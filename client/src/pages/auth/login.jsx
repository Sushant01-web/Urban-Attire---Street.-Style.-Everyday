import { data, Link } from "react-router-dom";
import { useState } from "react";
import CommonForm from "@/components/common/form";
import { loginFormControls } from "@/config";
import { useDispatch } from "react-redux";
import { loginUser } from "@/store/auth-slice";
import { toast } from "sonner";

const initialState = {
  email: "",
  password: "",
};

function AuthLogin() {
  // creating state to holding form data
  const [formData, setformData] = useState(initialState);

  //creating onsubmit function.. also including event.preventdefault to freeze the page and after successfully registration it will redirect to login page
  const disptach = useDispatch();

  //creating onsubmit function
  function onSubmit(event) {
    event.preventDefault();

    disptach(loginUser(formData)).then((data) => {
      if (data?.payload?.success) {
        toast(data?.payload?.message);
      } else {
        toast(data?.payload?.message);
      }
    });
  }

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Sign in to your account
        </h1>
        <p className="mt-2 ">
          Not Having Account?
          <Link
            className="font-medium text-primary hover:underline ml-1.5"
            to="/auth/register"
          >
            Register
          </Link>
        </p>
      </div>

      {/* passing user detail in form which we have created (common/form.jsx) */}
      <CommonForm
        formControls={loginFormControls}
        buttonText={"Sign in"}
        formData={formData}
        setFormData={setformData}
        onSubmit={onSubmit}
      />
    </div>
  );
}

export default AuthLogin;
