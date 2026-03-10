const inputs=document.querySelectorAll("input");
inputs.forEach(i=>i.addEventListener("input",calcular));

let chart1;

const precioInput=document.getElementById("precio");
const entradaInput=document.getElementById("entrada");
const interesInput=document.getElementById("interes");
const añosInput=document.getElementById("años");

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
  let interes=parseFloat(interesInput.value)/100/12||0;
  let años=parseFloat(añosInput.value)||0;

  // Gastos de escritura ya incluidos (2500 €)
  let gastos = 2500 + precio*0.08; // 8% impuestos aprox
  let entradaGastos = Math.min(ahorro, gastos);
  let entradaCasa = Math.max(0, ahorro-entradaGastos);

  let capital = precio - entradaCasa;

  let n = años*12;
  let cuota = capital*(interes*Math.pow(1+interes,n))/(Math.pow(1+interes,n)-1);
  let saldo = capital;

  let meses=[], saldoData=[], totalIntereses=0;
  const tbody = document.querySelector("#tabla tbody");
  tbody.innerHTML="";

  for(let i=1;i<=n;i++){
    let interesMes = saldo*interes;
    let capitalMes = cuota - interesMes;
    saldo -= capitalMes;
    totalIntereses += interesMes;

    meses.push(i);
    saldoData.push(saldo);

    let row=`<tr>
      <td>${i}</td>
      <td>${formatMoney(cuota)}</td>
      <td>${formatMoney(interesMes)}</td>
      <td>${formatMoney(capitalMes)}</td>
      <td>${formatMoney(Math.max(saldo,0))}</td>
    </tr>`;
    tbody.innerHTML += row;
  }

  document.getElementById("capital").innerText = formatMoney(capital);
  document.getElementById("cuota").innerText = formatMoney(cuota);
  document.getElementById("intereses").innerText = formatMoney(totalIntereses);
  document.getElementById("sueldo").innerText = formatMoney(cuota/0.35);
  document.getElementById("ltv").innerText = ((capital/precio)*100).toFixed(1) + "%";

  document.getElementById("gastos").innerText = formatMoney(gastos);
  document.getElementById("entradaGastos").innerText = formatMoney(entradaGastos);
  document.getElementById("entradaCasa").innerText = formatMoney(entradaCasa);

  if(chart1) chart1.destroy();
  chart1 = new Chart(document.getElementById("grafico1"),{
    type:"line",
    data:{
      labels:meses,
      datasets:[{
        label:"Capital pendiente",
        data:saldoData,
        borderColor:"#0077ff",
        backgroundColor:"rgba(0,119,255,0.1)",
        fill:true
      }]
    },
    options:{
      responsive:true,
      maintainAspectRatio:false,
      plugins:{legend:{display:false}}
    }
  });
}

calcular();
