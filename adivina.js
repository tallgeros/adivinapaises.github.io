const botonera = document.getElementById("boton");
let cantPalabrasJugadas = 0;
let intentosRestantes = 3;
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
  if (cantPartidasJugadas >= 5) {
    alert("¡Has alcanzado el límite de 5 partidas!");
    return;
  }

  cantPartidasJugadas++;
  actualizarJugadas();
  // Reiniciar otros elementos y variables
  intentosRestantes = 3;
  letrasIngresadas = [];
  document.getElementById("letrasIngresadas").textContent = "";
  document.getElementById("intentos").textContent = intentosRestantes;
  cantPalabrasJugadas++;

  // Cargar nueva palabra
  cargarNuevaPalabra(paisSeleccionado, continenteSeleccionado.continente);
  
  // Agregar event listener para verificar letra
  document.addEventListener("keydown", verificarLetra);
}

function cargarNuevaPalabra(pais, continente) {
  posActual = pais.toUpperCase();
  arrayPalabraActual = posActual.split('');
  document.getElementById("ayuda").textContent =" "+" " + continente;
  document.getElementById("palabra").innerHTML = "";
  for (let i = 0; i < arrayPalabraActual.length; i++) {
    const divLetra = document.createElement("div");
    divLetra.className = "letra";
    document.getElementById("palabra").appendChild(divLetra);
  }
}
function actualizarJugadas() {
  const jugadasElement = document.getElementById("jugadas");
  jugadasElement.textContent =" " + `Partida  ${cantPartidasJugadas}/5`;
}

cantPartidasJugadas++;
actualizarJugadas();

function verificarLetra(event) {
   let letraIngresada;
  
  // Verificar si se presionó una tecla
  if (isLetter(event.key)) {
    letraIngresada = event.key.toUpperCase();
  } else {
    // Si no se presionó una tecla, verificar el contenido del campo de entrada
    letraIngresada = document.getElementById("inputLetra")
    .addEventListener("keypress").value.trim().toUpperCase().focus();
  }

  // Verificar si la letra ingresada no ha sido ingresada antes
  if (letraIngresada.lastIndexOf(letraIngresada) === -1) {
    let acierto = verificarAcierto(letraIngresada);

    if (!acierto) {
      manejarError(letraIngresada);
    }

    actualizarLetrasIngresadas(letraIngresada, acierto);

    if (verificarVictoria()) {
      manejarVictoria();
    }

    // Limpiar el campo de entrada después de verificar la letra
    document.getElementById("inputLetra").value = "";
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
  intentosRestantes--;
  document.getElementById("intentos").textContent = intentosRestantes;

  if (intentosRestantes === 0) {
    for (let i = 0; i < arrayPalabraActual.length; i++) {
      document
        .getElementsByClassName("letra")
        [i].classList.add("pintarError");
    }
    document.removeEventListener("keydown", verificarLetra);
    alert("¡Perdiste! La palabra era: " + arrayPalabraActual);
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
  for (let i = 0; i < arrayPalabraActual.length; i++) {
    document.getElementsByClassName("letra")[i].classList.add("pintar");
  }
  document.removeEventListener("keydown", verificarLetra);
  alert("¡Ganaste!");
}

function isLetter(str) {
  return str.length === 1 && str.match(/[a-z]/i);
}
