import { Outlet, useLocation } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { Sidebar } from "../components/Sidebar";
import { Footer } from "../components/Footer";

export const Layout = () => {
    const location = useLocation();

    // Identificamos si estamos en una ruta protegida
    const isDashboard = location.pathname.startsWith("/private") || location.pathname.startsWith("/admin");

    return (
        <div className="min-h-screen bg-[#0f172a] text-white">
            {/* Si NO es dashboard, mostramos el Navbar superior (Home, Login) */}
            {!isDashboard && <Navbar />}

            <div className={`flex ${isDashboard ? "flex-row" : "flex-col"}`}>
                {/* Si ES dashboard, inyectamos el Sidebar lateral */}
                {isDashboard && <Sidebar />}

                {/* Contenedor del contenido principal */}
                <main className="flex-1 relative">
                    <Outlet />
                </main>
            </div>

            {/* Mostramos Footer solo en la web pública */}
            {!isDashboard && <Footer />}
        </div>
    );
};