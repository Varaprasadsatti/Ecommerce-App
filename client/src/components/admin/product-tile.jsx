import { Button } from "../ui/button"
import { Card, CardContent, CardFooter } from "../ui/card"

function AdminProductTile({product,setOpenCreateProductDialogue,setFormData,setCurrentEditedId,handleDeleteButton}){
    

    return (
        <Card>
            <div className="w-full max-w-sm mx-auto">
                <div className="relative">
                    <img 
                    src={product?.image}
                    alt = {product?.title}
                    className="w-full h-[300px] object-cover rounded-t-lg"
                    />
                </div>
                <CardContent>
                    <h2 className="mt-2 text-xl font-bold mb-2">{product?.title}</h2>
                    <div className="flex mb-2 justify-between items-center">
                        <span className={`${product?.salePrice > 0 ? "line-through" : ""} text-lg font-semibold text-primary`}>₹{product?.price}</span>
                        {product?.salePrice > 0 ?
                            <span className="text-lg font-bold">₹{product?.salePrice}</span>
                            : null
                        }
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between items-center">
                    <Button onClick={()=>{
                        setOpenCreateProductDialogue(true)
                        setCurrentEditedId(product?._id)
                        setFormData(product)
                    }} >Edit</Button>
                    <Button onClick={()=>handleDeleteButton(product?._id)} >Delete</Button>
                </CardFooter>
            </div>
        </Card>
    )
}

export default AdminProductTile