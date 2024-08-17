import foodModel from '../models/foodModel.js';
import Food from '../models/foodModel.js';
import fs from 'fs'; // used to interact with the file system
//add food item
const addFood = async (req, res) => {
    const image_filename = req.file.filename;

    const food = new Food({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        image: image_filename
    });

    try {
        await food.save();
        res.status(201).json({ success: true, message: "Food added successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "An error occurred while adding food", error: error.message });
    }
};
//all food list
const listfood =async(req,res)=>{
 try{
    const foods = await foodModel.find({});
    res.json({success:true,data:foods})
 }
 catch(error)
 {
    console.log(error);
    res.json({success:false,message:"Error"})
 }
}
//remove food item
const removeFood =async(req,res)=>{
  try{
   const food=await foodModel.findById(req.body.id);
   fs.unlink(`uploads/${food.image}`,()=>{})
   await foodModel.findByIdAndDelete(req.body.id);
   res.json({success:true,message:"Food Removed"})
  }
  catch(error)
  {
    console.log(error);
    res.json({success:false,message:"Error"})
  }
}

export { addFood,listfood,removeFood};

//JSON (JavaScript Object Notation) 
// The async keyword allows the use of await within the function, enabling asynchronous code to be written in a synchronous style, making it more readable and easier to manage.