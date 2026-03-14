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
    { id: "n", label: "Iteraciones (n)", type: "number", val: "100" },
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
    { id: "m", label: "Módulo (m) (P X Q)", type: "number", val: "30049" },
    { id: "n", label: "Iteraciones (n)", type: "number", val: "50" },
  ],
};

const tableFormats = {
  "cuadrados-medios": {
    headers: ["i", "X_i", "Y_i", "X_{i+1}", "r_i"],
    keys: ["i", "Xi", "Yi", "Xi_1", "ri"],
  },
  "productos-medios": {
    headers: ["i", "X_i", "X_{i+1}", "Y_i", "X_{i+2}", "r_i"],
    keys: ["i", "Xi", "Xi_1", "Yi", "Xi_2", "ri"],
  },
  "multiplicador-constante": {
    headers: ["i", "a", "X_i", "Y_i", "X_{i+1}", "r_i"],
    keys: ["i", "a", "Xi", "Yi", "Xi_1", "ri"],
  },
  "congruencial-mixto": {
    headers: ["n", "X_n", "aX_n+c", "(aX_n+c) mod m", "X_{n+1}", "U_n"],
    keys: ["n", "Xn", "aXn_c", "division", "Xn_1", "un"],
  },
  "congruencial-multiplicativo": {
    headers: ["n", "X_n", "aX_n", "(aX_n) mod m", "X_{n+1}", "U_n"],
    keys: ["n", "Xn", "aXn", "division", "Xn_1", "un"],
  },
  "congruencial-aditivo": {
    headers: [
      "i",
      "X_i",
      "X_{i-1}+X_{i-n}",
      "(X_{i-1}+X_{i-n}) mod m",
      "X_{i+1}",
      "r_i",
    ],
    keys: ["i", "Xi", "suma", "division", "Xi_1", "ri"],
  },
  "congruencial-cuadratico": {
    headers: [
      "i",
      "X_i",
      "aX_i²+bX_i+c",
      "(aX_i²+bX_i+c) mod m",
      "X_{i+1}",
      "r_i",
    ],
    keys: ["i", "Xi", "formula", "division", "Xi_1", "ri"],
  },
  "blum-blum-shub": {
    headers: ["i", "X_i", "X_i²", "X_i² mod m", "X_{i+1}", "r_i"],
    keys: ["i", "Xi", "formula", "division", "Xi_1", "ri"],
  },
};

const testConfigs = {
  promedios: [
    {
      id: "alfa",
      label: "Significancia (α)",
      type: "number",
      val: "0.05",
      step: "0.01",
    },
  ],
  frecuencias: [
    {
      id: "alfa",
      label: "Significancia (α)",
      type: "number",
      val: "0.05",
      step: "0.01",
    },
    {
      id: "intervalos",
      label: "Intervalos (n)",
      type: "number",
      val: "5",
      step: "1",
    },
  ],
  kolmogorov: [
    {
      id: "alfa",
      label: "Significancia (α)",
      type: "number",
      val: "0.05",
      step: "0.01",
    },
  ],
  poker: [
    {
      id: "alfa",
      label: "Significancia (α)",
      type: "number",
      val: "0.05",
      step: "0.01",
    },
  ],
  series: [
    {
      id: "alfa",
      label: "Significancia (α)",
      type: "number",
      val: "0.05",
      step: "0.01",
    },
    {
      id: "intervalos",
      label: "Sub-intervalos (n)",
      type: "number",
      val: "5",
      step: "1",
    },
  ],
  huecos: [
    {
      id: "alfa",
      label: "Significancia (α)",
      type: "number",
      val: "0.05",
      step: "0.01",
    },
  ],
  poker: [
    {
      id: "alfa",
      label: "Significancia (α)",
      type: "number",
      val: "0.05",
      step: "0.01",
    },
    {
      id: "decimales",
      label: "Decimales",
      type: "number",
      val: "5",
      step: "1",
      min: "3",
      max: "5",
    },
  ],
  huecos: [
    {
      id: "alfa",
      label: "Significancia (α)",
      type: "number",
      val: "0.05",
      step: "0.01",
    },
    {
      id: "alfaHueco",
      label: "Intervalo Inferior (α)",
      type: "number",
      val: "0.80",
      step: "0.01",
    },
    {
      id: "betaHueco",
      label: "Intervalo Superior (β)",
      type: "number",
      val: "1.00",
      step: "0.01",
    },
    {
      id: "maxHueco",
      label: "Hueco Máximo (≥)",
      type: "number",
      val: "5",
      step: "1",
    },
  ],
};

