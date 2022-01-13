const express = require('express')
const connection = require('../db/mySQL')
const validator = require('validator')
const bcrypt = require('bcrypt')
const saltRounds = 10;


const router = new express.Router()


let message

//loads register page
router.get('/register', (req, res) => {
    res.render('register', {
        title: 'Service Catalog'
    })
})

//allows user to create an account if viable info is added
router.post('/register',(req,res)=>{

    const userName = req.body.userName
    const firstName = req.body.firstName
    const lastName = req.body.lastName
    const email = req.body.email
    const password = req.body.password
    const permission = req.body.permission
    
    if(!validator.isEmail(email)){
        req.session.message = {
            type:'warning',
            intro:'Invalid Email',
            message:'Please Enter a Valid Email'
        }
        return res.redirect('/register')
        
    }

    connection.query('SELECT email FROM users WHERE email = ?',[email],(error,result)=>{
        if(error) throw error
        else{
            if(result.length>0){
                
                req.session.message = {
                    type:'warning',
                    intro:'Invalid Email',
                    message:'Email is already in use'
                }
                return res.redirect('/register')
             
            }
            else{
                 //hashing password
                 bcrypt.hash(password,saltRounds,(err,hash)=>{
                 const sql = "insert into users values(null,'"+userName+"','"+hash+"',null,default,null,default,'"+firstName+"','"+lastName+"','"+permission+"','"+email+"')";
                  connection.query(sql,(err,rows,fields)=>{
                        if(err) throw err
                        req.session.message = {
                            type:'success',
                            intro:'Data Saved',
                            message:'Account has been successfully created'
                        }
                        return res.redirect('/')
                })
                })
            }









        }
       
    })


   
    //const sql = "insert into users values(null,'"+userName+"','"+password+"',null,default,null,default,'"+firstName+"','"+lastName+"','"+permission+"','"+email+"')";
  
})

module.exports = router