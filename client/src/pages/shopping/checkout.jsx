import Address from "@/components/shopping/address"
import img from "../../assets/account.png"
import { useDispatch, useSelector } from "react-redux"
import UserCartItemsContent from "@/components/shopping/cart-items.content"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { createNewOrder } from "@/store/shop/order-slice"
import { useToast } from "@/components/ui/use-toast"

function ShoppingCheckout(){

    const {cartItems} = useSelector(state=>state.shopCart)
    const {user} = useSelector(state=>state.auth)
    const {approvalUrl} = useSelector(state=>state.shopOrder)
    const {toast} = useToast()

    const dispatch = useDispatch()

    const[currentSelectedAddress,setCurrentSelectedAddress] = useState(null)
    const [isPaymentStarted,setIsPaymentStarted] = useState(false)

    const totalAmount = cartItems && cartItems.items && cartItems.items.length > 0 ? 
    cartItems.items.reduce((sum,currentItem) => sum + (currentItem?.salePrice > 0 ? currentItem?.salePrice : currentItem?.price ) * currentItem?.quantity,0 )    
    : 0

    function handleCheckout(){

        if(cartItems?.items?.length === 0){
            toast({
                title : "Your Cart Is Empty...Please Add Some Items!",
                variant : "destructive"
            })

            return ;
        }

        if(currentSelectedAddress === null){
            toast({
                title : "Please Select Address To Proceed",
                variant : "destructive"
            })

            return ;
        }

        const orderData = {
            userId : user?.id ,
            cartId : cartItems?._id,
            cartItems : cartItems && cartItems.items.map(singleCartItem=>({
                productId : singleCartItem?.productId,
            title : singleCartItem?.title,
            image : singleCartItem?.image ,
            price : singleCartItem.salePrice > 0 ? singleCartItem?.salePrice : singleCartItem?.price ,
            quantity : singleCartItem?.quantity,
            })),
            addressInfo : {
                addressId : currentSelectedAddress?._id,
                address : currentSelectedAddress?.address,
                city : currentSelectedAddress?.city,
                pincode : currentSelectedAddress?.pincode,
                phone : currentSelectedAddress?.phone,
                notes : currentSelectedAddress?.notes,
            },
            orderStatus : "pending",
            paymentMethod : "paypal",
            paymentStatus : "pending",
            totalAmount,
            orderDate : new Date(),
            orderUpdateDate : new Date(),
            paymentId : "",
            payerId : "",
        }

        dispatch(createNewOrder(orderData)).then((data)=>{
            if(data?.payload?.success){
                setIsPaymentStarted(true)
            }
            else{
                setIsPaymentStarted(false)
            }
        })
    }

    if(approvalUrl){
        window.location.href = approvalUrl ;
    }

    

    
    return <div className="flex-flex-col">
        <div className="relative h-[300px] w-full overflow-hidden">
            <img src={img} className="w-full h-full object-cover object-center"/>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5 p-5">
            <Address currentSelectedAddress={currentSelectedAddress?._id} setCurrentSelectedAddress={setCurrentSelectedAddress} />
            <div className="flex flex-col gap-4">
            {cartItems.items && cartItems.items.length > 0 ?
               cartItems.items.map(item => <UserCartItemsContent cartItem={item} />) : null}
            <div className="mt-8 space-y-4">
            <div className="flex justify-between">
                <span className="font-bold">Total Amount</span>
                <span className="font-bold">₹{totalAmount}</span>
            </div>
            </div>
            <div className="mt-4 w-full">
                <Button onClick={handleCheckout} className="w-full">
                    {
                        isPaymentStarted ? "Payment is processing..." : "Checkout With Paypal"
                    }
                </Button>
            </div>
            </div>
        </div>
    </div>
}

export default ShoppingCheckout