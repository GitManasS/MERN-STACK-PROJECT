const express=require("express");
const app=express();
const ExpressError =require("./ExpressError");
//app.set("view engine", "ejs");

const checkerror=(req,res,next)=>{
  let { token }=req.query;
  if(token === "giveaccess")
  {
    next();
  }
    throw new ExpressError(401,"Access Denied");
}

app.get("/api",checkerror,(req,res)=>{
  res.send("data");
});


app.use((err,req,res,next)=>{
    console.log("error 1");
    next(err);
});

app.use((err,req,res,next)=>{
    //console.log("error 2 ");
    let {status,message}=err;
    res.status(status).send(message);
});

/*
app.use((req,res,next)=>{
   // let {query}=req.query;
   // console.log(query);
    console.log("hy i am 1 middleware");
    next();
});

app.use((req,res,next)=>{
    // let {query}=req.query;
    // console.log(query);
     console.log("hy i am 2 middleware");
     next();
 });
 */

app.listen(8080,()=>{
    console.log("server listening to port 8080");
});