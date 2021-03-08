import express from 'express';
import http from 'http';
import base64 from 'base64-stream';
//import * as url from "url";
const $ = require( "jquery" )
//URL = 'https://api.tosdr.org/v1/service/facebook.json'

///AWS USer info
import S3 from "aws-sdk/clients/s3";
import { Credentials } from "aws-sdk";
import { v4 as uuid } from "uuid";
import * as url from "url";

var AWS = require('aws-sdk');
var bodyParser = require('body-parser');

var userID = 'T';

// Initialize http server
const app = express();
app.use(bodyParser.json())


const config = require('./config');


app.get('/users/:userId', function (req, res) {
    AWS.config.update(config.aws_remote_config);
    const docClient = new AWS.DynamoDB.DocumentClient();
    const params = {
        TableName: config.aws_table_name,
        Key: {
            userID: req.params.userId,
        },
    }
    docClient.get(params, (error, result) => {
            if (error) {
                  console.log(error);
                  res.status(400).json({ error: 'Could not get user' });
                }
          if (result.Item) {
                  const {userId, name} = result.Item;
                  res.json({ userID, name });
                } else {
                  res.status(404).json({ error: "User not found" });
                }
          });
})

// Create User endpoint
app.post('/users', (req, res) => {
    AWS.config.update(config.aws_remote_config);
    const docClient = new AWS.DynamoDB.DocumentClient();
    const userId = req.body.userId;
    const name = req.body.name;


      const params = {
          TableName: config.aws_table_name
      };


    docClient.put(params, (error) => {
            if (error) {
                  console.log(error);
                 //res.status(400).json({ error: 'Could not create user' });
                }
            res.json({ userID, name });
            console.log("user created", name, userID);
          });


})

//Send users scan info to database
app.post('/users/:userID/scan', (req, res) => {
    AWS.config.update(config.aws_remote_config);
    const docClient = new AWS.DynamoDB.DocumentClient();
    const ip = req.body.ip;
    const mac = req.body.mac;
    const lastScanned = req.body.lastScanned;
    const vendor = req.body.vendor;
    const userID = req.body.userID;
    console.log(req.body);
    const params = {
        TableName: config.aws_table_name,
        Item: {
            userID : req.params.userID,
            scan: {
                devices: req.body,
            }
        }
    };

    docClient.put(params, (error) => {
        if (error) {
            console.log(error);
            //res.status(400).json({ error: 'Could not create user' });
        }
        res.json({ ip, mac,lastScanned, vendor });
    });


})

///Get users scan that was stored in database
app.get('/users/:userId/scan', function (req, res) {
    AWS.config.update(config.aws_remote_config);
    const docClient = new AWS.DynamoDB.DocumentClient();
    const params = {
        TableName: config.aws_table_name,
        Key: {
            userID: req.params.userId,
        },
    }
    docClient.get(params, (error, result) => {
        if (error) {
            console.log(error);
            res.status(400).json({ error: 'Could not get user' });
        }
        if (result.Item) {
            console.log(result.Item.scan.devices)
            //const {ip, mac, lastScanned, vendor} = result.Item;
            res.json(result.Item.scan.devices);
            //console.log("IP", ip, mac, lastScanned, vendor);

        } else {
            res.status(404).json({ error: "User not found" });
        }
    });
})



// Launch the server on port 3000
const server = app.listen(3000, () => {
    const { address, port } = server.address();
    console.log(`Listening at http://${address}:${port}`);
});