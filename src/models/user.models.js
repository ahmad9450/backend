import mongoose from 'mongoose';
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim : true,
    lowercase : true,
    index : true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim : true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    trim : true,
  },
  age: {
    type: Number,
    default: 0,
  },
  fullName: {
    type: String,
    default: '',
  },
  mobileNumber: {
    type: String,
    default: '',
  },
  isAdmin :{
     type: Boolean,
     default : false,
  },
  avatar: {
    type: String,
    default: '',
  },
  coverImage: {
    type: String,
    default: '',
  },
  refreshToken : {
    type: String,
  },
  address: {
    type: String,
    default: '',
  },
  bio: {
    type: String,
    default: '',
  },
  logoColor: {
    type: String,
    default: '',
  },
  posts:[{
    type : mongoose.Schema.Types.ObjectId,
    ref:"Post",
    default : [],
  }],
  watchHistory:[{
    type : mongoose.Schema.Types.ObjectId,
    ref : "Video",
  }],
}, { timestamps: true });

userSchema.pre("save",async function(next){
  if(this.isModified("password") || this.isNew){
    this.password = await bcrypt.hash(this.password,12);
    next ();
  }
  else{
    return next();
  }
});
userSchema.methods.isPasswordCorrect = async function(password){
  return await bcrypt.compare(password,this.password);
};
userSchema.methods.generateAccessToken = function (){
  return jwt.sign(
    {
      _id : this._id,
      email : this.email,
      username : this.username,
      fullName : this.fullName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn : process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};
userSchema.methods.generateRefreshToken = function (){
  return jwt.sign(
    {
      _id : this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn : process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};






// Function to generate a color based on the first letter of the username
const generateColor = (letter) => {
  const colors = {
    a: 'bg-color-a', b: 'bg-color-b', c: 'bg-color-c', d: 'bg-color-d', e: 'bg-color-e',
    f: 'bg-color-f', g: 'bg-color-g', h: 'bg-color-h', i: 'bg-color-i', j: 'bg-color-j',
    k: 'bg-color-k', l: 'bg-color-l', m: 'bg-color-m', n: 'bg-color-n', o: 'bg-color-o',
    p: 'bg-color-p', q: 'bg-color-q', r: 'bg-color-r', s: 'bg-color-s', t: 'bg-color-t',
    u: 'bg-color-u', v: 'bg-color-v', w: 'bg-color-w', x: 'bg-color-x', y: 'bg-color-y',
    z: 'bg-color-z'
  };
  return colors[letter.toLowerCase()] || 'bg-color-default';
};

// Middleware to set the logo color before saving a new user
userSchema.pre('save', function(next) {
  if (this.isNew && this.fullName) {
    const firstLetter = this.fullName.charAt(0);
    this.logoColor = generateColor(firstLetter);
  }
  next();
});

export default mongoose.model("User", userSchema);