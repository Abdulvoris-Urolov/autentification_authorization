const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Joi = require('joi');

const listSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    password:{
        type: String,
        reuired: true,
        minlength: 4
    },
    email:{
        type: String,
        required: true,
        unique: true
    }
});
const List = mongoose.model('List', listSchema);

mongoose.connect("mongodb://localhost/list", { useNewUrlParser: true, useUnifiedTopology: true });

app.use(express.json());

app.post('/api/users', async (req, res) => {
    const { error } = validateList(req.body)
    if(error){
        return res.status(404).send(error.message);
    }
    let list = await List.findOne({email: req.body.email})
    if(list)
        return res.status(400).send('Bunday foydalanuvchi bor');
    list = new List({
        name: req.body.name,
        password: req.body.password,
        email:req.body.email
    });

    await list.save();
    res.send(list);
});

function validateList(list){
    const listSchema = Joi.object({
        name: Joi.string()
                 .required(),
        password:Joi.string()
                    .min(4)
                    .required(),
        email:Joi.string()
                 .required(),
    });

    return listSchema.validate(list);
};

app.listen(2000, (req, res) =>{
    console.log(`2000-port ishlayabdi`);
});