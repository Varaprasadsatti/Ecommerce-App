const Address = require("../../models/address")



const addAddress = async (req,res)=>{
    try{

        const {userId,address,city,pincode,phone,notes} = req.body

        if(!userId || !address || !city || !pincode || !phone || !notes){
            return res.status(400).json({
                success : false,
                message : "Invalid Data Provided"
            })
        }

        const newlyCreatedAddress = new Address({
            userId,address,city,pincode,phone,notes
        })

        await newlyCreatedAddress.save()

        res.status(201).json({
            success : true,
            data : newlyCreatedAddress,
        })


    }
    catch(e){
        console.log(e);
        res.status(500).json({
            success : false,
            message : "Some Error Occured"
        })
    }
}

const fetchAllAddresses = async (req,res)=>{
    try{

        const {userId} = req.params

        if(!userId){
            return res.status(400).json({
                success : false,
                message : "UserId Is Required"
            })
        }

        const addressList = await Address.find({userId})

        res.status(200).json({
            success : false,
            data : addressList
        })

    }
    catch(e){
        console.log(e);
        res.status(500).json({
            success : false,
            message : "Some Error Occured"
        })
    }
}

const editAddress = async (req,res)=>{
    try{

        const {userId,addressId} = req.params
        const formData = req.body

        if(!userId || !addressId ){
            return res.status(400).json({
                success : false,
                message : "UserId and AddressId Is Required"
            })
        }

        const address = await Address.findOneAndUpdate({userId,_id:addressId},formData,{new:true})

        if(!address){
            res.status(404).json({
                success : false,
                message : "Address Not Found"
            })
        }

        res.status(200).json({
            success : true,
            data : address
        })

    }
    catch(e){
        console.log(e);
        res.status(500).json({
            success : false,
            message : "Some Error Occured"
        })
    }
}

const deleteAddress = async (req,res)=>{

    try{

        const {userId,addressId} = req.params

        if(!userId || !addressId ){
            return res.status(400).json({
                success : false,
                message : "UserId and AddressId Is Required"
            })
        }

        const address = await Address.findOneAndDelete({userId,_id:addressId})

        if(!address){
            return res.status(404).json({
                success : false,
                message : "Address Not Found"
            })
        }

        res.status(200).json({
            success : true,
            message : "Address Deleted Successfully"
        })
    }
    catch(e){
        console.log(e);
        res.status(500).json({
            success : false,
            message : "Some Error Occured"
        })
    }
}

module.exports = {addAddress,fetchAllAddresses,editAddress,deleteAddress}