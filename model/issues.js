const mongoose=require('mongoose');

const IssueSchema= mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String
    },
    status:{
        type:String,
        enum:['open','closed'],
        default:'open',
    },
    priority:{
        type:String,
        enum:['Low','Medium','High'],
        required:true
    },
    assigned_to:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'User'
    },
    project_id :{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'Projects'
    }
});

module.exports=mongoose.model('Issues',IssueSchema)