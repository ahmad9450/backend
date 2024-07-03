import mongoose from 'mongoose';
import mongooseAgrigatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = mongoose.Schema({
  videoFile: {
    type: String,
    required : true,
  },
  title :{
    type : String,
    required: true,
    default: "",
  },
  thumbnail :{
    type: String,
    required : false,
    default: "",
  },
  description:{
    type : String,
    default : "",
  },
  duration:{
    type : Number,
    default: 0,
  },
  views:{
    type : Number,
    default: 0,
  },
  isPublished :{
    type: Boolean,
    required : false,
  },
  uploader : {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required : true,
  },
  likes:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }]
},{timestamps : true});
videoSchema.plugin(mongooseAgrigatePaginate);

 export default  mongoose.model("Video",videoSchema);