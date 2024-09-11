const paypal = require("../../helpers/paypal")
const Order = require("../../models/order")
const Cart = require("../../models/cart")
const Product = require("../../models/product")
require("dotenv").config();

const createOrder = async (req,res)=>{
    try{

        const {userId,cartId,cartItems,addressInfo,orderStatus,paymentMethod,paymentStatus,totalAmount,orderDate,orderUpdateDate,paymentId,payerId} = req.body

        const create_payment_json = {
            intent : "sale",
            payer : {
                payment_method : 'paypal'
            },
            redirect_urls : {
                return_url : `${process.env.CLIENT_BASE_URL}/shop/paypal-return`,
                cancel_url : `${process.env.CLIENT_BASE_URL}/shop/paypal-cancel`,
            },
            transactions : [
                {
                    item_list : {
                        items : cartItems.map(item => ({
                            name : item.title,
                            sku : item.productId,
                            price : item.price.toFixed(2),
                            currency : "USD",
                            quantity : item.quantity
                        }))
                    },
                    amount : {
                        currency : "USD",
                        total : totalAmount.toFixed(2)
                    },
                    description : "description"
                }
            ]
        }

        paypal.payment.create(create_payment_json,async(error,paymentInfo)=>{
            if(error){
                console.log(error);
                return res.status(500).json({
                    success : false,
                    message :"Error while creating paypal payment"
                })
            }
            else{
                const newlyCreatedOrder = new Order({
                    userId,
                    cartId,
                    cartItems,
                    addressInfo,
                    orderStatus,
                    paymentMethod,
                    paymentStatus,
                    totalAmount,
                    orderDate,
                    orderUpdateDate,
                    paymentId,
                    payerId
                })

                await newlyCreatedOrder.save();

                const approvalUrl = paymentInfo.links.find(link => link.rel === "approval_url").href;

                res.status(201).json({
                    success : true,
                    approvalUrl,
                    orderId : newlyCreatedOrder._id
                })
            }
        })

    }
    catch(e){
        console.log(e);
        res.status(500).json({
            success : false,
            message : "some error occured"
        })
    }
}

const capturePayment = async (req,res)=>{
    try{
        const {paymentId,payerId,orderId} = req.body

        const order = await Order.findById(orderId)

        if(!order){
            return res.status(404).json({
                success : false,
                message : "Order Not Found"
            })
        }

        order.paymentStatus = "paid",
        order.orderStatus = "confirmed"
        order.paymentId = paymentId
        order.payerId = payerId

        for (let item of order.cartItems){
            let product = await Product.findById(item.productId)

            if(!product){
                return res.status(404).json({
                    success : false,
                    message : `Stock is not enough for this product ${item.title}`
                })
            }

            product.totalStock -= item.quantity

            await product.save()
        }

        const getCartId = order.cartId;
        await Cart.findByIdAndDelete(getCartId)

        await order.save();

        res.status(200).json({
            success : true,
            message : "Order Confirmed",
            data : order
        })

    }
    catch(e){
        console.log(e);
        res.status(500).json({
            success : false,
            message : "some error occured"
        })
    }
}

const getAllOrdersByUser = async (req,res) => {
    try{

        const {userId} = req.params
        const orders = await Order.find({userId})

        if(!orders.length){
            return res.status(404).json({
                success : false,
                message : "No Orders Found"
            })
        }

        res.status(200).json({
            success  :true,
            data : orders
        })

    }
    catch(e){
        console.log(e);
        res.status(500).json({
            success : false,
            message : "some error occured"
        })
    }
}

const getOrderDetails = async (req,res) => {
    try{
        const {id} = req.params

        const order = await Order.findById(id)

        if(!order){
            return res.status(404).json({
                success : false,
                message : "Order Not Found"
            })
        }

        res.status(200).json({
            success  :true,
            data : order
        })
    }
    catch(e){
        console.log(e);
        res.status(500).json({
            success : false,
            message : "some error occured"
        })
    }
}



module.exports = {createOrder,capturePayment,getAllOrdersByUser,getOrderDetails}