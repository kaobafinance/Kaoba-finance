// script.js

// Inputs
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
const sueldoOut = document.getElementById("sueldo");
const ltiOut = document.getElementById("lti");
const compatibleOut = document.getElementById("compatible");
const entradaTotalOut = document.getElementById("entradaTotal");
const resumenOut = document.getElementById("resumen");
const plazoEdadMax = document.getElementById("plazoEdadMax");

// Tabla de amortización
const tablaContainer = document.getElementById("tablaContainer");
const tbody = document.querySelector("#tabla tbody");

// Segundo titular
const edadTitular2Div = document.getElementById("edadTitular2");
const deudaTitular2Div = document.getElementById("deudaTitular2");

// Helper: formatea euros
function formatMoney(n){
    return new Intl.NumberFormat('es-ES',{style:'currency',currency:'EUR'}).format(n);
}

// Mostrar/ocultar segundo titular según selección
titularesInput.addEventListener("change", () => {
    if(titularesInput.value === "2"){
        edadTitular2Div.style.display = "block";
        deudaTitular2Div.style.display = "block";
    } else {
        edadTitular2Div.style.display = "none";
        deudaTitular2Div.style.display = "none";
        edad2Input.value = "";
        deuda2Input.value = 0;
    }
    calcular();
});

// Limita el plazo máximo según edad del mayor
function actualizarPlazoMaximo(){
    let edades = [parseInt(edad1Input.value) || 0];
    if(titularesInput.value === "2") edades.push(parseInt(edad2Input.value) || 0);
    let mayor = Math.max(...edades);
    let maxPlazo = Math.max(0, 75 - mayor);
    plazoEdadMax.innerText = `Plazo máximo según edad: ${maxPlazo} años`;
    let actual = parseInt(añosInput.value) || 0;
    if(actual > maxPlazo && maxPlazo > 0) añosInput.value = maxPlazo;
}

// Debounce para evitar recalcular muy rápido
function debounce(func, wait) {
  let timeout;
  return function() {
    clearTimeout(timeout);
    timeout = setTimeout(func, wait);
  }
}

// Añadir eventos
const inputs = [
    precioInput, entradaInput, tipoViviendaInput,
    titularesInput, edad1Input, edad2Input,
    deuda1Input, deuda2Input, añosInput,
    salarioInput, comunidadInput, interesInput
];
inputs.forEach(i => i.addEventListener("input", debounce(() => {
    actualizarPlazoMaximo();
    calcular();
}, 300)));

// Función principal de cálculo
function calcular(){
    let precio = parseFloat(precioInput.value) || 0;
    let ahorro = parseFloat(entradaInput.value) || 0;
    let tipoVivienda = tipoViviendaInput.value;
    let interes = parseFloat(interesInput.value)/100/12 || 0;
    let años = parseInt(añosInput.value) || 0;
    let salario = parseFloat(salarioInput.value) || 0;
    let comunidad = parseFloat(comunidadInput.value) || 0;

    // Gastos según tipo de vivienda
    let impuesto = 0;
    if(tipoVivienda === "obraNueva") impuesto = precio * 0.10; // IVA 10%
    else impuesto = precio * comunidad; // ITP según comunidad

    let gastosTotales = impuesto + 2500; // Añadimos escrituras
    let entradaReal = Math.max(0, ahorro - gastosTotales);
    let capital = precio - entradaReal;

    // Número de cuotas
    let n = años * 12;
    let cuota = 0;
    if(interes > 0){
        cuota = capital*(interes*Math.pow(1+interes,n))/(Math.pow(1+interes,n)-1);
    } else {
        cuota = capital/n;
    }
    let totalIntereses = cuota*n - capital;

    // Deudas mensuales de titulares
    let deudaMensualTotal = parseFloat(deuda1Input.value) || 0;
    if(titularesInput.value === "2") deudaMensualTotal += parseFloat(deuda2Input.value) || 0;

    // LTI (ratio de endeudamiento) con deudas
    let ltiVal = (cuota + deudaMensualTotal)*12 / salario;

    // Tarjetas resumen
    capitalOut.innerText = formatMoney(capital);
    cuotaOut.innerText = formatMoney(cuota);
    interesesOut.innerText = formatMoney(totalIntereses);
    sueldoOut.innerText = formatMoney((cuota+deudaMensualTotal)/0.35);
    ltiOut.innerText = (ltiVal*100).toFixed(1) + "%";
    entradaTotalOut.innerText = formatMoney(entradaReal + gastosTotales);

    // Compatibilidad salario
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

    // % financiación (LTV)
    let ltv = capital/precio*100;
    document.getElementById("ltv").innerText = ltv.toFixed(1) + "%";

    // Resumen rápido
    let maxCapital = salario*0.35/12*n - deudaMensualTotal*n;
    let maxPrecio = maxCapital + entradaReal;
    resumenOut.innerText = `Con tu salario neto anual de ${formatMoney(salario)}, podrías permitirte una vivienda de hasta ${formatMoney(maxPrecio)} con LTI ≤35%`;

    amortizacionGenerada = false;
}

// Tabla de amortización
let amortizacionGenerada = false;
function toggleTabla(){
    tablaContainer.style.display = tablaContainer.style.display==="none" ? "block" : "none";
    if(tablaContainer.style.display==="block") generarTabla();
}

function generarTabla(){
    if(amortizacionGenerada) return;

    tbody.innerHTML = "";
    let precio = parseFloat(precioInput.value) || 0;
    let ahorro = parseFloat(entradaInput.value) || 0;
    let tipoVivienda = tipoViviendaInput.value;
    let interes = parseFloat(interesInput.value)/100/12 || 0;
    let años = parseInt(añosInput.value) || 0;
    let comunidad = parseFloat(comunidadInput.value) || 0;

    let impuesto = tipoVivienda === "obraNueva" ? precio*0.10 : precio*comunidad;
    let gastosTotales = impuesto + 2500;
    let entradaReal = Math.max(0, ahorro - gastosTotales);
    let capital = precio - entradaReal;
    let n = años*12;
    let cuota = interes > 0 ? capital*(interes*Math.pow(1+interes,n))/(Math.pow(1+interes,n)-1) : capital/n;
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

// Botón tabla
document.getElementById("verTabla").addEventListener("click", toggleTabla);

// Inicial
actualizarPlazoMaximo();
calcular();
