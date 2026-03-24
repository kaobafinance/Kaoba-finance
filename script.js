// =============================
// SCRIPT COMPLETO KAОBA FINANCE
// =============================

// -----------------------------
// ELEMENTOS MODAL CALCULADORA
// -----------------------------
const btnCalculadoraFlotante = document.getElementById("btnCalculadoraFlotante");
const modal = document.getElementById("modalCalculadora");
const cerrarModal = document.getElementById("cerrarModal");

// Abrir y cerrar modal
btnCalculadoraFlotante.addEventListener("click", () => modal.style.display = "block");
cerrarModal.addEventListener("click", () => modal.style.display = "none");
window.addEventListener("click", e => { if (e.target === modal) modal.style.display = "none"; });

// -----------------------------
// ELEMENTOS CALCULADORA
// -----------------------------
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

// -----------------------------
// FORMATO MONEDA
// -----------------------------
function formatMoney(n) {
  return new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(n);
}

// -----------------------------
// FUNCIONES CALCULADORA
// -----------------------------
function calcular(inputs, cuotaEl, interesesEl, totalEl, resultadosDivEl, verTablaBtnEl, tablaContainerEl) {
  const capital = parseFloat(inputs[0].value) || 0;
  const interes = (parseFloat(inputs[1].value)/100)/12 || 0;
  const anos = parseFloat(inputs[2].value) || 0;
  const n = anos*12;

  if (capital <= 0 || interes <= 0 || anos <= 0) {
    resultadosDivEl.style.display = "flex";
    verTablaBtnEl.style.display = "none";
    tablaContainerEl.style.display = "none";
    return;
  }

  const cuota = capital * (interes * Math.pow(1+interes,n)) / (Math.pow(1+interes,n)-1);
  const totalPagado = cuota*n;
  const interesesTotales = totalPagado - capital;

  cuotaEl.innerText = formatMoney(cuota);
  interesesEl.innerText = formatMoney(interesesTotales);
  totalEl.innerText = formatMoney(totalPagado);

  resultadosDivEl.style.display = "flex";
  verTablaBtnEl.style.display = "block";
  tablaContainerEl.style.display = "none";
}

function generarTabla(inputs, tbodyEl) {
  tbodyEl.innerHTML = "";
  const capital = parseFloat(inputs[0].value) || 0;
  const interes = (parseFloat(inputs[1].value)/100)/12 || 0;
  const anos = parseFloat(inputs[2].value) || 0;
  const n = anos*12;
  const cuota = capital * (interes * Math.pow(1+interes,n)) / (Math.pow(1+interes,n)-1);
  let saldo = capital;

  for (let i=1;i<=n;i++){
    const interesMes = saldo*interes;
    const capitalMes = cuota-interesMes;
    saldo -= capitalMes;
    tbodyEl.innerHTML += `<tr>
      <td>${i}</td>
      <td>${formatMoney(cuota)}</td>
      <td>${formatMoney(interesMes)}</td>
      <td>${formatMoney(capitalMes)}</td>
      <td>${formatMoney(Math.max(saldo,0))}</td>
    </tr>`;
  }
}

// Eventos inputs calculadora
[prestamoInput, interesInput, anosInput].forEach(el =>
  el.addEventListener("input", () => calcular([prestamoInput, interesInput, anosInput], cuotaOut, interesesTotalesOut, totalPagadoOut, resultadosDiv, verTablaBtn, tablaContainer))
);

// Evento ver tabla
verTablaBtn.addEventListener("click", () => {
  if(tablaContainer.style.display==="none"){
    generarTabla([prestamoInput, interesInput, anosInput], tbody);
    tablaContainer.style.display="block";
    verTablaBtn.innerText="Ocultar tabla de amortización";
  } else {
    tablaContainer.style.display="none";
    verTablaBtn.innerText="Ver cuadro de amortización";
  }
});

// -----------------------------
// PERFIL FINANCIERO
// -----------------------------
const perfilDiv = document.getElementById("perfil");
const calculadoraDiv = document.getElementById("calculadora");

