// ===== ELEMENTOS =====
const btnCalculadora = document.getElementById("btnCalculadora");
const btnAnalizarPerfil = document.getElementById("btnAnalizarPerfil");

const seccionCalculadora = document.getElementById("seccionCalculadora");
const seccionPerfil = document.getElementById("seccionPerfil");

// --- Calculadora ---
const precioInput = document.getElementById("precio");
const entradaInput = document.getElementById("entrada");
const tipoVivienda = document.getElementById("tipoVivienda");
const comunidadSelect = document.getElementById("comunidad");
const interesInput = document.getElementById("interes");

const capitalOut = document.getElementById("capital");
const cuotaOut = document.getElementById("cuota");
const interesesOut = document.getElementById("intereses");
const entradaTotalOut = document.getElementById("entradaTotal");
const ltvOut = document.getElementById("ltv");

const verTablaBtn = document.getElementById("verTabla");
const tablaContainer = document.getElementById("tablaContainer");
const tbody = document.querySelector("#tabla tbody");

// --- Perfil ---
const perfilTitulares = document.getElementById("perfilTitulares");
const perfilEdad1 = document.getElementById("perfilEdad1");
const perfilEdad2Div = document.getElementById("perfilEdad2Div");
const perfilEdad2 = document.getElementById("perfilEdad2");
const perfilSalario1 = document.getElementById("perfilSalario1");
const perfilSalario2Div = document.getElementById("perfilSalario2Div");
const perfilSalario2 = document.getElementById("perfilSalario2");
const perfilPagas = document.getElementById("perfilPagas");
const perfilAhorros = document.getElementById("perfilAhorros");
const perfilDeuda = document.getElementById("perfilDeuda");
const perfilOtroIngreso = document.getElementById("perfilOtroIngreso");
const yaTieneVivienda = document.getElementById("yaTieneVivienda");
const perfilVivienda = document.getElementById("perfilVivienda");
const perfilPrecio = document.getElementById("perfilPrecio");
const perfilTipoVivienda = document.getElementById("perfilTipoVivienda");
const perfilComunidadDiv = document.getElementById("perfilComunidadDiv");
const perfilComunidad = document.getElementById("perfilComunidad");
const perfilPrimeraSegunda = document.getElementById("perfilPrimeraSegunda");
const perfilInteres = document.getElementById("perfilInteres");

const perfilCapitalOut = document.getElementById("perfilCapital");
const perfilCuotaOut = document.getElementById("perfilCuota");
const perfilInteresesOut = document.getElementById("perfilIntereses");
const perfilLTVOut = document.getElementById("perfilLTV");
const perfilLTIOut = document.getElementById("perfilLTI");
const perfilCompatibleOut = document.getElementById("perfilCompatible");

const perfilVerTablaBtn = document.getElementById("perfilVerTabla");
const perfilTablaContainer = document.getElementById("perfilTabla");
const perfilTbody = document.querySelector("#perfilTabla tbody");

// ===== UTILIDADES =====
function formatMoney(n) {
  return new Intl.NumberFormat('es-ES',{style:'currency',currency:'EUR'}).format(n);
}

// ===== SELECCIÓN DE SECCIÓN =====
btnCalculadora.addEventListener("click", ()=>{
  seccionCalculadora.style.display = "block";
  seccionPerfil.style.display = "none";
});
btnAnalizarPerfil.addEventListener("click", ()=>{
  seccionCalculadora.style.display = "none";
  seccionPerfil.style.display = "block";
});

// ===== CALCULADORA =====
function calcularGastos(precio, tipo, comunidad){
  let impuestos = tipo === "obraNueva" ? precio*0.10 : precio*parseFloat(comunidad);
  let gastosAdicionales = 2500; // notaria, registro, gestor
  return impuestos + gastosAdicionales;
}

function calcularCapital(precio, ahorro, gastos){
  return precio + gastos - ahorro;
}

function calcularCuota(capital, interesAnual, años){
  if(años===0) return 0;
  let n = años*12;
  let i = interesAnual/100/12;
  if(i===0) return capital/n;
  return capital*(i*Math.pow(1+i,n))/(Math.pow(1+i,n)-1);
}

function calcularCalculadora(){
  let precio = parseFloat(precioInput.value) || 0;
  let ahorro = parseFloat(entradaInput.value) || 0;
  let tipo = tipoVivienda.value;
  let comunidad = comunidadSelect.value;
  let interes = parseFloat(interesInput.value) || 0;

  let gastos = calcularGastos(precio,tipo,comunidad);
  let capital = calcularCapital(precio,ahorro,gastos);
  let cuota = calcularCuota(capital,interes,30);

  capitalOut.innerText = formatMoney(capital);
  cuotaOut.innerText = formatMoney(cuota);
  interesesOut.innerText = formatMoney(cuota*30*12 - capital);
  entradaTotalOut.innerText = formatMoney(ahorro + gastos);
  ltvOut.innerText = ((capital/precio)*100).toFixed(1)+"%";
}

