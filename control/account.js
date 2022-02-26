const accountDAO = require('../dao/account');
const authControl = require('./auth');

const facebookLogin = async (req, res) => {
    try {
        fbID = req.body.fbID;
        fullname = req.body.name;
        email = req.body.email;
        accountDAO.facebookLogin(fbID, fullname, email).then(data => {
            if (data.status) {
                acToken = authControl.sign_accesToken({user:null,facebook:fbID,google:null});
                rfToken = authControl.sign_refreshToken({user:null,facebook:fbID,google:null});
                accountDAO.updateToken(rfToken,null,fbID,null).then(()=>{
                    return res.status(200).json({
                        login: true,
                        code: 1,
                        message: 'Login success',
                        accessToken: acToken,
                        refreshToken: rfToken
                    })
                }).catch(err=>{
                    return res.status(500).json({err});
                })
            } else {
                return res.status(200).json({
                    login: false,
                    code: 0,
                    message: 'Email already exist',
                    accessToken: null,
                    refreshToken: null
                })
            }
        }).catch((err) => {
            return res.status(500).json({ err });
        })
    } catch {
        return res.sendStatus(404);
    }
}

const googleLogin = async (req,res)=>{
    try {
        ggID = req.body.ggID;
        fullname = req.body.name;
        email = req.body.email;
        accountDAO.googleLogin(ggID, fullname, email).then(data => {
            if (data.status) {
                acToken = authControl.sign_accesToken({user:null,facebook:null,google:ggID});
                rfToken = authControl.sign_refreshToken({user:null,facebook:null,google:ggID});
                accountDAO.updateToken(rfToken,null,null,ggID).then(()=>{
                    return res.status(200).json({
                        login: true,
                        code: 1,
                        message: 'Login success',
                        accessToken: acToken,
                        refreshToken: rfToken
                    })
                }).catch(()=>{
                    return res.sendStatus(500);
                })
            } else {
                return res.status(200).json({
                    login: false,
                    code: 0,
                    message: 'Email already exist',
                    accessToken: null,
                    refreshToken: null
                })
            }
        }).catch(() => {
            return res.sendStatus(500);
        })
    } catch {
        return res.sendStatus(404);
    }
}

const accountLogin = async (req,res)=>{
    try{
        username = req.body.username;
        password = req.body.password;
        accountDAO.accountLogin(username,password).then(async (data)=>{
            if(data.status){
                acToken = authControl.sign_accesToken({user:username,facebook:null,google:null});
                rfToken = authControl.sign_refreshToken({user:username,facebook:null,google:null});
                accountDAO.updateToken(rfToken,username,null,null)
                .then((data)=>{
                    return res.status(200).json({
                        login: true,
                        code: 1,
                        message: 'Login success',
                        accessToken: acToken,
                        refreshToken: rfToken
                    })
                }).catch((err)=>{
                    res.sendStatus(500);
                })
            }else{
                return res.status(200).json({
                    login: false,
                    code: 0,
                    message: 'Invalid username or password',
                    accessToken: null,
                    refreshToken: null
                })
            }
        }).catch((err)=>{
            return res.sendStatus(500);
        })
    }catch{
        return res.sendStatus(404);
    }
}

const Login = async (req,res) => {
    try{
        let type = req.body.type;
        if(type.toLowerCase() == 'facebook'){
            return facebookLogin(req,res);
        }
        else if(type.toLowerCase() == 'google'){
            return googleLogin(req,res);
        }else if(type.toLowerCase() == 'account'){
            return accountLogin(req,res);
        }else{
            res.status(404).json({error: "Invalid type of login"});
        }
    }
    catch{
        res.sendStatus(404);
    }
}

module.exports = {
    Login
}