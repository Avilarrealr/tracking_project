import React, { useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const DriversAdmin = () => {
    const { store, dispatch } = useGlobalReducer();
    const [formData, setFormData] = useState({ fullname: "", license_id: "", phone: "" });
    const [editingId, setEditingId] = useState(null);
    const [editName, setEditName] = useState("");

    // --- Lógica de Backend ---
    const handleAddDriver = async (e) => {
        e.preventDefault();
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/drivers`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${store.token}`
            },
            body: JSON.stringify(formData)
        });
        if (response.ok) {
            const data = await response.json();
            dispatch({ type: "load_drivers", payload: [...store.drivers, data.driver] });
            setFormData({ fullname: "", license_id: "", phone: "" });
        }
    };

    const deleteDriver = async (id) => {
        if (!confirm("¿Eliminar este chofer de la flota?")) return;
        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/drivers/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${store.token}` }
            });
            if (res.ok) {
                dispatch({ type: "load_drivers", payload: store.drivers.filter(d => d.id !== id) });
            }
        } catch (error) { console.error(error); }
    };

    const updateDriver = async (id, fields) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/drivers/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${store.token}` },
                body: JSON.stringify(fields)
            });
            if (res.ok) {
                const updated = await res.json();
                dispatch({ type: "load_drivers", payload: store.drivers.map(d => d.id === id ? updated : d) });
                setEditingId(null);
            }
        } catch (error) { console.error(error); }
    };

    return (
        <div className="flex-1 bg-slate-50 min-h-screen p-8">
            {/* Header */}
            <header className="mb-8 flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-black text-slate-800 tracking-tight">Gestión de Choferes</h2>
                    <p className="text-slate-400 text-sm">Administra el personal operativo de tu flota</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center text-green-700 font-bold shadow-sm">
                    {store.drivers.length}
                </div>
            </header>

            {/* Bento Grid Superior */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">

                {/* Formulario (Col 7) */}
                <div className="lg:col-span-7 bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
                    <h3 className="text-xl font-bold text-slate-800 mb-6">Nuevo Registro</h3>
                    <form onSubmit={handleAddDriver} className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold text-slate-400 ml-1 uppercase">Nombre Completo</label>
                                <input
                                    type="text" placeholder="Ej: Antonio Villarreal"
                                    value={formData.fullname}
                                    onChange={e => setFormData({ ...formData, fullname: e.target.value })}
                                    className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-green-500/20 transition-all"
                                    required
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold text-slate-400 ml-1 uppercase">ID Licencia</label>
                                <input
                                    type="text" placeholder="Ej: V-26451225"
                                    value={formData.license_id}
                                    onChange={e => setFormData({ ...formData, license_id: e.target.value })}
                                    className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-green-500/20 transition-all"
                                    required
                                />
                            </div>
                            <div className="flex flex-col gap-2 md:col-span-2">
                                <label className="text-xs font-bold text-slate-400 ml-1 uppercase">Teléfono de Contacto</label>
                                <input
                                    type="text" placeholder="+58 412..."
                                    value={formData.phone}
                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-green-500/20 transition-all"
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-slate-900 hover:bg-green-600 text-white font-bold rounded-2xl py-4 transition-all active:scale-95 shadow-lg shadow-slate-200 flex items-center justify-center gap-2"
                        >
                            <i className="fa-solid fa-user-plus text-xs"></i>
                            Añadir a la Flota
                        </button>
                    </form>
                </div>

                {/* Vista Previa Estilo Carnet (Col 5) */}
                <div className="lg:col-span-5">
                    <div className="bg-white p-8 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-50 h-full flex flex-col justify-between relative overflow-hidden group">
                        {/* Círculo decorativo de fondo */}
                        <div className="absolute -right-10 -top-10 w-40 h-40 bg-green-50 rounded-full group-hover:scale-110 transition-transform duration-700"></div>

                        <div className="relative">
                            <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center text-slate-300 text-4xl mb-6 border border-slate-50">
                                <i className="fa-solid fa-id-card"></i>
                            </div>

                            <span className="px-3 py-1 bg-green-50 text-green-600 text-[10px] font-black uppercase rounded-full tracking-widest">Pre-visualización</span>

                            <h4 className="text-2xl font-bold text-slate-800 mt-4 mb-1 truncate">
                                {formData.fullname || "Nombre Chofer"}
                            </h4>
                            <p className="text-slate-400 text-sm font-mono italic">
                                LIC: {formData.license_id || "--- --- ---"}
                            </p>
                        </div>

                        <div className="pt-6 border-t border-slate-50 mt-6 space-y-3 relative">
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-slate-400 uppercase">Estado</span>
                                <span className="text-xs font-black text-green-500 italic">ACTIVO</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-slate-400 uppercase">Contacto</span>
                                <span className="text-xs font-semibold text-slate-700">{formData.phone || "No asignado"}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabla Inferior Corregida */}
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8 mt-8">
                <table className="w-full">
                    <thead>
                        <tr className="text-slate-400 text-[10px] uppercase tracking-widest border-b border-slate-50">
                            <th className="pb-4 font-bold text-left w-1/3">Chofer</th>
                            <th className="pb-4 font-bold text-left">Licencia</th>
                            <th className="pb-4 font-bold text-center">Estado</th>
                            <th className="pb-4 font-bold text-right pr-4">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {store.drivers.map(driver => (
                            <tr key={driver.id} className={`group transition-all ${editingId === driver.id ? 'bg-blue-50/40' : 'hover:bg-slate-50/50'}`}>
                                {/* COLUMNA: CHOFER (Nombre y Teléfono) */}
                                <td className="py-5 pl-8 w-2/5">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-sm shadow-sm transition-all ${editingId === driver.id ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                            {editingId === driver.id ? <i className="fa-solid fa-fingerprint animate-pulse"></i> : driver.fullname.charAt(0)}
                                        </div>
                                        <div className="flex flex-col">
                                            {editingId === driver.id ? (
                                                <div className="flex flex-col gap-1">
                                                    <input
                                                        className="text-sm font-bold text-slate-700 bg-white border border-blue-200 px-2 py-1 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20"
                                                        value={editName}
                                                        onChange={(e) => setEditName(e.target.value)}
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter') updateDriver(driver.id, { fullname: editName });
                                                            if (e.key === 'Escape') setEditingId(null);
                                                        }}
                                                        autoFocus
                                                    />
                                                    <span className="text-[9px] text-blue-400 font-bold uppercase italic">Editando nombre...</span>
                                                </div>
                                            ) : (
                                                <>
                                                    <span className="text-sm font-bold text-slate-700">{driver.fullname}</span>
                                                    <span className="text-[11px] text-slate-400 font-medium tracking-tight">{driver.phone || "Sin contacto"}</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </td>

                                {/* COLUMNA: LICENCIA (Ajustada para visibilidad) */}
                                <td className="py-5 w-1/4">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-slate-300 font-black uppercase mb-0.5">ID Licencia</span>
                                        <span className="text-sm font-mono text-slate-600 font-medium bg-slate-50 px-2 py-0.5 rounded-md inline-block w-fit">
                                            {driver.license_id || "No registrada"}
                                        </span>
                                    </div>
                                </td>

                                {/* COLUMNA: ESTADO */}
                                <td className="py-5 text-center w-1/6">
                                    <select
                                        value={driver.status}
                                        onChange={(e) => updateDriver(driver.id, { status: e.target.value })}
                                        className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase border-none focus:ring-0 cursor-pointer shadow-sm transition-colors ${driver.status === 'activo' ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                                            }`}
                                    >
                                        <option value="activo">Activo</option>
                                        <option value="vacaciones">Vacaciones</option>
                                    </select>
                                </td>

                                {/* COLUMNA: ACCIONES */}
                                <td className="py-5 text-right pr-8 w-1/6">
                                    <div className="flex justify-end items-center gap-2">
                                        {editingId === driver.id ? (
                                            <button
                                                onClick={() => updateDriver(driver.id, { fullname: editName })}
                                                className="w-9 h-9 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all flex items-center justify-center"
                                            >
                                                <i className="fa-solid fa-check"></i>
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => { setEditingId(driver.id); setEditName(driver.fullname); }}
                                                className="w-9 h-9 rounded-xl text-slate-300 hover:text-blue-500 hover:bg-blue-50 transition-all flex items-center justify-center"
                                            >
                                                <i className="fa-solid fa-pen-to-square text-sm"></i>
                                            </button>
                                        )}
                                        <button
                                            onClick={() => deleteDriver(driver.id)}
                                            className="w-9 h-9 rounded-xl text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all flex items-center justify-center"
                                        >
                                            <i className="fa-solid fa-trash-can text-sm"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {editingId && (
                    <p className="mt-4 text-[10px] text-blue-400 italic">
                        <i className="fa-solid fa-circle-info mr-1"></i>
                        Presiona <strong>Enter</strong> para guardar o <strong>Esc</strong> para cancelar la edición.
                    </p>
                )}
            </div>
        </div>
    );
};