let generatedNumbersAll = [];
let generatedNumbersValid = [];
let myChart = null;
let currentDataMode = "manual";

const testingPanel = document.getElementById("testingPanel");
const testSelect = document.getElementById("testSelect");
const testAlert = document.getElementById("testAlert");
const manualContainer = document.getElementById("manualInputContainer");
const radioModes = document.querySelectorAll('input[name="dataMode"]');
const selectMethod = document.getElementById("metodoSelect");
const dynamicInputs = document.getElementById("dynamicInputs");
const form = document.getElementById("simForm");
const tableHead = document.querySelector("table thead");
const tableBody = document.getElementById("tablaResultados");
const alerta = document.getElementById("alertaCiclo");
const testParamsContainer = document.getElementById("testParamsContainer");
const testTableWrapper = document.getElementById("testTableWrapper");
const testChartWrapper = document.getElementById("testChartWrapper");

function renderInputs(methodId) {
  const config = methodConfig[methodId];
  dynamicInputs.innerHTML = "";
  config.forEach((input) => {
    const maxAttr =
      input.id === "cantidad" || input.id === "n" ? 'max="1000"' : "";
    dynamicInputs.innerHTML += `
            <div class="input-group">
                <label for="${input.id}">${input.label}</label>
                <input type="${input.type}" id="${input.id}" value="${input.val}" ${maxAttr} required>
            </div>
        `;
  });
}

