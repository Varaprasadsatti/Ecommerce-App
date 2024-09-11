import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { Button } from "../ui/button"
import { Dialog } from "../ui/dialog"
import AdminOrderDetails from "./order-details"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getAllOrdersForAdmin, getOrderDetailsForAdmin, resetOrderDetails } from "@/store/admin/order-slice"
import { Badge } from "../ui/badge"

function AdminOrdersView(){
    const [openDetailsDialog,setOpenDetailsDialog] = useState(false)
    const {orderList,orderDetails} = useSelector(state=>state.adminOrder)
    const dispatch = useDispatch()

    const [openOrderDetailsDialog,setOpenOrderDetailsDialog] = useState(false)


    function handleViewOrderDetails(id){
        dispatch(getOrderDetailsForAdmin(id))
    }

    useEffect(()=>{
        if(orderDetails !== null){
            setOpenOrderDetailsDialog(true)
        }
    },[orderDetails])
    
    useEffect(()=>{
        dispatch(getAllOrdersForAdmin())
    },[dispatch])
    

    return <Card>
        <CardHeader>
            <CardTitle>
                Orders
            </CardTitle>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Order Id</TableHead>
                        <TableHead>Order Date</TableHead>
                        <TableHead>Order Status</TableHead>
                        <TableHead>Order Price</TableHead>
                        <TableHead><span className="sr-only">Details</span></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                {
                        orderList && orderList.length > 0 ?
                            orderList.map((orderItem) => 
                                <TableRow>
                                    <TableCell>{orderItem?._id}</TableCell>
                                    <TableCell>{orderItem?.orderDate.split('T')[0]}</TableCell>
                                    <TableCell><Badge className={`px-3 py-1 ${orderItem?.orderStatus === "confirmed" ? "bg-green-600" : orderItem?.orderStatus === "rejected" ? "bg-red-800" : "bg-black" }`} >{orderItem?.orderStatus}</Badge></TableCell>
                                    <TableCell>${orderItem?.totalAmount}</TableCell>
                                    <TableCell>
                                        <Dialog open={openOrderDetailsDialog} onOpenChange={()=>{
                                            setOpenOrderDetailsDialog(false)
                                            dispatch(resetOrderDetails())
                                        }}>
                                            <Button onClick={() => handleViewOrderDetails(orderItem?._id)} >View Details</Button>
                                            <AdminOrderDetails orderDetails={orderDetails} />
                                        </Dialog>
                                    </TableCell>
                                </TableRow>
                            )
                            : null
                    }
                </TableBody>
            </Table>
        </CardContent>
    </Card>
}

export default AdminOrdersView