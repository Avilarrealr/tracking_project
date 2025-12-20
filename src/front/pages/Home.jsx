import React from 'react';

export const Home = () => {
	return (
		<div className="min-h-screen bg-gray-50 dark:bg-gray-900">
			{/* NAVBAR */}
			<nav className="bg-white dark:bg-gray-800 shadow-md">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between h-16 items-center">
						{/* Logo */}
						<div className="shrink-0 flex items-center">
							<span className="text-2xl font-bold text-green-600">Trazer</span>
						</div>

						{/* Links de escritorio */}
						<div className="hidden md:flex space-x-8">
							<a href="#" className="text-gray-700 dark:text-gray-200 hover:text-indigo-600 font-medium">Inicio</a>
							<a href="#" className="text-gray-700 dark:text-gray-200 hover:text-indigo-600 font-medium">Servicios</a>
							<a href="#" className="text-gray-700 dark:text-gray-200 hover:text-indigo-600 font-medium">Contacto</a>
						</div>

						{/* Botón de Acción */}
						<div className="flex items-center">
							<button className="bg-green-600 text-white px-4 py-2 rounded-pill hover:scale-110 transition">
								Log In
							</button>
						</div>
					</div>
				</div>
			</nav>

			{/* CONTENIDO PRINCIPAL (HERO SECTION) */}
			<main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8">
				<div className="text-center">
					<h1 className="text-4xl tracking-tight font-extrabold text-white dark:text-white sm:text-5xl md:text-6xl">
						<span className="block">Bienvenido a</span>
						<span className="block text-green-600">Trazer</span>
					</h1>
					<p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl">
						Ahora que Tailwind está configurado, puedes empezar a construir bloque a bloque.
					</p>
				</div>
			</main>
		</div>
	);
};