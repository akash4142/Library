import mongoose,{Schema} from "mongoose";


const userSchema = new  mongoose.Schema({
    userId :{
        type:Number,
        require:true,
        unique:true,
    },
    userName:{
        type:String,
        require:true,
    },
    userEmail:{
        type:String,
        require:true,
    },
    userPassword:{
        type:String,
        require:true,
    },
    role:{
        type:String,
        enum:['admin','user','Admin','User'],
        require:true,
    },
    borrowedBooks:[{
        book:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Book",
        },
        issuedDate:{type:Date,default:Date.now},
        returnDate:{type:Date,default:null}
    }]
},{
    timestamps:true,
})

const  User = mongoose.model('User',userSchema)
export default User;