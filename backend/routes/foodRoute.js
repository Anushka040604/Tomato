import express from 'express';
import { addFood, listfood,removeFood } from '../controllers/foodController.js'; 
import multer from 'multer';

const router = express.Router();

// Image Storage Engine
const storage = multer.diskStorage({
    destination: "uploads",
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage: storage });

// Validation Middleware
const validateFood = (req, res, next) => {
    const { name, description, price, category } = req.body;
    if (!name || !description || !price || !category) {
        return res.status(400).json({ success: false, message: "All fields are required" });
    }
    next();
};

router.post('/add', upload.single("image"), validateFood, addFood);
router.get("/list", listfood); 
router.post('/remove',removeFood);
export default router;
