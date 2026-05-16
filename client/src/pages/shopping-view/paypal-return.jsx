/*------------------------------
Here we will create a design and code for-- after payment done
-------------------------------*/

import { useDispatch } from "react-redux"
import { Card, CardHeader, CardTitle } from "../../components/ui/card"
import { useLocation } from "react-router-dom"
import { useEffect } from "react"
import { capturePayemnt } from "@/store/shop/order-slice"

function PaypalReturn(){

    const dispatch = useDispatch()
    const location = useLocation()
    const params = new URLSearchParams(location.search)
    const paymentId = params.get("paymentId")
    const payerId = params.get("PayerID")

    useEffect(()=>{
        if (paymentId && payerId) {
            const orderId = JSON.parse(sessionStorage.getItem("currentOrderId"))
            
            dispatch(capturePayemnt({paymentId, payerId, orderId})).then((data)=>{
                if(data?.payload?.success){
                    sessionStorage.removeItem('currentOrderId')
                    window.location.href = '/shop/payment-success'
                }
            })
        }
    },[payerId, paymentId, dispatch])

    return(
        <Card>
            <CardHeader>
                <CardTitle>
                    Processing Payment..Please Wait!
                </CardTitle>
            </CardHeader>
        </Card>
    )
}

export default PaypalReturn