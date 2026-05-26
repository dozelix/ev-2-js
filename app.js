// ==========================================================================
// 1. Almacenamiento y Referencias del DOM
// ==========================================================================
const baseDatosEmpleados = []; // Array donde se guardarán los registros exitosos 📂

const formulario = document.querySelector('.formulario-registro form');
const inputNombre = document.getElementById('nombre');
const inputApellido = document.getElementById('apellido');
const selectCargo = document.getElementById('cargo');
const inputCorreo = document.getElementById('correo');
const botonEnviar = formulario.querySelector('button[type="submit"]');
const inputBuscador = document.getElementById('buscador'); // NUEVO: Referencia al buscador

// REFERENCIA A LA TABLA
const tablaCuerpo = document.querySelector('.tabla-colaboradores tbody') || document.getElementById('tablaEmpleadosBody');

// ==========================================================================
// 2. Funciones Reutilizables de Validación (Lógica Pura)
// ==========================================================================

const esVacio = (valor) => valor.trim() === '';
const contieneNumeros = (valor) => /\d/.test(valor);
const cumpleLargoMinimo = (valor, minimo) => valor.trim().length >= minimo;

const esCorreoCorporativoValido = (correo) => {
    const expresionCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return expresionCorreo.test(correo) && correo.toLowerCase().endsWith('@empresa.cl');
};

// ==========================================================================
// 3. Funciones de Interfaz de Usuario (UI), Renderizado y Filtrado
// ==========================================================================

const mostrarError = (input, idError, mensaje) => {
    const contenedorError = document.getElementById(idError);
    if (contenedorError) {
        contenedorError.textContent = mensaje;
    }
    input.classList.add('input-error');
};

const limpiarError = (input, idError) => {
    const contenedorError = document.getElementById(idError);
    if (contenedorError) {
        contenedorError.textContent = "";
    }
    input.classList.remove('input-error');
};

// MODIFICACIÓN: Se añade el botón eliminar dinámicamente en el renderizado
const renderizarTabla = (listaColaboradores = baseDatosEmpleados) => {
    if (!tablaCuerpo) return;

    tablaCuerpo.innerHTML = '';

    listaColaboradores.forEach((colaborador) => {
        const fila = document.createElement('tr');

        fila.innerHTML = `
            <td>${colaborador.nombre}</td>
            <td>${colaborador.apellido}</td>
            <td>${colaborador.cargo}</td>
            <td>${colaborador.correoCorporativo}</td>
            <td>
                <button class="btn-eliminar" data-id="${colaborador.id}">Eliminar 🗑️</button>
            </td>
        `;

        // Asignamos el evento click directamente al botón de esta fila
        const botonEliminar = fila.querySelector('.btn-eliminar');
        botonEliminar.addEventListener('click', () => {
            eliminarColaborador(colaborador.id);
        });

        tablaCuerpo.appendChild(fila);
    });
};

// NUEVA FUNCIÓN: Elimina al colaborador del arreglo y actualiza la UI
const eliminarColaborador = (id) => {
    // Confirmación opcional para mejorar la experiencia de usuario
    const confirmar = confirm("¿Estás seguro de que deseas eliminar este colaborador?");
    
    if (confirmar) {
        // 1. Buscamos el índice del elemento en el arreglo original usando el ID
        const indice = baseDatosEmpleados.findIndex(emp => emp.id === id);
        
        if (indice !== -1) {
            // 2. Removemos el elemento del arreglo original
            baseDatosEmpleados.splice(indice, 1);
            
            // 3. Volvemos a filtrar/renderizar para que respete si el usuario tenía algo escrito en el buscador
            filtrarColaboradores();
            
            console.log(`Colaborador con ID ${id} eliminado. Array actual:`, baseDatosEmpleados);
        }
    }
};

// NUEVA FUNCIÓN: Filtra en tiempo real usando métodos de arreglos (filter e includes)
const filtrarColaboradores = () => {
    const textoBusqueda = inputBuscador.value.toLowerCase().trim();

    // Filtramos la base de datos original
    const colaboradoresFiltrados = baseDatosEmpleados.filter((colaborador) => {
        const coincideNombre = colaborador.nombre.toLowerCase().includes(textoBusqueda);
        const coincideCargo = colaborador.cargo.toLowerCase().includes(textoBusqueda);
        
        return coincideNombre || coincideCargo;
    });

    // Renderizamos la tabla pasando únicamente los resultados que coincidieron
    renderizarTabla(colaboradoresFiltrados);
};

