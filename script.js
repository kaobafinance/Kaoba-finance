let chart1;

const precioInput = document.getElementById("precio");
const entradaInput = document.getElementById("entrada");
const interesInput = document.getElementById("interes");
const añosInput = document.getElementById("años");

const inputs = document.querySelectorAll("input");

inputs.forEach(i => i.addEventListener("input", calcular));

function formatMoney(n){
return new Intl.NumberFormat('es-ES',{style:'currency',currency:'EUR'}).format(n);
}

function toggleTabla(){

const tabla=document.getElementById("tablaContainer");

tabla.style.display = tabla.style.display==="none" ? "block" : "none";

}

function calcular(){

let precio=parseFloat(precioInput.value)||0;
let ahorro=parseFloat(entradaInput.value)||0;
let interes=parseFloat(interesInput.value)/100/12;
let años=parseFloat(añosInput.value)||0;

let gastos=precio*0.10;

let entradaGastos=Math.min(ahorro,gastos);
let entradaCasa=Math.max(0,ahorro-gastos);

let capital=precio-entradaCasa;

let n=años*12;

let cuota=capital*(interes*Math.pow(1+interes,n))/(Math.pow(1+interes,n)-1);

let saldo=capital;

let meses=[];
let saldoData=[];

let totalIntereses=0;

let tbody=document.querySelector("#tabla tbody");
tbody.innerHTML="";

for(let i=1;i<=n;i++){

let interesMes=saldo*interes;

let capitalMes=cuota-interesMes;

saldo-=capitalMes;

totalIntereses+=interesMes;

meses.push(i);
saldoData.push(saldo);

let row=`

tbody.innerHTML+=row;

}

document.getElementById("capital").innerText=formatMoney(capital);
document.getElementById("cuota").innerText=formatMoney(cuota);
document.getElementById("intereses").innerText=formatMoney(totalIntereses);

let sueldo=cuota/0.35;

document.getElementById("sueldo").innerText=formatMoney(sueldo);

let ltv=(capital/precio)*100;

document.getElementById("ltv").innerText=ltv.toFixed(1)+"%";

document.getElementById("gastos").innerText=formatMoney(gastos);
document.getElementById("entradaGastos").innerText=formatMoney(entradaGastos);
document.getElementById("entradaCasa").innerText=formatMoney(entradaCasa);

if(chart1) chart1.destroy();

chart1=new Chart(document.getElementById("grafico1"),{
type:"line",
data:{
labels,
datasets:[{
label:"Capital pendiente",
data,
borderColor:"#2c7be5",
backgroundColor:"rgba(44,123,229,0.2)",
fill,
tension:0.3
}]
},
options:{
responsive
}
});

}

calcular();
