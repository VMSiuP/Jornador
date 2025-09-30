document.addEventListener('DOMContentLoaded', () => {
  // --- REGISTRO DEL SERVICE WORKER ---
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js')
      .then(reg => console.log('Service Worker registrado con éxito.', reg))
      .catch(err => console.error('Error en el registro del Service Worker:', err));
  }

  // --- REFERENCIAS A ELEMENTOS DEL DOM ---
  const inputs = {
    años: document.getElementById('años'),
    meses: document.getElementById('meses'),
    días: document.getElementById('días'),
    resultado: document.getElementById('resultado'),
    resultadoDescuento: document.getElementById('resultadoDescuento')
  };

  const darkModeToggle = document.getElementById('darkModeToggle');
  
  let jornadasCalculadas = 0;

  // --- LÓGICA DE CÁLCULO ---
  const calcularJornadas = () => {
    const años = parseInt(inputs.años.value) || 0;
    const meses = parseInt(inputs.meses.value) || 0;
    const días = parseInt(inputs.días.value) || 0;

    if (años === 0 && meses === 0 && días === 0) {
      inputs.resultado.value = '';
      jornadasCalculadas = 0;
      return;
    }

    const totalDiasPPL = (años * 365) + (meses * 30) + días;
    let jornadas = Math.ceil(totalDiasPPL / 7);

    // Aplicar límites (10 a 156 jornadas)
    jornadas = Math.max(10, Math.min(jornadas, 156));

    jornadasCalculadas = jornadas;
    inputs.resultado.value = `${jornadas} jornadas`;
    inputs.resultadoDescuento.value = ''; // Limpiar descuento previo
  };
  
  // --- LÓGICA DE DESCUENTO ---
  const descontar = (fraccion, tipo) => {
    if (jornadasCalculadas > 0) {
      const descuento = Math.ceil(jornadasCalculadas * fraccion);
      const resultadoFinal = jornadasCalculadas - descuento;
      inputs.resultadoDescuento.value = `${resultadoFinal} jornadas (${tipo})`;
    } else {
      alert("Primero calcula las jornadas iniciales.");
    }
  };

  // --- FUNCIONES DE BOTONES ---
  const nuevoCalculo = () => {
    inputs.años.value = '';
    inputs.meses.value = '';
    inputs.días.value = '';
    inputs.resultado.value = '';
    jornadasCalculadas = 0;
  };
  
  const nuevoCompleto = () => {
    nuevoCalculo();
    inputs.resultadoDescuento.value = '';
  };
  
  const copiarResultado = async (elementId, buttonElement) => {
    const resultadoInput = document.getElementById(elementId);
    if (!resultadoInput.value || buttonElement.disabled) return;
    
    try {
      await navigator.clipboard.writeText(resultadoInput.value);
      
      // Feedback visual no intrusivo
      const originalText = buttonElement.innerText;
      buttonElement.innerText = '¡Copiado!';
      buttonElement.disabled = true;
      
      setTimeout(() => {
        buttonElement.innerText = originalText;
        buttonElement.disabled = false;
      }, 1500);

    } catch (err) {
      console.error('Error al copiar:', err);
      // Podrías mostrar un error de forma no intrusiva también si quisieras
    }
  };

  const compartirWhatsApp = (elementId) => {
    const resultadoInput = document.getElementById(elementId);
    if (!resultadoInput.value) return;
    const texto = encodeURIComponent(`El resultado del cálculo es: ${resultadoInput.value}`);
    window.open(`https://wa.me/?text=${texto}`, '_blank');
  };

  // --- ASIGNACIÓN DE EVENTOS ---
  inputs.años.addEventListener('input', calcularJornadas);
  inputs.meses.addEventListener('input', calcularJornadas);
  inputs.días.addEventListener('input', calcularJornadas);
  
  document.getElementById('descontarTA').addEventListener('click', () => descontar(1/6, 'descuento 1/6'));
  document.getElementById('descontarCA').addEventListener('click', () => descontar(1/7, 'descuento 1/7'));
  
  document.getElementById('copiarResultadoBtn').addEventListener('click', function() { copiarResultado('resultado', this) });
  document.getElementById('compartirResultadoBtn').addEventListener('click', () => compartirWhatsApp('resultado'));
  document.getElementById('nuevoCalculoBtn').addEventListener('click', nuevoCalculo);
  
  document.getElementById('copiarDescuentoBtn').addEventListener('click', function() { copiarResultado('resultadoDescuento', this) });
  document.getElementById('compartirDescuentoBtn').addEventListener('click', () => compartirWhatsApp('resultadoDescuento'));
  document.getElementById('nuevoCompletoBtn').addEventListener('click', nuevoCompleto);

  // --- MODO OSCURO ---
  darkModeToggle.addEventListener('change', () => {
    document.body.classList.toggle('dark-mode');
  });
});
