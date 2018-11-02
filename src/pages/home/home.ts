import {Component} from '@angular/core';
import {NavController, AlertController} from 'ionic-angular';
import {Camera, CameraOptions} from "@ionic-native/camera";
import {HTTP} from '@ionic-native/http';
import {AwsUtil} from "../../providers/aws.service";
import xml2js from 'xml2js';


@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {

    public photos: any;
    public base64Image: string;

    constructor(public navCtrl: NavController,
                private camera: Camera,
                private alertCtrl: AlertController,
                //public http: HttpClient,
                public http: HTTP,
                public awsUtil: AwsUtil) {
    }

    ngOnInit() {
        this.photos = [];
    }

    deletePhoto(index) {
        let confirm = this.alertCtrl.create({
            title: 'Sure you want to delete this photo? There is NO undo!',
            message: '',
            buttons: [
                {
                    text: 'No',
                    handler: () => {
                        console.log('Disagree clicked');
                    }
                }, {
                    text: 'Yes',
                    handler: () => {
                        console.log('Agree clicked');
                        this.photos.splice(index, 1);
                    }
                }
            ]
        });
        confirm.present();
    }

    takePhoto() {
        const options: CameraOptions = {
            quality: 50, // picture quality
            destinationType: this.camera.DestinationType.DATA_URL,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE
        };

        const context = this;
        let res = [];

        context.camera.getPicture(options)
            .then(imageData => {
                context.base64Image = "data:image/jpeg;base64," + imageData;
                let buffer = new Buffer(imageData, 'base64');
                return context.awsUtil.getImageTextPromise(buffer);
            })
            .then(response => {
                let tags: string = "";
                let query: string;

                res.push("Detected Text lines\n");

                if (response['Labels']) {
                    for (let label of response['Labels']) {
                        tags += `${label.Name} `
                    }
                }
                if (response['TextDetections']) {
                    for (let textItem of response['TextDetections']) {
                        if (textItem.Type === "LINE") {
                            tags += `${textItem.DetectedText} `;
                            res.push(textItem.DetectedText+"\n")
                        }
                    }
                }
                tags = tags.replace(/\s+/g, "+");
                res.push("---------------------------------\n");
                res.push("Calling the WorldCat Search API\n");
                query = "http://www.worldcat.org/webservices/catalog/search/worldcat/sru?query=srw.kw+all+%22" + tags + "%22+and+srw.mt=bks&wskey={your wskey here}";
                res.push(query+"\n");
                res.push("---------------------------------\n");
                return context.http.get(query, {}, {});
            })
            .then(data => {

                return new Promise((resolve, reject) => {
                    xml2js.parseString(data.data, {explicitArray: false}, (error, result) => {
                        if (error) {
                            reject(error);
                            res.push("=== PARSE FAIL ===\n");
                            res.push(error);

                        } else {
                            res.push("=== PARSE SUCCESS ===\n");
                            resolve(result);
                        }
                        res.push("\n---------------------------------\n")

                    });
                });
            })
            .then(jsonResult => {

                let jsonResultString = JSON.stringify(jsonResult,null,4);

                for (let line of jsonResultString.split("\n")) {
                    if (line.includes("_")) {
                        res.push(line.trim().replace(/"_":\s/g, "").replace(/"/g, ""));
                    }
                }

                context.photos.push({image: context.base64Image, tags: res});
                context.photos.reverse();
            })
            .catch(err => {
                context.photos.push({image: context.base64Image, tags: JSON.stringify(err, null, 4)});
                console.log("===== ERROR =====");
                console.log(JSON.stringify(err, null, 4));
            });
    }
}
