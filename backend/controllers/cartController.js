import userModel from "../models/userModel.js";

// Add items to user cart
const addToCart = async (req, res) => {
    try {
        const { userId, itemId } = req.body;
        if (!userId || !itemId) {
            return res.status(400).json({ success: false, message: "User ID and Item ID are required" });
        }

        const userData = await userModel.findById(userId);
        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const cartData = userData.cartData || {};
        cartData[itemId] = (cartData[itemId] || 0) + 1;

        await userModel.findByIdAndUpdate(userId, { cartData });

        res.json({ success: true, message: "Added to cart" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// Remove items from user cart
const removeFromCart = async (req, res) => {
    try {
        const { userId, itemId } = req.body;
        if (!userId || !itemId) {
            return res.status(400).json({ success: false, message: "User ID and Item ID are required" });
        }

        const userData = await userModel.findById(userId);
        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const cartData = userData.cartData || {};

        if (cartData[itemId]) {
            cartData[itemId] -= 1;
            if (cartData[itemId] <= 0) {
                delete cartData[itemId];
            }

            await userModel.findByIdAndUpdate(userId, { cartData });
            return res.json({ success: true, message: "Removed from cart" });
        }

        res.status(400).json({ success: false, message: "Item not found in cart" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// Fetch user cart data
const getCart = async (req, res) => {
    try {
        const { userId } = req.body;
        const userData = await userModel.findById(userId);
        if (!userData) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const cartData = userData.cartData;

        return res.json({ success: true, cartData });
    } catch (error) {
        console.error("Error fetching user cart data:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};
export { addToCart, removeFromCart, getCart };
