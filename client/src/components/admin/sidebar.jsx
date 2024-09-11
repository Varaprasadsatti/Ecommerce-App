import { ChartLine, LayoutDashboard, ShoppingCart, Truck } from "lucide-react"
import { Fragment } from "react"
import { useNavigate } from "react-router-dom"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet"

const AdminSidebarMenuItems = [
    {
        id : "dashboard",
        label : "Dashboard",
        path : "/admin/dashboard",
        icon : <LayoutDashboard />,
    },
    {
        id : "products",
        label : "Products",
        path : "/admin/products",
        icon : <ShoppingCart />,
    },
    {
        id : "orders",
        label : "Orders",
        path : "/admin/orders",
        icon : <Truck />,
    },
]



function MenuItems({setOpen}){
    const navigate = useNavigate()

    return <nav className="flex flex-col gap-2 mt-8">
        {
           AdminSidebarMenuItems.map((menuItem)=><div key={menuItem.id} 
           onClick={() => {
            navigate(menuItem.path) ;
            setOpen ? setOpen(false) : null ;
        }
           }
           className="flex items-center gap-2 cursor-pointer rounded-md px-3 py-2 text-muted-foreground hover:bg-muted-foreground hover:text-muted">
                {menuItem.icon}
                <span>{menuItem.label}</span>
           </div>) 
        }
    </nav>
}


function AdminSidebar({open,setOpen}){
    const navigate = useNavigate()

    return (
        <Fragment>
            <Sheet open={open} onOpenChange={setOpen} >
                <SheetContent side="left" className="w-64">
                <div className="flex flex-col h-full">
                <SheetHeader className="border-b">
                    <SheetTitle className="flex items-center gap-2">
                    <ChartLine size={30} />
                    <h1 className="text-xl font-extrabold">Admin Panel</h1>
                    </SheetTitle>
                </SheetHeader>
                <MenuItems setOpen={setOpen}/>
                </div>
                </SheetContent>
            </Sheet>
            <aside className="hidden w-64 flex-col border-r bg-background p-6 lg:flex">
                <div onClick={()=>navigate("/admin/dashboard")} className="flex items-center gap-2 cursor-pointer">
                   <ChartLine size={30} />
                    <h1 className="text-xl font-extrabold">Admin Panel</h1>
                </div>
                <MenuItems />
            </aside>
        </Fragment>
    )
}

export default AdminSidebar