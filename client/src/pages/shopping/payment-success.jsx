import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { CircleCheck } from "lucide-react"
import { useNavigate } from "react-router-dom"

function PaymentSuccessPage() {
    const navigate = useNavigate()
    return <Card className="p-10">
        <CardHeader className="p-0 mb-5">
            <CardTitle className="flex items-center">
                <h2>Payment is successful</h2>
                <CircleCheck className="w-8 h-8 pt-1 text-white fill-green-600" />
            </CardTitle>
        </CardHeader>
        <Button onClick={()=>navigate("/shop/account")}>
            View Orders
        </Button>
    </Card>
}

export default PaymentSuccessPage