// --- SELECCIÓN DE SECCIÓN ---
const btnCalculadora = document.getElementById("btnCalculadora");
const btnPerfil = document.getElementById("btnPerfil");
const calculadoraDiv = document.getElementById("calculadora");
const perfilDiv = document.getElementById("perfil");

btnCalculadora.addEventListener("click", ()=>{
  calculadoraDiv.style.display="block";
  perfilDiv.style.display="none";
});

btnPerfil.addEventListener("click", ()=>{
  calculadoraDiv.style.display="none";
  perfilDiv.style.display="block";
});

// --- ELEMENTOS CALCULADORA ---
const precioInput = document.getElementById("precio");
const entradaInput = document.getElementById("entrada");
const tipoVivienda = document.getElementById("tipoVivienda");
const añosInput = document.getElementById("años");
const interesInput = document.getElementById("interes");
const comunidadSelect = document.getElementById("comunidad");

const capitalOut = document.getElementById("capital");
const cuotaOut = document.getElementById("cuota");
const ltvOut = document.getElementById("ltv");
const gastosOut = document.getElementById("gastos");
const verTablaBtn = document.getElementById("verTabla");
const tablaContainer = document.getElementById("tablaContainer");
const tbody = document.querySelector("#tabla tbody");

// --- ELEMENTOS PERFIL ---
const perfilTitulares = document.getElementById("perfilTitulares");
const perfilEdad1 = document.getElementById("perfilEdad1");
const perfilEdad2 = document.getElementById("perfilEdad2");
const perfilEdad2Div = document.getElementById("perfilEdad2Div");
const perfilSalario1 = document.getElementById("perfilSalario1");
const perfilSalario2 = document.getElementById("perfilSalario2");
const perfilSalario2Div = document.getElementById("perfilSalario2Div");
const perfilPagas = document.getElementById("perfilPagas");
const perfilAhorros = document.getElementById("perfilAhorros");
const perfilDeuda = document.getElementById("perfilDeuda");
const perfilOtroIngreso = document.getElementById("perfilOtroIngreso");
const yaTieneVivienda = document.getElementById("yaTieneVivienda");
const viviendaInfo = document.getElementById("viviendaInfo");
const perfilPrecio = document.getElementById("perfilPrecio");
const perfilTipoVivienda = document.getElementById("perfilTipoVivienda");
const perfilComunidad = document.getElementById("perfilComunidad");
const perfilPrimeraSegunda = document.getElementById("perfilPrimeraSegunda");
const perfilPlazo = document.getElementById("perfilPlazo");

const perfilCapitalOut = document.getElementById("perfilCapital");
const perfilCuotaOut = document.getElementById("perfilCuota");
const perfilLTVOut = document.getElementById("perfilLTV");
const perfilGastosOut = document.getElementById("perfilGastos");
const perfilLTIOut = document.getElementById("perfilLTI");
const perfilCompatibleOut = document.getElementById("perfilCompatible");

// --- FORMATO MONEDA ---
function formatMoney(n){return new Intl.NumberFormat('es-ES',{style:'currency',currency:'EUR'}).format(n);}

// --- MOSTRAR/OCULTAR SEGUNDO TITULAR ---
perfilTitulares.addEventListener("change", ()=>{
  if(perfilTitulares.value==="2"){
    perfilEdad2Div.style.display="block";
    perfilSalario2Div.style.display="block";
  }else{
    perfilEdad2Div.style.display="none";
    perfilSalario2Div.style.display="none";
  }
  calcularPerfil();
});

// --- MOSTRAR/OCULTAR COMUNIDAD ---
tipoVivienda.addEventListener("change", ()=>{
  if(tipoVivienda.value==="obraNueva"){
    comunidadSelect.parentElement.style.display="none";
  }else{
    comunidadSelect.parentElement.style.display="block";
  }
  calcular();
});

perfilTipoVivienda.addEventListener("change", ()=>{
  if(perfilTipoVivienda.value==="obraNueva"){
    perfilComunidad.parentElement.style.display="none";
  }else{
    perfilComunidad.parentElement.style.display="block";
  }
  calcularPerfil();
});

// --- MOSTRAR INFO VIVIENDA ---
yaTieneVivienda.addEventListener("change", ()=>{
  viviendaInfo.style.display = yaTieneVivienda.checked ? "block":"none";
  calcularPerfil();
});

