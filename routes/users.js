var mongoose=require("mongoose");
var plm=require("passport-local-mongoose");
mongoose.set("strictQuery",true);


mongoose.connect("mongodb+srv://hrgupta19:hrgupta123@cluster0.2pzl7kl.mongodb.net/?retryWrites=true&w=majority")
.then(function(){
  console.log("Connected to db");
})

const userSchema= mongoose.Schema({
  username : String,
  email : String,
  password:String,
  displayname:{
    type: String,
    default: ""
  },
  contact:{
    type: String,
    default: ""
  },
  country:{
    type: String,
    default: ""
  },
  image:{
    type: String,
    default: ""
  },
  roomId:{
    type: String,
    default: ""
  },
})

userSchema.plugin(plm);

module.exports=mongoose.model("user", userSchema)