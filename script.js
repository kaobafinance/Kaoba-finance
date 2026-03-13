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
const prestamoInput = document.getElementById("prestamo");
const interesInput = document.getElementById("interes");
const anosInput = document.getElementById("anos");

const cuotaOut = document.getElementById("cuota");
const interesesTotalesOut = document.getElementById("interesesTotales");
const totalPagadoOut = document.getElementById("totalPagado");

const calcularBtn = document.getElementById("calcularBtn");
const verTablaBtn = document.getElementById("verTabla");

const tablaContainer = document.getElementById("tablaContainer");
const tbody = document.querySelector("#tabla tbody");

// --- FORMATO MONEDA ---
function formatMoney(n){
return new Intl.NumberFormat('es-ES',{style:'currency',currency:'EUR'}).format(n);
}

// --- CALCULAR HIPOTECA ---
calcularBtn.addEventListener("click", calcular);

function calcular(){

let capital = parseFloat(prestamoInput.value)||0;
let interes = (parseFloat(interesInput.value)/100)/12||0;
let anos = parseFloat(anosInput.value)||0;

let n = anos*12;

if(capital===0 || interes===0 || anos===0){
return;
}

let cuota = capital*(interes*Math.pow(1+interes,n))/(Math.pow(1+interes,n)-1);

let totalPagado = cuota*n;
let interesesTotales = totalPagado-capital;

cuotaOut.innerText = formatMoney(cuota);
interesesTotalesOut.innerText = formatMoney(interesesTotales);
totalPagadoOut.innerText = formatMoney(totalPagado);

verTablaBtn.style.display="block";
}

// --- TABLA AMORTIZACIÓN ---
verTablaBtn.addEventListener("click", ()=>{

tablaContainer.style.display =
tablaContainer.style.display==="none"?"block":"none";

if(tablaContainer.style.display==="block"){
generarTabla();
}

});

function generarTabla(){

tbody.innerHTML="";

let capital = parseFloat(prestamoInput.value)||0;
let interes = (parseFloat(interesInput.value)/100)/12||0;
let anos = parseFloat(anosInput.value)||0;

let n = anos*12;

let cuota = capital*(interes*Math.pow(1+interes,n))/(Math.pow(1+interes,n)-1);

let saldo = capital;

for(let i=1;i<=n;i++){

let interesMes = saldo*interes;
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

}
