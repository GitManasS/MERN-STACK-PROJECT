if(process.env.NODE_ENV != "production")
{
require("dotenv").config();
}

//console.log(process.env.ATLASDB_URL);
const express=require("express");
const app=express();
const mongoose=require("mongoose");
//const listing=require("./models/listing.js");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
//const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");
//const {listingSchema,reviewSchema}=require("./schema.js");
//const Review=require("./models/review.js");
const session=require("express-session");
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User= require("./models/user.js");


const listingRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/review.js")
const userRouter=require("./routes/user.js")


main()
  .then(()=>{
    console.log("Connected to db");
  })
  .catch((err)=>{
    console.log("error in db connection");
});

/*
const dbUrl=process.env.ATLASDB_URL;

async function main()
{
  await mongoose.connect(dbUrl);
}
*/


async function main()
{
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
 //await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust', { useNewUrlParser: true, useUnifiedTopology: true });
}



app.set("view engine","ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const sessionOptions={
  secret:"mysupersecretcode",
  resave:false,
  saveUninitialized:true,
  cookie:{
    expires:Date.now()+ 7*24*60*60*1000,
    maxAge:7*24*60*60*1000,
    httpOnly:true,
  },
};

/*
app.get("/",(req,res)=>{
  res.send("hello welcome to server root");
});
*/

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  res.locals.currUser=req.user;
  next();
});


/*
app.get("/demouser",async(req,res)=>{
 let fakeUser=new User({
  email:"student@gmail.com",
  username:"delta-student",
 });

 let registeredUser=await User.register(fakeUser,"hellowrold");
 res.send(registeredUser);
});

*/

/*
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
*/

/*

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

*/

app.use("/listings" ,listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);

/*
//showing all indexes name in list form
app.get("/listings",wrapAsync(async(req,res)=>{
  const alllisting= await listing.find({});
  res.render("listings/index.ejs",{alllisting});
  }));

  //new route
  app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");
  });

  //show routed by id
  app.get("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
   const listing_data = await listing.findById(id).populate("reviews");
    res.render("listings/show.ejs",{listing_data});
  }));

  //create route
  app.post("/listings",validateListings,wrapAsync (async(req,res,next)=>{
    let nlisting=req.body.listing;
    let newlisting=new listing(nlisting);
    await newlisting.save();
    res.redirect("/listings");
  })
  );

  //edit route
  app.get("/listings/:id/edit",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    console.log(id);
    const updatelisting=await listing.findById(id);
    console.log(updatelisting);
    res.render("listings/edit.ejs",{updatelisting});
  }));
  

//update route
app.put("/listings/:id",validateListings,wrapAsync( async (req,res)=>{
  let {id}=req.params;
  await listing.findByIdAndUpdate(id,{...req.body.listing});
  res.redirect(`/listings/${id}`);
}));


//DELETE ROUTE
app.delete("/listings/:id",wrapAsync(async(req,res)=>{
  if(!req.body.listing){
    throw new ExpressError(404,"Send valid data for listings");
  }
  let {id}=req.params;
  let deletedListing = await listing.findByIdAndDelete(id);
  console.log(deletedListing);
  res.redirect("/listings");
}));

*/

/*
//reviews
//post review route
app.post("/listings/:id/reviews" ,validateReview ,wrapAsync(async(req,res)=>{
 let listings_data= await listing.findById(req.params.id)
 let newReview= new Review(req.body.review);
 listings_data.reviews.push(newReview);
 await newReview.save();
 await listings_data.save();
 
 res.redirect(`/listings/${listings_data._id}`)
}));

//delete review route
app.delete("/listings/:id/reviews/:reviewId",wrapAsync(async(req,res)=>{
let {id,reviewId}=req.params;

await listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
await Review.findByIdAndDelete(reviewId);
res.redirect(`/listings/${id}`)
})
);

*/

/*
app.get("/testlisting",async(req,res)=>{
let samplelisting=new listing({
  title:"My New Villa",
  description:"By the beach",
  price:1200,
  location:"calingot,Goa",
  country:"India",
});

await samplelisting.save();
console.log("Sample is saved");
res.send("successfull testing");
});

*/

app.all("*",(req,res,next)=>{
  next(new ExpressError(404,"Page not found"));
});

app.use((err,req,res,next)=>{
  let {statusCode=500,message="Something Went Wrong"}=err;
  //res.status(statusCode).send(message);
  res.render("listings/error.ejs",{message});
});

app.listen(8080,()=>{
    console.log("app is listening to port 8080");
});


