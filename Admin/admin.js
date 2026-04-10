// Seleccionamos el botón y la tabla
const botonSubir = document.querySelector('#formulario-producto button');
const cuerpoTabla = document.querySelector('tbody');

botonSubir.addEventListener('click', () => {
    // Capturamos los datos de los inputs
    const inputs = document.querySelectorAll('#formulario-producto input');
    const nombre = inputs[0].value;
    const precio = inputs[1].value;
    const stock = inputs[2].value;

    if(nombre === "" || precio === "") {
        alert("Por favor llena los campos principales");
        return;
    }

    // Creamos una nueva fila para la tabla
    const nuevaFila = document.createElement('tr');
    nuevaFila.innerHTML = `
        <td>${nombre}</td>
        <td>${stock}</td>
        <td>0</td>
        <td><button>Editar</button> <button onclick="this.parentElement.parentElement.remove()">Eliminar</button></td>
    `;

    // La agregamos a la tabla
    cuerpoTabla.appendChild(nuevaFila);

    // Limpiamos los campos
    inputs.forEach(input => input.value = "");
});
