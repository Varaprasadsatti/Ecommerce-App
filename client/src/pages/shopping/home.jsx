import { Button } from "@/components/ui/button"
import bannerOne from "../../assets/banner-1.webp"
import bannerTwo from "../../assets/banner-2.webp"
import bannerThree from "../../assets/banner-3.webp"
import { AwardIcon, BabyIcon, ChartNoAxesGantt, ChevronLeftIcon, ChevronRightIcon, CloudLightningIcon, FootprintsIcon, Heading, Heading1Icon, PersonStandingIcon, ShieldCheckIcon, ShirtIcon, WatchIcon,  } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchAllFilteredProducts, fetchProductDetails } from "@/store/shop/products-slice"
import ShoppingProductTile from "@/components/shopping/product-tile"
import { useNavigate } from "react-router-dom"
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice"
import { useToast } from "@/components/ui/use-toast"
import ProductDetailsDialog from "@/components/shopping/product-details-dialog"
import { getFeatureImages } from "@/store/common-slice"


const categories = [
    { id: "men", label: "Men" ,icon : ShirtIcon },
    { id: "women", label: "Women", icon : CloudLightningIcon },
    { id: "kids", label: "Kids", icon : BabyIcon },
    { id: "accessories", label: "Accessories", icon : WatchIcon },
    { id: "footwear", label: "Footwear", icon : FootprintsIcon },
  ]

const brands = [
    { id: "nike", label: "Nike",icon : ShieldCheckIcon },
    { id: "adidas", label: "Adidas",icon : ChartNoAxesGantt  },
    { id: "puma", label: "Puma",icon : FootprintsIcon  },
    { id: "levi", label: "Levi's",icon : AwardIcon },
    { id: "zara", label: "Zara",icon : PersonStandingIcon  },
    { id: "h&m", label: "H&M" ,icon : Heading },
  ]

function ShoppingHome(){
    const [currentSlide,setCurrentSlide] = useState(0)
    const [openDetailsDialog,setOpenDetailsDialog] = useState(false)

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const {toast} = useToast()

    const {productsList,productDetails} = useSelector(state=>state.shopProducts)
    const {user} = useSelector(state=>state.auth)
    const { featureImageList } = useSelector(state => state.commonFeature)

    function handleNavigateToListingPage(getCurrentItem,section){
        sessionStorage.removeItem("filters");
        const currentFilter = {
            [section] : [getCurrentItem.id]
        }
        sessionStorage.setItem("filters",JSON.stringify(currentFilter));
        navigate("/shop/listing");
    }

    function handleGetProductDetails(id){        
        dispatch(fetchProductDetails(id))
    }

    function handleAddToCart(getCurrentProductId){
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

    useEffect(() => {
        dispatch(getFeatureImages())
    }, [])

    useEffect(()=>{
        if(productDetails !== null){
            setOpenDetailsDialog(true)
        }
    },[productDetails])

    useEffect(()=>{
        const timer = setInterval(()=>{
            setCurrentSlide(prevSlide=> (prevSlide+1)%featureImageList.length)
        },3000)

        return ()=>clearInterval(timer)
    },[featureImageList])

    useEffect(()=>{
        dispatch(fetchAllFilteredProducts({filterParams:{},sortParams:"price-lowtohigh"}))
    },[dispatch])
    
    

    return <div className="flex flex-col min-h-screen">
        <div className="relative w-full h-[600px] overflow-hidden">
            {
                featureImageList && featureImageList.length > 0 ? featureImageList.map((slide,index)=>
                <img 
                src={slide?.image} 
                key={index} 
                className={`${index === currentSlide ? "opacity-100" : "opacity-0"} absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000`}/>)
            :null}
            <Button
            onClick = {()=>{
                setCurrentSlide(prevSlide=>(prevSlide -1 + featureImageList.length) % featureImageList.length)
                
                
            }}
            variant="outline" size="icon" className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/80">
                <ChevronLeftIcon className="w-4 h-4" />
            </Button>
            <Button
            onClick = {()=>setCurrentSlide(prevSlide=>(prevSlide +1) % featureImageList.length)}
            variant="outline" size="icon" className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/80">
                <ChevronRightIcon className="w-4 h-4" />
            </Button>
        </div>
        <section className="py-12 bg-gray-50">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-8">Shop By Category</h2>
            </div>
            <div className="grid col-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {
                    categories.map((item)=><Card onClick={()=>handleNavigateToListingPage(item,"category")} className="cursor-pointer hover:shadow-lg transition-shadow">
                        <CardContent className="flex flex-col items-center justify-center p-6">
                            <item.icon className="w-12 h-12 mb-4 text-primary" />
                            <span className="font-bold">{item?.label}</span>
                        </CardContent>
                    </Card>)
                }
            </div>
        </section>
        <section className="py-12 bg-gray-50">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-8">Shop By Brand</h2>
            </div>
            <div className="grid col-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {
                    brands.map((item)=><Card onClick={()=>handleNavigateToListingPage(item,"brand")} className="cursor-pointer hover:shadow-lg transition-shadow">
                        <CardContent className="flex flex-col items-center justify-center p-6">
                            <item.icon className="w-12 h-12 mb-4 text-primary" />
                            <span className="font-bold">{item?.label}</span>
                        </CardContent>
                    </Card>)
                }
            </div>
        </section>
        <section className="py-12">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold text-center mb-8">You May Like</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {
                    productsList && productsList?.length > 0 ?
                    productsList.map(productItem=><ShoppingProductTile handleAddToCart={handleAddToCart} handleGetProductDetails={handleGetProductDetails} key={productItem._id} product={productItem} />)
                    : null
                    }
                </div>
            </div>
        </section>
        <ProductDetailsDialog open={openDetailsDialog} setOpen={setOpenDetailsDialog} productDetails={productDetails} />
    </div>
}

export default ShoppingHome