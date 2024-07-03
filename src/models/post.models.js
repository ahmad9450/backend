import mongoose from 'mongoose';

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
  uploader : {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required : false,
  },
  likes:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }]
},{timestamps : true});

 export default  mongoose.model("Post",postSchema);