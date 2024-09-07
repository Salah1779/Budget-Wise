const express=require('express');
const mysql=require('mysql');

const db=mysql.createConnection({
    host:'localhost',                        
    user:'root',
    database:'budgetwise'
});
db.connect((err)=>{
    if(err){    
        console.log(err);
    }
    else{
        console.log('connected to database successfully!!' );
    }
            
})
module.exports = db;