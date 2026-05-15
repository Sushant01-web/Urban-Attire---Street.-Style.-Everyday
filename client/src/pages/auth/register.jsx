import CommonForm from "@/components/common/form";
import { registerFormControls } from "@/config";
import { registerUser } from "@/store/auth-slice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const initialState = {
  username: "",
  email: "",
  password: "",
};

function AuthRegister() {
  // creating state to holding form data
  const [formData, setFormData] = useState(initialState);

  //creating onsubmit function.. also including event.preventdefault to freeze the page and after successfully registration it will redirect to login page
  const disptach = useDispatch();
  const navigate = useNavigate();

  function onSubmit(event) {
    event.preventDefault();
    disptach(registerUser(formData)).then((data) => {
      //if user pass all the condition then we will navigate to login page
      if (data?.payload?.success) {
        //toats is use to display message
        toast(data?.payload?.message);
        navigate("/auth/login");
      } else {
        toast(data?.payload?.message);
      }
    });
  }

  console.log(formData);

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Create new account
        </h1>
        <p className="mt-2">
          Already have an account
          <Link
            className="font-medium ml-2 text-primary hover:underline"
            to="/auth/login"
          >
            Login
          </Link>
        </p>
      </div>

      {/* passing user detail in form which we have created (common/form.jsx) */}
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

export default AuthRegister;
