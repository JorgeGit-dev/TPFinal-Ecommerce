//Funciones para enviar objetos al array
import { obtenerCarrito } from "./storage.js";
import { agregarAlCarrito } from "./funcionesCarrito.js";
import { actualizarContador, mostrarMensaje } from "./ui.js";
//import { formatearPrecio } from "./utils.js";

// ✅ Recuperar el carrito guardado al iniciar
let carrito = obtenerCarrito();
actualizarContador(carrito);

// Formateo de precio
const formatearPrecio = (precio) => {
  if (typeof precio !== "number") {
    return precio;
  }

  return precio.toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
  });
};

//Funcion que se ocupara de renderizar las tarjetas
const renderizarProductos = () => {
  //Agarrar al div para meter las atrjetas
  const contenedor = document.getElementById("contenedor-tarjetas");

  if (!contenedor) {
    console.error("No se encontró el contenedor de productos 😒");
    return;
  }

  // Petición HTTP usando Fetch
  fetch("./data/productos.json")
    .then((respuesta) => {
      if (!respuesta.ok) {
        throw new Error("No se pudo cargar el archivo de productos.");
      }
      return respuesta.json();
    })
    .then((productos) => {
      contenedor.innerHTML = "";

      productos.forEach((producto) => {
        const descripcion = producto.descripcion || {};

        // Crear tarjeta principal
        const tarjeta = document.createElement("article");
        tarjeta.classList.add("card", "text-dark");

        // 1. IMAGEN (Presentación inicial)
        const img = document.createElement("img");
        img.src = producto.img;
        img.alt = producto.nombre;
        img.loading = "lazy";
        tarjeta.appendChild(img);

        // 2. TÍTULO PRINCIPAL (Presentación inicial)
        const titulo = document.createElement("h3");
        titulo.textContent = producto.descripcion.desc1;
        tarjeta.appendChild(titulo);

        // 3. PRECIO (Presentación inicial)
        const precio = document.createElement("p");
        precio.textContent = formatearPrecio(producto.precio);
        tarjeta.appendChild(precio);

        // --- CONTENEDOR DE DETALLES / DESCRIPCIÓN EXTENDIDA (Oculto por defecto con d-none) ---
        const detallesContainer = document.createElement("div");
        detallesContainer.classList.add("detalles-producto", "d-none");

        // Descripcion secundaria (desc2)
        if (descripcion.desc2) {
          const descripcionSecundaria = document.createElement("p");
          descripcionSecundaria.textContent = descripcion.desc2;
          detallesContainer.appendChild(descripcionSecundaria);
        }

        // Caracteristicas.
        if (descripcion.caracteristicas?.length > 0) {
          const tituloCaracteristicas = document.createElement("h4");
          tituloCaracteristicas.classList.add("titulo-caracteristicas");
          tituloCaracteristicas.textContent = "Características";

          const listaCaracteristicas = document.createElement("ul");
          listaCaracteristicas.classList.add("lista-caracteristicas");

          descripcion.caracteristicas.forEach((texto) => {
            const li = document.createElement("li");
            li.textContent = texto;
            listaCaracteristicas.appendChild(li);
          });

          detallesContainer.appendChild(tituloCaracteristicas);
          detallesContainer.appendChild(listaCaracteristicas);
        }

        // Disponibilidad
        if (descripcion.disponible?.trim()) {
          const pDisponibles = document.createElement("p");
          const strongDisponibles = document.createElement("strong");
          strongDisponibles.textContent = descripcion.disponible;

          pDisponibles.appendChild(strongDisponibles);
          detallesContainer.appendChild(pDisponibles);
        }

        // Medidas disponibles.
        if (descripcion.medidas?.length > 0) {
          const tituloMedidas = document.createElement("h4");
          tituloMedidas.classList.add("titulo-medidas");
          tituloMedidas.textContent = "Medidas disponibles";

          const listaMedidas = document.createElement("ul");
          listaMedidas.classList.add("lista-medidas");

          descripcion.medidas.forEach((item) => {
            const li = document.createElement("li");
            const strong = document.createElement("strong");
            strong.textContent = item.modelo;
            li.appendChild(strong);
            li.append(item.detalle);

            listaMedidas.appendChild(li);
          });

          detallesContainer.appendChild(tituloMedidas);
          detallesContainer.appendChild(listaMedidas);
        }

        // Añadimos el bloque de detalles a la tarjeta
        tarjeta.appendChild(detallesContainer);

        // --- BOTONES DE ACCIÓN ---

        // Botón para alternar la descripción (Usa tu clase de estilo personalizada)
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

        // Botón agregar al carrito.
        const botonAgregar = document.createElement("button");
        botonAgregar.type = "button";
        botonAgregar.classList.add("btn", "bg-secondary", "text-dark");
        botonAgregar.textContent = "Agregar al carrito";

        botonAgregar.addEventListener("click", () => {
          agregarAlCarrito(producto);
          const carritoActualizado = obtenerCarrito();
          actualizarContador(carritoActualizado);
        });

        tarjeta.appendChild(botonAgregar);

        // Finalmente, agregamos la tarjeta completa al contenedor general del DOM
        contenedor.appendChild(tarjeta);
      });
    })
    .catch((error) => {
      console.error("Error al renderizar productos:", error);
      mostrarMensaje("Hubo un error al cargar los productos ⚠️");
    });
};

// Inicialización al cargar el DOM
document.addEventListener("DOMContentLoaded", () => {
  const carrito = obtenerCarrito();
  actualizarContador(carrito);
  renderizarProductos();
});
