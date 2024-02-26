const mongoose=require("mongoose");
const initdata=require("./data.js");
const Listing=require("../models/listing.js");

main()
  .then(()=>{
    console.log("Connected to db");
  })
  .catch((err)=>{
    console.log("error in db connection");
});

async function main()
{
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
 //await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust', { useNewUrlParser: true, useUnifiedTopology: true });
}

const intiDB= async ()=>{
   const x= await Listing.deleteMany({});
   console.log(x);
    await Listing.insertMany(initdata.data);
    console.log("data was initializd")
};

intiDB();