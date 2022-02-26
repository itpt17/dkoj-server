require('dotenv').config();

const jwt = require('jsonwebtoken');

const sign_accesToken = ({user,facebook,google})=>{
    return jwt.sign({user,facebook,google},process.env.ACCESS_SECRET_STRING,{expiresIn:'600s'});
}

const sign_refreshToken = ({user,facebook,google})=>{
    return jwt.sign({user,facebook,google},process.env.REFRESH_SECRET_STRING);
}

const verify_accessToken = (token)=>{
    try{
        jwt.verify(token,process.env.ACCESS_SECRET_STRING);
        ;
    }catch{
        return false;
    }
}

const verify_refreshToken = (token)=>{
    try{
        jwt.verify(token,process.env.REFRESH_SECRET_STRING);
        return true;
    }catch{
        return false;
    }
}

module.exports = {
    sign_accesToken,
    sign_refreshToken,
    verify_accessToken,
    verify_refreshToken
}