//Writing Code to build header of shopping/ listing page

import { House, LogOut, Menu, ShoppingCart, UserCog } from "lucide-react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { shoppingPageHeaderMenuItem } from "@/config";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu";
import {
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { Avatar } from "../ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { logoutUser } from "@/store/auth-slice";
import UserCartWrapper from "./cart-wrapper";
import { useEffect, useState } from "react";
import { fetchCartItems } from "@/store/shop/cart-slice";
import { Label } from "../ui/label";

//Creating Funtion to render Menu Items in Navbar
function MenuItems() {
  const location = useLocation()
  const [searchParams, setSearchParams] = useSearchParams()
  /*----------------------------
  Creating Function - to get Navigate where according to click on label
  ------------------------------*/
  const navigate = useNavigate()
  function handleNavigate(getCurrentMenuItem){
    sessionStorage.removeItem('filters')

    //Creating New Filter according to click on lable . But if user click on home , he will stay on home page only
    const currentFilter = getCurrentMenuItem.id !== 'home' && getCurrentMenuItem.id !== 'products' && getCurrentMenuItem.id !== 'search' ? {category : [getCurrentMenuItem.id]} : null

    //Setting new filter to session storage
    sessionStorage.setItem('filters', JSON.stringify(currentFilter))

    location.pathname.includes('listing') && currentFilter !== null ? setSearchParams(new URLSearchParams(`?category=${getCurrentMenuItem.id}`)) : 

    navigate(getCurrentMenuItem.path)
  }

  return (
    <nav className="flex flex-col mb-3 lg:mb-0 lg:items-center gap-8 lg:flex-row">
      {
        //Mapping Shopping view menu items
        shoppingPageHeaderMenuItem.map((menuItem) => (
          <Label
            onClick={() => handleNavigate(menuItem)}
            key={menuItem.id}
            className="text-[18px] text-gray-500 hover:text-black 
            transform transition-all duration-300 ease-in-out 
            hover:scale-115 cursor-pointer"
          >
            {menuItem.label}
          </Label>
        ))
      }
    </nav>
  );
}

//Creating Funtion to display menu for smaller device in right side
function HeaderRightContent() {
  const { user } = useSelector((state) => state.auth);

  //Creating state to display the Cart
  const [openCartSheet, setOpenCartSheet] = useState(false);

  //Using navigate gook to go respected pages after clicking on account details or logout
  const navigate = useNavigate();
  const dispatch = useDispatch();

  //Creating Logout Function
  function handleLogout() {
    //Dispatching logoutuser asyncthunk which we have created
    dispatch(logoutUser());
  }

  //Getting cart items
  const {cartItems} = useSelector((state) => state.shopCart)
  useEffect(()=>{
    dispatch(fetchCartItems(user?.id))
  },[dispatch])

  return (
    <div className="flex lg:items-center lg:flex-row flex-col gap-4">
      {/* Appearing for smaller screen device */}
      <Sheet open={openCartSheet} onOpenChange={() => setOpenCartSheet(false)}>
        <Button
          onClick={() => setOpenCartSheet(true)}
          variant="outline"
          size="icon"
          className="relative"
        >
          <ShoppingCart className="w-13 h-13" />
          <span className="absolute top-[-3px] right-0.5 font-bold text-sm">{cartItems?.items?.length || 0}</span>
          <span className="sr-only">User Cart</span>
        </Button>

        {/* Passing Cart Items here so it can be displayed in cart section */}
        <UserCartWrapper
          setOpenCartSheet={setOpenCartSheet}
          cartItems={
            cartItems && cartItems.items && cartItems.items.length > 0
              ? cartItems.items
              : []
          }
        />    
        </Sheet>

      {/* Creating drop down menu for categories */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="bg-black">
            <AvatarFallback
              className="bg-black text-white font-extrabold 
             flex items-center justify-center 
             w-10 h-8 rounded-full"
            >
              {user?.username[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          side="right"
          className="text-sm font-medium text-neutral-700 dark:text-neutral-200 bg-amber-50 w-80 mt-3 rounded-2xl p-7"
        >
          <DropdownMenuLabel>Logged in as {user?.username}</DropdownMenuLabel>
          <DropdownMenuSeparator />

          {/* Going to account page by using navigate hook */}
          <DropdownMenuItem
            onClick={() => navigate("/shop/account")}
            className="flex gap-2 cursor-pointer hover:bg-indigo-100 dark:hover:bg-indigo-800/40 rounded-md transition"
          >
            <UserCog className="mr-2 h-4 w-4" />
            Account Setting
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleLogout}
            className="flex gap-2 cursor-pointer hover:bg-red-100 dark:hover:bg-red-800/40 rounded-md transition text-red-600 dark:text-red-400"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function ShoppingHeader() {
  //Checking whether user is authenticated or not. Getting authentication information from store/auth-slice/index.js
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <Link to="/shop/home" className="flex items-center gap-2">
          <House className="h-8 w-8" />
          <span className="font-bold text-xl">Urban-Attire</span>
        </Link>

        {/* Rendering for Smaller device */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="lg:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle Header Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-full max-w-xs">
            <MenuItems />
            <HeaderRightContent />
          </SheetContent>
        </Sheet>

        {/* Redering icons and logout for larger device */}
        <div className="hidden lg:block">
          <MenuItems />
        </div>

        <div className="hidden lg:block">
          <HeaderRightContent />
        </div>
      </div>
    </header>
  );
}

export default ShoppingHeader;
