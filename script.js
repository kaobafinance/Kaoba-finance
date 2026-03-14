// CAMBIO DE SECCIÓN

const btnCalculadora=document.getElementById("btnCalculadora");
const btnPerfil=document.getElementById("btnPerfil");

const calculadoraDiv=document.getElementById("calculadora");
const perfilDiv=document.getElementById("perfil");

btnCalculadora.onclick=()=>{
calculadoraDiv.style.display="block";
perfilDiv.style.display="none";
}

btnPerfil.onclick=()=>{
calculadoraDiv.style.display="none";
perfilDiv.style.display="block";
}

// FORMATO €

function formatMoney(n){
return new Intl.NumberFormat('es-ES',{style:'currency',currency:'EUR'}).format(n);
}

// CALCULADORA

const prestamo=document.getElementById("prestamo");
const interes=document.getElementById("interes");
const anos=document.getElementById("anos");

const cuotaOut=document.getElementById("cuota");
const interesesOut=document.getElementById("interesesTotales");
const totalOut=document.getElementById("totalPagado");

function calcular(){

let capital=parseFloat(prestamo.value)||0;
let i=(parseFloat(interes.value)/100)/12||0;
let n=(parseFloat(anos.value)||0)*12;

let cuota=capital*(i*Math.pow(1+i,n))/(Math.pow(1+i,n)-1);

let total=cuota*n;
let intereses=total-capital;

cuotaOut.innerText=formatMoney(cuota);
interesesOut.innerText=formatMoney(intereses);
totalOut.innerText=formatMoney(total);

}

[prestamo,interes,anos].forEach(el=>el.addEventListener("input",calcular));

calcular()

// TABLA AMORTIZACIÓN

const verTabla=document.getElementById("verTabla");
const tablaContainer=document.getElementById("tablaContainer");
const tbody=document.querySelector("#tabla tbody");

verTabla.onclick=()=>{

tablaContainer.style.display=
tablaContainer.style.display==="none"?"block":"none";

if(tablaContainer.style.display==="block") generarTabla();

}

function generarTabla(){

tbody.innerHTML="";

let capital=parseFloat(prestamo.value)||0;
let i=(parseFloat(interes.value)/100)/12||0;
let n=(parseFloat(anos.value)||0)*12;

let cuota=capital*(i*Math.pow(1+i,n))/(Math.pow(1+i,n)-1);

let saldo=capital;

for(let m=1;m<=n;m++){

let interesMes=saldo*i;
let capitalMes=cuota-interesMes;

saldo-=capitalMes;

tbody.innerHTML+=`
<tr>
<td>${m}</td>
<td>${formatMoney(cuota)}</td>
<td>${formatMoney(interesMes)}</td>
<td>${formatMoney(capitalMes)}</td>
<td>${formatMoney(Math.max(0,saldo))}</td>
</tr>`;
}

}

// EURIBOR (aproximación automática)

document.getElementById("euriborValor").innerText="3.6% aprox";

// PERFIL

function calcularPerfil(){

let ingresos=(parseFloat(document.getElementById("perfilSalario1").value)||0)+
(parseFloat(document.getElementById("perfilSalario2").value)||0)+
(parseFloat(document.getElementById("perfilOtroIngreso").value)||0);

let pagas=parseFloat(document.getElementById("perfilPagas").value)||12;
let deuda=parseFloat(document.getElementById("perfilDeuda").value)||0;

let interesPerfil=(parseFloat(document.getElementById("perfilInteres").value)/100)/12;
let anosPerfil=parseFloat(document.getElementById("perfilPlazo").value);

let tipo=document.getElementById("perfilTipoVivienda").value;

let ingresosAnuales=ingresos*pagas;

let cuotaMax=ingresosAnuales*0.35/12-deuda;

let n=anosPerfil*12;

let capital=cuotaMax*(Math.pow(1+interesPerfil,n)-1)/(interesPerfil*(Math.pow(1+interesPerfil,n)));

let aviso=document.getElementById("perfilAviso");

if(tipo==="segunda"){

capital=capital*0.7;

aviso.innerText="Segunda residencia: financiación habitual máxima 70%";

}

if(tipo==="local"){

capital=capital*0.7;

if(anosPerfil>15){
anosPerfil=15;
document.getElementById("perfilPlazo").value=15;
}

aviso.innerText="Locales comerciales: financiación aprox 70% máximo 15 años";

}

document.getElementById("perfilCapital").innerText=formatMoney(capital);
document.getElementById("perfilCuota").innerText=formatMoney(cuotaMax);

let lti=(cuotaMax+deuda)*12/ingresosAnuales;

let estado=document.getElementById("perfilCompatible");
let msg=document.getElementById("perfilCompatibleMsg");

if(lti<=0.35){

estado.innerText="Compatible";
estado.style.color="green";
msg.innerText="Nivel de endeudamiento adecuado.";

}

else if(lti<=0.40){

estado.innerText="Aceptable";
estado.style.color="orange";
msg.innerText="Puede depender del banco.";

}

else{

estado.innerText="No viable";
estado.style.color="red";
msg.innerText="La cuota supera el nivel recomendado.";

}

}

document.querySelectorAll("#perfil input,#perfil select")
.forEach(el=>el.addEventListener("input",calcularPerfil));
