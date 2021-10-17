const aws = require('aws-sdk');
const express = require('express')
const bodyParser = require('body-parser')
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')

const app = express()
app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext())

// Enable CORS for all methods
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "*")
    next()
});

app.get('/items', async function (req, res) {
    try {
        const { Parameters } = await (new aws.SSM()).getParameters({
            Names: [process.env["MBTKN"]],
            WithDecryption: true
        }).promise();
        
        const MBTKN = Parameters && Parameters.length > 0 && Parameters[0]["Value"];
        res.json({ tkn: MBTKN || "", style: process.env.MBSTL });
    } catch (error) {
        console.log(error);        
    }
});

app.listen(3000, function () {
    console.log("App started")
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app
