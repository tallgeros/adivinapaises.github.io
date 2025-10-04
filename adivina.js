const botonera = document.getElementById("boton");
let cantPartidasJugadas = 0;
let intentosRestantes = 3;
let posActual;
let arrayPalabraActual;
let letrasIngresadas = [];

// Función para normalizar texto (quita tildes y convierte a mayúsculas)
function normalizarTexto(texto) {
  return texto.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

// Event listener del botón (solo se añade una vez)
botonera.addEventListener("click", comienzo);

// Event listener para teclado (solo se añade una vez)
document.addEventListener("keydown", function (event) {
  const letraIngresada = event.key.toUpperCase();
  if (isLetter(letraIngresada)) {
    verificarLetra(letraIngresada);
  }
});

// Event listener para móvil (solo se añade una vez)
document.getElementById("inputLetra").addEventListener("input", function (event) {
  const letraIngresada = event.target.value.toUpperCase();
  if (isLetter(letraIngresada)) {
    verificarLetra(letraIngresada);
    this.value = "";
  }
});

function comienzo() {
  // Verificar límite de partidas
  if (cantPartidasJugadas >= 5) {
    mostrarModal("limite");
    return;
  }

  // Generar nuevos valores para continente y país
  const indiceContinente = Math.floor(Math.random() * ContinentesPaises.length);
  const continenteSeleccionado = ContinentesPaises[indiceContinente];
  const indicePais = Math.floor(Math.random() * continenteSeleccionado.paises.length);
  const paisSeleccionado = continenteSeleccionado.paises[indicePais];

  this.textContent = "Nueva Palabra";

  // Incrementar partidas
  cantPartidasJugadas++;
  actualizarJugadas();

  // Reiniciar variables del juego
  intentosRestantes = 3;
  letrasIngresadas = [];
  document.getElementById("letrasIngresadas").textContent = "";
  document.getElementById("intentos").textContent = intentosRestantes;
  document.getElementById("inputLetra").value = "";

  // Cargar nueva palabra
  cargarNuevaPalabra(paisSeleccionado, continenteSeleccionado.continente);
}

function cargarNuevaPalabra(pais, continente) {
  // Normalizar el país para comparaciones
  posActual = normalizarTexto(pais);
  arrayPalabraActual = posActual.split('');
  
  document.getElementById("ayuda").textContent = continente;
  document.getElementById("palabra").innerHTML = "";
  
  for (let i = 0; i < arrayPalabraActual.length; i++) {
    const divLetra = document.createElement("div");
    // ✅ CORREGIDO: Espacios quedan vacíos (sin borde)
    if (arrayPalabraActual[i] === ' ') {
      divLetra.className = "espacio";
    } else {
      divLetra.className = "letra";
    }
    document.getElementById("palabra").appendChild(divLetra);
  }
}

function actualizarJugadas() {
  const jugadasElement = document.getElementById("jugadas");
  jugadasElement.textContent = `${cantPartidasJugadas}/5`;
}

function verificarLetra(letra) {
  // Normalizar letra ingresada
  const letraNormalizada = normalizarTexto(letra);
  
  if (isLetter(letra)) {
    // ✅ CORREGIDO: Verificar si la letra YA fue intentada
    if (letrasIngresadas.includes(letraNormalizada)) {
      return; // Salir si ya fue ingresada
    }

    // ✅ Agregar letra INMEDIATAMENTE al array
    letrasIngresadas.push(letraNormalizada);

    let acerto = false;
    acerto = verificarAcierto(letraNormalizada);

    if (!acerto) {
      manejarError(letraNormalizada);
    }

    actualizarLetrasIngresadas(letraNormalizada, acerto);

    // ✅ Verificar victoria solo si quedan intentos
    if (intentosRestantes > 0 && verificarVictoria()) {
      manejarVictoria();
    }
  }
}

function verificarAcierto(letra) {
  let acerto = false;
  for (let i = 0; i < arrayPalabraActual.length; i++) {
    if (arrayPalabraActual[i] === letra) {
      const elementos = document.querySelectorAll("#palabra > div");
      elementos[i].textContent = letra;
      elementos[i].classList.add("pintar");
      acerto = true;
    }
  }
  return acerto;
}

function manejarError(letra) {
  // Primero verificar si quedan intentos, LUEGO restar
  if (intentosRestantes > 0) {
    intentosRestantes--;
    document.getElementById("intentos").textContent = intentosRestantes;
  }

  // Verificar derrota después de restar
  if (intentosRestantes === 0) {
    mostrarModal("derrota", posActual);
  }
}

function actualizarLetrasIngresadas(letra, acerto) {
  const letrasIngresadasElement = document.getElementById("letrasIngresadas");
  const nuevaLetra = document.createElement("span");
  nuevaLetra.textContent = letra + " ";
  
  if (acerto) {
    nuevaLetra.style.color = "#02bfa4";
    nuevaLetra.style.fontWeight = "bold";
  } else {
    nuevaLetra.style.color = "#ff4444";
    nuevaLetra.style.fontWeight = "bold";
  }
  
  letrasIngresadasElement.appendChild(nuevaLetra);
}

function verificarVictoria() {
  let todasAdivinadas = true;
  const elementos = document.querySelectorAll("#palabra > div");
  
  for (let i = 0; i < arrayPalabraActual.length; i++) {
    // ✅ Ignorar espacios en la verificación
    if (arrayPalabraActual[i] !== ' ') {
      if (!elementos[i].classList.contains("pintar")) {
        todasAdivinadas = false;
        break;
      }
    }
  }
  
  console.log("¿Victoria?", todasAdivinadas); // Debug
  return todasAdivinadas;
}

function manejarVictoria() {
  mostrarModal("victoria");
}

// ✅ NUEVA FUNCIÓN: Modal mejorado y reutilizable
function mostrarModal(tipo, palabra = "") {
  const modal = document.getElementById("modal");
  const modalContent = document.querySelector(".modal-content");
  const modalMessage = document.getElementById("modal-message");
  const modalIcon = document.getElementById("modal-icon");
  
  // Limpiar clases anteriores
  modalContent.classList.remove("victoria", "derrota", "limite");
  
  // Configurar contenido según el tipo
  if (tipo === "victoria") {
    modalContent.classList.add("victoria");
    modalIcon.innerHTML = "🎉";
    modalMessage.innerHTML = `
      <h2>¡Felicidades!</h2>
      <p>¡Has adivinado el país correctamente!</p>
    `;
  } else if (tipo === "derrota") {
    modalContent.classList.add("derrota");
    modalIcon.innerHTML = "😔";
    modalMessage.innerHTML = `
      <h2>¡Perdiste!</h2>
      <p>La palabra era:</p>
      <strong class="palabra-correcta">${palabra}</strong>
    `;
  } else if (tipo === "limite") {
    modalContent.classList.add("limite");
    modalIcon.innerHTML = "🏁";
    modalMessage.innerHTML = `
      <h2>¡Límite alcanzado!</h2>
      <p>Has completado las 5 partidas.</p>
      <p>Recarga la página para jugar de nuevo.</p>
    `;
  }
  
  // Mostrar modal con animación
  modal.style.display = "flex";
  setTimeout(() => {
    modalContent.style.transform = "scale(1)";
    modalContent.style.opacity = "1";
  }, 10);
  
  // Cerrar modal
  const closeModal = document.querySelector(".close");
  const cerrarConClick = () => {
    modalContent.style.transform = "scale(0.7)";
    modalContent.style.opacity = "0";
    setTimeout(() => {
      modal.style.display = "none";
    }, 300);
  };
  
  closeModal.onclick = cerrarConClick;
  
  // Cerrar al hacer clic fuera del modal
  modal.onclick = function(event) {
    if (event.target === modal) {
      cerrarConClick();
    }
  };
}

function isLetter(str) {
  return str && str.length === 1 && str.match(/[a-z]/i);
}