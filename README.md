# REST API BEARER TOKEN
Example Rest API authorization by Bearer token

[![JavaScript Style Guide](https://cdn.rawgit.com/standard/standard/master/badge.svg)](https://github.com/standard/standard)

[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![Build Status](https://travis-ci.org/joemccann/dillinger.svg?branch=master)]()


REST API service.
* Authorization by bearer token (/ info, / latency, / logout);
* CORS setup;
* DB - Mysql;
* CACHE - Redis;
* Http - Express;

Token
* Token is updated every time
* Validity of 10 minutes.
* The authorized token is renewed at any request by the user (except for signin);

REST API:
* / signin [POST] - request to bearer a token by id and password;
* / signup [POST] - register a new user;
** Fields id and password, id - phone number and / or email;
** Upon successful registration, the bearer token is returned;
* / info [GET] - returns the user id;
* / latency [GET] - returns the delay from the service to google.com;
*  / logout [GET] - logout;
** After the exit, you need to get a new token;
** The old one should stop working;

### Run Environment

***
1. ##### Clone repo
```sh
$ git clone git@github.com:JuliaKliuchuk/rest-token-bearer.git
$ cd ./rest-token-bearer
```

2. ##### install db
```sh
$ docker-compose up --build mysql
wait install process 
$ Ctr+C
```


3. ##### start docker
```sh
$ docker-compose up
```

4. ##### stop docker
```sh
docker-compose stop

5. ##### clear docker
```sh
docker-compose rm
