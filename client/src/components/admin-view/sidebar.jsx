import {
  BadgeCheck,
  ChartCandlestick,
  ChartNoAxesCombined,
  LayoutDashboard,
  ShoppingBasket,
} from "lucide-react";
import { Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";

//Menu items for Admin Sidebar
const adminSidebarMenuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/admin/dashboard",
    //getting icon from lucid-react
    icon: <LayoutDashboard />,
  },
  {
    id: "products",
    label: "Products",
    path: "/admin/products",
    icon: <ShoppingBasket />,
  },
  {
    id: "orders",
    label: "Orders",
    path: "/admin/orders",
    icon: <BadgeCheck />,
  },
  {
    id: "features",
    label: "Features",
    path: "/admin/features",
    icon: <ChartCandlestick />,
  },
];

//Creating function to Menu Items -- and reciving setOpen props
function MenuItems({ setOpen }) {
  //Using navigate hook
  const navigate = useNavigate();

  return (
    <div className="mt-8 flec flex-col gap-3 cursor-pointer">
      {adminSidebarMenuItems.map((menuitem) => (
        <div
          key={menuitem.id}
          onClick={() => {
            navigate(menuitem.path);

            //sidebar agar open nhi hai thn close rakho...nd open hai toh user click pe close ho jayega
            setOpen ? setOpen(false) : null;
          }}
          className="flex text-xl items-center gap-2 rounded-md px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          {menuitem.icon}
          <span>{menuitem.label}</span>
        </div>
      ))}
    </div>
  );
}

//getting props form parent component
function AdminSidebar({ open, setOpen }) {
  //use navigate hook for direct go to on dashboard when admin click on admin panel
  const navigate = useNavigate();

  return (
    <Fragment>
      {/* Setting sheet for smaller screen ..while he clicks on icon */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-64">
          <div className="flex flex-col h-full">
            <SheetHeader className="border-b">
              <SheetTitle
                onClick={() => {
                  navigate("/admin/dashboard");
                  setOpen ? setOpen(false) : null;
                }}
                className="flex gap-2 mt-5 mb-5"
              >
                <ChartNoAxesCombined size={30} />
                <h1 className="text-xl font-extrabold cursor-pointer">
                  Admin Panel
                </h1>
              </SheetTitle>
            </SheetHeader>
            {/* Passing setOpen props to this Menuitem function -- this is fetch as parameter of Menuitem function
              By using this.. when user clicks on any other attribut..sidebar will close
            */}
            <MenuItems setOpen={setOpen} />
          </div>
        </SheetContent>
      </Sheet>

      {/* Side Panel of Admin */}
      <aside className="hidden w-64 flex-col border-r bg-background p-6 lg:flex">
        <div
          onClick={() => {
            navigate("/admin/dashboard");
          }}
          className="flex items-center gap-2 cursor-pointer"
        >
          {/* getting analytical icon from lucid react */}
          <ChartNoAxesCombined size={30} />
          <h1 className="text-2xl font-bold">Admin Panel</h1>
        </div>
        <MenuItems />
      </aside>
    </Fragment>
  );
}

export default AdminSidebar;
