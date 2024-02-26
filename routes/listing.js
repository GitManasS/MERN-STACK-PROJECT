const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const {listingSchema,reviewSchema}=require("../schema.js");
const ExpressError=require("../utils/ExpressError.js");
const listing=require("../models/listing.js");
const {isLoggedIn}=require("../middleware.js")

const validateListings =(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
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

//index route

router.get("/",wrapAsync(async(req,res)=>{
    const alllisting= await listing.find({});
    res.render("listings/index.ejs",{alllisting});
    }));
  
    //new route
    router.get("/new",isLoggedIn,(req,res)=>{
      res.render("listings/new.ejs");
    });
  
    //show routed by id
    router.get("/:id", wrapAsync(async (req, res) => {
      let { id } = req.params;
     const listing_data = await listing.findById(id).populate("reviews");
     if(!listing_data)
     {
        req.flash("error","listing u requested for does not exist!");
        res.redirect("/listings");
     }
      res.render("listings/show.ejs",{listing_data});
    }));
  
    //create route
    router.post("/",isLoggedIn,validateListings,wrapAsync (async(req,res,next)=>{
      let nlisting=req.body.listing;
      let newlisting=new listing(nlisting);
      await newlisting.save();
      req.flash("success","New Listing Created!");
      res.redirect("/listings");
    })
    );
  
    //edit route
    router.get("/:id/edit",isLoggedIn,wrapAsync(async (req,res)=>{
      let {id}=req.params;
      console.log(id);
      const updatelisting=await listing.findById(id);
      if(!updatelisting)
     {
        req.flash("error","listing u requested for does not exist!");
        res.redirect("/listings");
     }
      res.render("listings/edit.ejs",{updatelisting});
    }));
    
  
  //update route
  router.put("/:id",isLoggedIn,validateListings,wrapAsync( async (req,res)=>{
    let {id}=req.params;
    await listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success","Listing Updated!");
    res.redirect(`/listings/${id}`);
  }));
  
  
  //DELETE ROUTE
  router.delete("/:id",isLoggedIn,wrapAsync(async(req,res)=>{
   // console.log(req.body.listing);
   // if(!req.body.listing){
     // throw new ExpressError(404,"Send valid data for listings");
    //}
    let {id}=req.params;
    let deletedListing = await listing.findByIdAndDelete(id);
    //console.log(deletedListing);
    req.flash("success","Listing Deleted");
    res.redirect("/listings");
  }));
  
  module.exports=router;