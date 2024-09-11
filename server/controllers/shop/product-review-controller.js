const Order = require("../../models/order")
const Product = require("../../models/product")
const ProductReview = require("../../models/review")

const addProductReview = async (req, res) => {
    try {
        const { productId,userId,userName,reviewMessage,reviewValue } = req.body

        const order = await Order.findOne({
            userId,
            "cartItems.productId" : productId,
            orderStatus : "confirmed"
        })

        if(!order){
            return res.status(403).json({
                success : false,
                message : "You need to purchase product before review it",
            })
        }

        const checkExistingReview =  await ProductReview.findOne({productId,userId})
        
        if(checkExistingReview){
            return res.status(400).json({
                success : false,
                message : "You already reviewed this product"
            })
        }

        const newReview = new ProductReview({
            productId,userId,userName,reviewMessage,reviewValue
        })

        await newReview.save()

        const totalReviews = await ProductReview.find({productId})
        const totalReviewsLength = totalReviews.length;
        const averageReview = totalReviews.reduce((sum,review)=>sum + review.reviewValue,0)/totalReviewsLength

        await Product.findByIdAndUpdate(productId,{averageReview})

        res.status(201).json({
            success : true,
            date : newReview
        })

    }
    catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: "some error occured"
        })
    }
}

const getProductReviews = async (req, res) => {
    try {
        
        const {productId} = req.params

        const reviews = await ProductReview.find({productId})

        res.status(201).json({
            success : true,
            data : reviews
        });
        
    }
    catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: "some error occured"
        })
    }
}

module.exports = { getProductReviews, addProductReview }