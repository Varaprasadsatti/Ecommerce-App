import { Minus, Plus, Trash } from "lucide-react"
import { Button } from "../ui/button"
import { useDispatch, useSelector } from "react-redux"
import { deleteFromCart, updateCartQuantity } from "@/store/shop/cart-slice"
import { useToast } from "../ui/use-toast"

function UserCartItemsContent({cartItem}){
    const {user} = useSelector(state=>state.auth)
    const dispatch = useDispatch()
    const {toast} = useToast()
    const {productsList,productDetails} = useSelector(state=>state.shopProducts)
    const {cartItems} = useSelector(state=>state.shopCart)

    function handleDeleteCartItem(getCartItem){
        dispatch(deleteFromCart({userId:user?.id,productId:getCartItem?.productId})).then((data)=>{
            if(data?.payload?.success){
                toast({
                    title : "Product Removed From Cart"
                })
            }
        })
    }

    function handleUpdateCartItem(getCartItem,typeOfAction){
        
        if(typeOfAction === "plus"){
            let getCartItems = cartItems.items || []

            if(getCartItems.length){
                const indexOfCurrentItem = getCartItems.findIndex(item=>item.productId === getCartItem?.productId)
    
                if(indexOfCurrentItem > -1){
                    const getQuantity = getCartItems[indexOfCurrentItem].quantity
                    
                    const getProductIndex = productsList.findIndex(product=>product?._id === getCartItem?.productId)
                    const getTotalStock = productsList[getProductIndex].totalStock
                    
                    if(getQuantity + 1 > getTotalStock){
    
                        toast({
                            title : `Only ${getQuantity} products can be added to cart`,
                            variant : "destructive"
                        })
                        return ;
                    }
                    
                }
            }
        }

        

        dispatch(updateCartQuantity({userId:user?.id,productId:getCartItem?.productId,quantity:(
            typeOfAction === "plus" ? getCartItem.quantity +1 : getCartItem.quantity-1
        )}))
    }

    return <div className="flex items-center space-x-4">
        <img src={cartItem?.image} alt={cartItem?.title} className="w-20 h-20 rounded object-cover" />
        <div className="flex-1">
            <h3 className="font-extrabold">{cartItem?.title}</h3>
            <div className="flex items-center mt-1 gap-2">
                <Button disabled={cartItem?.quantity===1} onClick={()=>handleUpdateCartItem(cartItem,"minus")} variant="outline" className="h-8 w-8 rounded-full" size="icon" >
                    <Minus className="w-4 h-4" />
                    <span className="sr-only">Decrease</span>
                </Button>
                <span className="font-semibold">{cartItem?.quantity}</span>
                <Button onClick={()=>handleUpdateCartItem(cartItem,"plus")} variant="outline" className="h-8 w-8 rounded-full" size="icon" >
                    <Plus className="w-4 h-4" />
                    <span className="sr-only">Increase</span>
                </Button>
            </div>
        </div>
        <div className="flex flex-col items-end">
            <p className="font-semibold">₹{((cartItem?.salePrice > 0 ? cartItem?.salePrice :  cartItem?.price) * cartItem?.quantity).toFixed(2)}</p>
            <Trash onClick={()=>handleDeleteCartItem(cartItem)} className="cursor-pointer mt-2" size={20}/>
        </div>
    </div>
}

export default UserCartItemsContent