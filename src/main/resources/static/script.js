// Configuración de los campos requeridos para cada método
const methodConfig = {
  "cuadrados-medios": [
    { id: "semilla", label: "Semilla (X0)", type: "number", val: "1234" },
    { id: "digitos", label: "Dígitos (D)", type: "number", val: "4" },
    { id: "cantidad", label: "Cantidad (n)", type: "number", val: "100" },
  ],
  "productos-medios": [
    { id: "x0", label: "Semilla (X0)", type: "number", val: "5015" },
    { id: "x1", label: "Semilla (X1)", type: "number", val: "5734" },
    { id: "digitos", label: "Dígitos (D)", type: "number", val: "4" },
    { id: "cantidad", label: "Cantidad (n)", type: "number", val: "100" },
  ],
  "multiplicador-constante": [
    { id: "x0", label: "Semilla (X0)", type: "number", val: "9803" },
    { id: "a", label: "Constante (a)", type: "number", val: "6965" },
    { id: "digitos", label: "Dígitos (D)", type: "number", val: "4" },
    { id: "cantidad", label: "Cantidad (n)", type: "number", val: "100" },
  ],
  "congruencial-mixto": [
    { id: "x0", label: "Semilla (X0)", type: "number", val: "17" },
    { id: "a", label: "Multiplicador (a)", type: "number", val: "21" },
    { id: "c", label: "Aditiva (c)", type: "number", val: "15" },
    { id: "m", label: "Módulo (m)", type: "number", val: "100" },
    { id: "n", label: "Iteraciones (n)", type: "number", val: "200" },
  ],
  "congruencial-multiplicativo": [
    { id: "x0", label: "Semilla (X0)", type: "number", val: "17" },
    { id: "a", label: "Multiplicador (a)", type: "number", val: "21" },
    { id: "m", label: "Módulo (m)", type: "number", val: "100" },
    { id: "n", label: "Iteraciones (n)", type: "number", val: "200" },
  ],
  "congruencial-aditivo": [
    {
      id: "semillas",
      label: "Semillas (Separadas por coma)",
      type: "text",
      val: "65, 89, 98, 03, 69",
    },
    { id: "m", label: "Módulo (m)", type: "number", val: "100" },
    { id: "cantidad", label: "Iteraciones (n)", type: "number", val: "100" },
  ],
  "congruencial-cuadratico": [
    { id: "x0", label: "Semilla (X0)", type: "number", val: "13" },
    { id: "a", label: "Valor (a)", type: "number", val: "26" },
    { id: "b", label: "Valor (b)", type: "number", val: "27" },
    { id: "c", label: "Valor (c)", type: "number", val: "27" },
    { id: "m", label: "Módulo (m)", type: "number", val: "8" },
    { id: "n", label: "Iteraciones (n)", type: "number", val: "50" },
  ],
  "blum-blum-shub": [
    { id: "x0", label: "Semilla (X0)", type: "number", val: "317" },
    { id: "m", label: "Módulo (p*q = m)", type: "number", val: "30049" },
    { id: "n", label: "Iteraciones (n)", type: "number", val: "50" },
  ],
};

const selectMethod = document.getElementById("metodoSelect");
const dynamicInputs = document.getElementById("dynamicInputs");
const form = document.getElementById("simForm");
const tableBody = document.getElementById("tablaResultados");
const alerta = document.getElementById("alertaCiclo");

// Renderizar inputs según el método
function renderInputs(methodId) {
  const config = methodConfig[methodId];
  dynamicInputs.innerHTML = "";
  config.forEach((input) => {
    dynamicInputs.innerHTML += `
            <div class="input-group">
                <label for="${input.id}">${input.label}</label>
                <input type="${input.type}" id="${input.id}" value="${input.val}" required>
            </div>
        `;
  });
}

// Inicializar
renderInputs(selectMethod.value);
selectMethod.addEventListener("change", (e) => renderInputs(e.target.value));

// Ejecutar simulación
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  alerta.classList.add("hidden");
  tableBody.innerHTML =
    '<tr><td colspan="2" class="empty-state">Calculando...</td></tr>';

  const currentMethod = selectMethod.value;
  const config = methodConfig[currentMethod];

  // Construir la URL con parámetros dinámicos
  const params = new URLSearchParams();
  config.forEach((input) => {
    params.append(input.id, document.getElementById(input.id).value);
  });

  try {
    const response = await fetch(
      `/api/simulacion/${currentMethod}?${params.toString()}`,
    );
    if (!response.ok) throw new Error("Error en la red");
    const data = await response.json(); // Array de números (Double)

    tableBody.innerHTML = "";
    const numerosVistos = new Set();
    let cicloDetectado = false;
    let periodo = 0;

    // Bucle con Trigger de Repetición Integrado
    for (let i = 0; i < data.length; i++) {
      const ri = data[i];

      // TRIGGER: Si el número r_i ya salió antes, cortamos el proceso
      if (numerosVistos.has(ri)) {
        cicloDetectado = true;
        periodo = i;
        break;
      }

      numerosVistos.add(ri);

      // Dibujar fila
      const tr = document.createElement("tr");
      tr.innerHTML = `
                <td>${i}</td>
                <td>${ri.toFixed(5)}</td>
            `;
      tableBody.appendChild(tr);
    }

    // Mostrar alerta si se detectó ciclo
    if (cicloDetectado) {
      document.getElementById("alertaMensaje").innerHTML =
        `La sucesión se empezó a repetir. El periodo de vida de la secuencia es de <strong>${periodo}</strong> números únicos.`;
      alerta.classList.remove("hidden");
    } else if (data.length === 0) {
      tableBody.innerHTML =
        '<tr><td colspan="2" class="empty-state">No se generaron resultados.</td></tr>';
    }
  } catch (error) {
    tableBody.innerHTML = `<tr><td colspan="2" style="color: #ef4444; text-align:center;">Error: Verifica los parámetros del backend.</td></tr>`;
    console.error(error);
  }
});