renderInputs(selectMethod.value);
selectMethod.addEventListener("change", (e) => renderInputs(e.target.value));

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  alerta.classList.add("hidden");

  const currentMethod = selectMethod.value;
  const inputsConfig = methodConfig[currentMethod];
  const tableConfig = tableFormats[currentMethod];

  tableHead.innerHTML = `<tr>${tableConfig.headers.map((h) => `<th>${h}</th>`).join("")}</tr>`;
  tableBody.innerHTML = `<tr><td colspan="${tableConfig.headers.length}" class="empty-state">Calculando...</td></tr>`;

  const params = new URLSearchParams();
  inputsConfig.forEach((input) => {
    let val = document.getElementById(input.id).value;
    if (input.id === "cantidad" || input.id === "n") val = Math.min(val, 1000);
    params.append(input.id, val);
  });

  try {
    const response = await fetch(
      `/api/simulacion/${currentMethod}?${params.toString()}`,
    );
    if (response.status === 429) {
      tableBody.innerHTML = `<tr><td colspan="${tableConfig.headers.length}" style="color: #ef4444; text-align:center; font-weight:bold;">Límite de peticiones alcanzado. Espera un momento.</td></tr>`;
      return;
    }
    if (!response.ok) throw new Error("Error en la red");

    const data = await response.json();
    tableBody.innerHTML = "";
    const numerosVistos = new Set();
    let cicloDetectado = false;
    let periodo = 0;
    let limiteMostrar = data.length;

    const llaveAleatorioFinal = tableConfig.keys[tableConfig.keys.length - 1];

    for (let j = 0; j < data.length; j++) {
      const fila = data[j];
      const valorAleatorio = fila[llaveAleatorioFinal];

      if (!cicloDetectado && numerosVistos.has(valorAleatorio)) {
        cicloDetectado = true;
        periodo = j;
        limiteMostrar = periodo + 10;
      }

      if (!cicloDetectado) numerosVistos.add(valorAleatorio);
      if (j >= limiteMostrar) break;

      const tr = document.createElement("tr");
      if (cicloDetectado) {
        tr.style.opacity = "1";
        tr.style.backgroundColor = "rgba(255, 0, 0, 0.05)";
      }

      tableConfig.keys.forEach((key) => {
        const td = document.createElement("td");
        td.textContent =
          key === "ri" || key === "un"
            ? Number(fila[key]).toFixed(5)
            : fila[key];
        tr.appendChild(td);
      });
      tableBody.appendChild(tr);
    }

    if (cicloDetectado) {
      document.getElementById("alertaMensaje").innerHTML =
        `El periodo único es de <strong>${periodo}</strong> números. <span style="opacity: 0.7;">(Mostrando 10 adicionales)</span>`;
      alerta.classList.remove("hidden");
    }

    // ... tu código anterior que llena la tabla ...

    generatedNumbersAll = data.map((fila) => Number(fila[llaveAleatorioFinal]));
    generatedNumbersValid = cicloDetectado
      ? generatedNumbersAll.slice(0, periodo)
      : [...generatedNumbersAll];

    testingPanel.classList.remove("hidden");

    // --- NUEVO: DESBLOQUEAR BOTONES Y CAMBIAR A MODO AUTOMÁTICO ---
    const rdValidos = document.getElementById("rdValidos");
    const rdTodos = document.getElementById("rdTodos");
    const lblValidos = document.getElementById("lblValidos");
    const lblTodos = document.getElementById("lblTodos");

    // Habilitamos los inputs
    rdValidos.disabled = false;
    rdTodos.disabled = false;

    // Restauramos la opacidad y el cursor de los labels
    lblValidos.style.opacity = "1";
    lblValidos.style.cursor = "pointer";
    lblTodos.style.opacity = "1";
    lblTodos.style.cursor = "pointer";

    // Opcional pero recomendado: si acaban de generar números,
    // les seleccionamos "Únicos" automáticamente para mayor comodidad
    rdValidos.checked = true;
    currentDataMode = "validos";
    document.getElementById("manualInputContainer").classList.add("hidden");
    // --------------------------------------------------------------
  } catch (error) {
    tableBody.innerHTML = `<tr><td colspan="${tableConfig.headers.length}" style="color: #ef4444; text-align:center;">Error: Verifica los parámetros.</td></tr>`;
  }
});

radioModes.forEach((radio) => {
  radio.addEventListener("change", (e) => {
    const selectedMode = e.target.value;
    if (
      generatedNumbersAll.length > 0 &&
      ((currentDataMode === "manual" && selectedMode !== "manual") ||
        (currentDataMode !== "manual" && selectedMode === "manual"))
    ) {
      if (
        !confirm(
          "¿Estás seguro de cambiar el origen de los datos? La tabla principal no se borrará.",
        )
      ) {
        document.querySelector(
          `input[name="dataMode"][value="${currentDataMode}"]`,
        ).checked = true;
        return;
      }
    }
    currentDataMode = selectedMode;
    selectedMode === "manual"
      ? manualContainer.classList.remove("hidden")
      : manualContainer.classList.add("hidden");
  });
});
function renderTestParams() {
  const params = testConfigs[testSelect.value] || [];
  testParamsContainer.innerHTML = "";
  params.forEach((p) => {
    testParamsContainer.innerHTML += `
        <div style="display:flex; flex-direction:column; width: 120px;">
            <label style="font-size:0.75rem; color:var(--text-muted);">${p.label}</label>
            <input type="${p.type}" id="test_param_${p.id}" value="${p.val}" step="${p.step}" 
                style="padding:0.4rem; font-size:0.9rem; background:transparent; border:none; border-bottom:2px solid var(--border-color); color:var(--text-main); outline:none;">
        </div>`;
  });
}

