import {Injectable} from "@angular/core";
import {_IDENTITY_POOL_ID, _REGION} from "./properties.service";

declare let AWS: any;

@Injectable()
export class AwsUtil {

    constructor() {

    }

    /**
     * This is the method that needs to be called in order to init the aws global creds
     */
    initAwsService() {
        AWS.config.credentials = new AWS.CognitoIdentityCredentials({IdentityPoolId: _IDENTITY_POOL_ID});
        AWS.config.update({region: _REGION});
    }

    getImageTags(image, cb) {

        const rekognition = new AWS.Rekognition();

        rekognition.detectLabels({
            'Image': {
                'Bytes': image
            },
            'MaxLabels': 6,
            'MinConfidence': 60
        }, function (err, data) {
            if (err) console.log(err, err.stack);
            else {
                console.log(data);
                cb(data);
            }
        })
    }

    getImageText(image, cb) {

        const rekognition = new AWS.Rekognition();

        rekognition.detectText({
            'Image': {
                'Bytes': image
            }
        }, function (err, data) {
            if (err) console.log(err, err.stack);
            else {
                console.log(JSON.stringify(data, null, 4));
                cb(data);
            }
        })
    }

    getImageTextPromise(image) {

        const rekognition = new AWS.Rekognition();

        return new Promise((resolve, reject) => {
            rekognition.detectText({
                'Image': {
                    'Bytes': image
                }
            }, function (err, data) {
                if (err) reject(err);
                else {
                    resolve(data);
                }
            })
        })
    }

}

