/* CONTANTES */
const urlProductos = "js/productos.json"
const urlMensajes = "js/mensajes.json"
const idTimeout = 0
const productos = []
const mensajes = []
const carrito = JSON.parse(localStorage.getItem("MiCarrito")) || []
const contenedor = document.querySelector("div.container#divcontenedor")
const btnCarrito = document.querySelector("img#logo")
const inputBuscar = document.querySelector("input#inputBusqueda")
const tablaCarrito = document.querySelector("table tbody")
const detalleCarrito = document.querySelector("#divDetalleCarrito")
const carritoVacio = document.querySelector("#divVacio")
const btnSeguirComprando1 = document.querySelector("button#btnSeguirComprando1")
const btnComprarCarrito = document.querySelector("button#btnComprarCarrito")
/* FIN CONTANTES */

/* CREA HTML */
function crearDetalleCarritoHTML(producto) {
    return `<td align="center" class="columna"><img src="${producto.imagen
        }" class="img-producto" /></td>
            <td>${producto.nombre}</td>
            <td>${producto.precio.toLocaleString("es-CL")}</td>
            <th align="center"><button id="${producto.id
        }" class="button-eliminar" type="button">Eliminar</button></th>`;
}

function crearCardCarritoVacio() {
    return `<div class="div-card-error">
                <div><img src="images/not-found.png" class="img-not-found" /></div>
                <div class="leyenda-error">Ups no encontramos productos en tú carrito</div>
                <div class="leyenda-intento">Agrega productos a tú carrito para poder visualizarlos.</div>
                <div><button id="btnSeguirComprando2" class="button-sigue-comprando" type="button">Seguir comprando</button></div>
            </div>`;
}

function crearCardExito() {
    return `<div class="div-card-exito">
                <div><img src="images/success.png" class="img-not-found" /></div>
                <div class="leyenda-error">Felicidades tú compra se efectuo con exito</div>
                <div class="leyenda-intento">En unos segundos seras redireccionado a la página principal</div>
                <div><button id="btnSeguirComprando2" class="button-sigue-comprando" type="button">Seguir comprando</button></div>
            </div>`;
}

function crearCardError() {
    return `<div class="div-card-error">
                <div><img src="images/not-found.png" class="img-not-found" /></div>
                <div class="leyenda-error">Ups no encontramos lo que andas buscando</div>
                <div class="leyenda-intento">Intenta nuevamente.</div>
            </div>`;
}

function crearCardHTML(producto) {
    return `<div class="div-card">
                <div><img src="${producto.imagen}" class="img" /></div>
                <div class="producto">${producto.nombre}</div>
                <div class="importe">$ ${producto.precio}</div>
                <button id="${producto.id}" class="add-to-cart">Agregar</button>
            </div>`;
}
/* FIN CREA HTML */

/* FUNCIONES UTILES */
function OcultaControles(option) {
    switch (option) {
        case 1:
            contenedor.classList.remove("ocultar-panel");
            detalleCarrito.classList.add("ocultar-panel");
            detalleCarrito.classList.remove("detalle-carrito");
            break;
        case 2:
            contenedor.classList.add("ocultar-panel");
            detalleCarrito.classList.remove("detalle-carrito");
            detalleCarrito.classList.add("ocultar-panel");
            carritoVacio.classList.add("detalle-vacio");
            break;
        case 3:
            contenedor.classList.add("ocultar-panel");
            detalleCarrito.classList.add("detalle-carrito");
            detalleCarrito.classList.remove("ocultar-panel");
            break;
        case 4:
            contenedor.classList.remove("ocultar-panel");
            detalleCarrito.classList.remove("detalle-carrito");
            detalleCarrito.classList.add("ocultar-panel");
            carritoVacio.classList.remove("detalle-vacio")
            carritoVacio.classList.add("ocultar-panel");
            break;
    }
}

function GuardaCarrito() {
    localStorage.setItem("MiCarrito", JSON.stringify(carrito));
}

function buscarProducto(id) {
    let productoSeleccionado = productos.find((producto) => producto.id === id);
    return productoSeleccionado;
}

function obtenerMensaje(opcion) {
    let textoMensaje = mensajes.filter((msj) => msj.id === parseInt(opcion));
    return textoMensaje.length > 0 ? textoMensaje[0].mensaje : "";
}

function cargaArray(jsonData, type) {
    switch (type) {
        case 'productos':
            productos.push(...jsonData)
            cargarProductos()
            break
        case 'mensajes':
            mensajes.push(...jsonData)
            break
    }
}

/* DATOS DESDE ARCHIVO */
function cargaArrayProductos(url, type) {
    fetch(url)
        .then((response) => response.json())
        .then((jsonData) => cargaArray(jsonData, type))
        .catch(() => crearCardError())
}
/* FIN DATOS DESDE ARCHIVO */

function cargarProductos() {
    OcultaControles(4);
    contenedor.innerHTML = "";
    if (productos.length > 0) {
        productos.forEach(
            (producto) => (contenedor.innerHTML += crearCardHTML(producto))
        );
        activarClickEnBotones();
    } else {
        contenedor.innerHTML = crearCardError();
    }
}