// --- FUNCIONES CALCULADORA ---
function calcular(){
  let precio = parseFloat(precioInput.value)||0;
  let entrada = parseFloat(entradaInput.value)||0;
  let años = parseFloat(añosInput.value)||0;
  let interes = parseFloat(interesInput.value)/100/12||0;
  
  let impuestos = tipoVivienda.value==="obraNueva"?precio*0.10:precio*parseFloat(comunidadSelect.value);
  let gastos = impuestos+2500;
  
  let ahorroAplicado = Math.min(entrada,gastos);
  let capital = precio - (entrada - ahorroAplicado);
  
  let n = años*12;
  let cuota = capital*(interes*Math.pow(1+interes,n))/(Math.pow(1+interes,n)-1);
  let ltv = (capital/precio)*100;
  
  capitalOut.innerText = formatMoney(capital);
  cuotaOut.innerText = formatMoney(cuota);
  ltvOut.innerText = ltv.toFixed(1)+"%";
  gastosOut.innerText = formatMoney(gastos);
}

// --- TABLA AMORTIZACIÓN ---
verTablaBtn.addEventListener("click", ()=>{
  tablaContainer.style.display = tablaContainer.style.display==="none"?"block":"none";
  if(tablaContainer.style.display==="block") generarTabla();
});

function generarTabla(){
  tbody.innerHTML="";
  let precio = parseFloat(precioInput.value)||0;
  let entrada = parseFloat(entradaInput.value)||0;
  let años = parseFloat(añosInput.value)||0;
  let interes = parseFloat(interesInput.value)/100/12||0;
  let impuestos = tipoVivienda.value==="obraNueva"?precio*0.10:precio*parseFloat(comunidadSelect.value);
  let gastos = impuestos+2500;
  let ahorroAplicado = Math.min(entrada,gastos);
  let capital = precio - (entrada - ahorroAplicado);
  
  let n = años*12;
  let cuota = capital*(interes*Math.pow(1+interes,n))/(Math.pow(1+interes,n)-1);
  let saldo = capital;
  
  for(let i=1;i<=n;i++){
    let interesMes = saldo*interes;
    let capitalMes = cuota - interesMes;
    saldo -= capitalMes;
    tbody.innerHTML += `<tr><td>${i}</td><td>${formatMoney(cuota)}</td><td>${formatMoney(interesMes)}</td><td>${formatMoney(capitalMes)}</td><td>${formatMoney(Math.max(saldo,0))}</td></tr>`;
  }
}

// --- FUNCIONES PERFIL ---
function calcularPerfil(){
  let nTitulares = parseInt(perfilTitulares.value)||1;
  let edad1 = parseInt(perfilEdad1.value)||0;
  let edad2 = nTitulares===2?parseInt(perfilEdad2.value)||0:0;
  let maxEdad = Math.max(edad1,edad2);
  let plazoMax = Math.min(30,75-maxEdad);
  perfilPlazo.value = plazoMax>0?plazoMax:0;
  
  let ingresos = (parseFloat(perfilSalario1.value)||0) + (nTitulares===2?(parseFloat(perfilSalario2.value)||0):0) + (parseFloat(perfilOtroIngreso.value)||0);
  let pagas = parseInt(perfilPagas.value)||12;
  let ingresosAnuales = ingresos*pagas;
  let deudas = parseFloat(perfilDeuda.value)||0;

  // Tipo referencia 2,8%
  let tipoRef = 0.028/12;
  let n = plazoMax*12;
  let cuotaMax = ingresosAnuales*0.35/12 - deudas;
  let capitalPosible = cuotaMax*(Math.pow(1+tipoRef,n)-1)/(tipoRef*(Math.pow(1+tipoRef,n)));
  
  // Si tiene vivienda
  let gastos=0;
  if(yaTieneVivienda.checked){
    let precio = parseFloat(perfilPrecio.value)||0;
    let impuestos = perfilTipoVivienda.value==="obraNueva"?precio*0.10:precio*parseFloat(perfilComunidad.value);
    gastos = impuestos+2500;
    let ahorro = parseFloat(perfilAhorros.value)||0;
    capitalPosible = precio + gastos - ahorro;
  }

  // Cuota real con capital
  let cuota = capitalPosible*(tipoRef*Math.pow(1+tipoRef,n))/(Math.pow(1+tipoRef,n)-1);
  let ltv = yaTieneVivienda.checked?(capitalPosible/parseFloat(perfilPrecio.value)*100):0;

  // LTI
  let lti = (cuota + deudas)*12 / ingresosAnuales;

  perfilCapitalOut.innerText = formatMoney(capitalPosible);
  perfilCuotaOut.innerText = formatMoney(cuota);
  perfilLTVOut.innerText = ltv>0?ltv.toFixed(1)+"%":"-";
  perfilGastos
