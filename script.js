const inputs=document.querySelectorAll("input");
const comunidadInput = document.getElementById("comunidad");

inputs.forEach(i=>i.addEventListener("input",calcular));
comunidadInput.addEventListener("change",calcular);

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

  let itp = parseFloat(comunidadInput.value) || 0.08;
  let gastos = 2500 + precio * itp; // Escrituras + ITP
  let entradaGastos = Math.min(ahorro, gastos);
  let entradaCasa = Math.max(0, ahorro - entradaGastos);

  let capital = precio - entradaCasa;
  let n = años*12;
  let cuota = capital*(interes*Math.pow(1+interes,n))/(Math.pow(1+interes,n)-1);
  let saldo = capital;

  let meses=[], saldoData=[], totalIntereses=0;

  let tbody = document.querySelector("#tabla tbody");
  tbody.innerHTML="";

  for(let i=1;i<=n;i++){
    let interesMes = saldo*interes;
    let capitalMes = cuota - interesMes;
    saldo -= capitalMes;
    totalIntereses += interesMes;

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

  document.getElementById("capital").innerText = formatMoney(capital);
  document.getElementById("cuota").innerText = formatMoney(cuota);
  document.getElementById("intereses").innerText = formatMoney(totalIntereses);
  document.getElementById("sueldo").innerText = formatMoney(cuota/0.35);
  document.getElementById("ltv").innerText = ((capital/precio)*100).toFixed(1) + "%";

  document.getElementById("gastos").innerText = formatMoney(gastos);
  document.getElementById("entradaGastos").innerText = formatMoney(entradaGastos);
  document.getElementById("entradaCasa").innerText = formatMoney(entradaCasa);
}

calcular();
