require('dotenv').config();

const mysql = require('mysql');
const DBinfo = process.env;
const connect = mysql.createConnection({
    host:  DBinfo.DBHOST,
    port: DBinfo.DBPORT,
    user: DBinfo.DBUSER,
    password: DBinfo.DBPASSWORD,
    database: DBinfo.DBNAME
});
setInterval(()=>{
    new Promise((resolve,reject)=>{
        connect.query('SELECT version()',(error,result)=>{
            if(error) reject(error);
            else resolve(result);
        });
    })
},5000);

module.exports = connect;
