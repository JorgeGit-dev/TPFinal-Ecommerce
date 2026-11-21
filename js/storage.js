const KEY = "carrito";

export const guardarCarrito = (carrito) => {
  //Convierte a JSON
  localStorage.setItem(KEY, JSON.stringify(carrito));
};

export const obtenerCarrito = () => {
  //Convierte a JSON para tener datos con parse
  const carrito = JSON.parse(localStorage.getItem(KEY));

  return Array.isArray(carrito) ? carrito : [];
};

export const vaciarCarritoStorage = () => {
  localStorage.removeItem(KEY);
};

//Limpiar localStorage del Navegador con consola en F12
//localStorage.removeItem("carrito");
