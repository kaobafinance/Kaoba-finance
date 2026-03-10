const inputs = document.querySelectorAll("input");
let chart1;
let debounceTimer;

inputs.forEach(i => i.addEventListener("input", () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(calcular, 250); // Debounce 250ms
}));

const precioInput = document.getElementById("precio");
const entradaInput = document.getElementById("entrada");
const interesInput = document.getElementById("interes");
const añosInput = document.getElementById("años");

function formatMoney(n){
  return new Intl.NumberFormat('es-ES',{style:'currency',currency:'EUR'}).format(n);
}

function toggleTabla(){
  const tabla = document.getElementById("tablaContainer");
  tabla.style.display = tabla.style.display==="none" ? "block" : "none";
}

function calcular(){
  let precio = parseFloat(precioInput.value);
  let ahorro = parseFloat(entradaInput.value);
  let interes = parseFloat(interesInput.value)/100/12;
  let años = parseFloat(añosInput.value);

  let gastos = precio * 0.10 + 2500; // Incluye 2.500€ de escrituras

  let entradaGastos = Math.min(ahorro, gastos);
  let entradaCasa = Math.max(0, ahorro - gastos);

  let capital = precio - entradaCasa;
  let n = años*12;

  let cuota = capital*(interes*Math.pow(1+interes,n))/(Math.pow(1+interes,n)-1);
  let saldo = capital;

  let meses = [];
  let saldoData = [];
  let totalIntereses = 0;

  let tbody = document.querySelector("#tabla tbody");
  tbody.innerHTML = "";

  let maxMesesTabla = 60; // mostrar solo 5 años en móviles/tablets
  for(let i=1;i<=n;i++){
    let interesMes = saldo*interes;
    let capitalMes = cuota - interesMes;
    saldo -= capitalMes;
    totalIntereses += interesMes;
    meses.push(i);
    saldoData.push(saldo);

    if(i <= maxMesesTabla){
      let row = `
      <tr>
        <td>${i}</td>
        <td>${formatMoney(cuota)}</td>
        <td>${formatMoney(interesMes)}</td>
        <td>${formatMoney(capitalMes)}</td>
        <td>${formatMoney(Math.max(saldo,0))}</td>
      </tr>
      `;
      tbody.innerHTML += row;
    }
  }

  document.getElementById("capital").innerText = formatMoney(capital);
  document.getElementById("cuota").innerText = formatMoney(cuota);
  document.getElementById("intereses").innerText = formatMoney(totalIntereses);
  document.getElementById("sueldo").innerText = formatMoney(cuota/0.35);
  document.getElementById("ltv").innerText = ((capital/precio)*100).toFixed(1) + "%";
  document.getElementById("gastos").innerText = formatMoney(gastos);
  document.getElementById("entradaGastos").innerText = formatMoney(entradaGastos);
  document.getElementById("entradaCasa").innerText = formatMoney(entradaCasa);

  // actualizar gráfico sin recrearlo
  if(chart1){
    chart1.data.labels = meses;
    chart1.data.datasets[0].data = saldoData;
    chart1.update();
  } else {
    chart1 = new Chart(document.getElementById("grafico1"),{
      type:"line",
      data:{
        labels:meses,
        datasets:[{
          label:"Capital pendiente",
          data:saldoData,
          borderColor:"#0077ff",
          backgroundColor:"rgba(0,119,255,0.2)"
        }]
      },
      options:{
        responsive:true,
        maintainAspectRatio:false,
        plugins:{legend:{display:true}},
        scales:{y:{beginAtZero:true, ticks:{callback:v=>formatMoney(v)}}}
      }
    });
  }
}

// calcular al inicio
calcular();
