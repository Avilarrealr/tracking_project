import React from 'react';

export const Home = () => {
	return (
		<div className="relative w-full h-full bg-[#0f172a] text-white selection:bg-green-500/30 overflow-x-hidden">
			{/* NAVBAR (Mejorado el Glassmorphism) */}
			<nav className="fixed top-0 w-full z-50 bg-slate-900/40 backdrop-blur-xl border-b border-white/5 shadow-2xl">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between h-20 items-center">
						<div className="shrink-0 flex items-center">
							<a href="#" className="text-2xl font-black tracking-tighter text-white no-underline! italic">TRAZER</a>
						</div>
						<div className="hidden md:flex space-x-10">
							<a href="#" className="text-sm font-medium text-slate-300! hover:text-green-400! transition-colors no-underline!">Inicio</a>
							<a href="#" className="text-sm font-medium text-slate-300! hover:text-green-400! transition-colors no-underline!">Servicios</a>
							<a href="#" className="text-sm font-medium text-slate-300! hover:text-green-400! transition-colors no-underline!">Contacto</a>
						</div>
						<div className="flex items-center">
							<button className="hover:bg-green-500 text-white text-sm font-bold px-6 py-2.5 border-[.05rem] border-green-400 rounded-pill transition-all hover:shadow-[0_0_20px_rgba(34,197,94,0.3)]">
								Log In
							</button>
						</div>
					</div>
				</div>
			</nav>

			{/* HERO SECTION */}
			<main className="relative pt-40 pb-20 px-4">
				{/* Círculo de luz (Ajustado para v4) */}
				<div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
					<div className="absolute top-0 right-0 w-2xl h-96 bg-green-500/10 rounded-full blur-[120px]" />
					<div className="absolute bottom-10 left-0 w-2xl h-96 bg-green-500/10 rounded-full blur-[120px]" />
				</div>

				<div className="text-center max-w-4xl mx-auto relative z-10">
					<h1 className="text-6xl font-extrabold tracking-tight sm:text-8xl">
						<span className="font-medium text-7xl block mb-4 text-gray-400">Todo el orden en tus manos</span>
						{/* Gradiente Corregido para Tailwind v4 */}
						<span className=" mt-12 block font-black text-7xl italic tracking-tighter text-white bg-clip-text">
							TRAZER
						</span>
					</h1>

					<p className="mt-12! text-sm text-gray-400 max-w-2xl mx-auto leading-relaxed">
						La App que te ayudará a mantener el control sobre tus rutas de despacho, crea, define, organiza, y comparte con todo tu equipo de trabajo.
					</p>

					<div className="mt-12 flex justify-center gap-4">
						<a href="#" aria-describedby="tier-hobby" class="mt-8 block rounded-md bg-white/10 px-3.5 py-2.5 text-center text-sm font-semibold text-white inset-ring inset-ring-white/5 hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/75 sm:mt-10 no-underline!">Contact us</a>
						<a href="#" aria-describedby="tier-enterprise" class="mt-8 block rounded-md border-[0.1rem] border-green-400 px-3.5 py-2.5 text-center text-sm font-semibold text-white hover:bg-green-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-500 sm:mt-10 no-underline! shadow-[0_0_20px_rgba(34,197,94,0.3)]">Get started today</a>
					</div>

					<div className="relative bg-slate-900 rounded-2xl overflow-hidden mt-18 group">
						{/* Barra de control simulada */}
						<div className="h-10 bg-slate-950/50 border-b border-white/5 flex items-center px-4 gap-2">
							<div className="flex gap-1.5">
								<div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
								<div className="w-2.5 h-2.5 rounded-full bg-amber-500/50" />
								<div className="w-2.5 h-2.5 rounded-full bg-emerald-500/50" />
							</div>
						</div>

						{/* Contenedor de imagen con máscara */}
						<div className="relative">
							<img
								src="https://miro.medium.com/v2/resize:fit:1400/1*rQ3d_dKG7V2JhX8SrUjs6g.png"
								alt="Dashboard Preview"
								className="w-full h-auto object-cover opacity-60 transition-opacity group-hover:opacity-80"
							/>

							{/* EL TRUCO: Gradiente de desvanecimiento */}
							<div className="absolute inset-0 bg-linear-to-t from-[#0f172a] via-transparent to-transparent pointer-events-none" />
						</div>


					</div>
					{/* Logos etcnologias */}
					<section className="mt-12 pb-20 px-6 max-w-7xl mx-auto z-10 relative">
						<p className="text-center text-gray-400 font-black text-2xl tracking-widest uppercase mb-12!">
							Impulsando la próxima generación de aplicaciones
						</p>

						<div className="flex flex-wrap justify-center gap-12 md:gap-16 items-center opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
							{/* Python */}
							<div className="group relative">
								<img src="https://cdn.simpleicons.org/python/white" alt="Python" className="h-8 w-auto transition-transform group-hover:scale-110" title="Python" />
							</div>

							{/* Flask */}
							<div className="group relative">
								<img src="https://cdn.simpleicons.org/flask/white" alt="Flask" className="h-8 w-auto transition-transform group-hover:scale-110" title="Flask" />
							</div>

							{/* React */}
							<div className="group relative">
								<img src="https://cdn.simpleicons.org/react/white" alt="React" className="h-8 w-auto transition-transform group-hover:scale-110" title="React" />
							</div>

							{/* Tailwind */}
							<div className="group relative">
								<img src="https://cdn.simpleicons.org/tailwindcss/white" alt="Tailwind" className="h-8 w-auto transition-transform group-hover:scale-110" title="Tailwind CSS" />
							</div>

							{/* SQLAlchemy (Usamos SQL por ser más icónico) */}
							<div className="group relative">
								<img src="https://cdn.simpleicons.org/sqlite/white" alt="SQL" className="h-8 w-auto transition-transform group-hover:scale-110" title="SQLAlchemy" />
							</div>

							{/* Node.js */}
							<div className="group relative">
								<img src="https://cdn.simpleicons.org/nodedotjs/white" alt="Node" className="h-8 w-auto transition-transform group-hover:scale-110" title="Node.js" />
							</div>
						</div>
					</section>
				</div>
			</main>
		</div>
	)
};