// --- NUEVO: FUNCIÓN PARA CAMBIAR ENTRE VISTAS (TABLAS Y GRÁFICOS INDIVIDUALES) ---
function actualizarVistaPrueba() {
  document
    .querySelectorAll(".test-view")
    .forEach((el) => el.classList.add("hidden"));
  const vistaActiva = document.getElementById(`view-${testSelect.value}`);
  if (vistaActiva) vistaActiva.classList.remove("hidden");

  const testAlert = document.getElementById("testAlert");
  if (testAlert) testAlert.classList.add("hidden");
}

testSelect.addEventListener("change", () => {
  renderTestParams();
  actualizarVistaPrueba();
});
renderTestParams();
actualizarVistaPrueba(); // Ejecutar al inicio

// Diccionario global de gráficos
const charts = {
  promedios: null,
  frecuencias: null,
  kolmogorov: null,
  series: null,
};

// EVENTO PARA EJECUTAR PRUEBAS
document.getElementById("btnRunTest").addEventListener("click", async () => {
  let dataToSend = [];
  const pruebaSeleccionada = testSelect.value;

  // 1. OBTENER DATOS SEGÚN EL MODO
  if (currentDataMode === "manual") {
    const rawText = document.getElementById("manualData").value.trim();
    const formatSelect = document.getElementById("manualFormat");
    const format = formatSelect ? formatSelect.value : "comas";

    if (format === "matriz_coma") {
      const procesado = rawText.replace(/,/g, ".");
      dataToSend = procesado
        .split(/\s+/)
        .map(Number)
        .filter((n) => !isNaN(n));
    } else if (format === "matriz_punto") {
      dataToSend = rawText
        .split(/\s+/)
        .map(Number)
        .filter((n) => !isNaN(n));
    } else {
      dataToSend = rawText
        .split(",")
        .map((n) => Number(n.trim()))
        .filter((n) => !isNaN(n));
    }
  } else {
    dataToSend =
      currentDataMode === "validos"
        ? generatedNumbersValid
        : generatedNumbersAll;
  }

  if (dataToSend.length > 70) dataToSend = dataToSend.slice(0, 70);
  if (dataToSend.length === 0)
    return alert("No hay datos válidos para evaluar.");

  // 2. PREPARAR PETICIÓN
  const payload = { numeros: dataToSend, alfa: 0.05, intervalos: 5 };
  const params = testConfigs[pruebaSeleccionada] || [];

  params.forEach((p) => {
    const inputEl = document.getElementById(`test_param_${p.id}`);
    if (inputEl) {
      if (p.id === "alfa") payload.alfa = parseFloat(inputEl.value);
      if (p.id === "intervalos") payload.intervalos = parseInt(inputEl.value);

      if (p.id === "decimales") payload.decimales = parseInt(inputEl.value);
      if (p.id === "alfaHueco") payload.alfaHueco = parseFloat(inputEl.value);
      if (p.id === "betaHueco") payload.betaHueco = parseFloat(inputEl.value);
      if (p.id === "maxHueco") payload.maxHueco = parseInt(inputEl.value);
    }
  });

  // 3. ENVIAR A SPRING BOOT
  try {
    const response = await fetch(
      `/api/simulacion/pruebas/${pruebaSeleccionada}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    );

    if (!response.ok) throw new Error(await response.text());
    const resData = await response.json();

    // 4. MOSTRAR ALERTA
    const testAlert = document.getElementById("testAlert");
    testAlert.classList.remove("hidden");
    testAlert.innerHTML = resData.mensaje;
    testAlert.style.borderColor =
      resData.aceptado !== false ? "#10b981" : "#ef4444";
    testAlert.style.backgroundColor =
      resData.aceptado !== false
        ? "rgba(16, 185, 129, 0.1)"
        : "rgba(239, 68, 68, 0.1)";

    // 5. LLENAR LA TABLA CORRESPONDIENTE
    if (resData.tabla && resData.tabla.length > 0) {
      const tableEl = document.getElementById(`table-${pruebaSeleccionada}`);
      if (tableEl) {
        const thead = tableEl.querySelector("thead");
        const tbody = tableEl.querySelector("tbody");
        const headers = Object.keys(resData.tabla[0]);

        thead.innerHTML = `<tr>${headers.map((h) => `<th>${h}</th>`).join("")}</tr>`;
        tbody.innerHTML = "";

        resData.tabla.forEach((fila) => {
          const tr = document.createElement("tr");
          headers.forEach((key) => {
            let val = fila[key];
            if (
              typeof val === "number" &&
              !["n", "Oi", "i", "Ei"].includes(key)
            )
              val = val.toFixed(4);
            tr.innerHTML +=
              key === "¿Aprobado?"
                ? `<td style="color: ${val === "SÍ" ? "#10b981" : "#ef4444"}; font-weight:bold;">${val}</td>`
                : `<td>${val}</td>`;
          });
          tbody.appendChild(tr);
        });
      }
    }

    // 6. CASOS ESPECIALES: SECUENCIA DE HUECOS Y MATRIZ FO DE SERIES
    // 6. CASOS ESPECIALES: SECUENCIA DE HUECOS, MATRIZ FO DE SERIES Y CUADRÍCULA DE POKER
    if (pruebaSeleccionada === "huecos" && resData.secuencia) {
      document.getElementById("huecos-secuencia").innerText = resData.secuencia;
    }

    if (pruebaSeleccionada === "series" && resData.matrizFO) {
      let tableHTML =
        '<tr><th style="padding:0.5rem; border-bottom:1px solid var(--border-color);">Y \\ X</th>';
      if (resData.xLabels)
        resData.xLabels.forEach((lbl) => {
          tableHTML += `<th style="padding:0.5rem; border-bottom:1px solid var(--border-color); color:var(--accent-color)">${lbl}</th>`;
        });
      tableHTML += "</tr>";

      resData.matrizFO.forEach((fila, i) => {
        let yLabel = resData.yLabels ? resData.yLabels[i] : `F${i + 1}`;
        tableHTML +=
          `<tr><th style="padding:0.5rem; border-bottom:1px solid var(--border-color); color:var(--accent-color)">${yLabel}</th>` +
          fila
            .map(
              (val) =>
                `<td style="padding:0.5rem; border-bottom:1px solid var(--border-color); font-weight:bold;">${val}</td>`,
            )
            .join("") +
          `</tr>`;
      });
      document.getElementById("matrix-fo").innerHTML = tableHTML;
    }

    // --- NUEVO: CUADRÍCULA CLASIFICADORA DE POKER ---
    if (pruebaSeleccionada === "poker" && resData.detalle) {
      // Obtenemos los decimales para imprimir los números con los ceros correctos (ej: 0.10000)
      const inputDecimales = document.getElementById("test_param_decimales");
      const dec = inputDecimales ? parseInt(inputDecimales.value) : 5;

      // Creamos un CSS Grid dinámico
      let gridHTML = `<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(110px, 1fr)); gap: 0.5rem;">`;

      resData.detalle.forEach((item) => {
        gridHTML += `
          <div style="background: var(--bg-panel); border: 1px solid var(--border-color); padding: 0.5rem; border-radius: 6px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <span style="font-family: monospace; color: var(--text-main); font-size: 0.95rem;">${item.numero.toFixed(dec)}</span>
            <strong style="color: #ef4444; font-size: 0.95rem; margin-left: 0.5rem;">${item.mano}</strong>
          </div>`;
      });

      gridHTML += `</div>`;
      document.getElementById("poker-grid-container").innerHTML = gridHTML;
    }
    if (pruebaSeleccionada === "huecos" && resData.secuencia) {
      document.getElementById("huecos-secuencia").innerText = resData.secuencia;
    }

    // Inyectar Matriz FOij de Series
    if (pruebaSeleccionada === "series" && resData.matrizFO) {
      let tableHTML =
        '<table style="width:100%; text-align:center; border-collapse: collapse; margin-bottom: 1rem;">';

      // Primera fila: Cabeceras del Eje X
      tableHTML +=
        '<tr><th style="padding:0.5rem; border-bottom:1px solid var(--border-color);">Y \\ X</th>';
      if (resData.xLabels) {
        resData.xLabels.forEach((lbl) => {
          tableHTML += `<th style="padding:0.5rem; border-bottom:1px solid var(--border-color); color:var(--accent-color)">${lbl}</th>`;
        });
      }
      tableHTML += "</tr>";

      // Filas de datos con el Eje Y a la izquierda
      resData.matrizFO.forEach((fila, i) => {
        let yLabel = resData.yLabels ? resData.yLabels[i] : `F${i + 1}`;
        tableHTML += `<tr><th style="padding:0.5rem; border-bottom:1px solid var(--border-color); color:var(--accent-color)">${yLabel}</th>`;

        fila.forEach((val) => {
          tableHTML += `<td style="padding:0.5rem; border-bottom:1px solid var(--border-color); font-weight:bold;">${val}</td>`;
        });
        tableHTML += `</tr>`;
      });

      tableHTML += "</table>";
      document.getElementById("matrix-fo").innerHTML = tableHTML;
    }

    // 7. RENDERIZAR GRÁFICOS (Huecos no tiene gráfico)
    if (pruebaSeleccionada !== "huecos" && pruebaSeleccionada !== "poker") {
      renderChart(pruebaSeleccionada, resData);
    }
  } catch (error) {
    alert("Error al procesar la prueba. " + error.message);
  }
});

