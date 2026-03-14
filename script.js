// --- SELECCIÓN DE SECCIÓN ---
const btnCalculadora = document.getElementById("btnCalculadora");
const btnPerfil = document.getElementById("btnPerfil");
const calculadoraDiv = document.getElementById("calculadora");
const perfilDiv = document.getElementById("perfil");

btnCalculadora.addEventListener("click", () => {
  calculadoraDiv.style.display="block";
  perfilDiv.style.display="none";
});
btnPerfil.addEventListener("click", () => {
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

const resultadosDiv = document.getElementById("resultados");
const verTablaBtn = document.getElementById("verTabla");
const tablaContainer = document.getElementById("tablaContainer");
const tbody = document.querySelector("#tabla tbody");

// --- FORMATO MONEDA ---
function formatMoney(n){return new Intl.NumberFormat('es-ES',{style:'currency',currency:'EUR'}).format(n);}

// --- CALCULO AUTOMATICO ---
function calcularHipoteca(){
  const capital=parseFloat(prestamoInput.value)||0;
  const interes=(parseFloat(interesInput.value)/100)/12||0;
  const anos=parseFloat(anosInput.value)||0;
  const n=anos*12;

  if(capital<=0||interes<=0||anos<=0){resultadosDiv.style.display="none";verTablaBtn.style.display="none";tablaContainer.style.display="none";return;}

  const cuota=capital*(interes*Math.pow(1+interes,n))/(Math.pow(1+interes,n)-1);
  const totalPagado=cuota*n;
  const interesesTotales=totalPagado-capital;

  cuotaOut.innerText=formatMoney(cuota);
  interesesTotalesOut.innerText=formatMoney(interesesTotales);
  totalPagadoOut.innerText=formatMoney(totalPagado);

  resultadosDiv.style.display="grid";
  verTablaBtn.style.display="block";
  tablaContainer.style.display="none";
}

// --- TABLA AMORTIZACION OPCIONAL ---
verTablaBtn.addEventListener("click",()=>{
  if(tablaContainer.style.display==="none"){generarTabla();tablaContainer.style.display="block";verTablaBtn.innerText="Ocultar tabla de amortización";}
  else{tablaContainer.style.display="none";verTablaBtn.innerText="Ver tabla de amortización";}
});
function generarTabla(){
  tbody.innerHTML="";
  const capital=parseFloat(prestamoInput.value)||0;
  const interes=(parseFloat(interesInput.value)/100)/12||0;
  const anos=parseFloat(anosInput.value)||0;
  const n=anos*12;
  const cuota=capital*(interes*Math.pow(1+interes,n))/(Math.pow(1+interes,n)-1);
  let saldo=capital;
  for(let i=1;i<=n;i++){
    const interesMes=saldo*interes;
    const capitalMes=cuota-interesMes;
    saldo-=capitalMes;
    tbody.innerHTML+=`<tr><td>${i}</td><td>${formatMoney(cuota)}</td><td>${formatMoney(interesMes)}</td><td>${formatMoney(capitalMes)}</td><td>${formatMoney(Math.max(saldo,0))}</td></tr>`;
  }
}
[prestamoInput,interesInput,anosInput].forEach(el=>el.addEventListener("input",calcularHipoteca));
calcularHipoteca();

// --- PERFIL ---
const perfilTitulares = document.getElementById("perfilTitulares");
const titular2Div = document.getElementById("titular2");
const yaTieneVivienda = document.getElementById("yaTieneVivienda");
const viviendaInfo = document.getElementById("viviendaInfo");

const perfilEdad1 = document.getElementById("perfilEdad1");
const perfilSalario1 = document.getElementById("perfilSalario1");
const perfilPagas = document.getElementById("perfilPagas");
const perfilDeuda = document.getElementById("perfilDeuda");
const perfilOtroIngreso = document.getElementById("perfilOtroIngreso");

const perfilEdad2 = document.getElementById("perfilEdad2");
const perfilSalario2 = document.getElementById("perfilSalario2");
const perfilPagas2 = document.getElementById("perfilPagas2");
const perfilDeuda2 = document.getElementById("perfilDeuda2");
const perfilOtroIngreso2 = document.getElementById("perfilOtroIngreso2");

const perfilPrecio = document.getElementById("perfilPrecio");
const perfilTipoVivienda = document.getElementById("perfilTipoVivienda");
const perfilComunidad = document.getElementById("perfilComunidad");
const perfilPlazo = document.getElementById("perfilPlazo");
const perfilInteres = document.getElementById("perfilInteres");

const perfilCapitalOut = document.getElementById("perfilCapital");
const perfilCuotaOut = document.getElementById("perfilCuota");
const perfilLTVOut = document.getElementById("perfilLTV");
const perfilGastosOut = document.getElementById("perfilGastos");
const perfilLTIOut = document.getElementById("perfilLTI");
const perfilCompatibleOut = document.getElementById("perfilCompatible");

// --- MOSTRAR TITULAR 2 ---
perfilTitulares.addEventListener("change",()=>{
  if(perfilTitulares.value==="2"){titular2Div.style.display="block";}
  else{titular2Div.style.display="none";}
  calcularPerfil();
});

// --- MOSTRAR DATOS VIVIENDA ---
yaTieneVivienda.addEventListener("change",()=>{
  viviendaInfo.style.display=yaTieneVivienda.checked?"grid":"none";
  calcularPerfil();
});
perfilTipoVivienda.addEventListener("change",calcularPerfil);
perfilComunidad.addEventListener("change",calcularPerfil);
perfilPlazo.addEventListener("input",calcularPerfil);
perfilInteres.addEventListener("input",calcularPerfil);

// --- FUNCION PERFIL ---
function calcularPerfil(){
  let nTitulares = parseInt(perfilTitulares.value)||1;

  let ingresos = (parseFloat(perfilSalario1.value)||0)* (parseInt(perfilPagas.value)||12) + (parseFloat(perfilOtroIngreso.value)||0);
  if(nTitulares===2){ingresos += (parseFloat(perfilSalario2.value)||0)*(parseInt(perfilPagas2.value)||12) + (parseFloat(perfilOtroIngreso2.value)||0);}
  let deudas = parseFloat(perfilDeuda.value)||0;
  if(nTitulares===2){deudas += parseFloat(perfilDeuda2.value)||0;}

  let edadMax = parseInt(perfilEdad1.value)||0;
  if(nTitulares===2){edadMax = Math.max(edadMax,parseInt(perfilEdad2.value)||0);}
  let plazoMax = Math.min(30,75-edadMax);
  let n = plazoMax*12;

  let tipoRef = (parseFloat(perfilInteres.value)||2.8)/100/12;

  let cuotaMax = ingresos*0.35/12 - deudas;
  let capitalPosible = cuotaMax*(Math.pow(1+tipoRef,n)-1)/(tipoRef*(Math.pow(1+tipoRef,n)));

  let gastos=0,ltv=0;

  if(yaTieneVivienda.checked){
    let precio = parseFloat(perfilPrecio.value)||0;
    let factor = perfilTipoVivienda.value==="primera"?1:0.7;
    if(precio>0){ltv = factor*100;}
    gastos = perfilTipoVivienda.value==="obraNueva"?precio*0.10:precio*parseFloat(perfilComunidad.value) + 2500;
    capitalPosible = precio*factor + gastos - (parseFloat(document.getElementById("perfilAhorros").value)||0);
  }

  let cuota = capitalPosible*(tipoRef*Math.pow(1+tipoRef,n))/(Math.pow(1+tipoRef,n)-1);
  let lti = (cuota + deudas)*12/ingresos;

  perfilCapitalOut.innerText = formatMoney(capitalPosible);
  perfilCuotaOut.innerText = formatMoney(cuota);
  perfilLTVOut.innerText = ltv>0?ltv.toFixed(1)+"%":"-";
  perfilGastosOut.innerText = formatMoney(gastos);
  perfilLTIOut.innerText = (lti*100).toFixed(1)+"%";

  if(lti<=0.35){perfilCompatibleOut.innerText="Compatible";perfilCompatibleOut.style.color="green";}
  else if(lti<=0.40){perfilCompatibleOut.innerText="Aceptable";perfilCompatibleOut.style.color="orange";}
  else{perfilCompatibleOut.innerText="No viable";perfilCompatibleOut.style.color="red";}
}

// --- EVENTOS AUTOMATICOS PERFIL ---
[
  perfilEdad1, perfilSalario1, perfilPagas, perfilDeuda, perfilOtroIngreso,
  perfilEdad2, perfilSalario2, perfilPagas2, perfilDeuda2, perfilOtroIngreso2,
  perfilTitulares, perfilPrecio, perfilTipoVivienda, perfilComunidad, perfilPlazo,
  perfilInteres, yaTieneVivienda
].forEach(el=>el.addEventListener("input",calcularPerfil));

calcularPerfil();
