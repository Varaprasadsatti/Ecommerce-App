import ProductFilter from "@/components/shopping/filter"
import ProductDetailsDialog from "@/components/shopping/product-details-dialog"
import ShoppingProductTile from "@/components/shopping/product-tile"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/use-toast"
import { sortOptions } from "@/config"
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice"
import { fetchAllFilteredProducts, fetchProductDetails} from "@/store/shop/products-slice"
import { ArrowUpDownIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useSearchParams } from "react-router-dom"


function createSearchParamsHelper(filteredParams){
    const queryParams = []

    for(const [key,value] of Object.entries(filteredParams)){
        if(Array.isArray(value) && value.length>0){
            const paramValue = value.join(",");
            queryParams.push(`${key}:${encodeURIComponent(paramValue)}`)
        }
    }
    return queryParams.join("&")
}



function ShoppingListing(){
    const dispatch = useDispatch()
    const {productsList,productDetails} = useSelector(state=>state.shopProducts)
    const {cartItems} = useSelector(state=>state.shopCart)
    
    const {user} = useSelector(state=>state.auth)

    const [filters,setFilters] = useState({});
    const [sort,setSort] = useState(null);
    const [openDetailsDialog,setOpenDetailsDialog] = useState(false)
    const [searchParams,setSearchParams] = useSearchParams()
    const {toast} = useToast()

    const categorySearchParam = searchParams.get("category")

    function handleFilters(getCurrentSection,getCurrentOption){
        let cpyFilters = {...filters}
        const indexOfCurrentSection = Object.keys(cpyFilters).indexOf(getCurrentSection)

        if(indexOfCurrentSection === -1){
            cpyFilters = {
                ...cpyFilters,
                [getCurrentSection] : [getCurrentOption]
            }
        }
        else{
            const indesOfCurrentOption = cpyFilters[getCurrentSection].indexOf(getCurrentOption)

            if(indesOfCurrentOption===-1){
                cpyFilters[getCurrentSection].push(getCurrentOption)
            }
            else{
                cpyFilters[getCurrentSection].splice(indesOfCurrentOption,1)
            }
        }

        setFilters(cpyFilters)
        sessionStorage.setItem("filters",JSON.stringify(cpyFilters));
        
        
    }

    function handleSort(value){
        setSort(value);
    }

    function handleGetProductDetails(id){
        dispatch(fetchProductDetails(id))
    }

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
    

    useEffect(()=>{
        setSort("price-lowtohigh");
        setFilters(JSON.parse(sessionStorage.getItem("filters")) || {} );
    },[categorySearchParam])
    

    useEffect(()=>{
        if(filters !== null && sort !== null){
            dispatch(fetchAllFilteredProducts({filterParams:filters, sortParams:sort}))
        }
    },[dispatch,sort,filters])

    useEffect(()=>{
        if(filters && Object.keys(filters).length > 0){
            const createQueryString = createSearchParamsHelper(filters)
            setSearchParams(new URLSearchParams(createQueryString))
        }
    },[filters])

    useEffect(()=>{
        if(productDetails !== null){
            setOpenDetailsDialog(true)
        }
    },[productDetails])
    
    
    
    return <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 p4 md:p-6">
        <ProductFilter filters={filters} handleFilters={handleFilters} />
        <div className="bg-background w-full rounded-lg shadow-sm">
            <div className="p-4 border-b flex items-center justify-between">
                <h2 className="text-lg font-extrabold">All Products</h2>
                <div className="flex items-center gap-3">
                    <span className="text-muted-foreground">{productsList?.length} Products</span>
                    <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="flex items-center gap-1">
                            <ArrowUpDownIcon className="w-4 h-4"/>
                            <span>Sort By</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[200px]">
                        <DropdownMenuRadioGroup value={sort} onValueChange={handleSort}>
                            {
                                sortOptions.map(item => <DropdownMenuRadioItem value={item?.id} key={item.id}>{item.label}</DropdownMenuRadioItem>)
                            }
                        </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
                {
                    productsList && productsList.length > 0 ?
                    productsList.map(item => <ShoppingProductTile handleAddToCart={handleAddToCart} handleGetProductDetails={handleGetProductDetails} key={item._id} product={item} />) : null
                }
            </div>
        </div>
        <ProductDetailsDialog open={openDetailsDialog} setOpen={setOpenDetailsDialog} productDetails={productDetails} />
    </div>
}

export default ShoppingListing