import { LogOut, Menu } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export default function Header({ sidebarOpen, setSidebarOpen }: HeaderProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.setItem("token", "");
    navigate("/login");
  };

  return (
    <header className="bg-white shadow-sm z-10">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="mr-2 sm:mr-4"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu className="h-6 w-6 sm:h-8 sm:w-8" aria-hidden="true" />
            </Button>
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 truncate max-w-[150px] sm:max-w-none">
              USEGM - Pedidos
            </h1>
          </div>
          <div className="flex items-center">
            {localStorage.getItem("token") !== null && (
              <div className="ml-2 sm:ml-4">
                <Button
                  variant="outline"
                  className="hover:bg-orange justify-start px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