const perfilTitulares = document.getElementById("perfilTitulares");
const perfilEdad1 = document.getElementById("perfilEdad1");
const perfilEdad2 = document.getElementById("perfilEdad2");
const titular2Div = document.getElementById("titular2Div");
const perfilSalario1 = document.getElementById("perfilSalario1");
const perfilSalario2 = document.getElementById("perfilSalario2");
const perfilPagas = document.getElementById("perfilPagas");
const perfilAhorros = document.getElementById("perfilAhorros");
const perfilDeuda = document.getElementById("perfilDeuda");
const perfilOtroIngreso = document.getElementById("perfilOtroIngreso");
const yaTieneVivienda = document.getElementById("agregardatosdelavivienda");
const viviendaInfo = document.getElementById("viviendaInfo");
const perfilPrecio = document.getElementById("perfilPrecio");
const perfilTipoVivienda = document.getElementById("perfilTipoVivienda");
const perfilComunidad = document.getElementById("perfilComunidad");
const perfilPrimeraSegunda = document.getElementById("perfilPrimeraSegunda");
const perfilPlazo = document.getElementById("perfilPlazo");
const perfilCapitalOut = document.getElementById("perfilCapital");
const perfilCuotaOut = document.getElementById("perfilCuota");
const perfilLTVOut = document.getElementById("perfilLTV");
const perfilGastosOut = document.getElementById("perfilGastos");
const perfilLTIOut = document.getElementById("perfilLTI");
const perfilCompatibleOut = document.getElementById("perfilCompatible");
const avisoSegunda = document.getElementById("avisoSegunda");

let plazoEditadoPorUsuario = false;

function calcularPerfil(){
  const nTitulares = parseInt(perfilTitulares.value) || 1;
  const edad1 = parseInt(perfilEdad1.value) || 0;
  const edad2 = nTitulares===2 ? parseInt(perfilEdad2.value) || 0 : 0;
  const maxEdad = Math.max(edad1, edad2);
  const plazoMax = Math.min(30,75-maxEdad);

  perfilPlazo.max = plazoMax>0?plazoMax:0;
  if(!plazoEditadoPorUsuario) perfilPlazo.value = plazoMax>0?plazoMax:0;
  if(plazoMax<=0) return;

  const ingresos = (parseFloat(perfilSalario1.value)||0)+(nTitulares===2?(parseFloat(perfilSalario2.value)||0):0)+(parseFloat(perfilOtroIngreso.value)||0);
  const pagas = parseInt(perfilPagas.value)||12;
  const ingresosAnuales = ingresos*pagas;
  const deudas = parseFloat(perfilDeuda.value)||0;

  const tipoRef = 0.028/12;
  const plazo = parseInt(perfilPlazo.value)||plazoMax;
  const n = plazo*12;
  const cuotaMax = ingresosAnuales*0.35/12 - deudas;
  let capitalPosible = cuotaMax*(Math.pow(1+tipoRef,n)-1)/(tipoRef*Math.pow(1+tipoRef,n));

  const precio = parseFloat(perfilPrecio.value)||0;
  const impuestos = perfilTipoVivienda.value==="obraNueva"?precio*0.10:precio*parseFloat(perfilComunidad.value);
  const gastos = impuestos + 2500;
  const ahorros = parseFloat(perfilAhorros.value)||0;
  const entrada = perfilPrimeraSegunda.value==="segunda"?precio*0.30:precio*0.20;
  const faltanteEntrada = Math.max(entrada-ahorros,0);

  if(yaTieneVivienda.checked) capitalPosible = precio+gastos;

  const cuota = capitalPosible*(tipoRef*Math.pow(1+tipoRef,n))/(Math.pow(1+tipoRef,n)-1);
  const ltv = precio>0?capitalPosible/precio*100:0;
  const lti = ingresosAnuales>0?(cuota+deudas)*12/ingresosAnuales:0;

  perfilCapitalOut.innerText = formatMoney(capitalPosible);
  perfilCuotaOut.innerText = formatMoney(cuota);
  perfilLTVOut.innerText = ltv>0?ltv.toFixed(1)+"%":"-";
  perfilGastosOut.innerText = formatMoney(gastos);
  perfilLTIOut.innerText = (lti*100).toFixed(1)+"%";

  if(perfilPrimeraSegunda.value==="segunda" && ltv>70){
    avisoSegunda.style.display="block";
    avisoSegunda.innerHTML=`<strong>¡Atención! Segunda residencia con alta financiación:</strong>
      <p>Necesario aportar ${formatMoney(faltanteEntrada)}, más gastos aproximados ${formatMoney(gastos)}</p>`;
  } else avisoSegunda.style.display="none";

  if(lti<=0.35){
    perfilCompatibleOut.innerText="Compatible"; perfilCompatibleOut.style.color="green";
  } else if(lti<=0.40){
    perfilCompatibleOut.innerText="Aceptable"; perfilCompatibleOut.style.color="orange";
  } else {
    perfilCompatibleOut.innerText="No viable"; perfilCompatibleOut.style.color="red";
  }
}

