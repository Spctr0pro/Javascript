class Carrito { 
    constructor(Productos) {
        this.miCarrito = Productos
    }

    guardarCarrito(){
        localStorage.setItem("MiCarrito", JSON.stringify(this.miCarrito))
    }

    obtenerTotal() {
        if (this.miCarrito.length > 0) { 
            return this.miCarrito.reduce((totalCompra, producto)=> totalCompra + producto.precio, 0)
        }
    }
}