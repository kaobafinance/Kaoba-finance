// Inputs principales
const precioInput = document.getElementById("precio");
const entradaInput = document.getElementById("entrada");
const interesInput = document.getElementById("interes");
const añosInput = document.getElementById("años");
const tipoViviendaInput = document.getElementById("tipoVivienda");
const comunidadInput = document.getElementById("comunidad");
const salarioInput = document.getElementById("salario");
const titularesInput = document.getElementById("titulares");
const edad1Input = document.getElementById("edad1");
const edad2Input = document.getElementById("edad2");
const deuda1Input = document.getElementById("deuda1");
const deuda2Input = document.getElementById("deuda2");

// Contenedores para mostrar/ocultar campos
const edadTitular2Div = document.getElementById("edadTitular2");
const deudaTitular2Div = document.getElementById("deudaTitular2");
const plazoEdadMaxP = document.getElementById("plazoEdadMax");

// Salidas
const capitalOut = document.getElementById("capital");
const cuotaOut = document.getElementById("cuota");
const interesesOut = document.getElementById("intereses");
const entradaTotalOut = document.getElementById("entradaTotal");
const sueldoOut = document.getElementById("sueldo");
const ltiOut = document.getElementById("lti");
const compatibleOut = document.getElementById("compatible");
const resumenOut = document.getElementById("resumen");
const ltvOut = document.getElementById("ltv");

// Tabla
const tablaContainer = document.getElementById("tablaContainer");
const tbody = document.querySelector("#tabla tbody");

// Debounce para inputs
function debounce(func, wait) {
  let timeout;
  return function () {
    clearTimeout(timeout);
    timeout = setTimeout(func, wait);
  }
}

// Función para formatear euros
function formatMoney(n) {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(n);
}

// Mostrar/ocultar campos según titulares y tipo de vivienda
function actualizarCampos() {
  if (titularesInput.value == "2") {
    edadTitular2Div.style.display = "block";
    deudaTitular2Div.style.display = "block";
  } else {
    edadTitular2Div.style.display = "none";
    deudaTitular2Div.style.display = "none";
    edad2Input.value = "";
    deuda2Input.value = 0;
  }

  if (tipoViviendaInput.value === "obraNueva") {
    comunidadInput.parentElement.style.display = "none";
  } else {
    comunidadInput.parentElement.style.display = "block";
  }
}

// Cálculo de hipoteca
function calcular() {
  actualizarCampos();

  let precio = parseFloat(precioInput.value) || 0;
  let entrada = parseFloat(entradaInput.value) || 0;
  let interes = parseFloat(interesInput.value) / 100 / 12 || 0;
  let años = parseFloat(añosInput.value) || 0;
  let salario = parseFloat(salarioInput.value) || 0;
  let n = años * 12;

  // Edad titular más mayor para calcular plazo máximo
  let edades = [parseInt(edad1Input.value) || 18];
  if (titularesInput.value == "2" && edad2Input.value) edades.push(parseInt(edad2Input.value));
  let edadMax = Math.max(...edades);
  let plazoMax = Math.min(75 - edadMax, 30);
  plazoEdadMaxP.innerText = `Plazo máximo recomendado según edad: ${plazoMax} años`;

  if (años > plazoMax) años = plazoMax;
  n = años * 12;

  // Gastos (ITP o IVA)
  let gastos = 2500; // escritura fija
  if (tipoViviendaInput.value === "obraNueva") gastos += precio * 0.10;
  else gastos += precio * parseFloat(comunidadInput.value);

  // Capital a financiar
  let entradaCasa = Math.max(0, entrada - gastos);
  let capital = precio - entradaCasa;

  // Cuota mensual
  let cuota = capital > 0 ? capital * (interes * Math.pow(1 + interes, n)) / (Math.pow(1 + interes, n) - 1) : 0;
  let totalIntereses = cuota * n - capital;

  // LTV
  let ltv = precio > 0 ? (capital / precio) * 100 : 0;

  // LTI considerando deudas
  let deuda1 = parseFloat(deuda1Input.value) || 0;
  let deuda2 = parseFloat(deuda2Input.value) || 0;
  let deudaTotal = deuda1 + deuda2;

  let ingresoMensual = salario / 12;
  let cuotaMax = ingresoMensual * 0.35 - deudaTotal;
  let lti = cuota * 12 / salario;

  // Máximo precio según salario y deudas
  let maxCapital = cuotaMax * n;
  let maxPrecio = maxCapital + entradaCasa;

  // Mostrar resultados
  capitalOut.innerText = formatMoney(capital);
  cuotaOut.innerText = formatMoney(cuota);
  interesesOut.innerText = formatMoney(totalIntereses);
  entradaTotalOut.innerText = formatMoney(entradaCasa + gastos);
  sueldoOut.innerText = formatMoney(cuotaMax * 12);
  ltiOut.innerText = (lti * 100).toFixed(1) + "%";
  ltvOut.innerText = ltv.toFixed(1) + "%";

  if (lti <= 0.35) compatibleOut.innerText = "Compatible", compatibleOut.style.color = "green";
  else if (lti <= 0.40) compatibleOut.innerText = "Aceptable", compatibleOut.style.color = "orange";
  else compatibleOut.innerText = "No viable", compatibleOut.style.color = "red";

  resumenOut.innerText = `Con tu salario neto anual de ${formatMoney(salario)} y tus deudas mensuales, podrías permitirte una vivienda de hasta ${formatMoney(maxPrecio)} con LTI ≤35%`;
}

// Tabla de amortización
let amortizacionGenerada = false;

function toggleTabla() {
  tablaContainer.style.display = tablaContainer.style.display === "none" ? "block" : "none";
  if (tablaContainer.style.display === "block") generarTabla();
}

function generarTabla() {
  if (amortizacionGenerada) return;
  tbody.innerHTML = "";

  let precio = parseFloat(precioInput.value) || 0;
  let entrada = parseFloat(entradaInput.value) || 0;
  let interes = parseFloat(interesInput.value) / 100 / 12 || 0;
  let años = parseFloat(añosInput.value) || 0;
  let n = años * 12;

  let gastos = 2500;
  if (tipoViviendaInput.value === "obraNueva") gastos += precio * 0.10;
  else gastos += precio * parseFloat(comunidadInput.value);

  let entradaCasa = Math.max(0, entrada - gastos);
  let capital = precio - entradaCasa;

  let cuota = capital > 0 ? capital * (interes * Math.pow(1 + interes, n)) / (Math.pow(1 + interes, n) - 1) : 0;
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
        <td>${formatMoney(Math.max(saldo,0))}</td>
      </tr>
    `;
  }
  amortizacionGenerada = true;
}

// Eventos
const allInputs = [precioInput, entradaInput, interesInput, añosInput, tipoViviendaInput, comunidadInput, salarioInput, titularesInput, edad1Input, edad2Input, deuda1Input, deuda2Input];
allInputs.forEach(input => input.addEventListener("input", debounce(calcular, 300)));
document.getElementById("verTabla").addEventListener("click", toggleTabla);

// Inicial
calcular();
