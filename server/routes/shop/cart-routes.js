const express = require("express")
const {addToCart,fetchCartItems,deleteFromCart,updateCartItemsQuantity} = require("../../controllers/shop/cart-controller")

const router = express.Router()

router.get("/get/:userId",fetchCartItems)
router.post("/add",addToCart)
router.put("/update-cart",updateCartItemsQuantity)
router.delete("/:userId/:productId",deleteFromCart)

module.exports = router