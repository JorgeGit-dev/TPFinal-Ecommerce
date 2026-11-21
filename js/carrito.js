import { obtenerCarrito } from "./storage.js";
import {
  agregarAlCarrito,
  eliminarProducto,
  vaciarCarrito,
} from "./funcionesCarrito.js";
import { actualizarContador } from "./ui.js";
//import { formatearPrecio } from "./utils.js";

// Formatear importes en pesos argentinos
const formatearPrecio = (precio) => {
  return `$${Number(precio).toLocaleString("es-AR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

// Calcular y mostrar el resumen de la compra
const renderizarResumen = (carrito) => {
  const resumen = document.getElementById("resumen-carrito");

  resumen.innerHTML = "";

  // Si el carrito está vacío, ocultar el resumen
  if (!carrito.length) {
    resumen.style.display = "none";
    return;
  }

  // Muestra el resumen cuando hay productos
  resumen.style.display = "block";

  // Calculo del subtotal sumando los precios de los productos
  const subtotal = carrito.reduce((acumulador, producto) => {
    return acumulador + (Number(producto.precio) || 0);
  }, 0);

  // Calculo del IVA del 21 %
  const iva = subtotal * 0.21;

  // Calculo del total con IVA incluido
  const total = subtotal + iva;

  // Crear el título del resumen
  const titulo = document.createElement("h2");
  titulo.textContent = "Resumen de tu compra";
  resumen.appendChild(titulo);

  // Cantidad de productos
  const cantidad = document.createElement("p");
  cantidad.classList.add("detalle-resumen");
  cantidad.innerHTML = `<span>Cantidad de productos :</span>
  <strong>${carrito.length}</strong>`;

  resumen.appendChild(cantidad);

  // Subtotal
  const pSubtotal = document.createElement("p");
  pSubtotal.classList.add("detalle-resumen");
  pSubtotal.innerHTML = `<span>Subtotal :</span>
  <strong><span class="moneda">$</span> ${formatearPrecio(subtotal).replace("$", "").trim()}</strong>`;

  resumen.appendChild(pSubtotal);

  // IVA
  const pIva = document.createElement("p");
  pIva.classList.add("detalle-resumen");
  pIva.innerHTML = `<span>IVA (21 %) :</span>
  <strong><span class="moneda">$</span> ${formatearPrecio(iva).replace("$", "").trim()}</strong>`;

  resumen.appendChild(pIva);

  // Total final
  const pTotal = document.createElement("p");
  pTotal.classList.add("total-carrito");
  pTotal.innerHTML = `<span>Total con IVA :</span>
    <strong><span class="moneda">$</span> ${formatearPrecio(total).replace("$", "").trim()}</strong>`;

  resumen.appendChild(pTotal);
};

// Renderizar las tarjetas del carrito
const renderizarCarrito = () => {
  const carrito = obtenerCarrito();

  // Agrupa los productos iguales
  const productosAgrupados = [];

  carrito.forEach((producto) => {
    const existente = productosAgrupados.find(
      (item) => item.producto.id === producto.id,
    );

    if (existente) {
      existente.cantidad++;
    } else {
      productosAgrupados.push({
        producto: producto,
        cantidad: 1,
      });
    }
  });

  actualizarContador(carrito);

  const contenedor = document.getElementById("contenedor-carrito");
  const divAcciones = document.getElementById("acciones-carrito");

  contenedor.innerHTML = "";
  divAcciones.innerHTML = "";

  // Si no hay productos
  if (!carrito.length) {
    const mensaje = document.createElement("h2");
    mensaje.classList.add("mensaje-carrito-vacio");
    mensaje.textContent = "Tu carrito 🛒 está vacío 😕";

    contenedor.appendChild(mensaje);

    // Limpiamos también el resumen
    renderizarResumen(carrito);
    return;
  }

  // Si hay productos, creamos las tarjetas
  productosAgrupados.forEach((item) => {
    const producto = item.producto;
    const cantidad = item.cantidad;
    const tarjeta = document.createElement("article");
    tarjeta.classList.add("card");

    // 1. Imagen
    const img = document.createElement("img");
    img.src = `../${producto.img}`;
    img.alt = producto.nombre || "Producto";
    img.loading = "lazy";

    tarjeta.appendChild(img);

    // 2. Título
    const titulo = document.createElement("h3");
    titulo.textContent =
      producto.descripcion?.desc1 || producto.nombre || "Sin título";
    tarjeta.appendChild(titulo);

    // 3. Precio
    const precio = document.createElement("p");
    precio.textContent = formatearPrecio(producto.precio);
    tarjeta.appendChild(precio);

    // Muestra la cantidad de unidades
    const cantidadProducto = document.createElement("p");

    cantidadProducto.classList.add("cantidad-producto");

    cantidadProducto.innerHTML = `<strong>Cantidad:</strong> ${cantidad}`;

    tarjeta.appendChild(cantidadProducto);

    // 4. Descripción extendida
    const detallesContainer = document.createElement("div");
    detallesContainer.classList.add("detalles-producto", "d-none");

    if (producto.descripcion) {
      // Descripción secundaria
      if (producto.descripcion.desc2) {
        const descripcionSecundaria = document.createElement("p");
        descripcionSecundaria.textContent = producto.descripcion.desc2;
        detallesContainer.appendChild(descripcionSecundaria);
      }

      // Características
      if (producto.descripcion.caracteristicas?.length > 0) {
        const tituloCaracteristicas = document.createElement("h4");
        tituloCaracteristicas.classList.add("titulo-caracteristicas");
        tituloCaracteristicas.textContent = "Características";

        const listaCaracteristicas = document.createElement("ul");
        listaCaracteristicas.classList.add("lista-caracteristicas");

        producto.descripcion.caracteristicas.forEach((texto) => {
          const li = document.createElement("li");
          li.textContent = texto;
          listaCaracteristicas.appendChild(li);
        });

        detallesContainer.appendChild(tituloCaracteristicas);
        detallesContainer.appendChild(listaCaracteristicas);
      }

      // Disponibilidad
      if (producto.descripcion.disponible?.trim()) {
        const pDisponibles = document.createElement("p");
        const strongDisponibles = document.createElement("strong");

        strongDisponibles.textContent = producto.descripcion.disponible;
        pDisponibles.appendChild(strongDisponibles);
        detallesContainer.appendChild(pDisponibles);
      }

      // Medidas disponibles
      if (producto.descripcion.medidas?.length > 0) {
        const tituloMedidas = document.createElement("h4");
        tituloMedidas.classList.add("titulo-medidas");
        tituloMedidas.textContent = "Medidas disponibles";

        const listaMedidas = document.createElement("ul");
        listaMedidas.classList.add("lista-medidas");

        producto.descripcion.medidas.forEach((item) => {
          const li = document.createElement("li");
          const strong = document.createElement("strong");

          strong.textContent = item.modelo;
          li.appendChild(strong);
          li.append(` ${item.detalle}`);

          listaMedidas.appendChild(li);
        });

        detallesContainer.appendChild(tituloMedidas);
        detallesContainer.appendChild(listaMedidas);
      }
    }

    tarjeta.appendChild(detallesContainer);

    // 5. Botón mostrar u ocultar descripción
    const mostrarOcultar = document.createElement("button");
    mostrarOcultar.type = "button";
    mostrarOcultar.classList.add("btn", "btn-outline-secondary");
    mostrarOcultar.textContent = "Mostrar descripción";

    mostrarOcultar.addEventListener("click", () => {
      detallesContainer.classList.toggle("d-none");

      if (detallesContainer.classList.contains("d-none")) {
        mostrarOcultar.textContent = "Mostrar descripción";
      } else {
        mostrarOcultar.textContent = "Ocultar descripción";
      }
    });

    tarjeta.appendChild(mostrarOcultar);

    // 6. Botón eliminar producto
    const btnEliminar = document.createElement("button");
    btnEliminar.classList.add("btn", "btn-eliminar-carrito");
    btnEliminar.textContent = "Eliminar producto";

    btnEliminar.addEventListener("click", () => {
      // Busca el índice de una unidad del producto original
      const indice = carrito.findIndex((item) => item.id === producto.id);

      if (indice !== -1) {
        eliminarProducto(indice);
        renderizarCarrito();
      }
    });

    tarjeta.appendChild(btnEliminar);

    // 7. Botón agregar al carrito
    const botonAgregar = document.createElement("button");

    botonAgregar.type = "button";
    botonAgregar.classList.add("btn", "bg-secondary", "text-dark");
    botonAgregar.textContent = "Agregar al carrito";

    botonAgregar.addEventListener("click", () => {
      // Agregar una nueva unidad del producto
      agregarAlCarrito(producto);

      // Actualizar la vista del carrito
      renderizarCarrito();
    });

    tarjeta.appendChild(botonAgregar);

    contenedor.appendChild(tarjeta);
  });

  // Mostrar el resumen después de las tarjetas
  renderizarResumen(carrito);

  // Botón para vaciar todo el carrito
  const btnVaciar = document.createElement("button");
  btnVaciar.classList.add("btn", "btn-vaciar-carrito");
  btnVaciar.textContent = "Vaciar carrito";

  btnVaciar.addEventListener("click", () => {
    vaciarCarrito().then(() => {
      renderizarCarrito();
    });
  });

  divAcciones.appendChild(btnVaciar);
};

// Inicializar al cargar la página
document.addEventListener("DOMContentLoaded", () => {
  const carrito = obtenerCarrito();
  actualizarContador(carrito);
  renderizarCarrito();
});
