import { Outlet } from "react-router-dom";
import AdminHeader from "./header";
import AdminSidebar from "./sidebar";
import { useState } from "react";

function AdminLayout() {
  //Creating state to pass props to admin-sidebar.jsx -- it will use to open admin sidebar for smaller screenn of devices
  const [openSidebar , setOpenSideBar] = useState(false)

  return (
    <div className="flex min-h-screen w-full">
      {/* admin panel leftside work */}
      <AdminSidebar open={openSidebar} setOpen={setOpenSideBar} />
      <div className="flex flex-1 flex-col">
        {/* admin header and passing this setOpen as props */}
        <AdminHeader setOpen={setOpenSideBar} />
        <main className="flex flex-1 bg-muted/90 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
