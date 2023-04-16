const mongoose=require('mongoose');

const ProjectShema= mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String
    },
})

module.exports= mongoose.model('Projects',ProjectShema);