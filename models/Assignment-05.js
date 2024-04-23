const { timeStamp } = require('console');
const mongoose =require('mongoose');
const { type } = require('os');

const TotalOrderSchema=mongoose.Schema({
    Title:{
        type:String,
    },
    FirstName:{
        type:String,
        required:[true],
    },
    Surname:{
        type:String,
        required:[true],
    },

    mobile:{
        type:Number,
        required:true,
    },
    Email:{
        type:String,
        required:[true],
    },
    AddressLine1:{
        type:String,
        required:[true],
    },
    AddressLine2:{
        type:String,
    },
    Town:{
        type:String,
        required:[true],
    },
    CountyCity:{
        type:String,
        required:[true],
    },
    EirCode:{
        type:String,
    },
    Manufacturer:{
        type:String,
        required:[true,"please enter product name"],
    },
    Quantity:{
        type:Number,
        required:[true],
    },

    Model:{
        type:String,
        required:true,
        default:0
    },
    Price:{
        type:Number,
        required:true
    }
},
{
    timestamps:true
}
);


const UserSchema=mongoose.Schema({
    Title:{
        type:String,
    },
    FirstName:{
        type:String,
        required:[true],
    },
    Surname:{
        type:String,
        required:[true],
    },

    mobile:{
        type:Number,
        required:true,
    },
    Email:{
        type:String,
        required:[true],
    },
},
{
    timestamps:true
}
);

const AddressSchema=mongoose.Schema({
    AddressLine1:{
        type:String,
        required:[true],
    },
    AddressLine2:{
        type:String,
    },
    Town:{
        type:String,
        required:[true],
    },
    CountyCity:{
        type:String,
        required:[true],
    },
    EirCode:{
        type:String,
    },
},
{
    timestamps:true
}
);

const ManufactureSchema=mongoose.Schema({
    Manufacturer:{
        type:String,
        required:[true,"please enter product name"],
    },

    Model:{
        type:String,
        required:true,
        default:0
    },
    Price:{
        type:Number,
        required:true
    }
},
{
    timestamps:true
}
);

const User=mongoose.model("User", UserSchema);
const Address=mongoose.model("Address", AddressSchema);
const Manufacturer=mongoose.model("Manufacturer", ManufactureSchema);
const TotalOrder=mongoose.model("TotalOrder", TotalOrderSchema);

module.exports = {
    User,
    Manufacturer,
    Address,
    TotalOrder
};
