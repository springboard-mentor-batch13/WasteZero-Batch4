import mongoose from "mongoose";
import bycript from "bcrypt";

const userSchema =new mongoose.Schema({

name :{type:String , required:true},
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['volunteer', 'ngo', 'admin'], default: 'volunteer' },
  skills: [{ type: String }],
  location: { type: String, default: '' },
  bio: { type: String, default: '' },
  address: { type: String, default: '' },
  coordinates: { type: String, default: '' },
}, { timestamps: true });

userSchema.pre('save',async function(next){
    if(!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.matchPassword = async function (enteredPassword){
    return await bycript.compare(enteredPassword, this.password);
};

export default userSchema;