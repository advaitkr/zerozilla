const express = require("express");
require('dotenv').config()
const app = express()
const mongoose = require("mongoose")
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken")
const Agency = require("./model/agency")
const Client = require("./model/client")
//const PORT = process.env.PORT || 4000
mongoose.set('strictQuery', false)
mongoose.connect(process.env.URL, {
    useNewUrlParser: true,

}, (err) => {
    if (err) {
        console.log(err)
    }
    else {
        console.log("db connected")
    }
})

app.use(express.json())



app.post('/api/create-records', async (req, res) => {

    let obj = req.query
    if (obj.agency == "yes") {
        try {
            const { name, address1, address2, state, city, phoneNumber } = req.body
            const newAgency = await Agency.create({
                name: name,
                address1: address1,
                address2: address2,
                state: state,
                city: city,
                phoneNumber: phoneNumber
            })
            newAgency.save();
            res.send({ "newAgency": newAgency })
        } catch (err) {
            console.log(err)
            res.status(400).send({ "err": err })
        }
    }
    else if (obj.client == "yes") {
        const {name, email, phoneNumber, totalBill, password } = req.body
        try {

            const existingUser = await Client.findOne({email:email})
            if(existingUser){
              res.send({"msg":"email already exists"})
            }
  
            const hashedPassword = await bcrypt.hash(password,10)

            const newClient = await Client.create({
                name: name,
                email: email,
                address2: address2,
                password: hashedPassword,
                totalBill: totalBill,
                phoneNumber: phoneNumber
            })
            newClient.save();
            res.send({ "newAgency": newClient })
        } catch (err) {
            console.log(err)
            res.status(400).send({ "err": err })
        }

    }
})

app.post("/login",async(req,res)=>{
       const {email,password} = req.body
    try{
       const existingUser = await Model.findOne({
           email:email
       })
       if(!existingUser){
          return res.status(404).json({"msg":"user not found"})
       }
     const matchPassword = await bcrypt.compare(password,existingUser.password)
     if(!matchPassword){
        return res.status(400).json({"message":"invalid credentials"})
     }
    const token = jwt.sign({
        email:existingUser.email,
        id:existingUser._id,

    },process.env.SECRET_KEY);


        res.status(201).send({client:existingUser,token:token})

    }catch(err){
      console.log(err)
      res.status(500).json({
        "message":"something went wrong"
      })

    }
})

app.put('/api/posts/:id', (req, res) => {
    const { id } = req.params;
    const updates = req.body;
  
    Client.findByIdAndUpdate(id, updates, { new: true })
      .then(post => {
        res.json({ post });
      })
      .catch(error => {
        res.status(500).json({ error: error.message });
      });
  });

  
  
  app.get('/api/agencies/top-clients', (req, res) => {
    Agency.aggregate([
      {
        $lookup: {
          from: 'clients',
          localField: '_id',
          foreignField: 'agencyId',
          as: 'clients'
        }
      },
      {
        $unwind: '$clients'
      },
      {
        $group: {
          _id: '$_id',
          agencyName: { $first: '$name' },
          clients: {
            $push: {
              clientName: '$clients.name',
              totalBill: '$clients.totalBill'
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          agencyName: 1,
          clients: {
            $sort: {
              totalBill: -1
            }
          }
        }
      },
      {
        $limit: 1
      }
    ])
      .then(agencies => {
        res.json({ agencies });
      })
      .catch(error => {
        res.status(500).json({ error: error.message });
      });
  });
   
const port = parseInt(process.env.PORT) || 3000;
app.listen(port, () => {
    console.log("listening on")
})