let personas = [];
let gastos = [];

// Cargar datos al inicio
window.onload = async () => {
    const res = await fetch("/datos");
    const data = await res.json();

    personas = data.personas;
    gastos = data.gastos;

    document.getElementById("year").textContent = new Date().getFullYear();

    // 🔥 SERVICE WORKER
    if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("/static/sw.js");
    }

    // 🔥 BOTÓN INSTALAR
    const btnInstalar = document.getElementById("btnInstalar");

    let deferredPrompt;

    window.addEventListener("beforeinstallprompt", (e) => {
        e.preventDefault();
        deferredPrompt = e;

        btnInstalar.style.display = "inline-block";
    });

    btnInstalar.addEventListener("click", async () => {
        if (!deferredPrompt) return;

        deferredPrompt.prompt();

        const { outcome } = await deferredPrompt.userChoice;

        console.log("Resultado instalación:", outcome);

        deferredPrompt = null;
        btnInstalar.style.display = "none";
    });

    render();
};

function guardar() {
    fetch("/guardar", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({personas, gastos})
    });
}

function agregarPersona() {
    const nombre = document.getElementById("nombrePersona").value;
    if (!nombre) return;

    personas.push(nombre);
    guardar();
    render();
}

function agregarGasto() {
    const persona = document.getElementById("personaGasto").value;
    const concepto = document.getElementById("concepto");
    const cantidad = document.getElementById("cantidad");
    const fecha = document.getElementById("fecha");

    if (!persona || !cantidad.value) return;

    gastos.push({
        persona,
        concepto: concepto.value,
        cantidad: parseFloat(cantidad.value),
        fecha: fecha.value
    });

    // 🔥 reset limpio
    concepto.value = "";
    cantidad.value = "";
    fecha.value = "";
    concepto.focus();

    guardar();
    render();
}

function render() {
    const listaPersonas = document.getElementById("listaPersonas");
    const select = document.getElementById("personaGasto");

    listaPersonas.innerHTML = "";
    select.innerHTML = "";

    personas.forEach(p => {
        listaPersonas.innerHTML += `<li>${p}</li>`;
        select.innerHTML += `<option>${p}</option>`;
    });

    const listaGastos = document.getElementById("listaGastos");
    listaGastos.innerHTML = "";

    gastos.forEach((g, index) => {
        listaGastos.innerHTML += `
            <li>
                ${g.persona} - ${g.concepto} - ${g.cantidad}€ - ${g.fecha}
                <button onclick="editarGasto(${index})">✏️</button>
                <button class="btn-delete" onclick="eliminarGasto(${index})">❌</button>
            </li>
        `;
    });
}

function calcular() {
    let total = gastos.reduce((sum, g) => sum + g.cantidad, 0);
    let porPersona = total / personas.length;

    let balance = {};

    // Inicializar
    personas.forEach(p => balance[p] = 0);

    // Sumar lo que ha pagado cada uno
    gastos.forEach(g => {
        balance[g.persona] += g.cantidad;
    });

    let resultado = `<p><strong>Total:</strong> ${total.toFixed(2)}€</p>`;
    resultado += `<p><strong>Por persona:</strong> ${porPersona.toFixed(2)}€</p>`;

    // 🔥 NUEVO: total por persona
    resultado += `<h3>💰 Lo que ha puesto cada uno:</h3>`;
    for (let p in balance) {
        resultado += `<p>${p}: ${balance[p].toFixed(2)}€</p>`;
    }

    // 🔥 Diferencias
    resultado += `<h3>⚖️ Ajuste final:</h3>`;
    for (let p in balance) {
        let diff = balance[p] - porPersona;

        if (diff > 0) {
            resultado += `<p>${p} recibe ${diff.toFixed(2)}€</p>`;
        } else if (diff < 0) {
            resultado += `<p>${p} debe ${Math.abs(diff).toFixed(2)}€</p>`;
        } else {
            resultado += `<p>${p} está en paz con el universo 😌</p>`;
        }
    }

    document.getElementById("resultado").innerHTML = resultado;
}
function eliminarGasto(index) {
    gastos.splice(index, 1);
    guardar();
    render();
}

function editarGasto(index) {
    const g = gastos[index];

    document.getElementById("personaGasto").value = g.persona;
    document.getElementById("concepto").value = g.concepto;
    document.getElementById("cantidad").value = g.cantidad;
    document.getElementById("fecha").value = g.fecha;

    // eliminar el antiguo
    gastos.splice(index, 1);

    guardar();
    render();
}

function exportar() {
    const dataStr = JSON.stringify({personas, gastos}, null, 2);
    const blob = new Blob([dataStr], {type: "application/json"});
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "gastos.json";
    a.click();
}

function importar(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = function(e) {
        const data = JSON.parse(e.target.result);
        personas = data.personas;
        gastos = data.gastos;

        guardar();
        render();
    };

    reader.readAsText(file);
}
function nuevo() {
    document.getElementById("modalConfirm").style.display = "block";

    guardar();
    render();

    document.getElementById("resultado").innerHTML = "";
}

function cerrarModal() {
    document.getElementById("modalConfirm").style.display = "none";
}

function confirmarNuevo() {
    personas = [];
    gastos = [];

    guardar();
    render();

    document.getElementById("resultado").innerHTML = "";

    cerrarModal();
}

