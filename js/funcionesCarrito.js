import {
  guardarCarrito,
  obtenerCarrito,
  vaciarCarritoStorage,
} from "./storage.js";

import { actualizarContador, mostrarMensaje } from "./ui.js";

export const agregarAlCarrito = (producto) => {
  //Usar funcion obtenerCarrito() del localStorage
  const carrito = obtenerCarrito();

  carrito.push(producto);

  //Con funcion guardarCarrito() del localStorage gardar carrito actualizado.
  guardarCarrito(carrito);

  //Usamos la funcion ui.js que actualiza el numero en el carrito
  actualizarContador(carrito);
  mostrarMensaje("Producto agregado al 🛒 carrito🎉");
};

export const eliminarProducto = (indice) => {
  //Elimina un elemento del array
  //Usar obtenerCarrito() del localStorage
  const carrito = obtenerCarrito();

  carrito.splice(indice, 1);

  //Actualizar carrito en localStorage
  guardarCarrito(carrito);

  //Actualizar el actualizarContador
  actualizarContador(carrito);
  mostrarMensaje("Producto eliminado ❌");
};

export const vaciarCarrito = () => {
  return Swal.fire({
    title: "¿Estás seguro❓",
    text: "Se eliminarán ⚠️ todos los productos del carrito 🛒",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí 🎉, vaciar carrito 🛒",
    cancelButtonText: "Cancelar ❌",
  }).then((resultado) => {
    if (resultado.isConfirmed) {
      vaciarCarritoStorage();

      actualizarContador([]);

      mostrarMensaje(
        "¡Carrito 🛒 vaciado!",
        "Se eliminaron ❌ todos los productos correctamente 🎉",
      );
    }
  });
};
