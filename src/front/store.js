export const initialStore = () => {
  return {
    message: null,
    // --- Nuevas colecciones de Logística ---
    vehicles: [],
    drivers: [],
    routes: [],
    stores: [],
    token: localStorage.getItem("token") || null // Persistencia del login
  }
}

export default function storeReducer(store, action = {}) {
  switch (action.type) {
    case 'set_token':
      return { ...store, token: action.payload };

    case 'load_vehicles':
      return { ...store, vehicles: action.payload };

    case 'load_drivers':
      return { ...store, drivers: action.payload };

    case 'load_routes':
      return { ...store, routes: action.payload };

    case 'logout':
      return { ...store, token: null, vehicles: [], drivers: [], routes: [] };

    default:
      return store; // Cambié el throw Error por return store para evitar que la app crashee si una acción no coincide
  }
}