// ==========================================================================
// 4. Orquestación de Validaciones por Campo
// ==========================================================================

const validarNombre = () => {
    const valor = inputNombre.value;
    if (esVacio(valor)) {
        mostrarError(inputNombre, 'error-nombre', 'El nombre es obligatorio ⚠️');
        return false;
    }
    if (!cumpleLargoMinimo(valor, 3)) {
        mostrarError(inputNombre, 'error-nombre', 'Debe tener al menos 3 caracteres 📝');
        return false;
    }
    if (contieneNumeros(valor)) {
        mostrarError(inputNombre, 'error-nombre', 'El nombre no puede contener números 🚫');
        return false;
    }
    limpiarError(inputNombre, 'error-nombre');
    return true;
};

const validarApellido = () => {
    const valor = inputApellido.value;
    if (esVacio(valor)) {
        mostrarError(inputApellido, 'error-apellido', 'El apellido es obligatorio ⚠️');
        return false;
    }
    if (!cumpleLargoMinimo(valor, 3)) {
        mostrarError(inputApellido, 'error-apellido', 'Debe tener al menos 3 caracteres 📝');
        return false;
    }
    if (contieneNumeros(valor)) {
        mostrarError(inputApellido, 'error-apellido', 'El apellido no puede contener números 🚫');
        return false;
    }
    limpiarError(inputApellido, 'error-apellido');
    return true;
};

const validarCargo = () => {
    const valor = selectCargo.value;
    if (esVacio(valor)) {
        mostrarError(selectCargo, 'error-cargo', 'Debes seleccionar un cargo válido de la lista 📋');
        return false;
    }
    limpiarError(selectCargo, 'error-cargo');
    return true;
};

const validarCorreo = () => {
    const valor = inputCorreo.value;
    if (esVacio(valor)) {
        mostrarError(inputCorreo, 'error-correo', 'El correo es obligatorio ⚠️');
        return false;
    }
    if (!esCorreoCorporativoValido(valor)) {
        mostrarError(inputCorreo, 'error-correo', 'El correo debe ser de nuestra empresa @empresa.cl ✉️');
        return false;
    }
    limpiarError(inputCorreo, 'error-correo');
    return true;
};

const controlarEstadoBoton = () => {
    const nombreOk = cumpleLargoMinimo(inputNombre.value, 3) && !contieneNumeros(inputNombre.value);
    const apellidoOk = cumpleLargoMinimo(inputApellido.value, 3) && !contieneNumeros(inputApellido.value);
    const cargoOk = !esVacio(selectCargo.value);
    const correoOk = esCorreoCorporativoValido(inputCorreo.value);

    if (nombreOk && apellidoOk && cargoOk && correoOk) {
        botonEnviar.disabled = false;
        botonEnviar.style.opacity = '1';
    }
};

// ==========================================================================
// 5. Event Listeners (Escuchadores de Eventos)
// ==========================================================================

inputNombre.addEventListener('input', () => { validarNombre(); controlarEstadoBoton(); });
inputApellido.addEventListener('input', () => { validarApellido(); controlarEstadoBoton(); });
selectCargo.addEventListener('change', () => { validarCargo(); controlarEstadoBoton(); }); 
inputCorreo.addEventListener('input', () => { validarCorreo(); controlarEstadoBoton(); });

// NUEVO: Escuchador para el buscador en tiempo real
inputBuscador.addEventListener('input', filtrarColaboradores);

formulario.addEventListener('submit', (evento) => {
    evento.preventDefault(); 

    const esFormularioValido = validarNombre() && validarApellido() && validarCargo() && validarCorreo();

    if (esFormularioValido) {
        const nuevoEmpleado = {
            id: Date.now(), 
            nombre: inputNombre.value.trim(),
            apellido: inputApellido.value.trim(),
            cargo: selectCargo.value,
            correoCorporativo: inputCorreo.value.trim().toLowerCase()
        };

        baseDatosEmpleados.push(nuevoEmpleado);

        // MODIFICACIÓN: Al guardar, limpiamos el buscador para mostrar toda la tabla actualizada
        inputBuscador.value = '';
        renderizarTabla();

        console.log('¡Registro guardado con éxito! Array actual:', baseDatosEmpleados);
        alert('🎉 Registro guardado exitosamente en el sistema.');

        formulario.reset();
        controlarEstadoBoton();
    } else {
        alert('Por favor, corrige los errores en el formulario antes de guardar. ❌');
    }
});