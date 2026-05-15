import { LogOut, TextAlignJustify } from "lucide-react";
import { Button } from "../ui/button";
import { useDispatch } from "react-redux";
import { logoutUser } from "@/store/auth-slice";

//Getting setOpen props from parameter of function AdminSidebar
function AdminHeader({setOpen}) {
  //Dispatching Logout
  const dispatch = useDispatch();

  function handleLogout() {
    dispatch(logoutUser());
  }

  return (
    <header className="flex items-center justify-center px-4 py-3 bg-background border-b">
      {/* Here lg:hidde means it menubar will hide for large screen whil sm:block means menubar will see on small device */}
      <Button onClick={()=>setOpen(true)} className="lg:hidden sm:block">
        <TextAlignJustify />
        <span className="sr-only">Toggle Menu</span>
      </Button>
      <div className="flex flex-1 justify-end">
        <Button
          onClick={handleLogout}
          className="inline-flex gap-2 items-center rounded-md px-4 py-2 text-sm font-medium shadow"
        >
          <LogOut />
          Logout
        </Button>
      </div>
    </header>
  );
}

export default AdminHeader;
