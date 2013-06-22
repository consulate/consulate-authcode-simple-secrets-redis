consulate-authcode-simple-secrets-redis [![Build Status](https://travis-ci.org/consulate/consulate-authcode-simple-secrets-redis.png?branch=master)](https://travis-ci.org/consulate/consulate-authcode-simple-secrets-redis)
=======================================

Redis backend for [consulate-authcode-simple-secrets](https://github.com/consulate/consulate-authcode-simple-secrets)

Usage
-----

```js
var consulate = require('consulate')
  , authcode = require('consulate-authcode-simple-secrets')
  , authcodeRedis = require('consulate-authcode-simple-secrets-redis');

var app = consulate();

app.plugin(authcode({
  key: process.env.AUTHCODE_SECRET
}, authcodeRedis({
  url: process.env.MY_REDIS_URL, // defaults to `process.env.MY_REDIS_URL` or 'redis://localhost:6379'
  prefix: 'my-authcode-prefix', // defaults to 'authcode'
  ttl: 60 // time-to-live of the auth code in seconds - defaults to 10 minutes
})));
```

Tests
-----

```sh
$ npm test
```
