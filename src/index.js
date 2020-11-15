const express = require('express')
const data = require('./InitialData');
const app = express()
console.log(data);
const bodyParser = require("body-parser");
//const { object } = require('joi');
const port = 8080
app.use(express.urlencoded());

// Parse JSON bodies (as sent by API clients)
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
// your code goes here

app.get("/api/student",(req,res)=>{
    res.send(data);
})

app.get("/api/student/:id",(req,res)=>{
    const id = parseInt(req.params.id);
    const resultArray = data.filter(obj=> obj.id===id);
    if(resultArray.length===0){
        res.status(404).send({message:'Not found'});
        return;
    }
    res.send(resultArray[0]);
})

app.post("/api/student",(req,res)=>{
    const student = req.body;
    if(["name","currentClass","division"].every(key => Object.prototype.hasOwnProperty.call(student, key))){
        const newObjectId = Math.max.apply(Math, data.map(function(obj) { return obj.id; }))+1;
           data.push({id: newObjectId,
            ...student,});
        res.send({id:newObjectId});
        return;
    }
    res.status(400).send({message:'bad request'});


})

app.put("/api/student/:id",(req,res)=>{
    const student = req.body;
    const id = req.params.id;
    console.log(student);
    //console.log(data.some(obj=> obj.id == parseInt(student.id)));
   const index =  data.findIndex(obj => obj.id == id);

    if(index >-1){
        //valid id
        console.log("id found...");     
        if(["name","currentClass","division"].some(key => Object.prototype.hasOwnProperty.call(student, key))){
            console.log("some valid fileds found...");
            for(key in student){
                if( Object.prototype.hasOwnProperty.call(data[index], key)){
                    data[index][key] = student[key];
                }
            }
           // console.log();
            res.send(data[index]);
            return;
            //console.log(["name","currentClass","division"].some(key => Object.prototype.hasOwnProperty.call(student, key)));
        }
        res.status(400).send({message:"bad req"});
        return;


    }
    res.status(400).send({message:"bad req"});
    
})

app.delete("/api/student/:id",(req,res)=>{

    const id = req.params.id;
    
    const index =  data.findIndex(obj => obj.id == id);

    if(index > -1){
        res.send(data.splice(index,1));
        console.log(data);
        return;
    }
    res.status(404).send();


})

app.listen(port, () => console.log(`App listening on port ${port}!`))


module.exports = app;   