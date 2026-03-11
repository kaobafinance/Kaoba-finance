// Inputs principales
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
const interesInput = document.getElementById("interes");

// Outputs
const capitalOut = document.getElementById("capital");
const cuotaOut = document.getElementById("cuota");
const interesesOut = document.getElementById("intereses");
const entradaTotalOut = document.getElementById("entradaTotal");
const sueldoOut = document.getElementById("sueldo");
const ltiOut = document.getElementById("lti");
const compatibleOut = document.getElementById("compatible");
const plazoEdadMaxOut = document.getElementById("plazoEdadMax");

// Mostrar/ocultar segundo titular y deuda
const edadTitular2Div = document.getElementById("edadTitular2");
const deudaTitular2Div = document.getElementById("deudaTitular2");

// Tabla
const tablaContainer = document.getElementById("tablaContainer");
const tbody = document.querySelector("#tabla tbody");

// Formateo de dinero
function formatMoney(n){
  return new Intl.NumberFormat('es-ES',{style:'currency',currency:'EUR'}).format(n);
}

// Evento para mostrar/ocultar segundo titular
titularesInput.addEventListener("change", ()=>{
  if(titularesInput.value === "2"){
    edadTitular2Div.style.display = "block";
    deudaTitular2Div.style.display = "block";
  } else {
    edadTitular2Div.style.display = "none";
    deudaTitular2Div.style.display = "none";
  }
  calcular();
});

// Evento para mostrar/ocultar comunidad según tipo de vivienda
tipoViviendaInput.addEventListener("change", ()=>{
  if(tipoViviendaInput.value === "obraNueva"){
    comunidadInput.parentElement.style.display = "none";
  } else {
    comunidadInput.parentElement.style.display = "block";
  }
  calcular();
});

// Debounce para inputs
const inputs = [precioInput, entradaInput, tipoViviendaInput, titularesInput, edad1Input, edad2Input, deuda1Input, deuda2Input, añosInput, salarioInput, comunidadInput, interesInput];
inputs.forEach(i => i.addEventListener("input", ()=> setTimeout(calcular, 100)));

// Calcular máximo plazo según edad
function maxPlazoPorEdad() {
  let edades = [parseInt(edad1Input.value) || 18];
  if(titularesInput.value === "2") edades.push(parseInt(edad2Input.value) || 18);
  const mayor = Math.max(...edades);
  const maxAños = Math.min(30, 75 - mayor); // nunca más de 30 años
  plazoEdadMaxOut.innerText = `Plazo máximo según edad: ${maxAños} años`;
  
  if(parseInt(añosInput.value) > maxAños) añosInput.value = maxAños;
  return maxAños;
}

// Función principal de cálculo
function calcular(){
  const precio = parseFloat(precioInput.value) || 0;
  const ahorro = parseFloat(entradaInput.value) || 0;
  const interes = (parseFloat(interesInput.value)/100)/12 || 0;
  const años = parseFloat(añosInput.value) || 0;
  const salario = parseFloat(salarioInput.value) || 0;
  const comunidad = parseFloat(comunidadInput.value) || 0;

  // Gastos según tipo de vivienda
  let gastos = tipoViviendaInput.value === "obraNueva" ? precio*0.10 + 2500 : precio*comunidad + 2500;
  let entradaCasa = Math.max(0, ahorro - gastos);
  let capital = precio - entradaCasa;
  let n = años * 12;

  // Cuota mensual
  const cuota = capital*(interes*Math.pow(1+interes,n))/(Math.pow(1+interes,n)-1);
  const totalIntereses = cuota*n - capital;

  // Salidas
  capitalOut.innerText = formatMoney(capital);
  cuotaOut.innerText = formatMoney(cuota);
  interesesOut.innerText = formatMoney(totalIntereses);
  entradaTotalOut.innerText = formatMoney(entradaCasa + gastos);

  // Máximo plazo según edad
  maxPlazoPorEdad();

  // Total de deudas mensuales
  let deudaTotal = parseFloat(deuda1Input.value) || 0;
  if(titularesInput.value === "2") deudaTotal += parseFloat(deuda2Input.value) || 0;

  // LTI considerando deudas
  const ltiVal = ((cuota*12) + (deudaTotal*12)) / salario;
  ltiOut.innerText = (ltiVal*100).toFixed(1) + "%";
  compatibleOut.innerText = ltiVal <= 0.35 ? "Compatible" : ltiVal <= 0.40 ? "Aceptable" : "No viable";

  // Salario mínimo recomendado
  sueldoOut.innerText = formatMoney(((cuota*12) + (deudaTotal*12))/0.35);
}

// Tabla de amortización
document.getElementById("verTabla").addEventListener("click", ()=>{
  tablaContainer.style.display = tablaContainer.style.display==="none"?"block":"none";
  if(tablaContainer.style.display==="block") generarTabla();
});

function generarTabla(){
  tbody.innerHTML = "";
  const precio = parseFloat(precioInput.value) || 0;
  const ahorro = parseFloat(entradaInput.value) || 0;
  const interes = (parseFloat(interesInput.value)/100)/12 || 0;
  const años = parseFloat(añosInput.value) || 0;
  const comunidad = parseFloat(comunidadInput.value) || 0;

  let gastos = tipoViviendaInput.value === "obraNueva" ? precio*0.10 + 2500 : precio*comunidad + 2500;
  let entradaCasa = Math.max(0, ahorro - gastos);
  let capital = precio - entradaCasa;
  let n = años*12;
  let cuota = capital*(interes*Math.pow(1+interes,n))/(Math.pow(1+interes,n)-1);
  let saldo = capital;

  for(let i=1;i<=n;i++){
    const interesMes = saldo*interes;
    const capitalMes = cuota - interesMes;
    saldo -= capitalMes;
    tbody.innerHTML += `<tr>
      <td>${i}</td>
      <td>${formatMoney(cuota)}</td>
      <td>${formatMoney(interesMes)}</td>
      <td>${formatMoney(capitalMes)}</td>
      <td>${formatMoney(Math.max(saldo,0))}</td>
    </tr>`;
  }
}

// Inicial
calcular();
