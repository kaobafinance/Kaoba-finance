// --- SELECCIÓN DE SECCIÓN ---
const btnCalculadora = document.getElementById("btnCalculadora");
const btnPerfil = document.getElementById("btnPerfil");
const calculadoraDiv = document.getElementById("calculadora");
const perfilDiv = document.getElementById("perfil");

btnCalculadora.addEventListener("click", () => { calculadoraDiv.style.display="block"; perfilDiv.style.display="none"; });
btnPerfil.addEventListener("click", () => { calculadoraDiv.style.display="none"; perfilDiv.style.display="block"; });

// --- EURIBOR ---
document.getElementById("euriborValor").innerText = "4,15% a marzo 2026";

// --- CALCULADORA ---
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

function formatMoney(n){ return new Intl.NumberFormat('es-ES',{style:'currency',currency:'EUR'}).format(n); }

function calcularHipoteca(){
  const capital = parseFloat(prestamoInput.value)||0;
  const interes = (parseFloat(interesInput.value)/100)/12||0;
  const anos = parseFloat(anosInput.value)||0;
  const n = anos*12;
  if(capital<=0||interes<=0||anos<=0){ resultadosDiv.style.display="none"; verTablaBtn.style.display="none"; tablaContainer.style.display="none"; return; }
  const cuota = capital*(interes*Math.pow(1+interes,n))/(Math.pow(1+interes,n)-1);
  const totalPagado = cuota*n;
  const interesesTotales = totalPagado-capital;
  cuotaOut.innerText = formatMoney(cuota);
  interesesTotalesOut.innerText = formatMoney(interesesTotales);
  totalPagadoOut.innerText = formatMoney(totalPagado);
  resultadosDiv.style.display="grid";
  verTablaBtn.style.display="block";
  tablaContainer.style.display="none";
}

// --- TABLA OPCIONAL ---
verTablaBtn.addEventListener("click", ()=>{
  if(tablaContainer.style.display==="none"){ generarTabla(); tablaContainer.style.display="block"; verTablaBtn.innerText="Ocultar tabla de amortización"; }
  else { tablaContainer.style.display="none"; verTablaBtn.innerText="Ver tabla de amortización"; }
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

// --- EVENTOS AUTOMÁTICOS CALCULADORA ---
[prestamoInput, interesInput, anosInput].forEach(el=>el.addEventListener("input",calcularHipoteca));
calcularHipoteca();

// --- PERFIL FINANCIERO ---
const perfilTitulares = document.getElementById("perfilTitulares");
const perfilEdad1 = document.getElementById("perfilEdad1");
const perfilEdad2 = document.getElementById("perfilEdad2");
const perfilTitular2Div = document.getElementById("perfilTitular2Div");
const perfilSalario1 = document.getElementById("perfilSalario1");
const perfilSalario2 = document.getElementById("perfilSalario2");
const perfilPagas = document.getElementById("perfilPagas");
const perfilDeuda = document.getElementById("perfilDeuda");
const perfilOtroIngreso = document.getElementById("perfilOtroIngreso");
const yaTieneVivienda = document.getElementById("yaTieneVivienda");
const viviendaInfo = document.getElementById("viviendaInfo");
const perfilPrecio = document.getElementById("perfilPrecio");
const perfilTipoVivienda = document.getElementById("perfilTipoVivienda");
const perfilPlazo = document.getElementById("perfilPlazo");
const perfilCapitalOut = document.getElementById("perfilCapital");
const perfilCuotaOut = document.getElementById("perfilCuota");
const perfilCompatibleOut = document.getElementById("perfilCompatible");
const perfilAviso = document.getElementById("perfilAviso");

function calcularPerfil(){
  let nTitulares=parseInt(perfilTitulares.value)||1;
  let edad1=parseInt(perfilEdad1.value)||0;
  let edad2=nTitulares===2?parseInt(perfilEdad2.value)||0:0;
  let maxEdad=Math.max(edad1,edad2);
  let plazoMax=Math.min(30,75-maxEdad);
  let precio=parseFloat(perfilPrecio.value)||0;
  let tipoVivienda=perfilTipoVivienda.value;
  let LTV=1;
  let aviso="";
  if(tipoVivienda==="segunda"||tipoVivienda==="local"){ LTV=0.7; aviso="Financiación máxima 70%"; plazoMax=Math.min(plazoMax,15); }
  perfilPlazo.value=plazoMax>0?plazoMax:0;
  let ingresos=(parseFloat(perfilSalario1.value)||0)+(nTitulares===2?(parseFloat(perfilSalario2.value)||0):0)+(parseFloat(perfilOtroIngreso.value)||0);
  let pagas=parseInt(perfilPagas.value)||12;
  let ingresosAnuales=ingresos*pagas;
  let deudas=parseFloat(perfilDeuda.value)||0;
  let ahorro=yaTieneVivienda.checked?parseFloat(document.getElementById("perfilAhorros").value)||0:0;
  let capitalPosible=precio*LTV;
  let tipoRef=0.028/12; 
  let n=plazoMax*12;
  let cuota=capitalPosible*(tipoRef*Math.pow(1+tipoRef,n))/(Math.pow(1+tipoRef,n)-1);
  let lti=(cuota+deudas)*12/ingresosAnuales;
  perfilCapitalOut.innerText=formatMoney(capitalPosible);
  perfilCuotaOut.innerText=formatMoney(cuota);
  perfilCompatibleOut.innerText=lti<=0.35?"Compatible":(lti<=0.4?"Aceptable":"No viable");
  perfilCompatibleOut.style.color=lti<=0.35?"green":(lti<=0.4?"orange":"red");
  perfilAviso.innerText=aviso;
}

perfilTitulares.addEventListener("change",()=>{
  perfilTitular2Div.style.display=perfilTitulares.value==="2"?"block":"none";
  calcularPerfil();
});
[perfilEdad1, perfilEdad2, perfilSalario1, perfilSalario2, perfilPagas, perfilDeuda, perfilOtroIngreso, perfilTipoVivienda, perfilPrecio, perfilPlazo, yaTieneVivienda].forEach(el=>el.addEventListener("input",calcularPerfil));
yaTieneVivienda.addEventListener("change",()=>{ viviendaInfo.style.display=yaTieneVivienda.checked?"block":"none"; calcularPerfil(); });
calcularPerfil();
