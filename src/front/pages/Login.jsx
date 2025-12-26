import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useGlobalReducer from '../hooks/useGlobalReducer';

export const Login = () => {
    const navigate = useNavigate()
    const { dispatch } = useGlobalReducer()
    const [activeTab, setActiveTab] = useState('signin')
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fullname, setFullname] = useState("")

    const handleSignUp = async (e) => {
        e.preventDefault();
        const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: email,
                password: password,
                fullname: fullname
            })
        });

        if (response.ok) alert("¡Usuario creado!");
        else alert("Error al registrar");
    }

    const handleLogin = async () => {
        const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            const data = await response.json();

            // 1. Guardamos en el disco (para cuando refresques)
            localStorage.setItem("token", data.token);

            // 2. ACTUALIZAMOS EL STORE (Para que ProtectedRoute te deje pasar YA)
            dispatch({ type: "set_token", payload: data.token });

            console.log("Sesión iniciada y estado actualizado");
            navigate("/private");
        } else {
            alert("Credenciales incorrectas");
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (activeTab === 'signin') {
            handleLogin();
        } else {
            handleSignUp(e);
        }
    }

    return (
        <div className="min-h-screen w-full flex flex-col md:flex-row bg-[#0f172a]">

            {/* LADO IZQUIERDO: Formulario */}
            <div className="w-full md:w-1/2 flex items-center justify-center p-8 relative overflow-hidden">
                {/* Luces de fondo sutiles */}
                <div className="absolute top-0 left-0 w-64 h-64 bg-green-500/5 rounded-full blur-[100px]" />

                <div className="w-full max-w-md z-10">
                    <h1 className="text-3xl font-extrabold! italic tracking-tighter text-center text-white mb-12! cursor-pointer"
                        onClick={() => { navigate("/") }}
                    >TRAZER</h1>

                    <div className="bg-slate-950/60 rounded-2xl backdrop-blur-md p-8 shadow-2xl">
                        <h2 className="text-2xl font-bold text-white mb-2">{activeTab === 'signin' ? 'Bienvenido de nuevo' : 'Crea tu cuenta'}</h2>
                        <p className="text-slate-400 text-sm mb-8">{activeTab === 'signin'
                            ? 'Ingresa tus credenciales para acceder.'
                            : 'Únete a TRAZER y gestiona tus finanzas.'}</p>

                        {/* Selector Sign In / Sign Up estilo pastilla */}
                        {/* Selector Sign In / Sign Up con efecto deslizante */}
                        <div className="relative flex bg-slate-950/50 p-1 rounded-2xl mb-8 border border-white/5 w-full h-12">

                            {/* Fondo Verde Deslizante (La "Pastilla") */}
                            <div
                                className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-green-600 rounded-xl shadow-lg transition-all duration-300 ease-in-out ${activeTab === 'signin' ? 'left-1' : 'left-[calc(50%+1px)]'
                                    }`}
                            />

                            {/* Botón Sign In */}
                            <button
                                onClick={() => setActiveTab('signin')}
                                className={`flex-1 z-10 text-sm font-bold transition-colors duration-300 ${activeTab === 'signin' ? 'text-white' : 'text-slate-400 hover:text-white'
                                    }`}
                            >
                                Iniciar sesión
                            </button>

                            {/* Botón Sign Up */}
                            <button
                                onClick={() => setActiveTab('signup')}
                                className={`flex-1 z-10 text-sm font-bold transition-colors duration-300 ${activeTab === 'signup' ? 'text-white' : 'text-slate-400 hover:text-white'
                                    }`}
                            >
                                Registrarse
                            </button>
                        </div>

                        <form className="space-y-5" onSubmit={handleSubmit}>
                            {activeTab === 'signup' && (
                                <div className="relative animate-fade-down animate-duration-300">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-lg">
                                        <i className="fa-regular fa-user"></i>
                                    </span>
                                    <input
                                        type="text"
                                        placeholder="Nombre completo"
                                        value={fullname}
                                        onChange={(e) => setFullname(e.target.value)}
                                        className="w-full bg-slate-950/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-green-500/50 transition-all text-sm text-white"
                                    />
                                </div>
                            )}
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-lg">
                                    <i className="fa-regular fa-envelope"></i>
                                </span>
                                <input
                                    type="email"
                                    placeholder="Correo electrónico"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-slate-950/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-green-500/50 transition-all text-sm text-white"
                                />
                            </div>

                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-lg">
                                    <i className="fa-solid fa-lock"></i>
                                </span>
                                <input
                                    type="password"
                                    placeholder="Contraseña"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-slate-950/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-green-500/50 transition-all text-sm text-white"
                                />
                            </div>

                            <button className="w-full hover:bg-green-500 text-white font-extrabold p-3 border-[.05rem] border-green-400/40 rounded-pill transition-all hover:shadow-[0_0_20px_rgba(34,197,94,0.3)] mt-4">
                                {activeTab === 'signin' ? 'Entrar' : 'Registrar Cuenta'}
                            </button>
                        </form>

                        <div className="flex items-center my-9">
                            <hr className="grow text-white" />
                            <span className="mx-2 font-bold uppercase text-white/40">O continúa con</span>
                            <hr className="grow text-white" />
                        </div>

                        {/* Social Logins */}
                        <div className="flex justify-center gap-4">
                            <button className="w-12 h-12 flex items-center justify-center hover:shadow-[0_0_20px_rgba(34,197,94,0.3)] rounded-circle hover:bg-green-950/10 transition-all group">
                                <img src="https://cdn.simpleicons.org/google/FFFFFF" className="h-5 w-5 group-hover:scale-150 transition" alt="Google" />
                            </button>
                            <button className="w-12 h-12 flex items-center justify-center hover:shadow-[0_0_20px_rgba(34,197,94,0.3)] rounded-circle hover:bg-green-950/10 transition-all group">
                                <img src="https://cdn.simpleicons.org/apple/FFFFFF" className="h-5 w-5 group-hover:scale-150 transition" alt="Apple" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* LADO DERECHO: Visual/Gráfico */}
            <div className="hidden md:flex w-1/2 bg-linear-to-br from-green-500/20 to-emerald-900/40 items-center justify-center relative p-12">
                {/* Patrón de cuadrícula (Grid) de fondo */}
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>

                <div className="flex flex-col items-center z-10">
                    {/* Elemento 3D / Icono flotante */}
                    <div className="w-64 h-64 bg-linear-to-tr from-green-400 to-emerald-600 rounded-[3rem] shadow-[0_0_100px_rgba(34,197,94,0.4)] flex items-center justify-center animate-bounce duration-75 ease-in-out">
                        <i className="fa-solid fa-vault text-white text-8xl"></i>
                    </div>

                    <div className="mt-16 max-w-sm">
                        <h3 className="text-3xl font-bold text-white mb-4">Seguridad de Nivel Empresarial</h3>
                        <p className="text-green-100/70 leading-relaxed">
                            Únete a miles de usuarios que confían en TRAZER para gestionar sus rutas de forma segura y eficiente.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}