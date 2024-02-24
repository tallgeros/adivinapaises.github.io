const botonera = document.getElementById("boton");
let cantPalabrasJugadas = 0;
let intentosRestantes = 3
let posActual;
let arrayPalabraActual;
letrasIngresadas = [];
let cantPartidasJugadas = -1;
botonera.addEventListener("click", comienzo);
function comienzo() {
  // Generar nuevos valores para continente y país
  const indiceContinente = Math.floor(Math.random() * ContinentesPaises.length);
  const continenteSeleccionado = ContinentesPaises[indiceContinente];
  const indicePais = Math.floor(Math.random() * continenteSeleccionado.paises.length);
  const paisSeleccionado = continenteSeleccionado.paises[indicePais];
  this.textContent = "Nueva Palabra"
  if (cantPartidasJugadas >= 5) {
    alert("¡Has alcanzado el límite de 5 partidas!");
    return;

  }
  let intentosRestantes = 3;
  cantPartidasJugadas++;
  actualizarJugadas();
  // Reiniciar otros elementos y variables
  intentosRestantes = 3;
  letrasIngresadas = [];
  document.getElementById("letrasIngresadas").textContent = "";
  document.getElementById("intentos").textContent = intentosRestantes;
  document.getElementById("inputLetra").textContent = ""
  cantPalabrasJugadas++;

  // Cargar nueva palabra
  cargarNuevaPalabra(paisSeleccionado, continenteSeleccionado.continente);
}
// Agregar event listener para verificar letra ingresada por teclado
document.addEventListener("keydown", function (event) {
  const letraIngresada = event.key.toUpperCase();
  if (isLetter(letraIngresada)) {
    verificarLetra(letraIngresada);
  }
});

// Agregar event listener para verificar letra ingresada en dispositivo móvil
document.getElementById("inputLetra").addEventListener("input", function (event) {
  const letraIngresada = event.target.value.toUpperCase();
  if (isLetter(letraIngresada)) {
    verificarLetra(letraIngresada);
    // Limpiar el campo de entrada después de cada intento
    this.value = "";
  }
});

function cargarNuevaPalabra(pais, continente) {
  posActual = pais.toUpperCase();
  arrayPalabraActual = posActual.split('');
  document.getElementById("ayuda").textContent = " " + " " + continente;
  document.getElementById("palabra").innerHTML = "";
  for (let i = 0; i < arrayPalabraActual.length; i++) {
    const divLetra = document.createElement("div");
    divLetra.className = "letra";
    document.getElementById("palabra").appendChild(divLetra);
  }
}
function actualizarJugadas() {
  const jugadasElement = document.getElementById("jugadas");
  jugadasElement.textContent = " " + `Partida  ${cantPartidasJugadas}/5`;
}

cantPartidasJugadas++;
actualizarJugadas();

function verificarLetra(letra) {
  if (isLetter(letra)) {
    if (letrasIngresadas.lastIndexOf(letra.toUpperCase()) === -1) {
      let acerto = false;

      acerto = verificarAcierto(letra.toUpperCase());

      if (!acerto) {
        manejarError(letra.toUpperCase());
      }

      actualizarLetrasIngresadas(letra.toUpperCase(), acerto);

      if (verificarVictoria()) {
        manejarVictoria();
      }
    }
  }
}



function verificarAcierto(letra) {
  let acerto = false;
  for (let i = 0; i < arrayPalabraActual.length; i++) {
    if (arrayPalabraActual[i] === letra) {
      document.getElementsByClassName("letra")[i].textContent = letra;
      document.getElementsByClassName("letra")[i].classList.add("pintar");
      acerto = true;
    }
  }
  return acerto;
}

function manejarError(letra) {
 if(intentosRestantes > 0){
    // Restar un intento
    intentosRestantes--;
    // Actualizar el contador de intentos en la interfaz
    document.getElementById("intentos").textContent = intentosRestantes;
 }
  if (intentosRestantes === 0) {
    const modal = document.getElementById("modal");
    const modalMessage = document.getElementById("modal-message");
    modalMessage.textContent = "¡Perdiste! La palabra era: " + arrayPalabraActual.join("");
    modal.style.display = "block";
    intentosRestantes = 3;
    // Cuando se haga clic en la X, ocultar el modal
    const closeModal = document.getElementsByClassName("close")[0];
    closeModal.onclick = function () {
      modal.style.display = "none";
    }
  }
}

let letrasIngresadasElement = document.getElementById("letrasIngresadas");

function actualizarLetrasIngresadas(letra, acerto) {
  const letrasIngresadasElement = document.getElementById("letrasIngresadas");
  const nuevaLetra = document.createElement("span");
  nuevaLetra.textContent = letra + " - ";
  if (acerto) {
    nuevaLetra.style.color = "green"; // Color verde para aciertos
  } else {
    nuevaLetra.style.color = "red"; // Color rojo para errores
  }
  letrasIngresadasElement.appendChild(nuevaLetra);
}


function verificarVictoria() {
  const palabraAdivinada = document.getElementById("palabra").innerText.replace(/\s/g, "").toUpperCase();
  const palabraActualSinEspacios = arrayPalabraActual.join("").replace(/\s/g, "");
  return palabraAdivinada === palabraActualSinEspacios;
}


function manejarVictoria() {
  const modal = document.getElementById("modal");
  const modalMessage = document.getElementById("modal-message");
  modalMessage.textContent = "¡Ganaste!" + "" + "Felicidades";
  modal.style.display = "block";

  // Cuando se haga clic en la X, ocultar el modal
  const closeModal = document.getElementsByClassName("close")[0];
  closeModal.onclick = function () {
    modal.style.display = "none";
  }
  intentosRestantes = "";
}

function isLetter(str) {
  return str && str.length === 1 && str.match(/[a-z]/i);
}
