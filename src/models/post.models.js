const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
  content: {
    type: String,
    required : false,
  },
  title :{
    type : String,
    required: true,
  },
  image :{
    type: String,
    required : false,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required : false,
  },
  likes:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }]
},{timestamps : true});
module.exports = mongoose.model("Post",postSchema);