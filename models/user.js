const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    pic:{
        type: String,
        default: "https://res.cloudinary.com/ateet/image/upload/v1597665047/no_Image_zhsk3f.jpg"
    }, 
    followers:[{
        type: ObjectId,
        ref:"User"
    }],
    
    following:[{
        type: ObjectId,
        ref:"User"
    }]
})
mongoose.model("User", userSchema);

