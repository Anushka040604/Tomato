import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://anushka04:anu040604@cluster0.oqwdjly.mongodb.net/FoodDelivery', {
        });
        console.log('DB Connected');
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1); // Exit process with failure
    }
};