// Eventos perfil
perfilPlazo.addEventListener("input", ()=>plazoEditadoPorUsuario=true);
[
  perfilEdad1, perfilEdad2, perfilSalario1, perfilSalario2,
  perfilPagas, perfilAhorros, perfilDeuda, perfilOtroIngreso,
  perfilPrecio
].forEach(el => el.addEventListener("input", calcularPerfil));

[
  perfilTitulares, perfilTipoVivienda, perfilComunidad, perfilPrimeraSegunda
].forEach(el => el.addEventListener("change", calcularPerfil));

perfilTitulares.addEventListener("change", ()=>{
  titular2Div.style.display = perfilTitulares.value==="2"?"block":"none";
  calcularPerfil();
});

yaTieneVivienda.addEventListener("change", ()=>{
  viviendaInfo.style.display = yaTieneVivienda.checked?"block":"none";
  calcularPerfil();
});

// Inicializar
calcularPerfil();

// -----------------------------
// OPERACIONES (tarjetas y selección)
// -----------------------------
function abrirOperacion(id){
  document.querySelectorAll(".card-content").forEach(cc=>{
    if(cc.id===id) cc.classList.toggle("open");
    else cc.classList.remove("open");
  });
}

function irAnalisis(event, tipo){
  event.stopPropagation();
  const badge = document.getElementById("operacionSeleccionada");
  const mismoTipo = badge.innerText.includes(tipo);
  if(perfilDiv.style.display==="block" && mismoTipo){
    perfilDiv.style.display="none"; badge.style.display="none"; return;
  }
  perfilDiv.style.display="block"; calculadoraDiv.style.display="none";
  badge.style.display="block"; badge.innerText=`Operación seleccionada: ${tipo}`;

  switch(tipo){
    case "Compra Primera Vivienda": perfilPrimeraSegunda.value="primera"; yaTieneVivienda.checked=false; break;
    case "Cambio de Hipoteca": perfilPrimeraSegunda.value="segunda"; yaTieneVivienda.checked=true; break;
    case "Inversión": perfilPrimeraSegunda.value="segunda"; yaTieneVivienda.checked=false; break;
  }

  viviendaInfo.style.display = yaTieneVivienda.checked?"block":"none";
  calcularPerfil();
  perfilDiv.scrollIntoView({behavior:"smooth"});
}

// -----------------------------
// ENVÍO PDF SIMULACIÓN
// -----------------------------
const leadForm = document.getElementById("leadForm");
const leadNombre = document.getElementById("leadNombre");
const leadEmail = document.getElementById("leadEmail");
const leadConsent = document.getElementById("leadConsentimiento");
const leadEnviar = document.getElementById("enviarLead");

