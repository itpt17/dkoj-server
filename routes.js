const routes = require('express').Router();
const account = require('./control/account');

routes.post('/login',(req,res)=>{
    account.Login(req,res);
})

module.exports = routes;