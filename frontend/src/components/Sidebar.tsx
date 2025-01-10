import React from 'react'
import {Link} from 'react-router-dom'
import {Button} from "@/components/ui/button"
import {ScrollArea} from "@/components/ui/scroll-area"
import {LayoutDashboard, Package, Send} from 'lucide-react'

interface SidebarProps {
  open: boolean
  setOpen: (open: boolean) => void
}

const Sidebar: React.FC<SidebarProps> = ({ open, setOpen }) => {
  const role = localStorage.getItem("role");

  return (
    <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg transform ${open ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out`}>
      <div className="flex items-center justify-between h-16 px-4 border-b dark:border-gray-700">
        <span className="text-2xl font-semibold text-gray-800 dark:text-white">Admin</span>
        <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <nav className="space-y-2 p-4">
          <Link to="/dashboard">
            <Button variant="ghost" className="w-full justify-start">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
          </Link>
          {role == "ADMIN" ? <Link to="/estoques">
            <Button variant="ghost" className="w-full justify-start">
              <Package className="mr-2 h-4 w-4" />
              Estoques
            </Button>
          </Link> : ""}
          <Link to="/pedidos">
            <Button variant="ghost" className="w-full justify-start">
              <Send className="mr-2 h-4 w-4" />
              Pedidos
            </Button>
          </Link>
        </nav>
      </ScrollArea>
    </div>
  )
}

export default Sidebar

