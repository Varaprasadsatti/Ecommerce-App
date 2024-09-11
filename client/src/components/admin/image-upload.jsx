import { useEffect, useRef } from "react"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { FileIcon, UploadCloudIcon, XIcon } from "lucide-react";
import { Button } from "../ui/button";
import axios from "axios";
import { Skeleton } from "../ui/skeleton";

function ProductImageUpload({imageFile,setImageFile,uploadedImageUrl, setUploadedImageUrl,setImageLoadingState,imageLoadingState,isEditMode,isCustomStyling=false}){
    const inputRef = useRef(null)

    function handleImageFileChange(event){
        const selectedFile = event.target.files?.[0]
        if(selectedFile) setImageFile(selectedFile);
    }

    function handleDragOver(event){
        event.preventDefault()
    }

    function handleDrop(event){
        event.preventDefault()
        const droppedFile = event.dataTransfer.files?.[0] ;
        if(droppedFile) setImageFile(droppedFile)
    }

    function handleRemoveImage(){
        setImageFile(null);
        if(inputRef.current) {
            inputRef.current.value = "";
        }
    }

    async function uploadImageToCloudinary(){
        setImageLoadingState(true)
        const data = new FormData();
        data.append("my_file",imageFile)
        const response = await axios.post(`${process.env.VITE_API_URL}/api/admin/products/upload-image`,data)
        
        
        if(response.data.success) {
            setUploadedImageUrl(response.data.result.url)
            setImageLoadingState(false)
        }
    }




    useEffect(()=>{
        if(imageFile !== null) uploadImageToCloudinary()
    },[imageFile])

    return (
        <div onDragOver={handleDragOver} onDrop={handleDrop} className={`w-full ${isCustomStyling ? "" : "max-w-md mx-auto" } mb-3 mt-0 `}>
            <Label className="text-lg font-semibold mb-2 block" >Upload Image</Label>
            <div className={`${isEditMode ? "opacity-30" : ""} border-2 border-dashed rounded-lg p-4`} >
                <Input disabled={isEditMode} className="hidden"  id="image-upload" type="file" ref={inputRef} onChange={handleImageFileChange} />
                {
                    !imageFile? <Label htmlFor="image-upload" className={`flex flex-col items-center justify-center h-32 ${isEditMode ? "cursor-not-allowed" : "cursor-pointer"}`}>
                        <UploadCloudIcon className="w-10 h-10 text-muted-foreground mb-2" />
                        <span>Drag & Drop or Click TO Upload Image</span>
                    </Label> : 
                    imageLoadingState ? 
                    <Skeleton className="h-12 w-12 rounded-full" /> :
                    <div className="flex justify-between items-center">
                        <div className="flex items-center">
                            <FileIcon className="w-8 h-8 text-primary mr-2" />
                        </div>
                        <p className="text-sm font-medium">{imageFile.name}</p>
                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground" onClick={handleRemoveImage}>
                            <XIcon className="w-4 h-4" />
                            <span className="sr-only">Remove File</span>
                        </Button>
                    </div>
                }
            </div>
        </div>
    )
}

export default ProductImageUpload