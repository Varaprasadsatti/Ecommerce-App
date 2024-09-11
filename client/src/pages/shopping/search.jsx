import ProductDetailsDialog from "@/components/shopping/product-details-dialog"
import ShoppingProductTile from "@/components/shopping/product-tile"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice"
import { fetchProductDetails } from "@/store/shop/products-slice"
import { getSearchResults, resetSearchResults } from "@/store/shop/search-slice"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useSearchParams } from "react-router-dom"

function SearchProducts(){
    const [keyword,setKeyword] = useState("")
    const [searchParams,setSearchParams] = useSearchParams()
    const {searchResults} = useSelector(state=>state.shopSearch)
    const {cartItems} = useSelector(state=>state.shopCart)
    const dispatch = useDispatch()
    const {toast} = useToast()
    const {user} = useSelector(state=>state.auth)
    const [openDetailsDialog,setOpenDetailsDialog] = useState(false)
    const {productDetails} = useSelector(state=>state.shopProducts)

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

    function handleGetProductDetails(id){
        dispatch(fetchProductDetails(id))
    }

    useEffect(()=>{
        if(productDetails !== null){
            setOpenDetailsDialog(true)
        }
    },[productDetails])

    useEffect(()=>{
        if(keyword && keyword.trim() !== "" && keyword.trim().length > 2){
            setTimeout(()=>{
                setSearchParams(new URLSearchParams(`?keyword=${keyword}`))
                dispatch(getSearchResults(keyword))
            },1000)
        }
        else{
            dispatch(resetSearchResults())
        }
        
    },[keyword])
    

    return <div className="container mx-auto md:px-6 px-4 py-8">
        <div className="flex justify-center mb-8">
            <div className="w-full flex items-center">
                <Input
                name="keyword"
                onChange={(event)=>setKeyword(event.target.value)}
                value={keyword}
                className="py-6"
                placeholder = "Search Products"
                />
            </div>
        </div>
        {!searchResults.length > 0 ? <h1 className="text-5xl font-extrabold">No Results Found</h1> : null}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {
            searchResults.map(item => <ShoppingProductTile product={item} handleAddToCart={handleAddToCart} handleGetProductDetails={handleGetProductDetails} />)
            }
        </div>
        <ProductDetailsDialog open={openDetailsDialog} setOpen={setOpenDetailsDialog} productDetails={productDetails} />
    </div>
}

export default SearchProducts