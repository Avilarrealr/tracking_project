import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { dispatch } = useGlobalReducer();

    const menuItems = [
        { name: "Dashboard", icon: "fa-chart-pie", path: "/private" },
        { name: "Choferes", icon: "fa-users-gear", path: "/admin/drivers" },
        { name: "Vehiculos", icon: "fa-solid  fa-truck", path: "/admin/vehicles" },

        // Agrega más rutas aquí conforme las crees
    ];

    return (
        <aside className="w-64 bg-slate-950 border-r border-white/5 flex flex-col h-screen sticky top-0">
            <div className="p-6">
                <p className="text-5xl font-black tracking-tighter text-white italic">TRAZER</p>
            </div>

            <nav className="flex-1 px-4 space-y-1">
                {menuItems.map((item) => (
                    <button
                        key={item.path}
                        onClick={() => navigate(item.path)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-1! font-medium transition-all ${location.pathname === item.path
                            ? "bg-green-600 text-white shadow-lg shadow-green-900/20"
                            : "text-slate-400 hover:bg-white/5 hover:text-white"
                            }`}
                    >
                        <i className={`fa-solid ${item.icon} w-5`}></i>
                        {item.name}
                    </button>
                ))}
            </nav>

            <div className="p-4 border-t border-white/5">
                <button
                    onClick={() => {
                        localStorage.removeItem("token");
                        dispatch({ type: "logout" });
                        navigate("/login");
                    }}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-500 hover:text-red-400 w-full"
                >
                    <i className="fa-solid fa-right-from-bracket w-5"></i>
                    Cerrar sesión
                </button>
            </div>
        </aside>
    );
};