// script.js

// Inputs
const precioInput = document.getElementById("precio");
const entradaInput = document.getElementById("entrada");
const interesInput = document.getElementById("interes");
const añosInput = document.getElementById("años");
const comunidadInput = document.getElementById("comunidad");
const salarioInput = document.getElementById("salario");
const titularesInput = document.getElementById("titulares");
const edad1Input = document.getElementById("edad1");
const edad2Input = document.getElementById("edad2");
const edadTitular2Div = document.getElementById("edadTitular2");
const plazoEdadMaxP = document.getElementById("plazoEdadMax");

// Outputs
const capitalOut = document.getElementById("capital");
const cuotaOut = document.getElementById("cuota");
const interesesOut = document.getElementById("intereses");
const entradaTotalOut = document.getElementById("entradaTotal");
const sueldoOut = document.getElementById("sueldo");
const ltiOut = document.getElementById("lti");
const compatibleOut = document.getElementById("compatible");
const tablaContainer = document.getElementById("tablaContainer");
const tbody = document.querySelector("#tabla tbody");

// Mostrar u ocultar segundo titular
titularesInput.addEventListener("change", () => {
  if (titularesInput.value === "2") {
    edadTitular2Div.style.display = "block";
  } else {
    edadTitular2Div.style.display = "none";
    edad2Input.value = "";
  }
  calcular();
});

// Formato de moneda
function formatMoney(n) {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(n);
}

// Debounce para no recalcular demasiado rápido
function debounce(func, wait = 300) {
  let timeout;
  return function () {
    clearTimeout(timeout);
    timeout = setTimeout(func, wait);
  }
}

// Event listeners
[precioInput, entradaInput, interesInput, añosInput, comunidadInput, salarioInput, edad1Input, edad2Input].forEach(i => {
  i.addEventListener("input", debounce(calcular, 300));
});
document.getElementById("verTabla").addEventListener("click", toggleTabla);

let amortizacionGenerada = false;

// Función principal de cálculo
function calcular() {
  let precio = parseFloat(precioInput.value) || 0;
  let ahorro = parseFloat(entradaInput.value) || 0;
  let interes = parseFloat(interesInput.value) / 100 / 12 || 0;
  let salario = parseFloat(salarioInput.value) || 0;

  // Edad mayor
  let edad1 = parseInt(edad1Input.value) || 0;
  let edad2 = parseInt(edad2Input.value) || 0;
  let edadMayor = Math.max(edad1, edad2 || 0);

  // Plazo máximo según edad
  let plazoMaxEdad = Math.max(0, 75 - edadMayor);
  plazoEdadMaxP.innerText = `Plazo máximo según edad del mayor: ${plazoMaxEdad} años`;

  // Plazo años
  let años = parseInt(añosInput.value) || 30;
  if (años > plazoMaxEdad) años = plazoMaxEdad;

  let n = años * 12;

  // Gastos + ITP
  let gastos = precio * parseFloat(comunidadInput.value) + 2500;
  let entradaCasa = Math.max(0, ahorro - gastos);
  let capital = precio - entradaCasa;

  // Cuota y total intereses
  let cuota = capital > 0 && n > 0 ? capital * (interes * Math.pow(1 + interes, n)) / (Math.pow(1 + interes, n) - 1) : 0;
  let totalIntereses = cuota * n - capital;

  // Salidas
  capitalOut.innerText = formatMoney(capital);
  cuotaOut.innerText = formatMoney(cuota);
  interesesOut.innerText = formatMoney(totalIntereses);
  entradaTotalOut.innerText = formatMoney(entradaCasa + gastos);

  // Sueldo recomendado
  let sueldo = cuota / 0.35 * 12;
  sueldoOut.innerText = formatMoney(sueldo);

  // LTI y compatibilidad
  let lti = salario > 0 ? cuota * 12 / salario : 0;
  ltiOut.innerText = (lti * 100).toFixed(1) + "%";

  if (lti <= 0.35) ltiOut.style.color = "green";
  else if (lti <= 0.40) ltiOut.style.color = "orange";
  else ltiOut.style.color = "red";

  if (lti <= 0.35) {
    compatibleOut.innerText = "Compatible";
    compatibleOut.style.color = "green";
  } else if (lti <= 0.40) {
    compatibleOut.innerText = "Aceptable";
    compatibleOut.style.color = "orange";
  } else {
    compatibleOut.innerText = "No viable";
    compatibleOut.style.color = "red";
  }

  // % Financiación (LTV)
  let ltv = precio > 0 ? (capital / precio) * 100 : 0;
  document.getElementById("ltv").innerText = ltv.toFixed(1) + "%";

  // Resumen rápido
  let maxCapital = salario * 0.35 / 12 * n;
  let maxPrecio = maxCapital + entradaCasa;
  document.getElementById("resumen").innerText = `Con tu salario neto anual de ${formatMoney(salario)}, podrías permitirte una vivienda de hasta ${formatMoney(maxPrecio)} con LTI ≤35%`;

  amortizacionGenerada = false;
}

// Tabla de amortización
function toggleTabla() {
  tablaContainer.style.display = tablaContainer.style.display === "none" ? "block" : "none";
  if (tablaContainer.style.display === "block") generarTabla();
}

function generarTabla() {
  if (amortizacionGenerada) return;
  tbody.innerHTML = "";

  let precio = parseFloat(precioInput.value) || 0;
  let ahorro = parseFloat(entradaInput.value) || 0;
  let interes = parseFloat(interesInput.value) / 100 / 12 || 0;

  let edad1 = parseInt(edad1Input.value) || 0;
  let edad2 = parseInt(edad2Input.value) || 0;
  let edadMayor = Math.max(edad1, edad2 || 0);
  let plazoMaxEdad = Math.max(0, 75 - edadMayor);
  let años = parseInt(añosInput.value) || 30;
  if (años > plazoMaxEdad) años = plazoMaxEdad;
  let n = años * 12;

  let gastos = precio * parseFloat(comunidadInput.value) + 2500;
  let entradaCasa = Math.max(0, ahorro - gastos);
  let capital = precio - entradaCasa;

  let cuota = capital > 0 && n > 0 ? capital * (interes * Math.pow(1 + interes, n)) / (Math.pow(1 + interes, n) - 1) : 0;
  let saldo = capital;

  for (let i = 1; i <= n; i++) {
    let interesMes = saldo * interes;
    let capitalMes = cuota - interesMes;
    saldo -= capitalMes;
    tbody.innerHTML += `
      <tr>
        <td>${i}</td>
        <td>${formatMoney(cuota)}</td>
        <td>${formatMoney(interesMes)}</td>
        <td>${formatMoney(capitalMes)}</td>
        <td>${formatMoney(Math.max(saldo, 0))}</td>
      </tr>`;
  }

  amortizacionGenerada = true;
}

// Inicial
calcular();