function renderChart(type, data) {
  const canvasId = `chart-${type}`;
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  // Destruir gráfico anterior si existe
  if (charts[type]) charts[type].destroy();

  Chart.defaults.color = "#94a3b8";
  Chart.defaults.borderColor = "#334155";

  if (type === "promedios" && data.chartData) {
    charts[type] = new Chart(ctx, {
      type: "line",
      data: {
        labels: Array.from({ length: data.chartData.length }, (_, i) => i + 1),
        datasets: [
          {
            label: "Valores r_i",
            data: data.chartData,
            borderColor: "#3b82f6",
            backgroundColor: "rgba(59, 130, 246, 0.2)",
            fill: true,
            tension: 0.3,
          },
          {
            label: "Media (0.5)",
            data: Array(data.chartData.length).fill(0.5),
            borderColor: "#ef4444",
            borderDash: [5, 5],
            pointRadius: 0,
          },
        ],
      },
    });
  } else if (type === "kolmogorov" && data.xVals) {
    charts[type] = new Chart(ctx, {
      type: "line",
      data: {
        labels: data.xVals.map((v) => v.toFixed(2)),
        datasets: [
          {
            label: "Observada (Empírica)",
            data: data.yObs,
            borderColor: "#10b981",
            stepped: true,
            borderWidth: 2,
          },
          {
            label: "Uniforme (Esperada Y=X)",
            data: data.yEsp,
            borderColor: "#f59e0b",
            type: "line",
            pointRadius: 0,
          },
        ],
      },
    });
  } else if (type === "series" && data.coordenadas) {
    charts[type] = new Chart(ctx, {
      type: "scatter",
      data: {
        datasets: [
          {
            label: "Parejas (r_i, r_{i+1})",
            data: data.coordenadas,
            backgroundColor: "#3b82f6",
            pointRadius: 5,
          },
        ],
      },
      options: { scales: { x: { min: 0, max: 1 }, y: { min: 0, max: 1 } } },
    });
  } else if (type === "frecuencias" && data.tabla) {
    const labels = data.tabla.map((t) => t.Rango);
    const observadas = data.tabla.map((t) => t.Oi);
    const esperada = data.tabla[0].Ei;

    charts[type] = new Chart(ctx, {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Observada (Oi)",
            data: observadas,
            backgroundColor: "#10b981",
          },
          {
            label: "Esperada (Ei)",
            data: Array(labels.length).fill(esperada),
            type: "line",
            borderColor: "#f59e0b",
            borderWidth: 2,
            pointRadius: 0,
          },
        ],
      },
    });
  }
}
