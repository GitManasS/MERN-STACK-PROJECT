const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {listingSchema,reviewSchema}=require("../schema.js");
const Review=require("../models/review.js");
const listing=require("../models/listing.js");

const validateReview =(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
      if(error)
      {
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
      }
      else
      {
        next();
      }
  };
  

router.post("/" ,validateReview ,wrapAsync(async(req,res)=>{
    let listings_data= await listing.findById(req.params.id)
    let newReview= new Review(req.body.review);
    listings_data.reviews.push(newReview);
    await newReview.save();
    await listings_data.save();
    
    req.flash("success","New Review Created!");
    res.redirect(`/listings/${listings_data._id}`)
   }));
   
   //delete review route
   router.delete("/:reviewId",wrapAsync(async(req,res)=>{
   let {id,reviewId}=req.params;
   
   await listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
   await Review.findByIdAndDelete(reviewId);
   req.flash("success","Review Deleted!");

   res.redirect(`/listings/${id}`)
   })
   );

   module.exports=router;
   