// Eventos Calculadora
[precioInput, entradaInput, tipoVivienda, comunidadSelect, interesInput].forEach(el=>{
  el.addEventListener("input", calcularCalculadora);
});
verTablaBtn.addEventListener("click", ()=>{
  tablaContainer.style.display = tablaContainer.style.display==="none" ? "block" : "none";
});

// Inicial
calcularCalculadora();

// ===== PERFIL =====
// Mostrar u ocultar segundo titular
perfilTitulares.addEventListener("change", ()=>{
  if(perfilTitulares.value==="2"){
    perfilEdad2Div.style.display="block";
    perfilSalario2Div.style.display="block";
  } else {
    perfilEdad2Div.style.display="none";
    perfilSalario2Div.style.display="none";
  }
});

// Mostrar u ocultar datos de vivienda si ya tiene
yaTieneVivienda.addEventListener("change", ()=>{
  perfilVivienda.style.display = yaTieneVivienda.checked ? "grid" : "none";
  if(perfilTipoVivienda.value==="obraNueva"){
    perfilComunidadDiv.style.display="none";
  } else {
    perfilComunidadDiv.style.display="block";
  }
});

// Ajustar comunidad según tipo vivienda
perfilTipoVivienda.addEventListener("change", ()=>{
  perfilComunidadDiv.style.display = perfilTipoVivienda.value==="obraNueva" ? "none" : "block";
});

// Función calcular perfil
function calcularPerfil(){
  let nTitulares = parseInt(perfilTitulares.value);
  let edad1 = parseInt(perfilEdad1.value) || 0;
  let edad2 = nTitulares===2 ? parseInt(perfilEdad2.value)||0 : 0;
  let mayorEdad = Math.max(edad1,edad2);
  let plazoMax = Math.min(30,75-mayorEdad);
  if(plazoMax<0) plazoMax=0;

  let ingreso1 = parseFloat(perfilSalario1.value)||0;
  let ingreso2 = nTitulares===2 ? parseFloat(perfilSalario2.value)||0 : 0;
  let otroIngreso = parseFloat(perfilOtroIngreso.value)||0;
  let ingresosAnuales = (ingreso1+ingreso2+otroIngreso) * parseInt(perfilPagas.value||12);

  let deudas = parseFloat(perfilDeuda.value)||0;
  let ahorro = parseFloat(perfilAhorros.value)||0;

  // Previsión de préstamo posible según LTI 35%
  let cuotaMaxAnual = ingresosAnuales*0.35;
  let capitalPosible = cuotaMaxAnual/12*plazoMax*12 - deudas*12;
  if(capitalPosible<0) capitalPosible=0;

  // Si ya tiene vivienda, se ajusta capital y se calcula cuota real
  if(yaTieneVivienda.checked){
    let precio = parseFloat(perfilPrecio.value)||0;
    let tipo = perfilTipoVivienda.value;
    let comunidad = perfilComunidad.value;
    let interes = parseFloat(perfilInteres.value)||0;
    let gastos = calcularGastos(precio,tipo,comunidad);
    capitalPosible = calcularCapital(precio,ahorro,gastos);
    let cuota = calcularCuota(capitalPosible,interes,plazoMax);

    perfilCapitalOut.innerText = formatMoney(capitalPosible);
    perfilCuotaOut.innerText = formatMoney(cuota);
    perfilInteresesOut.innerText = formatMoney(cuota*plazoMax*12 - capitalPosible);
    perfilLTVOut.innerText = ((capitalPosible/precio)*100).toFixed(1)+"%";

    let lti = (cuota+deudas)*12/ingresosAnuales;
    perfilLTIOut.innerText = (lti*100).toFixed(1)+"%";
    if(lti<=0.35){
      perfilCompatibleOut.innerText="Compatible"; perfilCompatibleOut.style.color="green";
    } else if(lti<=0.4){
      perfilCompatibleOut.innerText="Aceptable"; perfilCompatibleOut.style.color="orange";
    } else {
      perfilCompatibleOut.innerText="No viable"; perfilCompatibleOut.style.color="red";
    }
  } else {
    // Sin vivienda, solo mostrar capital posible
    perfilCapitalOut.innerText = formatMoney(capitalPosible);
    perfilCuotaOut.innerText = "-";
    perfilInteresesOut.innerText = "-";
    perfilLTVOut.innerText = "-";
    perfilLTIOut.innerText = "-";
    perfilCompatibleOut.innerText = "-";
  }
}

// Eventos perfil
[
  perfilTitulares, perfilEdad1, perfilEdad2, perfilSalario1, perfilSalario2,
  perfilPagas, perfilAhorros, perfilDeuda, perfilOtroIngreso,
  yaTieneVivienda, perfilPrecio, perfilTipoVivienda, perfilComunidad, perfilInteres
].forEach(el=>el.addEventListener("input",calcularPerfil));

// Inicial
calcularPerfil();
