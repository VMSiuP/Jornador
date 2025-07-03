// script.js
document.getElementById('darkModeToggle').addEventListener('change', function () {
  document.body.classList.toggle('dark', this.checked);
});

function calcularDias() {
  let años = parseInt(document.getElementById('años').value) || 0;
  let meses = parseInt(document.getElementById('meses').value) || 0;
  let días = parseInt(document.getElementById('días').value) || 0;

  // Validaciones estrictas
  if (document.getElementById('años').value && (años < 1 || años > 3)) {
    alert("Solo se permite ingresar 1, 2 ó 3 años como máximo.");
    document.getElementById('resultado').value = '';
    document.getElementById('resultadoDescuento').value = '';
    return;
  }

  let totalDías = (años * 365) + (meses * 30) + días;

  if (totalDías < 7 || totalDías > 1095) { // 3 años = 1095 días
    document.getElementById('resultado').value = '';
    document.getElementById('resultadoDescuento').value = '';
    return;
  }

  let jornadas = Math.round(totalDías / 7);
  if (jornadas < 10 || jornadas > 156) {
    document.getElementById('resultado').value = '';
    document.getElementById('resultadoDescuento').value = '';
    return;
  }

  document.getElementById('resultado').value = `${jornadas} jornadas`;
  actualizarDescuento(jornadas);
  return jornadas;
}

['años', 'meses', 'días'].forEach(id => {
  document.getElementById(id).addEventListener('input', calcularDias);
});

function copiarResultado(id) {
  const resultado = document.getElementById(id).value;
  if (!resultado) return;
  navigator.clipboard.writeText(resultado);
  alert("Resultado copiado.");
}

function compartirWhatsApp(id) {
  const texto = document.getElementById(id).value;
  if (!texto) return;
  window.open(`https://wa.me/?text=${encodeURIComponent(texto)}`, '_blank');
}

function nuevoCalculo() {
  ['años', 'meses', 'días'].forEach(id => document.getElementById(id).value = '');
  document.getElementById('resultado').value = '';
  document.getElementById('resultadoDescuento').value = '';
}

function nuevoCompleto() {
  nuevoCalculo();
}

let descuentoActivo = null;

function descontar(tipo) {
  const jornadasStr = document.getElementById('resultado').value;
  if (!jornadasStr) return;
  const jornadas = parseInt(jornadasStr.split(' ')[0]);
  if (isNaN(jornadas)) return;
  descuentoActivo = tipo;
  actualizarDescuento(jornadas);
}

function actualizarDescuento(jornadas) {
  if (!descuentoActivo) return;
  let divisor = descuentoActivo === '1/6' ? 6 : 7;
  let descuento = Math.round(jornadas / divisor);
  let final = jornadas - descuento;
  document.getElementById('resultadoDescuento').value = `${final} jornadas`;
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js')
    .then(() => console.log("✅ Service Worker registrado"))
    .catch(err => console.error("❌ Error en Service Worker", err));
}

