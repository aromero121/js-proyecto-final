// Definición de la clase Producto
class Producto {
    constructor(idProducto, nombreProducto, precioProducto, descProducto,imagenProducto,codigoBarras,categoria) {
        this.idProducto = idProducto
        this.nombreProducto = nombreProducto
        this.precioProducto = precioProducto
        this.descProducto = descProducto
        this.imagenProducto = imagenProducto
        this.codigoBarras = codigoBarras
        this.categoria = categoria
    }

    // Método para obtener el precio del producto
    obtenerPrecio() {
        return this.precioProducto;
    }

    // Método para incrementar el precio del producto
    incrementarPrecio(incremento) {
        this.precioProducto += incremento;
    }
}


