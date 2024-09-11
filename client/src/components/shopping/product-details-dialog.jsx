
import { StarIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { Dialog, DialogContent } from "../ui/dialog";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "../ui/use-toast";
import { setProductDetails } from "@/store/shop/products-slice";
import { Label } from "../ui/label";
import StarRatingComponent from "../common/star-rating";
import { useEffect, useState } from "react";
import { addReview, getReviews } from "@/store/shop/review-slice";

function ProductDetailsDialog({ open, setOpen, productDetails }) {
    const dispatch = useDispatch()
    const {toast}= useToast()
    const {user} = useSelector(state=>state.auth)
    const {cartItems} = useSelector(state=>state.shopCart)
    const {reviews} = useSelector(state=>state.shopReview)
    const [reviewMsg,setReviewMsg] = useState("")
    const [rating,setRating] = useState(0)

    function handleAddToCart(getCurrentProductId,getTotalStock){
        let getCartItems = cartItems.items || []

        if(getCartItems.length){
            const indexOfCurrentItem = getCartItems.findIndex(item=>item.productId === getCurrentProductId)
            

            if(indexOfCurrentItem > -1){
                const getQuantity = getCartItems[indexOfCurrentItem].quantity
                
                
                if(getQuantity + 1 > getTotalStock){

                    
                    toast({
                        title : `Only ${getQuantity} products can be added to cart`,
                        variant : "destructive"
                    })
                    return ;
                }
                
            }
        }
        

        dispatch(addToCart({userId:user?.id,productId:getCurrentProductId,quantity:1})).then((data)=>{
            if(data?.payload?.success){
                dispatch(fetchCartItems(user?.id))
                toast({
                    title : "Added To Cart"
                })
            }
        } 
        )
        
    }

    function handleOnOpenChange(){
        setOpen(false)
        dispatch(setProductDetails())
        setReviewMsg("")
        setRating(0)
    }

    function handleRatingChange(ratingValue){
        setRating(ratingValue)
    }

    function handleAddReview(){
        dispatch(addReview({
            productId : productDetails?._id,
            userId : user?.id,
            userName : user?.userName,
            reviewMessage : reviewMsg,
            reviewValue : rating
        })).then((data)=>{
            if(data?.payload?.success){
                dispatch(getReviews(productDetails?._id))
                setReviewMsg("")
                setRating(0)
                toast({
                    title : "Review Added Successfully"
                })
            }
            
        })
    }

    const averageReview = reviews && reviews?.length > 0 ? 
    reviews.reduce((sum,review)=>sum + review.reviewValue,0)/reviews?.length
    : 0

    useEffect(()=>{
        if(productDetails !== null){
            dispatch(getReviews(productDetails?._id))
        }
    },[productDetails])
    
    

    return (
        <Dialog open={open} onOpenChange={handleOnOpenChange}>
            <DialogContent className="grid grid-cols-2 gap-8 sm:p-12 max-w-[90vw] sm:max-w-[80vw] lg:max-w-[70vw]">
                <div className="relative overflow-hidden rounded-lg">
                    <img
                        src={productDetails?.image}
                        alt={productDetails?.title}
                        width={600}
                        height={600}
                        className="aspect-square w-full object-cover"
                    />
                </div>
                <div className="">
                    <div>
                        <h1 className="text-3xl font-extrabold">{productDetails?.title}</h1>
                        <p className="text-muted-foreground text-2xl mb-5 mt-4">
                            {productDetails?.description}
                        </p>
                    </div>
                    <div className="flex items-center justify-between">
                        <p
                            className={`text-3xl font-bold text-primary ${productDetails?.salePrice > 0 ? "line-through" : ""
                                }`}
                        >
                            ${productDetails?.price}
                        </p>
                        {productDetails?.salePrice > 0 ? (
                            <p className="text-2xl font-bold text-muted-foreground">
                                ${productDetails?.salePrice}
                            </p>
                        ) : null}
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center gap-0.5">
                            <StarRatingComponent rating={averageReview} />
                        </div>
                        <span className="text-muted-foreground">({averageReview.toFixed(1)})</span>
                    </div>
                    <div className="my-5">
                        {
                            productDetails?.totalStock === 0 ?
                            <Button disabled={true} onClick={()=>handleAddToCart(productDetails?._id,productDetails?.totalStock)} className="w-full opacity-60 cursor-not-allowed">Out Of Stock</Button> :
                            <Button onClick={()=>handleAddToCart(productDetails?._id,productDetails?.totalStock)} className="w-full">Add To Cart</Button>
                        }
                        
                    </div>
                    <Separator />
                    <div className="max-h[300px] overflow-auto">
                        <h2 className="text-xl font-bold mb-4">Reviews</h2>
                        <div className="grid gap-6">
                            {
                                reviews && reviews.length > 0 ?
                                reviews.map((reviewItem)=>(
                                    <div className="flex gap-4">
                                <Avatar className="w-10 h-10 border">
                                    <AvatarFallback>{reviewItem?.userName[0].toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div className="grid gap-1">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-bold">{reviewItem?.userName}</h3>
                                    </div>
                                    <div className="flex items-center gap-0.5">
                                        <StarRatingComponent rating={reviewItem?.reviewValue} />
                                    </div>
                                    <p className="text-muted-foreground">{reviewItem?.reviewMessage}</p>
                                </div>
                            </div>
                                ))
                                : null
                            }
                        </div>
                        <div className="mt-10 flex flex-col gap-2">
                            <Label>
                                Write a review
                            </Label>
                            <div className="flex gap-1">
                                <StarRatingComponent rating={rating} handleRatingChange={handleRatingChange} />
                            </div>
                            <Input name="reviewMsg" value={reviewMsg} onChange={(event)=>setReviewMsg(event.target.value)} placeholder="write your review..." />
                            <Button onClick={handleAddReview} disabled={reviewMsg.trim()===""} >Submit</Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default ProductDetailsDialog;