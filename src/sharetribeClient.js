// src/sharetribeClient.js
const sharetribeSdk = require('sharetribe-flex-sdk');

const clientId = process.env.SHARETRIBE_CLIENT_ID;
const clientSecret = process.env.SHARETRIBE_CLIENT_SECRET;

const sdk = sharetribeSdk.createInstance({
  clientId: clientId,
  clientSecret: clientSecret,
  baseUrl: process.env.SHARETRIBE_API_URL,
});

module.exports = sdk;
