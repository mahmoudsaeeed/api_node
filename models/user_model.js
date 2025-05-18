const express = require('express');
const mongoose = require('mongoose');
const {users_collection_name} = require('../constants')

const user_schema = mongoose.Schema({
  
  email: {
    'type': String,
    'requried': true,
    'unique':true
  },
  
  password : {
    'type': String,
    'requried': true,
  },
  firstName : {
    'type': String,
    'requried': true,
  },
  lastName : {
    'type': String,
    'requried': true,
  },
  mobileNumber : {
    'type': String,
  },
  gender : {
    'type': String,
  }

},  {
  versionKey: false // 👈 ده اللي بيشيل __v
})

const user_model = mongoose.model(users_collection_name , user_schema);

module.exports = user_model;

