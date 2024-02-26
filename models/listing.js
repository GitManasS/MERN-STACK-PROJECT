const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const Review= require("./review.js");

const listingSchema = new Schema(
    {
        title: {
        type:String,
        requires:true,
        },
        description:String,
        image:{
            type:String,
            default:"https://www.istockphoto.com/photo/hand-flip-wooden-cube-with-word-change-to-chance-personal-development-and-career-gm871196052-145508645?phrase=random",
            set:(v)=> v===""?"https://www.istockphoto.com/photo/hand-flip-wooden-cube-with-word-change-to-chance-personal-development-and-career-gm871196052-145508645?phrase=random"
            :v,
        },
        price:Number,
        location:String,
        country:String,
        reviews:[
            {
                type:Schema.Types.ObjectId,
                ref:"Review",
            },
        ],
    }
);

listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing)
    {
        await Review.deleteMany({_id: {$in: listing.reviews}});
    }
});

const Listing = mongoose.model("Listing",listingSchema);
module.exports=Listing;