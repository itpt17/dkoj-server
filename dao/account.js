const connect = require('./utils');
const crypto = require('crypto');

const facebookLogin = async (fbID,fullname,email)=>{
    return new Promise((resolve,reject)=>{
        let sql = `SELECT * FROM Account WHERE fbID='${fbID}'`;
        connect.query(sql,(err,res)=>{
            if(err) reject(err);
            else{
                if(res.length > 0){
                    resolve({status:true,code:1});
                }else{
                    new Promise((resolve,reject)=>{
                        sql = `SELECT * FROM Account WHERE email='${email}'`;
                        connect.query(sql,(err,res)=>{
                            if(err) reject(err);
                            else{
                                if(res.length > 0){
                                    resolve({status:false,code:-1});
                                }else{
                                    new Promise((resolve,reject)=>{
                                        sql = `INSERT INTO Account(fbID,fullname,email) VALUES('${fbID}','${fullname}','${email}')`;
                                        connect.query(sql,(err,res)=>{
                                            res = res;
                                            if(err){
                                                reject(err);
                                            }
                                            else resolve({status:true,code:1})
                                        })
                                    }).then((data)=>resolve(data)).catch((err)=>{reject(err)})
                                }
                            }
                        })
                    }).then((data)=>resolve(data)).catch((err)=>reject(err));
                }
            }
        })
    })
}

const googleLogin = async (ggID,fullname,email)=>{
    return new Promise((resolve,reject)=>{
        let sql = `SELECT * FROM Account WHERE ggID = '${ggID}'`;
        new Promise((resolve,reject)=>{
            connect.query(sql,(err,res)=>{
                if(err) reject(err);
                else{
                    if(res.length > 0) resolve({status:true,code:1})
                    else{
                        new Promise((resolve,reject)=>{
                            sql = `SELECT * FROM Account WHERE email='${email}'`;
                            connect.query(sql,(err,res)=>{
                                if(err) reject(err);
                                else{
                                    if(res.length > 0){
                                        resolve({status:false,code:-1});
                                    }else{
                                        sql =  `INSERT INTO Account(ggID,fullname,email) VALUES
                                        ('${ggID}','${fullname}','${email}')`;
                                        new Promise((resolve,reject)=>{
                                            connect.query(sql,(err,res)=>{
                                                if(err) reject(err);
                                                else{
                                                    res=res;
                                                    resolve({status:true,code:1});
                                                }
                                            })
                                        }).then(data=>resolve(data)).catch(err=>reject(err));
                                    }
                                }
                            });
                        }).then(data=>resolve(data)).catch(err=>reject(err));
                    }
                }
            })
        }).then(data=>resolve(data)).catch(err=>reject(err));
    })
}

const accountLogin = async (username,password) =>{
    return new Promise((resolve,reject)=>{
        password = crypto.createHash("sha256").update(password).digest("hex");
        password = password.toUpperCase();
        let sql = `SELECT * FROM Account WHERE username = '${username}' AND password = '${password}'`;
        connect.query(sql,(err,res)=>{
            if(err){
                reject(err);
            }else{
                if(res.length > 0){
                    resolve({status:true,code:1})
                }else{
                    resolve({status:false,code:0});
                }
            }
        })
    });
}

const checkToken = async (token) => {
    let sql = `SELECT * FROM Account WHERE rfToken='${token}'`;
    return new Promise((resolve,reject)=>{
        connect.query(sql,(err,res)=>{
            if(err) reject(err);
            else{
                res.length > 0 ? resolve(true) : resolve(false);
            }
        })
    })
}

const updateToken = async (token, user, fbID, ggID) => {
    if(user) sql = `UPDATE Account SET rfToken='${token}' WHERE username='${user}'`;
    else if(fbID) sql = `UPDATE Account SET rfToken='${token}' WHERE fbID='${fbID}'`;
    else if(ggID) sql = `UPDATE Account SET rfToken='${token}' WHERE ggID='${ggID}'`;
    return new Promise((resolve,reject)=>{
        connect.query(sql,(err,res)=>{
            if(err){
                reject(err);
            }
            else{
                resolve(res);
            }
        })
    })
}

module.exports = {
    facebookLogin,
    checkToken,
    updateToken,
    googleLogin,
    accountLogin
}