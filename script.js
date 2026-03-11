// Inputs principales
const precioInput = document.getElementById("precio");
const entradaInput = document.getElementById("entrada");
const interesInput = document.getElementById("interes");
const añosInput = document.getElementById("años");
const tipoViviendaInput = document.getElementById("tipoVivienda");
const comunidadInput = document.getElementById("comunidad");
const comunidadContainer = document.getElementById("comunidadContainer");
const salarioInput = document.getElementById("salario");
const titularesInput = document.getElementById("titulares");
const edad1Input = document.getElementById("edad1");
const edad2Input = document.getElementById("edad2");
const edadTitular2Div = document.getElementById("edadTitular2");
const deuda1Input = document.getElementById("deuda1");
const deuda2Input = document.getElementById("deuda2");
const deudaTitular2Div = document.getElementById("deudaTitular2");

// Outputs
const capitalOut = document.getElementById("capital");
const cuotaOut = document.getElementById("cuota");
const interesesOut = document.getElementById("intereses");
const sueldoOut = document.getElementById("sueldo");
const ltiOut = document.getElementById("lti");
const ltvOut = document.getElementById("ltv");
const entradaTotalOut = document.getElementById("entradaTotal");
const compatibleOut = document.getElementById("compatible");
const resumenOut = document.getElementById("resumen");

// Tabla
const verTablaBtn = document.getElementById("verTabla");
const tablaContainer = document.getElementById("tablaContainer");
const tbody = document.querySelector("#tabla tbody");

// Variables
let amortizacionGenerada = false;

// Función para formatear moneda
function formatMoney(n){
  return new Intl.NumberFormat('es-ES',{style:'currency',currency:'EUR'}).format(n);
}

// Mostrar / ocultar comunidad según tipo de vivienda
tipoViviendaInput.addEventListener("change", function() {
  if(tipoViviendaInput.value === "obraNueva"){
    comunidadContainer.style.display = "none";
  } else {
    comunidadContainer.style.display = "block";
  }
});

// Mostrar / ocultar segundo titular
titularesInput.addEventListener("change", function() {
  if(titularesInput.value === "2"){
    edadTitular2Div.style.display = "block";
    deudaTitular2Div.style.display = "block";
  } else {
    edadTitular2Div.style.display = "none";
    deudaTitular2Div.style.display = "none";
  }
});

// Debounce para no recalcular con cada tecla
function debounce(func, wait) {
  let timeout;
  return function() {
    clearTimeout(timeout);
    timeout = setTimeout(func, wait);
  }
}

// Inputs que afectan cálculo
const inputs = [precioInput, entradaInput, interesInput, añosInput, tipoViviendaInput, comunidadInput,
                salarioInput, titularesInput, edad1Input, edad2Input, deuda1Input, deuda2Input];

inputs.forEach(i => i.addEventListener("input", debounce(calcular, 300)));

