function calcular(){
let precio=parseFloat(document.getElementById("precio").value);
let entrada=parseFloat(document.getElementById("entrada").value)||0;
let años=parseFloat(document.getElementById("años").value);
let meses=años*12;
let interesF=parseFloat(document.getElementById("interesFijo").value)/100/12;
let interesV=parseFloat(document.getElementById("interesVar").value)/100/12 + parseFloat(document.getElementById("euribor").value)/100/12;
let anticipada=parseFloat(document.getElementById("anticipada").value)||0;

// Gastos
let impuesto=parseFloat(document.getElementById("impuesto").value)/100;
let notaria=parseFloat(document.getElementById("notaria").value)||0;
let registro=parseFloat(document.getElementById("registro").value)||0;
let tasacion=parseFloat(document.getElementById("tasacion").value)||0;
let gestoria=parseFloat(document.getElementById("gestoria").value)||0;
let gastosTotales=(precio-entrada)*impuesto+notaria+registro+tasacion+gestoria;

let monto=precio-entrada;

function cuotaMensual(monto,interes,meses){
return monto*interes/(1-Math.pow(1+interes,-meses));
}

let cuotaF=cuotaMensual(monto,interesF,meses);
let cuotaV=cuotaMensual(monto,interesV,meses);

let deuda=monto;
let tabla=""; let totalInteres=0;
let capitalData=[]; let interesData=[];

for(let i=1;i<=meses;i++){
let interesPago=deuda*interesF;
let capitalPago=cuotaF-interesPago;

if(anticipada>0 && i===1){
deuda-=anticipada;
}

deuda-=capitalPago;
totalInteres+=interesPago;

tabla+=`<tr>
<td>${i}</td>
<td>${cuotaF.toFixed(2)}</td>
<td>${interesPago.toFixed(2)}</td>
<td>${capitalPago.toFixed(2)}</td>
<td>${deuda.toFixed(2)}</td>
</tr>`;

capitalData.push(capitalPago);
interesData.push(interesPago);
}

document.querySelector("#tabla tbody").innerHTML=tabla;
let totalPagado=cuotaF*meses;

document.getElementById("resultado").innerHTML=
`<b>Tipo Fijo:</b> ${cuotaF.toFixed(2)} €/mes, total: ${totalPagado.toFixed(2)} €<br>
<b>Tipo Variable:</b> ${cuotaV.toFixed(2)} €/mes<br>
<b>Intereses:</b> ${totalInteres.toFixed(2)} €<br>
<b>Gastos de compra:</b> ${gastosTotales.toFixed(2)} €<br>
<b>Precio total con gastos:</b> ${(precio+gastosTotales).toFixed(2)} €`;

new Chart(document.getElementById("grafico"),{
type:"pie",
data:{
labels:["Capital","Intereses","Gastos compra"],
datasets:[{data:[monto,totalInteres,gastosTotales],backgroundColor:["#0077ff","#00cc66","#ff9933"]}]
},
options:{responsive:true}
});
}
