import ProductImageUpload from "@/components/admin/image-upload";
import AdminProductTile from "@/components/admin/product-tile";
import CommonForm from "@/components/common/common-form";
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { useToast } from "@/components/ui/use-toast";
import { addProductFormElements } from "@/config";
import { addNewProduct, deleteProduct, editProduct, fetchAllProducts } from "@/store/admin/products-slice";
import { Fragment, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux";

const initialFormData = {
    image: null,
    title: "",
    description: "",
    category: "",
    brand: "",
    price: "",
    salePrice: "",
    totalStock: "",
    averageReview: 0,
  };

function AdminProducts(){

    const [openCreateProductDialogue,setOpenCreateProductDialogue] = useState(false)
    const [formData,setFormData] = useState(initialFormData)
    const [imageFile,setImageFile] = useState(null)
    const [uploadedImageUrl, setUploadedImageUrl] =useState("")
    const [imageLoadingState,setImageLoadingState] = useState(false);
    const [currentEditedId,setCurrentEditedId] = useState(null)

    const dispatch = useDispatch()
    const {productsList} = useSelector(state => state.adminProducts)
    const {toast} = useToast()

    function isFormValid(){
        return Object.keys(formData).map(key => formData[key]!=="").every(item=>item);
    }

    function onSubmit(event){
        event.preventDefault()

        currentEditedId !== null ?
        dispatch(editProduct({id:currentEditedId,formData}))
        .then((data)=>{
            if(data?.payload?.success){
                dispatch(fetchAllProducts());
                setOpenCreateProductDialogue(false);
                setFormData(initialFormData);
                setCurrentEditedId(null)
                toast({
                    title : "Changes Saved Successully"
                     })
            }
            console.log(data);
            
        })
        :
        dispatch(addNewProduct({
            ...formData,
            image : uploadedImageUrl
        })).then((data)=>{
            if(data?.payload?.success){
            dispatch(fetchAllProducts());
            setOpenCreateProductDialogue(false);
            setImageFile(null);
            setFormData(initialFormData);
            toast({
                title : "Product Added Successfully"
                 })
        }
        })
    }

    function handleDeleteButton(id){
        dispatch(deleteProduct(id))
        .then((data)=>{
            if(data?.payload?.success){
                dispatch(fetchAllProducts())
            }
        })
        
    }

    useEffect(()=>{
        dispatch(fetchAllProducts())
    },[dispatch])
    

    return <Fragment>
        <div className="flex justify-end w-full my-5">
            <Button onClick = {() => setOpenCreateProductDialogue(true)}>Add New Product</Button>
        </div>
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
            {
               productsList && productsList?.length > 0 ? 
               productsList.map((productItem) => <AdminProductTile handleDeleteButton={handleDeleteButton} setFormData={setFormData} setCurrentEditedId={setCurrentEditedId} setOpenCreateProductDialogue={setOpenCreateProductDialogue} product={productItem} />)
               : null
            }
        </div>
            <Sheet open={openCreateProductDialogue} onOpenChange={()=> {
                setOpenCreateProductDialogue(false)
                setCurrentEditedId(null)
                setFormData(initialFormData)
                }}>
                <SheetContent side="right" className="overflow-scroll">
                    <SheetHeader>
                        <SheetTitle>{currentEditedId ? "Edit Product" : "Add New Product"}</SheetTitle>
                    </SheetHeader>
                <div className="py-6">
                    <ProductImageUpload isEditMode={currentEditedId !== null} imageFile={imageFile} setImageFile={setImageFile} uploadedImageUrl={uploadedImageUrl} setUploadedImageUrl={setUploadedImageUrl} setImageLoadingState={setImageLoadingState} imageLoadingState={imageLoadingState} />
                    <CommonForm isBtnDisabled={!isFormValid()} formControls={addProductFormElements} onSubmit={onSubmit} formData={formData} setFormData={setFormData} buttonText={currentEditedId? "Save Changes" : "Add"}/>
                </div>
                </SheetContent>
            </Sheet>
    </Fragment>
}

export default AdminProducts