function cargaDetalleCarrito() {
    clearTimeout(idTimeout)
    tablaCarrito.innerHTML = "";
    carritoVacio.innerHTML = "";
    if (carrito.length > 0) {
        OcultaControles(3);
        btnComprarCarrito.classList.remove('ocultar-boton')
        carrito.forEach(
            (producto) =>
                (tablaCarrito.innerHTML += crearDetalleCarritoHTML(producto))
        );
        activarClickEnBotonesCarrito();
        const totalCompra = document.querySelector("tfoot td.texto-derecha");
        let car = new Carrito(carrito);
        totalCompra.textContent = `$ ${car.obtenerTotal().toLocaleString("es-CL")}`;
    } else {
        OcultaControles(2);
        btnComprarCarrito.classList.add('ocultar-boton')
        carritoVacio.innerHTML = crearCardCarritoVacio();
        const btnSeguirComprando2 = document.querySelector(
            "button#btnSeguirComprando2"
        );
        btnSeguirComprando2.addEventListener("click", () => {
            EventosBotones();
        });
    }
}

function EventosBotones() {
    OcultaControles(1);
    carritoVacio.innerHTML = "";
    contenedor.innerHTML = "";
    if (productos.length > 0) {
        productos.forEach(
            (producto) => (contenedor.innerHTML += crearCardHTML(producto))
        );
        activarClickEnBotones();
    }
}

function activarClickEnBotonesCarrito() {
    const botonesAgregar = document.querySelectorAll("button.button-eliminar");
    botonesAgregar.forEach((boton) => {
        boton.addEventListener("click", (e) => {
            swal({
                title: obtenerMensaje(3),
                text: "",
                icon: "warning",
                buttons: true,
                dangerMode: true,
                buttons: ["Cancelar", "Aceptar"],
                class: "button-sweet",
            }).then((eliminar) => {
                if (eliminar) {
                    const id = parseInt(e.target.id);
                    const productoEliminado = carrito.findIndex(
                        (producto) => producto.id === id
                    );
                    carrito.splice(productoEliminado, 1);
                    GuardaCarrito();
                    cargaDetalleCarrito();
                    swal("Producto eliminado del carrito exitosamente!", {
                        icon: "success",
                    });
                }
            });
        });
    });
}
/* FIN FUNCIONES UTILES */

/* EVENTOS BOTONES */
function activarClickEnBotones() {
    const botonesAgregar = document.querySelectorAll("button.add-to-cart");
    botonesAgregar.forEach((boton) => {
        boton.addEventListener("click", (e) => {
            const id = parseInt(e.target.id);
            const productoSeleccionado = productos.find(
                (producto) => producto.id === id
            );
            carrito.push(productoSeleccionado);
            Toastify({
                text: "Producto agregado exitosamente",
                duration: 2000,
                close: false,
                gravity: "bottom", // `top` or `bottom`
                position: "right", // `left`, `center` or `right`
                stopOnFocus: false, // Prevents dismissing of toast on hover
                className: "toastify-css",
                style: {
                    background: "green",
                },
                // onClick: function(){} // Callback after click
            }).showToast();
            GuardaCarrito();
        });
    });
}

inputBuscar.addEventListener("input", () => {
    OcultaControles(1);
    carritoVacio.innerHTML = "";
    let textoAbuscar = inputBuscar.value.trim().toLowerCase();
    let resultado =
        textoAbuscar === ""
            ? productos
            : productos.filter((producto) =>
                producto.nombre.toLowerCase().includes(textoAbuscar)
            );
    contenedor.innerHTML = "";
    if (resultado.length > 0) {
        resultado.forEach(
            (producto) => (contenedor.innerHTML += crearCardHTML(producto))
        );
        activarClickEnBotones();
    } else {
        contenedor.innerHTML = crearCardError();
    }
});

btnCarrito.addEventListener("click", () => {
    cargaDetalleCarrito();
});

btnComprarCarrito.addEventListener("click", () => {
    swal({
        title: obtenerMensaje(4),
        text: "",
        icon: "warning",
        buttons: true,
        dangerMode: false,
        buttons: ["Cancelar", "Aceptar"],
        class: "button-sweet",
    }).then((comprar) => {
        if (comprar) {
            swal("Felicidades tú compra se ha efectuado con exito!", {
                icon: "success",
            }).then(() => {
                OcultaControles(2);
                btnComprarCarrito.classList.add('ocultar-boton')
                carritoVacio.innerHTML = crearCardExito();
                idTimeout = setTimeout(() => {
                    localStorage.removeItem("MiCarrito")
                    carrito.splice(0, carrito.length)
                    cargaArrayProductos(urlProductos, 'productos')
                }, 5000)
            })
            
        }
    });
})

btnSeguirComprando1.addEventListener("click", () => {
    EventosBotones();
});
/* FIN EVENTOS BOTONES */

/* CARGA INICIAL */
cargaArrayProductos(urlProductos, 'productos')
cargaArrayProductos(urlMensajes, 'mensajes')
/* FIN CARGA INICIAL */
