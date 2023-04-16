const mongoose=require('mongoose');

const CommentSchema=mongoose.Schema({
    author:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'User',
        required:true
    },
    content:{
        type:String,
        required:true
    },
    issue_id :{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'Issues',
        required:true
    },
    reply:[
        {
          type:mongoose.SchemaTypes.ObjectId,
          ref:'Comment',
          required:true
        }
      ]
})

module.exports= mongoose.model('Comment',CommentSchema);
