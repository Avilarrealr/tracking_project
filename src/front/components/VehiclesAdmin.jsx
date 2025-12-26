import React, { useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const VehiclesAdmin = () => {
    const { store, dispatch } = useGlobalReducer();
    const [formData, setFormData] = useState({
        brand: "", // Añadir esto
        model: "",
        plate: "",
        type: "Camión"
    });
    const [editingId, setEditingId] = useState(null);

    const handleAddVehicle = async (e) => {
        e.preventDefault();
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/vehicles`, {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${store.token}` },
            body: JSON.stringify(formData)
        });
        if (res.ok) {
            const data = await res.json();
            dispatch({ type: "load_vehicles", payload: [...store.vehicles, data.vehicle] });
            setFormData({ plate: "", model: "", brand: "", type: "Camión" });
        }
    };

    const deleteVehicle = async (id) => {
        if (!confirm("¿Eliminar este vehículo de la flota?")) return;
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/vehicles/${id}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${store.token}` }
        });
        if (res.ok) {
            dispatch({ type: "load_vehicles", payload: store.vehicles.filter(v => v.id !== id) });
        }
    };

    const updateVehicle = async (id, fields) => {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/vehicles/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${store.token}` },
            body: JSON.stringify(fields)
        });
        if (res.ok) {
            const updated = await res.json();
            dispatch({ type: "load_vehicles", payload: store.vehicles.map(v => v.id === id ? updated : v) });
            setEditingId(null);
        }
    };

    return (
        <div className="flex-1 bg-slate-50 min-h-screen p-8">
            <header className="mb-8">
                <h2 className="text-3xl font-extrabold! uppercase text-slate-800! tracking-tight">Flota de Vehículos</h2>
                <p className="text-slate-400 text-sm">Gestiona los camiones y unidades de transporte</p>
            </header>

            {/* Contenedor Superior: Formulario + Vista Previa */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12 items-start">

                {/* Formulario de Registro (Columna Izquierda - ocupa 7 de 12) */}
                <div className="lg:col-span-7 bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 h-full">
                    <h3 className="text-xl font-bold text-slate-800 mb-6">Detalles de Registro</h3>
                    <form onSubmit={handleAddVehicle} className="flex flex-col gap-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold text-slate-400 ml-1">PLACA</label>
                                <input
                                    type="text" placeholder="Ej: ABC-123"
                                    value={formData.plate} onChange={e => setFormData({ ...formData, plate: e.target.value })}
                                    className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-green-500/20 transition-all"
                                    required
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold text-slate-400 ml-1">MARCA</label>
                                <input
                                    type="text" placeholder="Ej: Chevrolet"
                                    value={formData.brand}
                                    onChange={e => setFormData({ ...formData, brand: e.target.value })}
                                    className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-green-500/20 transition-all"
                                    required
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold text-slate-400 ml-1">MODELO</label>
                                <input
                                    type="text" placeholder="Ej: NPR"
                                    value={formData.model} onChange={e => setFormData({ ...formData, model: e.target.value })}
                                    className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-green-500/20 transition-all"
                                    required
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold text-slate-400 ml-1">TIPO</label>
                                <select
                                    value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}
                                    className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-sm text-slate-500 outline-none cursor-pointer"
                                >
                                    <option value="Camión">Camión</option>
                                    <option value="Furgón">Furgón</option>
                                    <option value="Pickup">Pickup</option>
                                </select>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="mt-4 bg-slate-900 hover:bg-green-600 text-white font-bold rounded-2xl py-4 px-6 transition-all active:scale-95 shadow-lg shadow-slate-200 flex items-center justify-center gap-2"
                        >
                            <i className="fa-solid fa-plus text-xs"></i>
                            Registrar Unidad
                        </button>
                    </form>
                </div>

                {/* Vista Previa (Columna Derecha - ocupa 5 de 12) */}
                <div className="lg:col-span-5">
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-50 relative overflow-hidden group h-full">
                        <div className="w-full h-44 bg-slate-100 rounded-[2rem] mb-6 flex items-center justify-center overflow-hidden border border-slate-50">
                            <i className="fa-solid fa-truck-moving text-6xl text-slate-300 group-hover:scale-110 transition-transform duration-500"></i>
                        </div>

                        <div className="flex justify-between items-center mb-4">
                            <span className="px-4 py-1 bg-green-50 text-green-600 text-[10px] font-black uppercase rounded-full tracking-wider">Vista Previa</span>
                            <div className="flex gap-1">
                                <i className="fa-solid fa-star text-amber-400 text-[10px]"></i>
                                <span className="text-[10px] font-bold text-slate-400">FLOTA TRAZER</span>
                            </div>
                        </div>

                        <h4 className="text-2xl font-bold text-slate-800 mb-1">
                            {formData.brand || "Marca"} <span className="text-slate-400 font-medium">{formData.model || "Modelo"}</span>
                        </h4>
                        <p className="text-slate-400 text-sm mb-6 pb-6 border-b border-slate-50 font-mono tracking-tighter">ID Placa: {formData.plate || "---"}</p>

                        <div className="space-y-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-400 font-medium">Tipo</span>
                                <span className="text-slate-700 font-bold">{formData.type}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-400 font-medium">Estado Inicial</span>
                                <span className="text-green-500 font-black italic">DISPONIBLE</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sección Inferior: Tabla de Unidades (Ancho completo) */}
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-slate-800">Unidades Registradas</h3>
                    <span className="bg-slate-100 text-slate-500 text-[10px] px-3 py-1 rounded-full font-bold uppercase">{store.vehicles.length} Vehículos</span>
                </div>

                <table className="w-full text-left">
                    <thead>
                        <tr className="text-slate-400 text-[10px] uppercase tracking-widest border-b border-slate-50">
                            <th className="pb-4 font-semibold">Unidad</th>
                            <th className="pb-4 font-semibold">Placa</th>
                            <th className="pb-4 font-semibold">Estado</th>
                            <th className="pb-4 text-right font-semibold">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {store.vehicles.map(vehicle => (
                            <tr key={vehicle.id} className="group hover:bg-slate-50/50 transition-colors">
                                <td className="py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-green-600 transition-colors">
                                            <i className="fa-solid fa-truck-moving"></i>
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-700">{vehicle.brand} {vehicle.model}</p>
                                            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">{vehicle.type}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-4 font-mono text-sm text-slate-500 tracking-tighter">{vehicle.plate}</td>
                                <td className="py-4">
                                    <select
                                        value={vehicle.status}
                                        onChange={(e) => updateVehicle(vehicle.id, { status: e.target.value })}
                                        className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase border-none focus:ring-0 cursor-pointer ${vehicle.status === 'disponible' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                            }`}
                                    >
                                        <option value="disponible">Disponible</option>
                                        <option value="mantenimiento">Mantenimiento</option>
                                        <option value="en ruta">En Ruta</option>
                                    </select>
                                </td>
                                <td className="py-4 text-right">
                                    <button
                                        onClick={() => deleteVehicle(vehicle.id)}
                                        className="w-8 h-8 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all flex items-center justify-center ml-auto"
                                    >
                                        <i className="fa-solid fa-trash-can text-sm"></i>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}