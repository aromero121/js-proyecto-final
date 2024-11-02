let urlProductos = "../productos.json";
const productosTienda = [];


fetch(urlProductos)
  .then(response => {
    if (!response.ok) {
      throw new Error('Error al cargar el archivo JSON');
    }
    return response.json();
  })
  .then(data => {
    console.log(data);
    guardarProductosLS(data)
  })
  .catch(error => {
    console.error('Error al cargar el archivo JSON:', error);
  });