leadEnviar.addEventListener("click", ()=>{
  if(!leadNombre.value || !leadEmail.value || !leadConsent.checked){
    alert("Por favor, completa todos los campos y acepta la política de privacidad."); return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit:"pt", format:"a4" });
  let y=40; const margin=40;

  // HEADER
  doc.setFillColor(14,63,139); doc.rect(0,0,595,60,"F");
  doc.setFontSize(22); doc.setTextColor(255,255,255); doc.setFont("helvetica","bold");
  doc.text("Simulación Hipotecaria", margin,40);
  doc.setFontSize(11); doc.setFont("helvetica","normal"); doc.setTextColor(220,230,255);
  doc.text("Kaoba Finance Simulador",555,28,{align:"right"});

  y+=80; doc.setFontSize(12); doc.setTextColor(0,0,0);

  // DATOS CLIENTE
  doc.text("Datos del cliente:",margin,y); y+=15;
  doc.text(`Nombre: ${leadNombre.value}`,margin,y); y+=15;
  doc.text(`Correo: ${leadEmail.value}`,margin,y); y+=25;

  // DATOS PERFIL
  doc.setFont("helvetica","bold"); doc.text("Perfil financiero:",margin,y); y+=18; doc.setFont("helvetica","normal");
  const perfilDatos = [
    {label:"Número de titulares",value:perfilTitulares.value},
    {label:"Edad titular 1",value:perfilEdad1.value},
    {label:"Ingreso mensual titular 1",value:perfilSalario1.value?formatMoney(perfilSalario1.value):"-"},
  ];
  if(perfilTitulares.value==="2"){
    perfilDatos.push({label:"Edad titular 2",value:perfilEdad2.value});
    perfilDatos.push({label:"Ingreso mensual titular 2",value:perfilSalario2.value?formatMoney(perfilSalario2.value):"-"});
  }
  perfilDatos.push(
    {label:"Número de pagas al año",value:perfilPagas.value},
    {label:"Ahorros disponibles",value:perfilAhorros.value?formatMoney(perfilAhorros.value):"-"},
    {label:"Deudas / pagos mensuales",value:perfilDeuda.value?formatMoney(perfilDeuda.value):"-"},
    {label:"Otro ingreso mensual opcional",value:perfilOtroIngreso.value?formatMoney(perfilOtroIngreso.value):"-"}
  );
  perfilDatos.forEach(d=>{doc.text(`${d.label}: ${d.value}`,margin,y); y+=15;});

  // DATOS VIVIENDA
  if(yaTieneVivienda.checked){
    y+=10; doc.setFont("helvetica","bold"); doc.text("Datos de la vivienda:",margin,y); y+=18; doc.setFont("helvetica","normal");
    const viviendaDatos = [
      {label:"Precio vivienda",value:perfilPrecio.value?formatMoney(perfilPrecio.value):"-"},
      {label:"Tipo de vivienda",value:perfilTipoVivienda.options[perfilTipoVivienda.selectedIndex].text},
      {label:"Comunidad Autónoma",value:perfilComunidad.options[perfilComunidad.selectedIndex].text},
      {label:"Vivienda habitual o segunda",value:perfilPrimeraSegunda.options[perfilPrimeraSegunda.selectedIndex].text},
      {label:"Plazo máximo (años)",value:perfilPlazo.value}
    ];
    viviendaDatos.forEach(d=>{doc.text(`${d.label}: ${d.value}`,margin,y); y+=15;});
  }

  // RESULTADOS
  y+=10; doc.setFont("helvetica","bold"); doc.text("Resultados simulación:",margin,y); y+=18; doc.setFont("helvetica","normal");
  const resultados = [
    {titulo:"Capital posible",valor:perfilCapitalOut.innerText},
    {titulo:"Cuota mensual",valor:perfilCuotaOut.innerText},
    {titulo:"% Financiación (LTV)",valor:perfilLTVOut.innerText},
    {titulo:"Gastos estimados",valor:perfilGastosOut.innerText},
    {titulo:"LTI",valor:perfilLTIOut.innerText},
    {titulo:"Compatibilidad",valor:perfilCompatibleOut.innerText}
  ];
  const cardWidth=250, cardHeight=35;
  resultados.forEach((r,i)=>{
    const x = margin+(i%2)*(cardWidth+20);
    if(i%2===0 && i!==0) y+=cardHeight+10;
    doc.setFillColor(220,230,250); doc.roundedRect(x,y,cardWidth,cardHeight,5,5,"F");
    doc.setFont("helvetica","bold"); doc.text(r.titulo,x+5,y+12);
    doc.setFont("helvetica","normal"); doc.text(r.valor,x+5,y+27);
  });

  y+=cardHeight+30;
  const consejos = [
    "Ahorrar al menos el 20% del precio mejora la aprobación bancaria.",
    "Mantener deudas bajas y pagos puntuales mejora tu historial crediticio.",
    "Comparar ofertas de diferentes bancos puede reducir el interés total."
  ];
  doc.setFont("helvetica","bold"); doc.text("Consejos prácticos:",margin,y); y+=20; doc.setFont("helvetica","normal");
  consejos.forEach(c=>{doc.splitTextToSize(c,515).forEach(line=>{doc.text(`• ${line}`,margin,y); y+=15}); y+=5;});

  y+=10; doc.setDrawColor(0,63,139); doc.setLineWidth(1); doc.line(margin,y,555,y); y+=15;
  doc.setFont("helvetica","italic"); doc.setFontSize(10);
  const aviso = "Los cálculos son estimativos y dependen de los datos proporcionados. Las condiciones definitivas las determina la entidad financiera. Esta simulación no sustituye asesoramiento profesional.";
  const avisoLines = doc.splitTextToSize(aviso, 515);
  avisoLines.forEach(line => { doc.text(line, margin, y); y += 12; });

  // Guardar PDF
  doc.save(`Simulacion_Hipoteca_${leadNombre.value}.pdf`);
  alert(`Simulación generada y enviada a: ${leadEmail.value}\nGracias ${leadNombre.value}!`);
  leadForm.reset();
});
