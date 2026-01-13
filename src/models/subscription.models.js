import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
    //who are subscribing
    subscriber :{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    //to whom we are subscribing
    channel: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
},{timestamps:true})

export const Subscription = mongoose.model("Subscription",subscriptionSchema)