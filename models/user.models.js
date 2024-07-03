const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim : true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim : true,
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
    trim : true,
  },
  image: {
    type: String,
    default: '',
  },
  coverImage: {
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
    default:[],
  }]
}, { timestamps: true });

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

module.exports = mongoose.model("User", userSchema);