import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { capturePayment } from "@/store/shop/order-slice"
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { useLocation } from "react-router-dom"

function PaypalReturnPage(){

    const dispatch = useDispatch()
    const location = useLocation()
    const params = new URLSearchParams(location.search)
    const paymentId = params.get("paymentId")
    const payerId = params.get("PayerID")

    useEffect(()=>{
        if(payerId && paymentId){
            const orderId = JSON.parse(sessionStorage.getItem("currentOrderId"))
            console.log(orderId,"currentOrderId");
            

            dispatch(capturePayment({orderId,paymentId,payerId})).then((data)=>{
                if(data?.payload?.success){
                    sessionStorage.removeItem("currentOrderId")
                    window.location.href = "/shop/payment-success"
                }
            })
        }
    },[paymentId,payerId,dispatch])

    return <Card>
        <CardHeader>
            <CardTitle>Processing Payment...please wait!</CardTitle>
        </CardHeader>
    </Card>
}

export default PaypalReturnPage