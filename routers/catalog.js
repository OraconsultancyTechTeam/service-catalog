const express = require('express')
const connection = require('../db/mySQL')
const validator = require('validator')
const router = new express.Router()
let message

// Data for Step1
let step1
connection.query(`select * from catalog_services where status=1`, (err,res) => {
    if (err) throw err
    //console.log(res)
    return step1 = res
})

const step2 = [
    {img:'/img/oracledatabase.png', name:'Oracle Database', text:'Oracle Database is a multi-model database management system produced and marketed by Oracle Corporation', id:'6', g:'2'},
    {img:'/img/sql-server.png', name:'SQL Server', text:'Microsoft SQL Server is a relational database management system developed by Microsoft.', id:'7', g:'2'},
    {img:'/img/mysqllogo.png', name:'My SQL', text:'MySQL is an open-source relational database management system.', id:'8', g:'2'},
    {img:'/img/apachecassandra.png', name:'Apache Cassandra', text:'Cassandra is a free and open-source, distributed, wide-column store, NoSQL database management system designed to handle large amounts of data across many commodity servers, providing high availability with no single point of failure.', id:'9', g:'2'},
    {img:'/img/redislogo.png', name:'Redis', text:'Redis is an in-memory data structure store, used as a distributed, in-memory key–value database, cache and message broker, with optional durability. ', id:'10', g:'2'},
]

const step3 = [
    {name:'PRD', id:1}, 
    {name:'TRG', id:2},
    {name:'UAT', id:3}, 
    {name:'DVP', id:4}
]

const step4 = [
    {size:'2 CPU',id:1},
    {size:'4 CPU',id:2},
    {size:'6 CPU',id:3},
    {size:'8 CPU',id:4},
    {size:'10 CPU',id:5},
    {size:'12 CPU',id:6},
    {size:'24 CPU',id:7},
    {size:'30 CPU',id:8},
    {size:'Custom - Please provide comment',id:9}
]

const step6 = [
    {name:'Enterprise Edition',id:1},
    {name:'Advanced Security',id:2},
    {name:'Advanced Compression',id:3}
]

//Gets Logged Out Home Page
router.get('/', (req, res) => {
    res.render('home', {
        title: 'Service Catalog'
    })
})
//Gets Catalog Page for logged in users
router.get('/catalog', (req, res) => {
    res.render('index', {
        title: 'Service Catalog',
        msg1:'',
        step1,
        step2,
        step3,
        step4,
        step6
    })
})

//method checks selected card service id to find corresponding service stages
let service_stages
function stepLooper(stepCard) {
    step1.forEach(element => {
        if (stepCard == element.service_name) {
            connection.query(`select * from service_stages where service_id=`+element.service_id, (err,res) => {
                if (err) throw err
                service_stages = res
            })
           /* service_stages.forEach(stage => {
                
            });*/
        }
    });
}

//method is called when card in catalog is selected
router.post('/catalog', (req,res) => {
    //console.log(req.body.stepCard)
    //console.log(step1)
    // step1.forEach(element => {
    //     if (req.body.stepCard == element.service_name) {
    //         connection.query(`select * from service_stages where service_id=`+element.service_id, (err,res) => {
    //             if (err) throw err
    //             step2 = res
    //             console.log(step2)
    //         })
    //     }
    // });
    stepLooper(req.body.stepCard)

})

//Method submits data of catalog to database
router.post('/submit',(req,res) => {
    const host = req.body.radio1;
    const db = req.body.radio2;
    const env = req.body.env1;
    const tshirt = req.body.tshirtsize;
    const dbsize = req.body.dbsize;
    const licence = req.body.licensetype;
    const comment = req.body.commentBox;
    //const due_by = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const due_by = req.body.dueDate;
    const req_by = req.body.reqBy;
    const mang_email = req.body.mangEmail;
    
    if(!validator.isEmail(mang_email)){

        req.session.message = {
            type:'danger',
            intro:'Wrong Format',
            message:'Please enter the manager email in an email format'
        }
        
        return res.redirect('/catalog')
    
    }
    else{
        const sql = "insert into requests values(null,'"+host+"','"+db+"','"+env+"','"+tshirt+"','"+dbsize+"','"+licence+"','"+comment+"','"+due_by+"','"+req_by+"','"+mang_email+"',default)";
        connection.query(sql,(err,rows,fields)=>{
            if(err) throw err
    
            req.session.message = {
                type:'success',
                intro:'Data Saved',
                message:'Submission has been successfully sent'
            }
            return res.redirect('/catalog')
        })
    }   
})




module.exports = router