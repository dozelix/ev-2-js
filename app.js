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

// REFERENCIA A LA TABLA: Asegúrate de que tu HTML tenga un <tbody> con esta clase o ID
const tablaCuerpo = document.querySelector('.tabla-colaboradores tbody') || document.getElementById('tablaEmpleadosBody');

// ==========================================================================
// 2. Funciones Reutilizables de Validación (Lógica Pura)
// ==========================================================================

// Verifica si un campo está vacío o solo contiene espacios
const esVacio = (valor) => valor.trim() === '';

// Verifica si el texto contiene números usando una Expresión Regular
const contieneNumeros = (valor) => /\d/.test(valor);

// Valida que cumpla con el largo mínimo requerido
const cumpleLargoMinimo = (valor, minimo) => valor.trim().length >= minimo;

// Valida el formato general del correo y que termine exactamente en @empresa.cl
const esCorreoCorporativoValido = (correo) => {
    const expresionCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return expresionCorreo.test(correo) && correo.toLowerCase().endsWith('@empresa.cl');
};

// ==========================================================================
// 3. Funciones de Interfaz de Usuario (UI) y Renderizado
// ==========================================================================

// Muestra el mensaje de error de forma segura
const mostrarError = (input, idError, mensaje) => {
    const contenedorError = document.getElementById(idError);
    if (contenedorError) {
        contenedorError.textContent = mensaje;
    }
    input.classList.add('input-error');
};

// Limpia el mensaje de error de forma segura
const limpiarError = (input, idError) => {
    const contenedorError = document.getElementById(idError);
    if (contenedorError) {
        contenedorError.textContent = "";
    }
    input.classList.remove('input-error');
};

// FUNCIÓN DEDICADA: Renderiza la tabla dinámicamente con los colaboradores actuales
const renderizarTabla = () => {
    // Si no se encuentra el elemento de la tabla en el DOM, detenemos la ejecución
    if (!tablaCuerpo) return;

    // Limpiamos el contenido previo para evitar que se dupliquen las filas
    tablaCuerpo.innerHTML = '';

    // Recorremos el arreglo completo para generar las filas una por una
    baseDatosEmpleados.forEach((colaborador) => {
        const fila = document.createElement('tr');

        // Construimos las celdas usando las propiedades exactas de tu objeto empleado
        fila.innerHTML = `
            <td>${colaborador.nombre}</td>
            <td>${colaborador.apellido}</td>
            <td>${colaborador.cargo}</td>
            <td>${colaborador.correoCorporativo}</td>
        `;

        // Agregamos la fila armada al cuerpo de la tabla
        tablaCuerpo.appendChild(fila);
    });
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

// Nueva función para validar el elemento SELECT del cargo
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

// Revisa todo el formulario para habilitar o deshabilitar el botón de envío
const controlarEstadoBoton = () => {
    const nombreOk = cumpleLargoMinimo(inputNombre.value, 3) && !contieneNumeros(inputNombre.value);
    const apellidoOk = cumpleLargoMinimo(inputApellido.value, 3) && !contieneNumeros(inputApellido.value);
    const cargoOk = !esVacio(selectCargo.value); // Verifica que no sea el string vacío por defecto
    const correoOk = esCorreoCorporativoValido(inputCorreo.value);

    if (nombreOk && apellidoOk && cargoOk && correoOk) {
        botonEnviar.disabled = false;
        botonEnviar.style.opacity = '1';
    } else {
        // Opcional: mantener el botón deshabilitado visualmente
        // botonEnviar.disabled = true;
    }
};

// ==========================================================================
// 5. Event Listeners (Escuchadores de Eventos)
// ==========================================================================

// Validar en tiempo real cuando el usuario escribe o cambia algo
inputNombre.addEventListener('input', () => { validarNombre(); controlarEstadoBoton(); });
inputApellido.addEventListener('input', () => { validarApellido(); controlarEstadoBoton(); });
// Para elementos select se usa el evento 'change' en vez de 'input'
selectCargo.addEventListener('change', () => { validarCargo(); controlarEstadoBoton(); }); 
inputCorreo.addEventListener('input', () => { validarCorreo(); controlarEstadoBoton(); });

// Evento al intentar enviar el formulario
formulario.addEventListener('submit', (evento) => {
    evento.preventDefault(); // Evita que la página se recargue 🛑

    // Ejecutamos todas las validaciones (incluido el cargo) de manera estricta
    const esFormularioValido = validarNombre() && validarApellido() && validarCargo() && validarCorreo();

    if (esFormularioValido) {
        // Creamos el objeto con los datos del nuevo empleado
        const nuevoEmpleado = {
            id: Date.now(), 
            nombre: inputNombre.value.trim(),
            apellido: inputApellido.value.trim(),
            cargo: selectCargo.value,
            correoCorporativo: inputCorreo.value.trim().toLowerCase()
        };

        // Guardamos en nuestro array de documentos 📥
        baseDatosEmpleados.push(nuevoEmpleado);

        // ACTUALIZACIÓN DINÁMICA: Invocamos la función para refrescar la tabla sin recargar
        renderizarTabla();

        console.log('¡Registro guardado con éxito! Array actual:', baseDatosEmpleados);
        alert('🎉 Registro guardado exitosamente en el sistema.');

        // Limpiamos el formulario para un nuevo registro
        formulario.reset();
        controlarEstadoBoton();
    } else {
        alert('Por favor, corrige los errores en el formulario antes de guardar. ❌');
    }
});