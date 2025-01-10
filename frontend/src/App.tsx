import { useState } from "react";
import { Provider } from "react-redux";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider";
import OrderList from "./components/OrderList";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";
import StockList from "./components/StockList";
import AuthProvider from "./provider/authProvider";
import Login from "./auth/Login";
import Register from "./auth/Register";
import ErrorPage from "./components/ErrorPage";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { store } from "./redux/store";

function MainLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-background">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-6 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <Provider store={store}>
      <Router>
        <AuthProvider>
          <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              <Route element={<ProtectedRoute />}>
                <Route path="/" element={<MainLayout><Dashboard /></MainLayout>} />
                <Route path="/pedidos" element={<MainLayout><OrderList /></MainLayout>} />
                <Route path="/dashboard" element={<MainLayout><Dashboard /></MainLayout>} />
                <Route path="/estoques" element={<MainLayout><StockList /></MainLayout>} />
              </Route>

              <Route path="*" element={<ErrorPage />} />
            </Routes>
          </ThemeProvider>
        </AuthProvider>
      </Router>
    </Provider>
  );
}

export default App;

