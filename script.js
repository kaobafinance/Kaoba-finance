// Referencias a elementos
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

const capitalOut = document.getElementById("capital");
const cuotaOut = document.getElementById("cuota");
const interesesOut = document.getElementById("intereses");
const entradaTotalOut = document.getElementById("entradaTotal");
const sueldoOut = document.getElementById("sueldo");
const ltiOut = document.getElementById("lti");
const compatibleOut = document.getElementById("compatible");
const resumenOut = document.getElementById("resumen");
const plazoEdadMax = document.getElementById("plazoEdadMax");

const edadTitular2Div = document.getElementById("edadTitular2");
const deudaTitular2Div = document.getElementById("deudaTitular2");
const tablaContainer = document.getElementById("tablaContainer");
const tbody = document.querySelector("#tabla tbody");

// Función para formatear dinero
function formatMoney(n){
  return new Intl.NumberFormat('es-ES',{style:'currency',currency:'EUR'}).format(n);
}

// Mostrar/ocultar segundo titular y comunidad según elecciones
titularesInput.addEventListener("change", ()=>{
  edadTitular2Div.style.display = titularesInput.value === "2" ? "block" : "none";
  deudaTitular2Div.style.display = titularesInput.value === "2" ? "block" : "none";
  calcular();
});

tipoViviendaInput.addEventListener("change", ()=>{
  if(tipoViviendaInput.value === "obraNueva"){
    comunidadInput.parentElement.style.display = "none"; // Ocultar comunidad
  } else {
    comunidadInput.parentElement.style.display = "block";
  }
  calcular();
});

// Ajuste de plazo máximo según edad (hasta 75 años)
function ajustarPlazoMax(){
  let edades = [parseInt(edad1Input.value) || 18];
  if(titularesInput.value === "2"){
    edades.push(parseInt(edad2Input.value) || 18);
  }
  let mayorEdad = Math.max(...edades);
  let maxPlazo = Math.max(0, 75 - mayorEdad);
  plazoEdadMax.innerText = `Plazo máximo según edad: ${maxPlazo} años`;
  if(parseInt(añosInput.value) > maxPlazo){
    añosInput.value = maxPlazo;
  }
  return maxPlazo;
}

// Función principal de cálculo
function calcular(){
  ajustarPlazoMax();

  let precio = parseFloat(precioInput.value)||0;
  let ahorro = parseFloat(entradaInput.value)||0;
  let tipoVivienda = tipoViviendaInput.value;
  let comunidad = parseFloat(comunidadInput.value)||0;
  let nAnios = parseInt(añosInput.value)||0;
  let interes = parseFloat(interesInput.value)/100/12||0;
  let salario = parseFloat(salarioInput.value)||0;

  // Gastos según tipo de vivienda
  let impuesto = tipoVivienda === "obraNueva" ? precio*0.10 : precio*comunidad; // IVA 10% o ITP
  let gastos = impuesto + 2500; // 2500€ por escrituras
  let entradaCasa = Math.max(0, ahorro - gastos);
  let capital = precio - entradaCasa;
  let n = nAnios*12;
  let cuota = capital*(interes*Math.pow(1+interes,n))/(Math.pow(1+interes,n)-1);
  let totalIntereses = cuota*n - capital;

  // Deudas
  let deuda1 = parseFloat(deuda1Input.value)||0;
  let deuda2 = titularesInput.value==="2"? (parseFloat(deuda2Input.value)||0) : 0;
  let deudaTotal = deuda1 + deuda2;

  // LTI considerando deudas
  let ltiVal = (cuota + deudaTotal)*12 / salario;
  let comp = "";
  if(ltiVal <= 0.35) comp = "Compatible";
  else if(ltiVal <= 0.40) comp = "Aceptable";
  else comp = "No viable";

  // Salario mínimo recomendado (que soporte la cuota + deudas con LTI ≤ 35%)
  let salarioRecomendado = ((cuota + deudaTotal)*12) / 0.35;

  // Mostrar resultados
  capitalOut.innerText = formatMoney(capital);
  cuotaOut.innerText = formatMoney(cuota);
  interesesOut.innerText = formatMoney(totalIntereses);
  entradaTotalOut.innerText = formatMoney(entradaCasa + gastos);
  sueldoOut.innerText = formatMoney(salarioRecomendado);
  ltiOut.innerText = (ltiVal*100).toFixed(1) + "%";
  ltiOut.style.color = ltiVal<=0.35? "green": ltiVal<=0.40? "orange":"red";
  compatibleOut.innerText = comp;
  compatibleOut.style.color = ltiVal<=0.35? "green":ltiVal<=0.40? "orange":"red";

  // Resumen de precio máximo según salario disponible
  let maxCapital = (salario*0.35/12 - deudaTotal) * n;
  let maxPrecio = maxCapital + entradaCasa;
  resumenOut.innerText = `Con tu salario neto anual de ${formatMoney(salario)}, podrías permitirte una vivienda de hasta ${formatMoney(maxPrecio)} con LTI ≤35%`;
}

// Generar tabla de amortización
function toggleTabla(){
  tablaContainer.style.display = tablaContainer.style.display==="none" ? "block" : "none";
  if(tablaContainer.style.display==="block") generarTabla();
}

function generarTabla(){
  tbody.innerHTML = "";
  let precio = parseFloat(precioInput.value)||0;
  let ahorro = parseFloat(entradaInput.value)||0;
  let tipoVivienda = tipoViviendaInput.value;
  let comunidad = parseFloat(comunidadInput.value)||0;
  let nAnios = parseInt(añosInput.value)||0;
  let interes = parseFloat(interesInput.value)/100/12||0;

  let impuesto = tipoVivienda === "obraNueva" ? precio*0.10 : precio*comunidad; 
  let gastos = impuesto + 2500;
  let entradaCasa = Math.max(0, ahorro - gastos);
  let capital = precio - entradaCasa;
  let n = nAnios*12;
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
}

// Listeners
[precioInput, entradaInput, tipoViviendaInput, titularesInput, edad1Input, edad2Input, deuda1Input, deuda2Input, añosInput, salarioInput, comunidadInput, interesInput].forEach(el=>{
  el.addEventListener("input", calcular);
});
document.getElementById("verTabla").addEventListener("click", toggleTabla);

// Inicial
calcular();
