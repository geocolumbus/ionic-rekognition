# ionic 4 Amazon AWS Rekognition Mobile Project

## Requirements

* Macintosh Computer
* Ionic 4.1 installed globally
* Android SDK
* XCode 10
* Provisioning profile from Apple Developer Network

## Installation

This is a an ionic-angular app.

```
git clone 
cd ionic-rekognition
npm install
ionic cordova build ios
ionic cordova build android
```

## Running the app

| Platform         | Command Line                                                                 | Notes                                                                                  |
|------------------|------------------------------------------------------------------------------|----------------------------------------------------------------------------------------|
| Browser          | ```ionic serve```                                                            |                                                                                        |
| Android Emulator | ```ionic cordova emulate android --target=MyAndroid```                       | Assumes the Android SDK is installed, and an AVD named "MyAndroid" exists. |
| Android Device   | ```ionic cordova run android --device```                                     | Connect an Android device to USB.                                                      |
| iOS Emulator     | ```ionic cordova emulate ios -- --buildFlag="-UseModernBuildSystem=0"```     | Assumes you have XCode 10 installed and ios-deploy installed globally.                 |
| iOS Device       | ```ionic cordova run ios --device-- --buildFlag="-UseModernBuildSystem=0"``` | Connect an iOS device to USB. You must have a provisioning profile.                    |

1. Run a production build of your app with ```ionic cordova build ios --prod```
1. Open the .xcodeproj file in platforms/ios/ in Xcode
1. Connect your phone via USB and select it as the run target
1. Click the play button in Xcode to try to run your app

## Unit Tests

To enable continuous unit testing, open a terminal window, navigate to the project folder and type

```
npm run test
```

## How to Configure Amazon Cognito authentication and Rekognition Service access

1. Create an Identity and Access Management Group (IAM)
2. Create an admin Administrator user for that group.
3. Create an aliased access url to the AWS console, i.e. https://georgecampbelloclc.signin.aws.amazon.com/console
4. Log into the AWS console with the Administrator user
5. Create a programmatic user with Rekognition permissions. Note the "Access Key Id" and "Secret Access Key"
6. Go to Amazon Cognito and create an "Identity Pool". Note the IdentityPoolID and Region.
7. Go back to the IAM console and add the Rekognition service to the Identity Pools' role.

TODO - Diagram to explain all this better.

## Reference

* node example that calls Amazon Rekognition - http://git.ent.oclc.org/users/campbelg/repos/node-rekognition/browse'

* ionic tutorial - https://ionicframework.com/docs/intro/tutorial/
* ionic docs - https://ionicframework.com/docs/
* ionic camera tutorial - https://www.9lessons.info/2017/04/ionic2-angular2-camera-native-multiple.html
* typescript tutorial - https://www.tutorialspoint.com/typescript/index.htm
* typescript docs - https://www.typescriptlang.org/docs/home.html
* George's typescript notes - https://github.com/geocolumbus/typescript-notes

# TODO

Convert the oclc number into a holdings location.

https://www.oclc.org/developer/develop/web-services/worldcat-search-api/library-locations.en.html

# Adendum

To install the camera plugin required these steps:

```
ionic cordova plugin add cordova-plugin-camera
npm install --save @ionic-native/camera
ionic cordova plugin add cordova-plugin-ios-camera-permissions
```
