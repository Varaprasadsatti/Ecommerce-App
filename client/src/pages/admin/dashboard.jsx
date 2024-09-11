import ProductImageUpload from "@/components/admin/image-upload";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { addFeatureImage, deleteFeatureImage, getFeatureImages } from "@/store/common-slice";
import { Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

function AdminDashboard() {
    const [imageFile, setImageFile] = useState(null)
    const [uploadedImageUrl, setUploadedImageUrl] = useState("")
    const [imageLoadingState, setImageLoadingState] = useState(false);

    const { featureImageList } = useSelector(state => state.commonFeature)

    const { toast } = useToast()

    const dispatch = useDispatch()


    function handleUploadFeatureImage() {
        dispatch(addFeatureImage(uploadedImageUrl)).then((data) => {
            if (data?.payload?.success) {
                dispatch(getFeatureImages())
                toast({
                    title: "Image Added Successfully"
                })
                setImageFile(null)
                setUploadedImageUrl("")
            }
        })
    }

    function handleDelete(id){
        dispatch(deleteFeatureImage(id)).then((data)=>{
            if(data?.payload?.success){
                dispatch(getFeatureImages())
            }
        })
    }

    useEffect(() => {
        dispatch(getFeatureImages())
    }, [])

    console.log(featureImageList, "featureImageList");



    return (
        <div>
            <ProductImageUpload
                // isEditMode={currentEditedId !== null} 
                isCustomStyling={true}
                imageFile={imageFile}
                setImageFile={setImageFile}
                uploadedImageUrl={uploadedImageUrl}
                setUploadedImageUrl={setUploadedImageUrl}
                setImageLoadingState={setImageLoadingState}
                imageLoadingState={imageLoadingState} />
            <Button disabled={!imageFile} onClick={handleUploadFeatureImage} className="mt-5 w-full">Upload</Button>
            <div className="flex flex-col gap-4 mt-5">
                {featureImageList && featureImageList.length > 0
                    ? featureImageList.map((featureImgItem) => (
                        <div className="relative">
                            <img
                                src={featureImgItem.image}
                                className="w-full h-[300px] object-cover rounded-t-lg"
                            />
                            <Button onClick={()=>handleDelete(featureImgItem?._id)} className="absolute right-2 top-2" variant="outline" >
                                <Trash2 className="h-6 w-6" />
                            </Button>
                        </div>
                    ))
                    : null}
            </div>
        </div>
    )
}

export default AdminDashboard