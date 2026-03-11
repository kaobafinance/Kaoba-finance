// Elementos del DOM
const precioInput = document.getElementById("precio");
const entradaInput = document.getElementById("entrada");
const tipoViviendaInput = document.getElementById("tipoVivienda");
const titularesInput = document.getElementById("titulares");
const edad1Input = document.getElementById("edad1");
const edad2Input = document.getElementById("edad2");
const deuda1Input = document.getElementById("deuda1");
const deuda2Input = document.getElementById("deuda2");
const añosInput = document.getElementById("años");
const salarioInput = document.getElementById("salario");
const comunidadInput = document.getElementById("comunidad");

const capitalOut = document.getElementById("capital");
const cuotaOut = document.getElementById("cuota");
const interesesOut = document.getElementById("intereses");
const entradaTotalOut = document.getElementById("entradaTotal");
const sueldoOut = document.getElementById("sueldo");
const ltiOut = document.getElementById("lti");
const compatibleOut = document.getElementById("compatible");
const plazoEdadMaxOut = document.getElementById("plazoEdadMax");

const verTablaBtn = document.getElementById("verTabla");
const tablaContainer = document.getElementById("tablaContainer");
const tbody = document.querySelector("#tabla tbody");

const edadTitular2Div = document.getElementById("edadTitular2");
const deudaTitular2Div = document.getElementById("deudaTitular2");

// Mostrar/ocultar segundo titular
titularesInput.addEventListener("change", () => {
  if (titularesInput.value === "2") {
    edadTitular2Div.style.display = "block";
    deudaTitular2Div.style.display = "block";
  } else {
    edadTitular2Div.style.display = "none";
    deudaTitular2Div.style.display = "none";
  }
  calcular();
});

// Ocultar comunidad si es obra nueva
tipoViviendaInput.addEventListener("change", () => {
  if (tipoViviendaInput.value === "obraNueva") {
    comunidadInput.parentElement.style.display = "none";
  } else {
    comunidadInput.parentElement.style.display = "block";
  }
  calcular();
});

// Debounce para no recalcular demasiado rápido
function debounce(func, wait = 300) {
  let timeout;
  return function() {
    clearTimeout(timeout);
    timeout = setTimeout(func, wait);
  }
}

const inputs = [precioInput, entradaInput, tipoViviendaInput, titularesInput,
                edad1Input, edad2Input, deuda1Input, deuda2Input,
                añosInput, salarioInput, comunidadInput];
inputs.forEach(input => input.addEventListener("input", debounce(calcular)));

// Formatear dinero
function formatMoney(n) {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(n);
}

// Calcular máximo plazo según edad del mayor titular
function maxPlazoPorEdad() {
  let edades = [parseInt(edad1Input.value) || 18];
  if (titularesInput.value === "2") edades.push(parseInt(edad2Input.value) || 18);
  const mayor = Math.max(...edades);
  const maxAños = Math.min(30, 75 - mayor);
  plazoEdadMaxOut.innerText = `Plazo máximo según edad: ${maxAños} años`;
  return maxAños;
}

// Función principal de cálculo
function calcular() {
  let precio = parseFloat(precioInput.value) || 0;
  let entrada = parseFloat(entradaInput.value) || 0;
  let tipo = tipoViviendaInput.value;
  let años = parseFloat(añosInput.value) || 30;
  let salario = parseFloat(salarioInput.value) || 0;
  let interes = parseFloat(document.getElementById("interes").value)/100/12 || 0;
  let comunidad = parseFloat(comunidadInput.value) || 0;

  // Validar plazo según edad
  const maxPlazo = maxPlazoPorEdad();
  if (años > maxPlazo) años = maxPlazo;

  // Gastos según tipo de vivienda
  let gastos;
  if (tipo === "obraNueva") {
    gastos = precio * 0.10 + 2500; // IVA 10% + escrituras
  } else {
    gastos = precio * comunidad + 2500; // ITP + escrituras
  }

  const entradaCasa = Math.min(entrada, gastos);
  const capital = precio - (entrada - entradaCasa);

  const n = años * 12;
  const cuota = capital*(interes*Math.pow(1+interes,n))/(Math.pow(1+interes,n)-1);
  const totalIntereses = cuota*n - capital;

  // Deudas mensuales
  let deudaTotal = parseFloat(deuda1Input.value) || 0;
  if (titularesInput.value === "2") deudaTotal += parseFloat(deuda2Input.value) || 0;

  // Mostrar resultados
  capitalOut.innerText = formatMoney(capital);
  cuotaOut.innerText = formatMoney(cuota);
  interesesOut.innerText = formatMoney(totalIntereses);
  entradaTotalOut.innerText = formatMoney(entrada + gastos);

  // LTI: cuota + deudas vs salario
  const ltiVal = (cuota + deudaTotal) * 12 / salario;
  ltiOut.innerText = (ltiVal*100).toFixed(1) + "%";

  if (ltiVal <= 0.35) compatibleOut.innerText = "Compatible";
  else if (ltiVal <= 0.40) compatibleOut.innerText = "Aceptable";
  else compatibleOut.innerText = "No viable";

  // % Financiación
  const ltv = (capital/precio*100).toFixed(1);
  document.getElementById("ltv").innerText = ltv + "%";

  // Salario mínimo recomendado
  sueldoOut.innerText = formatMoney((cuota + deudaTotal)/0.35*12);

  // Resumen máximo precio según salario
  const maxCapital = (salario*0.35/12 - deudaTotal) * n;
  const maxPrecio = maxCapital + entradaCasa;
  document.getElementById("resumen").innerText =
    `Con tu salario neto anual de ${formatMoney(salario)}, podrías permitirte una vivienda de hasta ${formatMoney(maxPrecio)} con LTI ≤35%`;
}

// Generar tabla de amortización
let amortizacionGenerada = false;
function generarTabla(){
  if(amortizacionGenerada) return;
  tbody.innerHTML = "";

  let precio = parseFloat(precioInput.value) || 0;
  let entrada = parseFloat(entradaInput.value) || 0;
  let tipo = tipoViviendaInput.value;
  let años = parseFloat(añosInput.value) || 30;
  let interes = parseFloat(document.getElementById("interes").value)/100/12 || 0;
  let comunidad = parseFloat(comunidadInput.value) || 0;

  // Gastos
  let gastos = (tipo === "obraNueva") ? precio*0.10 + 2500 : precio*comunidad + 2500;
  let entradaCasa = Math.min(entrada, gastos);
  let capital = precio - (entrada - entradaCasa);

  const n = años*12;
  const cuota = capital*(interes*Math.pow(1+interes,n))/(Math.pow(1+interes,n)-1);
  let saldo = capital;

  for(let i=1;i<=n;i++){
    let interesMes = saldo*interes;
    let capitalMes = cuota - interesMes;
    saldo -= capitalMes;

    let row = `<tr>
      <td>${i}</td>
      <td>${formatMoney(cuota)}</td>
      <td>${formatMoney(interesMes)}</td>
      <td>${formatMoney(capitalMes)}</td>
      <td>${formatMoney(Math.max(saldo,0))}</td>
    </tr>`;
    tbody.innerHTML += row;
  }
  amortizacionGenerada = true;
}

// Mostrar/ocultar tabla
verTablaBtn.addEventListener("click", () => {
  tablaContainer.style.display = (tablaContainer.style.display === "none") ? "block" : "none";
  if(tablaContainer.style.display === "block") generarTabla();
});

// Inicial
calcular();
