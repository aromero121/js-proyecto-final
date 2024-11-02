
const url = "../productos.json";

fetch(url)
    .then(respuesta => respuesta.json())
    .then(datos => mostrarProductos(datos))
    
    .catch(error => console.error('Error al cargar el JSON:', error));

function mostrarProductos(datos) {
    let contenidoHTML = "";
    
    datos.forEach(item => {     
        contenidoHTML += `<div class="col-md-4 mt-3">
             <div class="card h-100 border-0 mb-3 text-center">
                <a href="/pages/producto.html" class="text-dark text-decoration-none" onclick="guardarIdProducto(${item.idProducto})">
                      <img src="${item.imagenProducto}" class="img-fluid" alt="${item.nombreProducto}">
                      <div class="card-body">
                          <p class="card-text fs-5">${item.nombreProducto}<br><b>$${item.precioProducto}</b></p>
                      </div>
                </a>
            </div>
          </div>`;
    });
    
    document.getElementById("contenido").innerHTML = contenidoHTML;
}

const guardarCarritoLS = (productos) => {
    localStorage.setItem("carrito", JSON.stringify(productos));
}

const cargarCarritoLS = () => {
    return JSON.parse(localStorage.getItem("carrito")) || [];
}

const guardarIdProducto = (id) => {
    localStorage.setItem("idProducto", JSON.stringify(id));
}

const cargarIdProducto = () => {
    return JSON.parse(localStorage.getItem("idProducto"));
}

const guardarProductosLS = (productosTienda) => {
    localStorage.setItem("productosTienda", JSON.stringify(productosTienda));
    console.log("productos " + productosTienda);
}

const cargarProductosLS = () => {
    return JSON.parse(localStorage.getItem("productosTienda")) || []; 
}

 const renderProducto = () => {
     const idProducto = cargarIdProducto();
     console.log(idProducto);

     const productosTienda = cargarProductosLS();
     const productoTienda = productosTienda.find(item => item.idProducto == idProducto);
     console.log(productoTienda.idProducto);

     let contenidoHTML = `<div class="col-md-4 offset-md-2">
         <img src="${productoTienda.imagenProducto}" class="img-fluid" alt="${productoTienda.nombreProducto}" />
     </div>
     <div class="col-md-4 text-center border border-warning rounded">
         <h1>${productoTienda.nombreProducto}</h1>
         <p>${productoTienda.descProducto}</p>
         <p class="fw-bold fs-2">$${productoTienda.precioProducto}</p>
         <p><button class="btn btn-outline-danger" onclick="agregarProducto(${productoTienda.idProducto});">Agregar al carrito (+)</button></p>
     </div>`;
    
     document.getElementById("contenido-prod").innerHTML = contenidoHTML;   
 }

 const cantTotalProductosCarrito = () => {
    const carrito = cargarCarritoLS();

    return carrito.reduce((acum, item) => acum += item.cantidad, 0);
}

const sumaTotalProductosCarrito = () => {
    const carrito = cargarCarritoLS();

    return carrito.reduce((acum, item) => acum += item.cantidad * item.precioProducto, 0);
}

const renderBotonCarrito = () => {
    let contenidoHTML = `<button type="button" class="btn btn-warning position-relative mt-4">
    <i class="bi bi-cart"></i>
    <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">${cantTotalProductosCarrito()}</span>
    </button>`;
    document.getElementById("botonCarrito").innerHTML = contenidoHTML;
    console.log(contenidoHTML);
}

const limpiarCarrito = () => {
    localStorage.removeItem("carrito");
    renderCarrito();
    renderBotonCarrito();
}

const buscarProducto = (id) => {
    const carrito = cargarCarritoLS();

    return carrito.some(item => item.idProducto == id);
}

const agregarProducto = (id) => {
    const productos = cargarProductosLS();
    const carrito = cargarCarritoLS();
    let producto;
    
    if (buscarProducto(id)) {      
        producto = carrito.find(item => item.idProducto == id); 
        producto.cantidad += 1;
        console.log(producto);
    } else {
        producto = productos.find(item => item.idProducto == id);
        producto.cantidad = 1;
        carrito.push(producto);
    }

    guardarCarritoLS(carrito);
    renderBotonCarrito();
    mostrarMensaje("El producto se agregó correctamente!");
}


const renderCarrito = () => {
    const carrito = cargarCarritoLS();
    let contenidoHTML="";

    if (carrito.length > 0) {
        contenidoHTML= `<table class="table">
        <tr>
        <td colspan="5" class="text-end"><button class="btn btn-outline-warning" onclick="limpiarCarrito();">Limpiar el Carrito</button></td>
        </tr>`;

        for (const item of carrito) {
            contenidoHTML += `<tr>
            <td><img src="${item.imagenProducto}" class="img-fluid" alt="${item.nombreProducto}" width="80"></td>
            <td class="align-middle">${item.nombreProducto}</td>
            <td class="align-middle text-center">$${item.precioProducto} X ${item.cantidad}</td>
            <td class="align-middle text-center">$${item.precioProducto * item.cantidad}</td>
            <td class="align-middle text-end"><i class="bi bi-trash" onclick="eliminarProductoCarrito(${item.idProducto});"></i></td>
            </tr>`;
        }

        contenidoHTML += `<tr>
        <td colspan="3"><b>Total a Pagar</b></td>
        <td class="text-center"><b>$${sumaTotalProductosCarrito()}</b></td>
        <td class="text-end"><button class="btn btn-outline-warning" onclick="finalizarCompra();">Finalizar Compra</button></td>
        </tr>
        </table>`;
    } else {
        contenidoHTML = `<div class="alert alert-danger p-5 text-center fw-bold fs-3" role="alert">¡Sin Productos en el Carrito!</div>`;
    }
    
    document.getElementById("contenido-carrito").innerHTML = contenidoHTML;
}

const eliminarProductoCarrito = (id) => {
     const carrito = cargarCarritoLS();
     const pos = carrito.findIndex(item => item.idProducto == id);
     carrito.splice(pos, 1);
     
     guardarCarritoLS(carrito);
     renderCarrito();
     renderBotonCarrito();
 }

const irPaginaPrincipal = () => {
    location.href = "index.html";
}

const finalizarCompra = () => {
    let mensaje = `El total a pagar es $${sumaTotalProductosCarrito()}`;
    
    mostrarMensaje("Gracias por tu compra", mensaje, 4000);
    limpiarCarrito();
    mostrarMensajeConBoton(mensaje, irPaginaPrincipal);
}

const mostrarMensaje = (titulo,texto,tiempoMsj) => {
    Swal.fire({
        position: "top-center",
        icon: "success",
        title: titulo,
        text: texto,
        background: '#FDF5D1',
        showConfirmButton: false,
        timer: tiempoMsj
    });
}

const renderMensajeDescuento = () => {
    const modalTemplate = `  <div class="modal fade" tabindex="-1" id="mi-modal-gana-dto" data-bs-backdrop="static">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        
        <div class="modal-header">
          <h5 class="modal-title fw-bold">@nuestraTienda - Grupo8</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        
        <div class="modal-body">
          <p class="display-6 text-bg-warning text-center fw-bold animate__animated animate__backInRight rounded">
            ¡GANASTE UN DESCUENTO!
          </p>
          <h3 class="text-center border border-2 border-warning rounded">
            Ganaste 35% de descuento para tu próxima compra
          </h3>
        </div>
        
        <div class="modal-footer">
          <button type="button" class="btn btn-dark" data-bs-dismiss="modal">Cerrar</button>
        </div>

      </div>
    </div>
  </div>`;

  document.getElementById("mensaje").innerHTML = modalTemplate;
}