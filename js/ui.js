export const actualizarContador = (carrito) => {
  const contador = document.getElementById("contador-carrito");
  if (contador) {
    contador.textContent = carrito.length || "";
  }
};

export const mostrarMensaje = (titulo, texto = "") => {
  if (typeof Swal === "undefined") {
    console.error("SweetAlert2 no está cargado 😒");
    alert(titulo);
    return;
  }

  Swal.fire({
    title: titulo,
    text: texto,
    icon: "success",
    confirmButtonText: "Aceptar",
  });
};
