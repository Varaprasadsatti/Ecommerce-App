const Cart = require("../../models/cart")
const Product = require("../../models/product")


const addToCart = async (req, res) => {
    try {
        const {userId, productId, quantity} = req.body

        if( !userId || !productId || quantity <=0 ){
            return res.status(400).json({
                success : false,
                message : "Invalid Data Provided"
            })
        }

        const product = await Product.findById(productId);

        if(!product){
            return res.status(404).json({
                success : false,
                message : "Product Not Found"
            })
        }

        let cart = await Cart.findOne({userId})

        if(!cart){
            cart = new Cart({userId,items : []})
        }

        const findCurrentProductIndex = cart.items.findIndex(item => item.productId.toString()===productId);

        if(findCurrentProductIndex===-1){
            cart.items.push({productId,quantity})
        }
        else{
            cart.items[findCurrentProductIndex].quantity += quantity
        }

        await cart.save()

        res.status(200).json({
            success : true,
            data : cart,
        })


    }
    catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: "Some Error Ocuured"
        })
    }
}


const fetchCartItems = async (req, res) => {
    try {

        const {userId} = req.params
        

        if(!userId){
            return res.status(400).json({
                success : false,
                message : "User Id Not Found"
            })
        }

        const cart = await Cart.findOne({userId}).populate({
            path : "items.productId",
            select : "image title price salePrice"
        })

        if(!cart){
            return res.status(404).json({
                success : false,
                message : "Cart Not Found"
            })
        }

        const validCartItems = cart.items.filter(productItem => productItem.productId)

        if(validCartItems.length < cart.items.length){
            cart.items = validCartItems;
            await cart.save()
        }

        const populateCartItems = validCartItems.map(item => ({
            productId : item.productId._id,
            image : item.productId.image,
            title : item.productId.title,
            price : item.productId.price,
            salePrice : item.productId.salePrice,
            quantity : item.quantity
        }))

        res.status(200).json({
            success : true,
            data : {
                ...cart._doc,
                items : populateCartItems
            }
        })

    }
    catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: "Some Error Ocuured"
        })
    }
}

const updateCartItemsQuantity = async (req, res) => {
    try {
        const {userId, productId, quantity} = req.body

        if( !userId || !productId || quantity <=0 ){
            return res.status(400).json({
                success : false,
                message : "Invalid Data Provided"
            })
        }

        const cart = await Cart.findOne({userId})

        if(!cart){
            return res.status(404).json({
                success : false,
                message : "Cart Not Found"
            })
        }

        const findCurrentProductIndex = cart?.items?.findIndex(item => item.productId.toString()===productId);

        if(findCurrentProductIndex===-1){
            return res.status(404).json({
                success : false,
                message : "Cart Item Not Present"
            })
        }

        cart.items[findCurrentProductIndex].quantity = quantity
        await cart.save()

        await cart.populate({
            path: "items.productId",
            select : "image title price salePrice",
        })

        const populateCartItems = cart.items.map(item => ({
            productId : item.productId? item.productId._id : null,
            image : item.productId? item.productId.image : null,
            title : item.productId? item.productId.title : "Product Not Found",
            price : item.productId? item.productId.price : null,
            salePrice : item.productId? item.productId.salePrice : null,
            quantity :item.quantity
        }))   
        
        res.status(200).json({
            success : true,
            data : {
                ...cart._doc,
                items : populateCartItems
            }
        })

    }
    catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: "Some Error Ocuured"
        })
    }
}

const deleteFromCart = async (req, res) => {
    try {
        const {userId,productId} = req.params

        if( !userId || !productId ){
            return res.status(400).json({
                success : false,
                message : "Invalid Data Provided"
            })
        }

        const cart = await Cart.findOne({userId}).populate({
            path: "items.productId",
            select : "image title price salePrice",
        })

        if(!cart){
            return res.status(404).json({
                success : false,
                message : "Cart Not Found"
            })
        }

        cart.items = cart.items.filter((item) => item.productId._id.toString() !== productId);

        await cart.save()

        await cart.populate({
            path: "items.productId",
            select : "image title price salePrice",
        })

        const populateCartItems = cart.items.map(item => ({
            productId : item.productId? item.productId._id : null,
            image : item.productId? item.productId.image : null,
            title : item.productId? item.productId.title : "Product Not Found",
            price : item.productId? item.productId.price : null,
            salePrice : item.productId? item.productId.salePrice : null,
            quantity :item.quantity
        }))

        res.status(200).json({
            success : true,
            data : {
                ...cart._doc,
                items : populateCartItems
            }
        })
    }
    catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: "Some Error Ocuured"
        })
    }
}

module.exports = { addToCart, fetchCartItems, updateCartItemsQuantity, deleteFromCart }