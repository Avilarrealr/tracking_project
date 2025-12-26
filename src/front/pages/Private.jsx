import React, { useEffect } from 'react';
import useGlobalReducer from "../hooks/useGlobalReducer"
import { useNavigate } from 'react-router-dom';

export const Private = () => {
    const { store, dispatch } = useGlobalReducer()
    const navigate = useNavigate()

    function handleLogout() {
        localStorage.removeItem("token");
        navigate("/login");
        alert("Sesión cerrada exitosamente.");
    }

    useEffect(() => {
        const loadDashboardData = async () => {
            // Verificamos que tengamos un token antes de pedir nada
            if (!store.token) return;

            try {
                // Hacemos las peticiones en paralelo para mayor velocidad
                const [resVehicles, resDrivers] = await Promise.all([
                    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/vehicles`, {
                        headers: { "Authorization": `Bearer ${store.token}` }
                    }),
                    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/drivers`, {
                        headers: { "Authorization": `Bearer ${store.token}` }
                    })
                ]);

                if (resVehicles.ok) {
                    const vehiclesData = await resVehicles.json();
                    // AQUÍ es donde conectas el Fetch con el Reducer
                    dispatch({ type: "load_vehicles", payload: vehiclesData });
                }

                if (resDrivers.ok) {
                    const driversData = await resDrivers.json();
                    dispatch({ type: "load_drivers", payload: driversData });
                }

            } catch (error) {
                console.error("Error cargando datos del dashboard:", error);
            }
        };

        loadDashboardData();
    }, [store.token]);

    const totalVehicles = store.vehicles.length;
    const vehiclesInRoute = store.vehicles.filter(v => v.status === "en ruta").length;
    const activeDrivers = store.drivers.filter(d => d.status === "activo").length;

    const fleetUsagePercent = totalVehicles > 0 ? (vehiclesInRoute / totalVehicles) * 100 : 0;


    return (
        <div className="flex h-screen bg-slate-50">
            {/* SIDEBAR - Estilo Oscuro TRAZER */}
            {/* MAIN CONTENT */}
            <main className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8">
                    <h3 className="font-extrabold! text-slate-800! uppercase text-xl">Panel de Operaciones</h3>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-slate-500">Hola, Admin</span>
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold">AV</div>
                    </div>
                </header>

                {/* Content Area */}
                <div className="p-8 overflow-y-auto space-y-8">
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                        {/* CARD 1: Camiones en Calle (Uso de Flota) */}
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                            <p className="text-slate-500 text-sm font-medium">Uso de Flota</p>
                            <h4 className="text-3xl font-bold text-slate-500!">
                                {vehiclesInRoute} / {totalVehicles}
                            </h4>
                            <div className="w-full bg-slate-100 h-2 mt-4 rounded-full overflow-hidden">
                                <div
                                    className="bg-green-500 h-full transition-all duration-500"
                                    style={{ width: `${fleetUsagePercent}%` }}
                                ></div>
                            </div>
                            <p className="text-[10px] text-slate-400 mt-2">
                                {fleetUsagePercent.toFixed(0)}% de los vehículos están operando
                            </p>
                        </div>

                        {/* CARD 2: Choferes Disponibles */}
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                            <p className="text-slate-500 text-sm font-medium">Choferes Activos</p>
                            <h4 className="text-3xl font-bold text-slate-500!">{activeDrivers}</h4>
                            <div className="flex gap-2 mt-4">
                                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-lg font-bold">
                                    Personal operativo
                                </span>
                            </div>
                        </div>

                        {/* CARD 3: Rutas del día (Progreso Global) */}
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                            <p className="text-slate-500 text-sm font-medium">Cumplimiento de Rutas</p>
                            <h4 className="text-3xl font-bold text-slate-500!">
                                {store.routes.length} <span className="text-sm font-normal text-slate-400">asignadas</span>
                            </h4>
                            <button className="mt-4 text-green-600 text-sm font-bold hover:underline">
                                Ver detalles →
                            </button>
                        </div>
                        {/* Sección de la Tabla - Estilo 'Recent Sales' de la imagen */}
                        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h4 className="font-bold text-slate-500! text-lg">Choferes en la Flota</h4>
                                    <p className="text-slate-400 text-xs">Lista actualizada de personal registrado</p>
                                </div>
                                <button className="text-green-600 text-sm font-bold hover:bg-green-50 px-3 py-1 rounded-lg transition-colors">
                                    Ver todos
                                </button>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="text-slate-400 text-[10px] uppercase tracking-widest border-b border-slate-50">
                                            <th className="pb-4 font-medium">Chofer</th>
                                            <th className="pb-4 font-medium">Licencia</th>
                                            <th className="pb-4 font-medium">Estado</th>
                                            <th className="pb-4 font-medium">Teléfono</th>
                                            <th className="pb-4 text-right">Acción</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {store.drivers.length > 0 ? (
                                            store.drivers.map((driver) => (
                                                <tr key={driver.id} className="group hover:bg-slate-50/50 transition-colors">
                                                    <td className="py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs uppercase">
                                                                {driver.fullname.charAt(0)}
                                                            </div>
                                                            <span className="text-sm font-semibold text-slate-700">{driver.fullname}</span>
                                                        </div>
                                                    </td>
                                                    <td className="py-4 text-sm text-slate-500">{driver.license}</td>
                                                    <td className="py-4">
                                                        <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase ${driver.status === 'activo'
                                                            ? 'bg-green-100 text-green-700'
                                                            : 'bg-amber-100 text-amber-700'
                                                            }`}>
                                                            {driver.status}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 text-sm text-slate-500">{driver.phone || "N/A"}</td>
                                                    <td className="py-4 text-right">
                                                        <button className="text-slate-400 hover:text-slate-600 p-2">
                                                            <i className="fa-solid fa-ellipsis-vertical"></i>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="5" className="py-10 text-center text-slate-400 text-sm italic">
                                                    No hay choferes registrados todavía.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        {/* Card de Estado de Flota */}
                        <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 h-full">
                            <div className="flex justify-between items-start mb-6">
                                <h3 className="text-slate-500! font-bold">Estado de Flota</h3>
                                <i className="fa-solid fa-truck-dot text-green-500 bg-green-50 p-2 rounded-lg text-xs"></i>
                            </div>

                            <div className="space-y-5">
                                {/* Operativos */}
                                <div>
                                    <div className="flex justify-between text-xs mb-2">
                                        <span className="text-slate-500 font-medium">Operativos</span>
                                        <span className="text-green-600 font-bold">
                                            {store.vehicles.filter(v => v.status === 'disponible').length}
                                        </span>
                                    </div>
                                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                        <div
                                            className="bg-green-500 h-full rounded-full transition-all duration-1000"
                                            style={{ width: `${(store.vehicles.filter(v => v.status === 'disponible').length / store.vehicles.length) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>

                                {/* En Ruta */}
                                <div>
                                    <div className="flex justify-between text-xs mb-2">
                                        <span className="text-slate-500 font-medium">En Ruta</span>
                                        <span className="text-red-600 font-bold">
                                            {store.vehicles.filter(v => v.status === 'en ruta').length}
                                        </span>
                                    </div>
                                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                        <div
                                            className="bg-red-500 h-full rounded-full transition-all duration-1000"
                                            style={{ width: `${(store.vehicles.filter(v => v.status === 'en ruta').length / store.vehicles.length) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>

                                {/* Mantenimiento */}
                                <div>
                                    <div className="flex justify-between text-xs mb-2">
                                        <span className="text-slate-500 font-medium">Mantenimiento</span>
                                        <span className="text-yellow-600 font-bold">
                                            {store.vehicles.filter(v => v.status === 'mantenimiento').length}
                                        </span>
                                    </div>
                                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                        <div
                                            className="bg-yellow-500 h-full rounded-full transition-all duration-1000"
                                            style={{ width: `${(store.vehicles.filter(v => v.status === 'mantenimiento').length / store.vehicles.length) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Area de Mapa / Tabla (Estilo Imagen 2) */}
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 h-125">
                        <div className="flex justify-between items-center mb-6">
                            <h4 className="font-bold text-slate-800">Monitoreo en Tiempo Real</h4>
                            <button className="bg-slate-950 text-white px-4 py-2 rounded-xl text-sm font-bold">Nueva Ruta</button>
                        </div>
                        <div className="w-full h-full bg-slate-100 rounded-2xl flex items-center justify-center border-2 border-dashed border-slate-200">
                            {/* Aquí irá el componente del Mapa */}
                            <p className="text-slate-400">Cargando Mapa Interactivo...</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}