// Función principal de cálculo
function calcular(){
  let precio = parseFloat(precioInput.value) || 0;
  let ahorro = parseFloat(entradaInput.value) || 0;
  let interes = parseFloat(interesInput.value)/100/12 || 0;
  let años = parseFloat(añosInput.value) || 0;
  let salario = parseFloat(salarioInput.value) || 0;
  let titulares = parseInt(titularesInput.value) || 1;
  let edad1 = parseInt(edad1Input.value) || 0;
  let edad2 = parseInt(edad2Input.value) || 0;
  let deuda1 = parseFloat(deuda1Input.value) || 0;
  let deuda2 = parseFloat(deuda2Input.value) || 0;

  // Determinar impuesto según tipo de vivienda
  let impuestos = 0;
  if(tipoViviendaInput.value === "obraNueva"){
    impuestos = 0.10; // IVA 10%
  } else {
    impuestos = parseFloat(comunidadInput.value) || 0; // ITP
  }

  // Gastos + impuestos
  let gastos = precio * impuestos + 2500;
  let entradaCasa = Math.max(0, ahorro - gastos);
  let capital = precio - entradaCasa;

  // Plazo máximo según edad del mayor
  let mayorEdad = titulares === 2 ? Math.max(edad1, edad2) : edad1;
  let maxAnios = 75 - mayorEdad;
  if(años > maxAnios) años = maxAnios;
  document.getElementById("plazoEdadMax").innerText = `Plazo máximo según edad: ${maxAnios} años`;

  let n = años*12;
  let cuota = capital*(interes*Math.pow(1+interes,n))/(Math.pow(1+interes,n)-1);
  let totalIntereses = cuota*n - capital;

  // LTV
  let ltv = capital / precio * 100;

  // Ratio de endeudamiento (LTI)
  let totalDeudasMensuales = deuda1 + (titulares===2 ? deuda2 : 0);
  let ltiVal = (cuota + totalDeudasMensuales) * 12 / salario;

  // Mostrar resultados
  capitalOut.innerText = formatMoney(capital);
  cuotaOut.innerText = formatMoney(cuota);
  interesesOut.innerText = formatMoney(totalIntereses);
  entradaTotalOut.innerText = formatMoney(entradaCasa + gastos);
  ltvOut.innerText = ltv.toFixed(1) + "%";
  ltiOut.innerText = (ltiVal*100).toFixed(1) + "%";

  // Compatible con salario
  if(ltiVal <= 0.35){
    compatibleOut.innerText = "Compatible";
    compatibleOut.style.color = "green";
  } else if(ltiVal <= 0.40){
    compatibleOut.innerText = "Aceptable";
    compatibleOut.style.color = "orange";
  } else {
    compatibleOut.innerText = "No viable";
    compatibleOut.style.color = "red";
  }

  // Resumen máximo precio posible según salario y deudas
  let maxCapital = (salario*0.35/12 - totalDeudasMensuales) * n;
  let maxPrecio = maxCapital + entradaCasa;
  resumenOut.innerText = `Con tu salario neto anual de ${formatMoney(salario)} y tus deudas mensuales, podrías permitirte una vivienda de hasta ${formatMoney(maxPrecio)} con LTI ≤35%`;

  amortizacionGenerada = false;
}

// Función tabla de amortización
function toggleTabla(){
  tablaContainer.style.display = tablaContainer.style.display==="none" ? "block" : "none";
  if(tablaContainer.style.display==="block") generarTabla();
}

function generarTabla(){
  if(amortizacionGenerada) return;
  tbody.innerHTML = "";

  let precio = parseFloat(precioInput.value) || 0;
  let ahorro = parseFloat(entradaInput.value) || 0;
  let interes = parseFloat(interesInput.value)/100/12 || 0;
  let años = parseFloat(añosInput.value) || 0;
  let salario = parseFloat(salarioInput.value) || 0;
  let titulares = parseInt(titularesInput.value) || 1;
  let edad1 = parseInt(edad1Input.value) || 0;
  let edad2 = parseInt(edad2Input.value) || 0;

  // Impuestos
  let impuestos = tipoViviendaInput.value === "obraNueva" ? 0.10 : parseFloat(comunidadInput.value) || 0;

  let gastos = precio * impuestos + 2500;
  let entradaCasa = Math.max(0, ahorro - gastos);
  let capital = precio - entradaCasa;

  // Plazo máximo
  let mayorEdad = titulares === 2 ? Math.max(edad1, edad2) : edad1;
  let maxAnios = 75 - mayorEdad;
  if(años > maxAnios) años = maxAnios;

  let n = años*12;
  let cuota = capital*(interes*Math.pow(1+interes,n))/(Math.pow(1+interes,n)-1);
  let saldo = capital;

  for(let i=1;i<=n;i++){
    let interesMes = saldo*interes;
    let capitalMes = cuota - interesMes;
    saldo -= capitalMes;
    tbody.innerHTML += `<tr>
      <td>${i}</td>
      <td>${formatMoney(cuota)}</td>
      <td>${formatMoney(interesMes)}</td>
      <td>${formatMoney(capitalMes)}</td>
      <td>${formatMoney(Math.max(saldo,0))}</td>
    </tr>`;
  }

  amortizacionGenerada = true;
}

// Eventos tabla
verTablaBtn.addEventListener("click", toggleTabla);

// Inicial
calcular();
