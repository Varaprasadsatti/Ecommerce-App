
import CommonForm from "@/components/common/common-form";
import { useToast } from "@/components/ui/use-toast";
import { registerFormControls } from "@/config";
import { registerUser } from "@/store/auth-slice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const initialState = {
  userName: "",
  email: "",
  password: "",
};

function Register() {
  const [formData, setFormData] = useState(initialState);

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const {toast} = useToast()

  function onSubmit(event) {
    event.preventDefault();
    dispatch(registerUser(formData)).then((data)=>{
      
      if(data?.payload?.success) {
        toast({
          title : data?.payload?.message
        })
        navigate("/auth/login")
      }
      else {
        toast({
          title : data?.payload?.message,
          variant : "destructive",
        })
      }
    })
  }
 

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Create new account
        </h1>
          <Link
            className="font-medium mt-2 ml-2 text-primary underline"
            to="/auth/login"
          >
            Already have an account?
          </Link>
      </div>
      <CommonForm
        formControls={registerFormControls}
        buttonText={"Sign Up"}
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
      />
    </div>
  );
}

export default Register;