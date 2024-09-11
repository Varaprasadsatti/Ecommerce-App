import { useEffect, useState } from "react"
import CommonForm from "../common/common-form"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { addressFormControls } from "@/config"
import { useDispatch, useSelector } from "react-redux"
import { DialogPortal } from "@radix-ui/react-dialog"
import { addNewAddress, deleteAddress, editAddress, fetchAllAddresses } from "@/store/shop/address-slice"
import AddressCard from "./address-card"
import { useToast } from "../ui/use-toast"

const initialAddressFormData = {
    address: "",
    city: "",
    pincode: "",
    phone: "",
    notes: "",
}

function Address({currentSelectedAddress,setCurrentSelectedAddress}) {
    const [formData, setFormData] = useState(initialAddressFormData)
    const [currentEditedAddressId, setCurrentEditedAddressId] = useState(null)
    const dispatch = useDispatch()
    const { user } = useSelector(state => state.auth)
    const { addressList } = useSelector(state => state.shopAddress)
    const {toast} = useToast()

    function handleManageAddress(event) {
        event.preventDefault()

        if(addressList.length >= 3  && currentEditedAddressId === null){
            toast({
                title : "You Can Add Upto 3 Addresses",
                variant : "destructive"
            })
            setFormData(initialAddressFormData)

            return ;
        }

        currentEditedAddressId !== null ? 
        dispatch(editAddress({userId:user?.id,addressId:currentEditedAddressId,formData})).then((data)=>{
            if(data?.payload?.success){
                dispatch(fetchAllAddresses(user?.id))
                setCurrentEditedAddressId(null);
                setFormData(initialAddressFormData);
                toast({
                    title : "Changes Saved"
                })
            }
        })
        :
        dispatch(addNewAddress({
            ...formData, userId: user?.id
        })).then((data) => {
            if (data?.payload?.success) {
                dispatch(fetchAllAddresses(user?.id))
                setFormData(initialAddressFormData)
                toast({
                    title : "Address Added Successfully"
                })
            }

        })
    }

    function isFormValid() {
        return Object.keys(formData).map((key) => formData[key].trim() !== "").every(item => item)
    }

    function handleDeleteAddress(getAddressDetails) {
        dispatch(deleteAddress({ userId: user?.id, addressId: getAddressDetails?._id })).then((data) => {

            if (data?.payload?.success) {
                dispatch(fetchAllAddresses(user?.id))
                toast({
                    title : "Address Deleted Successfully",
                    variant : "destructive"
                })
            }
        })
    }

    function handleEditAddress(getAddressDetails) {
        setCurrentEditedAddressId(getAddressDetails?._id)
        setFormData({
            ...formData,
            address: getAddressDetails?.address ,
            city: getAddressDetails?.city,
            pincode: getAddressDetails?.pincode,
            phone: getAddressDetails?.phone,
            notes: getAddressDetails?.notes,
        })
    }

    useEffect(() => {
        dispatch(fetchAllAddresses(user?.id))
    }, [dispatch])


    return <Card>
        <div className="mb-5 p-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
            {
                addressList && addressList.length > 0 ?
                    addressList.map(item => <AddressCard currentSelectedAddress={currentSelectedAddress} setCurrentSelectedAddress={setCurrentSelectedAddress} handleEditAddress={handleEditAddress} handleDeleteAddress={handleDeleteAddress} addressInfo={item} />) : null
            }
        </div>
        <CardHeader>
            <CardTitle>{ currentEditedAddressId !== null ? "Edit Your Address" : "Add New Address"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
            <CommonForm
                formControls={addressFormControls}
                formData={formData}
                setFormData={setFormData}
                buttonText={currentEditedAddressId !== null ? "Save Changes" : "Add"}
                onSubmit={handleManageAddress}
                isBtnDisabled={!isFormValid()}
            />
        </CardContent>
    </Card>
}

export default Address