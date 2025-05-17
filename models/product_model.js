const express = require('express');
const mongoose = require('mongoose');
const collectionNames = require('../constants')
const product_schema = mongoose.Schema({

  name: {
    'type': String,
    'requried': true,
    'unique':true
  },
  
  price : {
    'type': Number,
    'requried': true,
  },
  imageUrl : {
    'type': String,
    'requried': true,
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId, // ID الخاص باليوزر
    ref: collectionNames.users_collection_name, // ربط مع موديل اليوزر
    required: true,
  },

  


} , {
  versionKey: false // 👈 ده اللي بيشيل __v
})

const product_model = mongoose.model(collectionNames.product_collection_name , product_schema);

module.exports = product_model;

