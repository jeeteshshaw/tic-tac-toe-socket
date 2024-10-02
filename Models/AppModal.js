const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AppModel = new Schema({
   app_name:{
    type: String,
    required: true
   },
   android_version: {
    type: String,
    required: true
   },
   ios:{
    type: String,
    required: true
   }
},{timestamps:true});

module.exports = mongoose.model('AppModel', AppModel);