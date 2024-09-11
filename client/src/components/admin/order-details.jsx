
import { useState } from "react"
import CommonForm from "../common/common-form"
import { DialogContent } from "../ui/dialog"
import { Label } from "../ui/label"
import { Separator } from "../ui/separator"
import { Badge } from "../ui/badge"
import { useDispatch, useSelector } from "react-redux"
import { getAllOrdersForAdmin, getOrderDetailsForAdmin, updateOrderStatus } from "@/store/admin/order-slice"
import { useToast } from "../ui/use-toast"

const initialFormData = {
    status : ""
}

function AdminOrderDetails({orderDetails}){

    const [formData,setFormData] = useState(initialFormData)
    const {user} = useSelector((state)=>state.auth)
    const dispatch = useDispatch()
    const {toast} = useToast()

    const orderStatusFormControls = [{
        label: "Order Status",
        name: "status",
        componentType: "select",
        options: [
          { id: "pending", label: "Pending" },
          { id: "inprogress", label: "In Progress" },
          { id: "shipped", label: "Shipped" },
          { id: "rejected", label: "Rejected" },
          { id: "delivered", label: "Delivered" },
        ],
      }]

    function handleUpdateStatus(event){
        event.preventDefault()
        const {status} = formData
        dispatch(updateOrderStatus({id:orderDetails?._id,orderStatus:status})).then((data)=>{
            if(data?.payload?.success){
                dispatch(getOrderDetailsForAdmin(orderDetails?._id))
                dispatch(getAllOrdersForAdmin());
                setFormData(initialFormData)
                toast({
                    title : "Order Status Is Updated Successfully"
                })
            } 
        })
        
    }

    return <DialogContent className="sm:max-w-[600px]">
        <div className="grid gap-6">
            <div className="grid gap-2">
                <div className="flex items-center mt-6 justify-between">
                    <p className="font-medium">Order Id</p>
                    <Label>{orderDetails?._id}</Label>
                </div>
                <div className="flex items-center mt-2 justify-between">
                    <p className="font-medium">Order Date</p>
                    <Label>{orderDetails?.orderDate.split("T")[0]}</Label>
                </div>
                <div className="flex items-center mt-2 justify-between">
                    <p className="font-medium">Order Price</p>
                    <Label>{orderDetails?.totalAmount}</Label>
                </div>
                <div className="flex items-center mt-2 justify-between">
                    <p className="font-medium">Payment Method</p>
                    <Label>{orderDetails?.paymentMethod}</Label>
                </div>
                <div className="flex items-center mt-2 justify-between">
                    <p className="font-medium">Payment Status</p>
                    <Label>{orderDetails?.paymentStatus}</Label>
                </div>
                <div className="flex items-center mt-2 justify-between">
                    <p className="font-medium">Order Status</p>
                    <Label><Badge className={`px-3 py-1 ${orderDetails?.orderStatus === "confirmed" ? "bg-green-600" 
                         : orderDetails?.orderStatus === "rejected" ? "bg-red-800"
                         : "bg-black" }`} >{orderDetails?.orderStatus}</Badge></Label>
                </div>
            </div>
            <Separator/>
            <div className="grid gap-4">
                <div className="grid gap-2">
                    <div className="font-medium">Order Details</div>
                    <ul className="grid gap-3">
                        {
                            orderDetails && orderDetails.cartItems && orderDetails.cartItems.length>0 ?
                            orderDetails.cartItems.map((item)=>
                            <li className="flex items-center justify-between">
                                <span>Product Title : {item?.title}</span>
                                <span>Quantity : {item?.quantity}</span>
                                <span>Price : {item?.price}</span>
                            </li>)
                            : null
                        }
                    </ul>
                </div>
            </div>
            <div className="grid gap-4">
                <div className="grid gap-2">
                    <div className="font-medium">Shopping Info</div>
                    <div className="grid gap-0.5 text-muted-foreground">
                        <span>{user?.userName}</span>
                        <span>{orderDetails?.addressInfo?.address}</span>
                        <span>{orderDetails?.addressInfo?.city}</span>
                        <span>{orderDetails?.addressInfo?.pincode}</span>
                        <span>{orderDetails?.addressInfo?.phone}</span>
                        <span>{orderDetails?.addressInfo?.notes}</span>
                    </div>
                </div>
            </div>
            <div>
                <CommonForm 
                formControls={orderStatusFormControls}
                formData={formData}
                setFormData={setFormData}
                buttonText={"Update Order Status"}
                onSubmit={handleUpdateStatus}
                /> 
            </div>
        </div>
    </DialogContent>
}

export default AdminOrderDetails