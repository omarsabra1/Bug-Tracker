const mongoose=require('mongoose');

const Project= mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String
    },
})

module.exports= mongoose.model('Projects',Project);