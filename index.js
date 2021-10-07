const express = require('express');
const {RtcTokenBuilder, RtcRole} = require ('agora-access-token');

const PORT = 8080;

const APP_ID = "f8e870c2e8fa4896ac51592c6aee5d90";
const APP_CERTIFICATE = "419e93f1422741198d66da3fce13a362";

const app = express();

const nocache = (req,resp, next) => {
    resp.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    resp.header('Expires', '-1');
    resp.header('Pragma', 'no-cache');
    next();
}

const generateAccessToken = (req, resp) => {
    //set response header
    resp.header('Access-Control-Allow-Origin', '*');
    //get channel name
    const channelName = req.query.channelName;
    if(!channelName){
        return resp.status(500).json({'error':'channel name is required'});
    }
    //get uid
    let uid = req.query.uid;
    if(!uid || uid == ''){
        uid = 0;
    }
    //get role
    let role = RtcRole.SUBSCRIBER;
    if(req.query.role == 'publisher'){
        role = RtcRole.PUBLISHER;
    }
    //get the expire time
    let expireTime = req.query.expireTime;
    if(!expireTime || expireTime == ''){
        expireTime = 3600;
    }else {
        expireTime = parseInt(expireTime, 10);
    }
    //calculate privelege expire time
    const currentTime = Math.floor(Date.now()/1000);
    const privalegeExpireTime = currentTime + expireTime;
    //build token
    const token = RtcTokenBuilder.buildTokenWithUid(APP_ID,APP_CERTIFICATE, channelName, uid, role, privalegeExpireTime);
    //return token
    return resp.json({'token': token});
}

app.get('/access_token',nocache, generateAccessToken);

app.listen(PORT, ()=> {
    console.log('Listening on port: ${PORT}');
});