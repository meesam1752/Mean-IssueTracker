var express=require('express');
var bodyParser=require('body-parser');
var appconfig=require('./appconfig');
var path=require('path');
var userapi=require('./api/userapi');
var moduleapi=require('./api/modulesapi');
var issueapi=require('./api/issueapi');
var issuetypeapi=require('./api/issuetypeapi');
var statusapi=require('./api/statusapi');
var projectapi=require('./api/projectapi');
var cookieparser=require('cookie-parser');
var redis=require('redis');
var responseTime=require('response-time');
var logger=require('./core/Logger');
var config = require('config');


var redisClient=redis.createClient();
redisClient.on('error',function(err){
  logger.debug('Redis error is ' , err);
});

redisClient.on('connect',function(){
    logger.debug('Redis server is connect now.');
});

/*
redisClient.get("city",function(err,data){
  if(err)
   console.log('Error is ' + err);
    else console.log('Result is ' + data);
});*/

//redisClient.setex('Office',60,'Compunnel')


// app configuration
var app=express();
var apiRoutes = express.Router();


// use middleware
app.use(express.static(path.join(__dirname+'/public')));
app.use(express.static(path.join(__dirname+'/public/swagger_dist')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieparser());

// define routing

app.use(responseTime(function (req, resp, value) {
    var routePath = req.path
    logger.info('[' + routePath +'] http-response-time=' + value + 'ms ');
  })
);

// public api routing middleware

app.use('/api', apiRoutes);

//user routing middleware
app.use('/api', userapi);

//application module routing middleware
app.use('/api', moduleapi);

//project routing middleware
app.use('/api', projectapi);

//issue routing middleware
app.use('/api', issueapi);

//issuetype routing middleware
app.use('/api', issuetypeapi);

//status routing middleware
app.use('/api', statusapi);

app.route('/*').get(function(req, res) {
    return res.sendFile(path.join(__dirname+'/public/index.html')); 
});

app.route('/swagger').get(function(req, res) {
    return res.sendFile(path.join(__dirname +'/public/swagger_dist/index.html'));
});

 // this is for run  server on localhost
 app.listen(config.get('WEB_PORT'), function () {
     logger.debug('Server runing at ' + config.get('WEB_PORT'));
 });

