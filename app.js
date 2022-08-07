var express = require('express');
var dotenv=require('dotenv');
var app=express();
var mongo=require('mongodb');
var bodyParser=require('body-parser');
var cors=require('cors');
var MongoClient=mongo.MongoClient;
dotenv.config();
const MURL='mongodb+srv://nvs:nvs@cluster0.rhpwvaa.mongodb.net/?retryWrites=true&w=majority';
var port=process.env.PORT || 8050;
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cors());
var db;

app.get('/',(req,res)=>{
    res.send("<h1>hiiiiiiii</h1>");
})

app.get('/first',(req,res)=>{
    db.collection('first').find().toArray((err,result)=>{
    if(err) throw err;
    res.send(result);
})
})

app.get('/first/:id',(req,res)=>{
    //var id=req.params.id;
    //console.log(id);
    //res.send('ok');
    var id=Number(req.params.id);
    db.collection('first').find({"_id":id}).toArray((err,result)=>{
        if(err) throw err;
        res.send(result);
    })
    
})

app.post('/order',(req,res)=>{
    console.log(req.body);
    db.collection('clothes').find({id:{$in:req.body}})
    .toArray((err,result)=>{
        if(err) throw err;
        res.send(result);
    })
})

app.get('/clothes',(req,res)=>{
    db.collection('clothes').find().toArray((err,result)=>{
        if(err) throw err;
        res.send(result);
})
})

app.get('/clothes/:id',(req,res)=>{
    var id=Number(req.params.id);
    db.collection('clothes').find({"id":id}).toArray((err,result)=>{
        if(err) throw err;
        res.send(result);
    })
})

app.get('/category',(req,res)=>{
    var query={};
    if(req.query.category){
    query={category:(req.query.category)}
    }
    //console.log('query',query);
    //res.send('querycategory');
    db.collection('clothes').find(query).toArray((err,result)=>{
        if(err) throw err;
        res.send(result);
    })
})

app.get('/orders',(req,res)=>{
    db.collection('orders').find().toArray((err,result)=>{
        if (err) throw err;
        res.send(result);
    })
})

app.post('/placeorder',(req,res)=>{
    console.log(req.body);
    db.collection('orders').insertOne(req.body,(err,result)=>{
        if(err) throw err;
        res.send("order sucessfully placed")
    })
})

app.delete('/delete/:id',(req,res)=>{
    var id=Number(req.params.id);
    db.collection('orders').deleteOne({"id":id},(err,result)=>{
        if(err) throw err;
        res.send(result);
    })
})


app.delete('/deleteall',(req,res)=>{
    db.collection('orders').remove({},(err,result)=>{
        if(err) throw err;
        res.send(result)
    })
})

app.put('/update/:id',(req,res)=>{
    var status=req.body.status?req.body.status:"pending"
    var id=parseInt(req.params.id)
    db.collection('orders').updateOne({_id:id},{$set:{"status":status}})
    res.send('data updated')
})


MongoClient.connect(MURL,(err,client)=>{
    if(err) console.log("connection error");
    db=client.db('shop');
       app.listen(port,()=>{
       console.log(`listining on port ${port}`)
       })
})