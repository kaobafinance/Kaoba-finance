// -----------------------------
// BOTONES SECCIONES
// -----------------------------

const btnCalculadora = document.getElementById("btnCalculadora");
const btnPerfil = document.getElementById("btnPerfil");

const calculadora = document.getElementById("calculadora");
const perfil = document.getElementById("perfil");

btnCalculadora.onclick = () => {
calculadora.style.display="block";
perfil.style.display="none";
}

btnPerfil.onclick = () => {
calculadora.style.display="none";
perfil.style.display="block";
}



// -----------------------------
// FORMATO MONEDA
// -----------------------------

function formatMoney(n){
return new Intl.NumberFormat('es-ES',{style:'currency',currency:'EUR'}).format(n);
}



// -----------------------------
// CALCULADORA HIPOTECA
// -----------------------------

const prestamo = document.getElementById("prestamo");
const interes = document.getElementById("interes");
const anos = document.getElementById("anos");

const cuotaOut = document.getElementById("cuota");
const interesesOut = document.getElementById("interesesTotales");
const totalOut = document.getElementById("totalPagado");

const resultados = document.getElementById("resultados");

function calcular(){

const capital = parseFloat(prestamo.value);
const tipo = parseFloat(interes.value)/100/12;
const plazo = parseFloat(anos.value)*12;

if(!capital || !tipo || !plazo){
resultados.style.display="none";
return;
}

const cuota =
capital*(tipo*Math.pow(1+tipo,plazo)) /
(Math.pow(1+tipo,plazo)-1);

const total = cuota*plazo;
const intereses = total-capital;

cuotaOut.innerText=formatMoney(cuota);
interesesOut.innerText=formatMoney(intereses);
totalOut.innerText=formatMoney(total);

resultados.style.display="grid";

}



// -----------------------------
// TABLA AMORTIZACION
// -----------------------------

const tablaBtn = document.getElementById("verTabla");
const tablaContainer = document.getElementById("tablaContainer");
const tbody = document.querySelector("#tabla tbody");

tablaBtn.onclick=()=>{

if(tablaContainer.style.display==="block"){
tablaContainer.style.display="none";
tablaBtn.innerText="Ver cuadro de amortización";
return;
}

tablaContainer.style.display="block";
tablaBtn.innerText="Ocultar cuadro de amortización";

generarTabla();

}


function generarTabla(){

tbody.innerHTML="";

const capital = parseFloat(prestamo.value);
const tipo = parseFloat(interes.value)/100/12;
const plazo = parseFloat(anos.value)*12;

const cuota =
capital*(tipo*Math.pow(1+tipo,plazo)) /
(Math.pow(1+tipo,plazo)-1);

let saldo = capital;

for(let i=1;i<=plazo;i++){

const interesMes = saldo*tipo;
const capitalMes = cuota-interesMes;

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

}



// -----------------------------
// TITULARES
// -----------------------------

const perfilTitulares = document.getElementById("perfilTitulares");
const titular2Div = document.getElementById("titular2Div");

perfilTitulares.onchange=()=>{

if(perfilTitulares.value==="2"){
titular2Div.style.display="block";
}else{
titular2Div.style.display="none";
}

calcularPerfil();

}



// -----------------------------
// VIVIENDA
// -----------------------------

const yaTieneVivienda = document.getElementById("yaTieneVivienda");
const viviendaInfo = document.getElementById("viviendaInfo");

viviendaInfo.style.display="none";

yaTieneVivienda.onchange=()=>{

if(yaTieneVivienda.checked){
viviendaInfo.style.display="block";
}else{
viviendaInfo.style.display="none";
}

calcularPerfil();

}



// -----------------------------
// PERFIL FINANCIERO
// -----------------------------

function calcularPerfil(){

const edad1 = parseFloat(document.getElementById("perfilEdad1").value)||0;
const edad2 = parseFloat(document.getElementById("perfilEdad2").value)||0;

const salario1 = parseFloat(document.getElementById("perfilSalario1").value)||0;
const salario2 = parseFloat(document.getElementById("perfilSalario2").value)||0;

const pagas1 = parseFloat(document.getElementById("perfilPagas1").value)||12;
const pagas2 = parseFloat(document.getElementById("perfilPagas2").value)||12;

const deudas = parseFloat(document.getElementById("perfilDeuda").value)||0;
const otros = parseFloat(document.getElementById("perfilOtroIngreso").value)||0;
const ahorro = parseFloat(document.getElementById("perfilAhorros").value)||0;

const ingresosAnuales =
(salario1*pagas1)+(salario2*pagas2)+(otros*12);

if(ingresosAnuales<=0) return;


// tipo viabilidad
const tipo = 0.028/12;
const plazo = 30*12;

const cuotaMax = ingresosAnuales*0.35/12 - deudas;

const capitalMax =
cuotaMax*(Math.pow(1+tipo,plazo)-1) /
(tipo*Math.pow(1+tipo,plazo));


document.getElementById("perfilCapital").innerText=formatMoney(capitalMax);

const cuota =
capitalMax*(tipo*Math.pow(1+tipo,plazo)) /
(Math.pow(1+tipo,plazo)-1);

document.getElementById("perfilCuota").innerText=formatMoney(cuota);


// LTI

const lti = ((cuota+deudas)*12)/ingresosAnuales;

document.getElementById("perfilLTI").innerText=(lti*100).toFixed(1)+"%";

const compatibilidad = document.getElementById("perfilCompatible");

if(lti<=0.35){

compatibilidad.innerText="Viable";
compatibilidad.style.color="green";

}
else if(lti<=0.40){

compatibilidad.innerText="Riesgo";
compatibilidad.style.color="orange";

}
else{

compatibilidad.innerText="No viable";
compatibilidad.style.color="red";

}



// -----------------------------
// DATOS VIVIENDA
// -----------------------------

if(!yaTieneVivienda.checked) return;

const precio = parseFloat(document.getElementById("perfilPrecio").value)||0;
if(precio<=0) return;

const tipoOperacion = document.getElementById("perfilTipoOperacion").value;
const comunidad = parseFloat(document.getElementById("perfilComunidad").value)||0;

let gastos = 0;

if(tipoOperacion==="obraNueva"){
gastos = precio*0.10 + 2500;
}else{
gastos = precio*comunidad + 2500;
}

document.getElementById("perfilGastos").innerText=formatMoney(gastos);


// financiación

const capitalSolicitado = precio + gastos - ahorro;

const ltv = (capitalSolicitado/precio)*100;

document.getElementById("perfilLTV").innerText=ltv.toFixed(1)+"%";



// advertencias

let mensaje = "";

const tipoVivienda = document.getElementById("perfilTipoVivienda").value;

if(tipoVivienda==="primera" && ltv>100){

mensaje="⚠ La financiación supera el valor de la vivienda.";

}

if((tipoVivienda==="segunda" || tipoVivienda==="local") && ltv>70){

mensaje="⚠ Habitualmente los bancos financian hasta el 70% en este tipo de operación.";

}


const entradaNecesaria = precio + gastos - ahorro;

if(entradaNecesaria>0){

mensaje += " Entrada mínima necesaria aproximada: " + formatMoney(entradaNecesaria);

}

document.getElementById("perfilMensaje").innerText=mensaje;

}



// -----------------------------
// EVENTOS AUTOMATICOS
// -----------------------------

document.querySelectorAll("#perfil input,#perfil select")
.forEach(el=>{

el.addEventListener("input",calcularPerfil);

});
