# TrustUP Application


## Installation

Use the package yarn inside the root folder

```
yarn install
```

Extra installation steps for iOS

```shell
cd ios
pod install
```

## Usage

The commands below for Android and iOS should run another command and open up another terminal/command prompt to start 
the metro server. If it does not, run the command below. The metro server allows you to make changes to your code
without having to rebuild. Once you have made necesarry changes, save them or reload application inside metro server 
terminal/command prompt.

###Android

Make sure you Android simulator is up and running

```shell
npx react-native run-android
```

###iOS

iOS simulator will launch with this command

```shell
npx react-native run-ios
```

##Backend Setup

Both of these services have to be running in the background when testing, so you need multiple terminal windows.

###DynamoDB

Download the **US West Region** DynamoDB file from https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DynamoDBLocal.DownloadingAndRunning.html

CD into the directory and run 

```shell
java -Djava.library.path=./DynamoDBLocal_lib -jar DynamoDBLocal.jar -sharedDb
```

Note: No need to change access key information, I have set up a IAM user for the app. These credentials are located under backend/config.js

You can view changes to the database through aws command line or on our DynamoDB table on the aws site.

###Server

CD into the backend directory and run

```shell
npm install
```

Once that has installed all the npm packages you can start the server.

```shell
npm start
```


