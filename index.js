//server creation
//1) import express
const express = require('express')
//import dataservice
const dataService=require('./service/data.service')

//import CORS
const cors=require('cors')

//import jwt
const jwt=require('jsonwebtoken')
//2)create an app using server
const app = express()

//give command to share data via cors
app.use(cors({
    origin:['http://localhost:4200','http://192.168.134.146:8080','http://127.0.0.1:8080']
}))

//to parse json from req body
app.use(express.json())

//application specific middleware
const appMiddleWare=(req,res,next)=>{
    console.log('application middleware')
    next()
}

app.use(appMiddleWare)
//4)resolving HTTP request
//GET req - read data
app.get('/',(req,res)=>{
    res.send('GET METHORD')
})
//POST req - create data
app.post('/',(req,res)=>{
    res.send('POST MEATHORD')
})
//PUT request - to completly modefiy data
app.put('/',(req,res)=>{
    res.send('put methord')
})
//PATCH request - to partially modifiy data
app.patch('/',(req,res)=>{
    res.send('patch request')
})
//DELETE req- to remove data
app.delete('/',(req,res)=>{
    res.send('delete request')
}) 

console.log('-------------------------------------')
console.log('Bank Server')

//jwt middleware - to validate token
const jwtmiddleware=(req,res,next)=>{
 try  { console.log('router specific middleware')
    const token = req.headers['x-access-token']
    //validate - verifiy()
    const data = jwt.verify(token,'secrett3452')
    console.log(data)
    next()

}
catch{
    res.status(422).json({
        statusCode:422,
        status:false,
        message:'please login'
    })
}
}



//login
app.post('/login',(req,res)=>{
    console.log(req.body);
    dataService.login(req.body.acno,req.body.pswd)
    .then(result=>{
        res.status(result.statusCode).json(result)
    })
})
//register API- POST
app.post('/register',(req,res)=>{
    console.log(req.body);
    dataService.register(req.body.acno,req.body.username,req.body.password)
    .then(result=>{
        res.status(result.statusCode).json(result)
    })
    
})
//deposit
app.post('/deposit',jwtmiddleware,(req,res)=>{
    console.log(req.body);
    dataService.deposit(req.body.acno,req.body.pswd,req.body.amt)
    .then(result=>{
        res.status(result.statusCode).json(result)
    })
})
//withdraw
app.post('/withdraw',jwtmiddleware,(req,res)=>{
    console.log(req.body);
    dataService.withdraw(req.body.acno1,req.body.pswd1,req.body.amt1)
    .then(result=>{
        res.status(result.statusCode).json(result)
    })
})
//transactiom history
app.post('/transaction',jwtmiddleware,(req,res)=>{
    console.log(req.body)
    dataService.getTransaction(req.body.acno)
    .then(result=>{
        res.status(result.statusCode).json(result)
    })
})
//deleteAcc
app.delete('/deleteAcc/:acno',(req,res)=>{
    dataService.deleteAcc(req.params.acno)
    .then(result=>{
        res.status(result.statusCode).json(result)
     })
})

//3)create port number
app.listen(3000,()=>{
    console.log('server started at port 3000')
})