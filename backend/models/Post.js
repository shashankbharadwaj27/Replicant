
import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
    username : {type : String , required : true} ,
    title : {type : String , required : true},
    content : {type : String},
    isPublic : {type : Boolean , required : true},
    createdAt : {type : Date , default : Date.now()},
    likes : [
        {username : {type : String , required : true}}
    ],
    comments : [{
        username : {type : String , required :true},
        comment : {type : String , required : true}
    }
    ]
})

export default mongoose.model("Post" , postSchema);

