// ═══════════════════════════════════════════════════════════════
//  SIMULATION METHODS — script.js
//  Java (Spring Boot :8080) + Python (FastAPI :8000)
// ═══════════════════════════════════════════════════════════════

const PYTHON_API = 'http://localhost:8000';

// ──────────────────────────────────────────────────────────────
//  TAB NAVIGATION
// ──────────────────────────────────────────────────────────────
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.tab;
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => { c.classList.remove('active'); c.classList.add('hidden'); });
    btn.classList.add('active');
    const el = document.getElementById(`tab-${target}`);
    el.classList.remove('hidden'); el.classList.add('active');
    if (target === 'variables') checkPythonStatus();
  });
});

// ──────────────────────────────────────────────────────────────
//  JAVA GENERATORS — original config (unchanged)
// ──────────────────────────────────────────────────────────────
const methodConfig = {
  "cuadrados-medios": [
    { id: "semilla", label: "Semilla (X0)", type: "number", val: "1234" },
    { id: "digitos",  label: "Dígitos (D)",  type: "number", val: "4" },
    { id: "cantidad", label: "Cantidad (n)", type: "number", val: "100" },
  ],
  "productos-medios": [
    { id: "x0",       label: "Semilla (X0)", type: "number", val: "5015" },
    { id: "x1",       label: "Semilla (X1)", type: "number", val: "5734" },
    { id: "digitos",  label: "Dígitos (D)",  type: "number", val: "4" },
    { id: "cantidad", label: "Cantidad (n)", type: "number", val: "100" },
  ],
  "multiplicador-constante": [
    { id: "x0",       label: "Semilla (X0)",   type: "number", val: "9803" },
    { id: "a",        label: "Constante (a)",   type: "number", val: "6965" },
    { id: "digitos",  label: "Dígitos (D)",     type: "number", val: "4" },
    { id: "cantidad", label: "Cantidad (n)",    type: "number", val: "100" },
  ],
  "congruencial-mixto": [
    { id: "x0", label: "Semilla (X0)",      type: "number", val: "17" },
    { id: "a",  label: "Multiplicador (a)", type: "number", val: "21" },
    { id: "c",  label: "Aditiva (c)",       type: "number", val: "15" },
    { id: "m",  label: "Módulo (m)",        type: "number", val: "100" },
    { id: "n",  label: "Iteraciones (n)",   type: "number", val: "100" },
  ],
  "congruencial-multiplicativo": [
    { id: "x0", label: "Semilla (X0)",      type: "number", val: "17" },
    { id: "a",  label: "Multiplicador (a)", type: "number", val: "21" },
    { id: "m",  label: "Módulo (m)",        type: "number", val: "100" },
    { id: "n",  label: "Iteraciones (n)",   type: "number", val: "200" },
  ],
  "congruencial-aditivo": [
    { id: "semillas", label: "Semillas (Separadas por coma)", type: "text", val: "65, 89, 98, 03, 69" },
    { id: "m",        label: "Módulo (m)",                    type: "number", val: "100" },
    { id: "cantidad", label: "Iteraciones (n)",               type: "number", val: "100" },
  ],
  "congruencial-cuadratico": [
    { id: "x0", label: "Semilla (X0)", type: "number", val: "13" },
    { id: "a",  label: "Valor (a)",    type: "number", val: "26" },
    { id: "b",  label: "Valor (b)",    type: "number", val: "27" },
    { id: "c",  label: "Valor (c)",    type: "number", val: "27" },
    { id: "m",  label: "Módulo (m)",   type: "number", val: "8" },
    { id: "n",  label: "Iteraciones (n)", type: "number", val: "50" },
  ],
  "blum-blum-shub": [
    { id: "x0", label: "Semilla (X0)",       type: "number", val: "317" },
    { id: "m",  label: "Módulo (m) (P X Q)", type: "number", val: "30049" },
    { id: "n",  label: "Iteraciones (n)",    type: "number", val: "50" },
  ],
};

const tableFormats = {
  "cuadrados-medios":          { headers: ["i","X_i","Y_i","X_{i+1}","r_i"],                       keys: ["i","Xi","Yi","Xi_1","ri"] },
  "productos-medios":          { headers: ["i","X_i","X_{i+1}","Y_i","X_{i+2}","r_i"],              keys: ["i","Xi","Xi_1","Yi","Xi_2","ri"] },
  "multiplicador-constante":   { headers: ["i","a","X_i","Y_i","X_{i+1}","r_i"],                    keys: ["i","a","Xi","Yi","Xi_1","ri"] },
  "congruencial-mixto":        { headers: ["n","X_n","aX_n+c","(aX_n+c) mod m","X_{n+1}","U_n"],    keys: ["n","Xn","aXn_c","division","Xn_1","un"] },
  "congruencial-multiplicativo":{ headers: ["n","X_n","aX_n","(aX_n) mod m","X_{n+1}","U_n"],       keys: ["n","Xn","aXn","division","Xn_1","un"] },
  "congruencial-aditivo":      { headers: ["i","X_i","X_{i-1}+X_{i-n}","(X_{i-1}+X_{i-n}) mod m","X_{i+1}","r_i"], keys: ["i","Xi","suma","division","Xi_1","ri"] },
  "congruencial-cuadratico":   { headers: ["i","X_i","aX_i²+bX_i+c","(aX_i²+bX_i+c) mod m","X_{i+1}","r_i"], keys: ["i","Xi","formula","division","Xi_1","ri"] },
  "blum-blum-shub":            { headers: ["i","X_i","X_i²","X_i² mod m","X_{i+1}","r_i"],          keys: ["i","Xi","formula","division","Xi_1","ri"] },
};

const testConfigs = {
  promedios:   [{ id:"alfa", label:"Significancia (α)", type:"number", val:"0.05", step:"0.01" }],
  frecuencias: [{ id:"alfa", label:"Significancia (α)", type:"number", val:"0.05", step:"0.01" }, { id:"intervalos", label:"Intervalos (n)", type:"number", val:"5", step:"1" }],
  kolmogorov:  [{ id:"alfa", label:"Significancia (α)", type:"number", val:"0.05", step:"0.01" }],
  series:      [{ id:"alfa", label:"Significancia (α)", type:"number", val:"0.05", step:"0.01" }, { id:"intervalos", label:"Sub-intervalos (n)", type:"number", val:"5", step:"1" }],
  huecos:      [{ id:"alfa", label:"Significancia (α)", type:"number", val:"0.05", step:"0.01" }, { id:"alfaHueco", label:"Intervalo Inferior (α)", type:"number", val:"0.80", step:"0.01" }, { id:"betaHueco", label:"Intervalo Superior (β)", type:"number", val:"1.00", step:"0.01" }, { id:"maxHueco", label:"Hueco Máximo (≥)", type:"number", val:"5", step:"1" }],
  poker:       [{ id:"alfa", label:"Significancia (α)", type:"number", val:"0.05", step:"0.01" }, { id:"decimales", label:"Decimales", type:"number", val:"5", step:"1", min:"3", max:"5" }],
};

let generatedNumbersAll   = [];
let generatedNumbersValid = [];
let myChart = null;
let currentDataMode = "manual";

const testingPanel     = document.getElementById("testingPanel");
const testSelect       = document.getElementById("testSelect");
const testAlert        = document.getElementById("testAlert");
const manualContainer  = document.getElementById("manualInputContainer");
const radioModes       = document.querySelectorAll('input[name="dataMode"]');
const selectMethod     = document.getElementById("metodoSelect");
const dynamicInputs    = document.getElementById("dynamicInputs");
const form             = document.getElementById("simForm");
const tableHead        = document.querySelector("table thead");
const tableBody        = document.getElementById("tablaResultados");
const alerta           = document.getElementById("alertaCiclo");
const testParamsContainer = document.getElementById("testParamsContainer");

function renderInputs(methodId) {
  const config = methodConfig[methodId];
  dynamicInputs.innerHTML = "";
  config.forEach(input => {
    const maxAttr = (input.id === "cantidad" || input.id === "n") ? 'max="1000"' : "";
    dynamicInputs.innerHTML += `
      <div class="input-group">
        <label for="${input.id}">${input.label}</label>
        <input type="${input.type}" id="${input.id}" value="${input.val}" ${maxAttr} required>
      </div>`;
  });
}

renderInputs(selectMethod.value);
selectMethod.addEventListener("change", e => renderInputs(e.target.value));

form.addEventListener("submit", async e => {
  e.preventDefault();
  alerta.classList.add("hidden");
  const currentMethod = selectMethod.value;
  const inputsConfig  = methodConfig[currentMethod];
  const tableConfig   = tableFormats[currentMethod];

  tableHead.innerHTML = `<tr>${tableConfig.headers.map(h => `<th>${h}</th>`).join("")}</tr>`;
  tableBody.innerHTML = `<tr><td colspan="${tableConfig.headers.length}" class="empty-state">Calculando...</td></tr>`;

  const params = new URLSearchParams();
  inputsConfig.forEach(input => {
    let val = document.getElementById(input.id).value;
    if (input.id === "cantidad" || input.id === "n") val = Math.min(val, 1000);
    params.append(input.id, val);
  });

  try {
    const response = await fetch(`/api/simulacion/${currentMethod}?${params.toString()}`);
    if (response.status === 429) {
      tableBody.innerHTML = `<tr><td colspan="${tableConfig.headers.length}" style="color:var(--red);text-align:center;font-weight:bold;">Límite de peticiones alcanzado. Espera un momento.</td></tr>`;
      return;
    }
    if (!response.ok) throw new Error("Error en la red");

    const data = await response.json();
    tableBody.innerHTML = "";
    const numerosVistos = new Set();
    let cicloDetectado = false, periodo = 0;
    let limiteMostrar = data.length;
    const llaveAleatorioFinal = tableConfig.keys[tableConfig.keys.length - 1];

    for (let j = 0; j < data.length; j++) {
      const fila = data[j];
      const valorAleatorio = fila[llaveAleatorioFinal];
      if (!cicloDetectado && numerosVistos.has(valorAleatorio)) {
        cicloDetectado = true; periodo = j; limiteMostrar = periodo + 10;
      }
      if (!cicloDetectado) numerosVistos.add(valorAleatorio);
      if (j >= limiteMostrar) break;

      const tr = document.createElement("tr");
      if (cicloDetectado) { tr.style.opacity = "1"; tr.style.backgroundColor = "rgba(239,68,68,0.05)"; }
      tableConfig.keys.forEach(key => {
        const td = document.createElement("td");
        td.textContent = (key === "ri" || key === "un") ? Number(fila[key]).toFixed(5) : fila[key];
        tr.appendChild(td);
      });
      tableBody.appendChild(tr);
    }

    if (cicloDetectado) {
      document.getElementById("alertaMensaje").innerHTML =
        `El periodo único es de <strong>${periodo}</strong> números. <span style="opacity:0.7;">(Mostrando 10 adicionales)</span>`;
      alerta.classList.remove("hidden");
    }

    generatedNumbersAll   = data.map(fila => Number(fila[llaveAleatorioFinal]));
    generatedNumbersValid = cicloDetectado ? generatedNumbersAll.slice(0, periodo) : [...generatedNumbersAll];

    testingPanel.classList.remove("hidden");

    const rdValidos = document.getElementById("rdValidos");
    const rdTodos   = document.getElementById("rdTodos");
    const lblValidos = document.getElementById("lblValidos");
    const lblTodos   = document.getElementById("lblTodos");
    rdValidos.disabled = false; rdTodos.disabled = false;
    lblValidos.style.opacity = "1"; lblValidos.style.cursor = "pointer";
    lblTodos.style.opacity   = "1"; lblTodos.style.cursor   = "pointer";
    rdValidos.checked = true; currentDataMode = "validos";
    document.getElementById("manualInputContainer").classList.add("hidden");

  } catch (error) {
    tableBody.innerHTML = `<tr><td colspan="${tableConfig.headers.length}" style="color:var(--red);text-align:center;">Error: Verifica los parámetros.</td></tr>`;
  }
});

radioModes.forEach(radio => {
  radio.addEventListener("change", e => {
    const selectedMode = e.target.value;
    if (generatedNumbersAll.length > 0 &&
        ((currentDataMode === "manual" && selectedMode !== "manual") ||
         (currentDataMode !== "manual" && selectedMode === "manual"))) {
      if (!confirm("¿Estás seguro de cambiar el origen de los datos?")) {
        document.querySelector(`input[name="dataMode"][value="${currentDataMode}"]`).checked = true;
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
  params.forEach(p => {
    testParamsContainer.innerHTML += `
      <div style="display:flex;flex-direction:column;width:120px;">
        <label style="font-size:0.72rem;color:var(--text-muted);">${p.label}</label>
        <input type="${p.type}" id="test_param_${p.id}" value="${p.val}" step="${p.step}"
          style="padding:0.4rem;font-size:0.9rem;background:transparent;border:none;border-bottom:2px solid var(--border);color:var(--text);outline:none;">
      </div>`;
  });
}

function actualizarVistaPrueba() {
  document.querySelectorAll(".test-view").forEach(el => el.classList.add("hidden"));
  const vistaActiva = document.getElementById(`view-${testSelect.value}`);
  if (vistaActiva) vistaActiva.classList.remove("hidden");
  if (testAlert) testAlert.classList.add("hidden");
}

testSelect.addEventListener("change", () => { renderTestParams(); actualizarVistaPrueba(); });
renderTestParams();
actualizarVistaPrueba();

const charts = { promedios: null, frecuencias: null, kolmogorov: null, series: null };

document.getElementById("btnRunTest").addEventListener("click", async () => {
  let dataToSend = [];
  const pruebaSeleccionada = testSelect.value;

  if (currentDataMode === "manual") {
    const rawText = document.getElementById("manualData").value.trim();
    const formatSelect = document.getElementById("manualFormat");
    const format = formatSelect ? formatSelect.value : "comas";
    if (format === "matriz_coma") {
      const procesado = rawText.replace(/,/g, ".");
      dataToSend = procesado.split(/\s+/).map(Number).filter(n => !isNaN(n));
    } else if (format === "matriz_punto") {
      dataToSend = rawText.split(/\s+/).map(Number).filter(n => !isNaN(n));
    } else {
      dataToSend = rawText.split(",").map(n => Number(n.trim())).filter(n => !isNaN(n));
    }
  } else {
    dataToSend = currentDataMode === "validos" ? generatedNumbersValid : generatedNumbersAll;
  }

  if (dataToSend.length > 70) dataToSend = dataToSend.slice(0, 70);
  if (dataToSend.length === 0) return alert("No hay datos válidos para evaluar.");

  const payload = { numeros: dataToSend, alfa: 0.05, intervalos: 5 };
  const params = testConfigs[pruebaSeleccionada] || [];
  params.forEach(p => {
    const inputEl = document.getElementById(`test_param_${p.id}`);
    if (inputEl) {
      if (p.id === "alfa")      payload.alfa       = parseFloat(inputEl.value);
      if (p.id === "intervalos") payload.intervalos = parseInt(inputEl.value);
      if (p.id === "decimales") payload.decimales  = parseInt(inputEl.value);
      if (p.id === "alfaHueco") payload.alfaHueco  = parseFloat(inputEl.value);
      if (p.id === "betaHueco") payload.betaHueco  = parseFloat(inputEl.value);
      if (p.id === "maxHueco")  payload.maxHueco   = parseInt(inputEl.value);
    }
  });

  try {
    const response = await fetch(`/api/simulacion/pruebas/${pruebaSeleccionada}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error(await response.text());
    const resData = await response.json();

    testAlert.classList.remove("hidden");
    testAlert.innerHTML = resData.mensaje;
    testAlert.style.borderColor       = resData.aceptado !== false ? "#22c55e" : "#ef4444";
    testAlert.style.backgroundColor   = resData.aceptado !== false ? "rgba(34,197,94,0.08)" : "rgba(239,68,68,0.08)";

    if (resData.tabla && resData.tabla.length > 0) {
      const tableEl = document.getElementById(`table-${pruebaSeleccionada}`);
      if (tableEl) {
        const thead = tableEl.querySelector("thead");
        const tbody = tableEl.querySelector("tbody");
        const headers = Object.keys(resData.tabla[0]);
        thead.innerHTML = `<tr>${headers.map(h => `<th>${h}</th>`).join("")}</tr>`;
        tbody.innerHTML = "";
        resData.tabla.forEach(fila => {
          const tr = document.createElement("tr");
          headers.forEach(key => {
            let val = fila[key];
            if (typeof val === "number" && !["n","Oi","i","Ei"].includes(key)) val = val.toFixed(4);
            tr.innerHTML += key === "¿Aprobado?"
              ? `<td style="color:${val === "SÍ" ? "#22c55e" : "#ef4444"};font-weight:bold;">${val}</td>`
              : `<td>${val}</td>`;
          });
          tbody.appendChild(tr);
        });
      }
    }

    if (pruebaSeleccionada === "huecos" && resData.secuencia)
      document.getElementById("huecos-secuencia").innerText = resData.secuencia;

    if (pruebaSeleccionada === "series" && resData.matrizFO) {
      let tableHTML = '<tr><th style="padding:0.5rem;border-bottom:1px solid var(--border);">Y \\ X</th>';
      if (resData.xLabels) resData.xLabels.forEach(lbl => {
        tableHTML += `<th style="padding:0.5rem;border-bottom:1px solid var(--border);color:var(--accent)">${lbl}</th>`;
      });
      tableHTML += "</tr>";
      resData.matrizFO.forEach((fila, i) => {
        let yLabel = resData.yLabels ? resData.yLabels[i] : `F${i+1}`;
        tableHTML += `<tr><th style="padding:0.5rem;border-bottom:1px solid var(--border);color:var(--accent)">${yLabel}</th>` +
          fila.map(val => `<td style="padding:0.5rem;border-bottom:1px solid var(--border);font-weight:bold;">${val}</td>`).join("") + `</tr>`;
      });
      document.getElementById("matrix-fo").innerHTML = tableHTML;
    }

    if (pruebaSeleccionada === "poker" && resData.detalle) {
      const inputDecimales = document.getElementById("test_param_decimales");
      const dec = inputDecimales ? parseInt(inputDecimales.value) : 5;
      let gridHTML = `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(110px,1fr));gap:0.5rem;">`;
      resData.detalle.forEach(item => {
        gridHTML += `
          <div style="background:var(--bg-elevated);border:1px solid var(--border);padding:0.5rem;border-radius:6px;display:flex;justify-content:space-between;align-items:center;">
            <span style="font-family:var(--mono);font-size:0.85rem;">${item.numero.toFixed(dec)}</span>
            <strong style="color:var(--red);font-size:0.85rem;margin-left:0.4rem;">${item.mano}</strong>
          </div>`;
      });
      gridHTML += `</div>`;
      document.getElementById("poker-grid-container").innerHTML = gridHTML;
    }

    if (pruebaSeleccionada !== "huecos" && pruebaSeleccionada !== "poker")
      renderChart(pruebaSeleccionada, resData);

  } catch (error) {
    alert("Error al procesar la prueba. " + error.message);
  }
});

function renderChart(type, data) {
  const canvas = document.getElementById(`chart-${type}`);
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (charts[type]) charts[type].destroy();
  Chart.defaults.color = "#64748b";
  Chart.defaults.borderColor = "#1e2d4a";

  if (type === "promedios" && data.chartData) {
    charts[type] = new Chart(ctx, { type:"line", data: {
      labels: Array.from({length: data.chartData.length}, (_,i) => i+1),
      datasets: [
        { label:"Valores r_i", data:data.chartData, borderColor:"#3d8bff", backgroundColor:"rgba(61,139,255,0.15)", fill:true, tension:0.3 },
        { label:"Media (0.5)", data:Array(data.chartData.length).fill(0.5), borderColor:"#ef4444", borderDash:[5,5], pointRadius:0 },
      ]
    }});
  } else if (type === "kolmogorov" && data.xVals) {
    charts[type] = new Chart(ctx, { type:"line", data: {
      labels: data.xVals.map(v => v.toFixed(2)),
      datasets: [
        { label:"Observada (Empírica)", data:data.yObs, borderColor:"#22c55e", stepped:true, borderWidth:2 },
        { label:"Uniforme (Esperada Y=X)", data:data.yEsp, borderColor:"#f59e0b", type:"line", pointRadius:0 },
      ]
    }});
  } else if (type === "series" && data.coordenadas) {
    charts[type] = new Chart(ctx, { type:"scatter", data: {
      datasets: [{ label:"Parejas (r_i, r_{i+1})", data:data.coordenadas, backgroundColor:"#3d8bff", pointRadius:5 }]
    }, options: { scales:{ x:{min:0,max:1}, y:{min:0,max:1} } }});
  } else if (type === "frecuencias" && data.tabla) {
    const labels     = data.tabla.map(t => t.Rango);
    const observadas = data.tabla.map(t => t.Oi);
    const esperada   = data.tabla[0].Ei;
    charts[type] = new Chart(ctx, { type:"bar", data: {
      labels,
      datasets: [
        { label:"Observada (Oi)", data:observadas, backgroundColor:"#22c55e" },
        { label:"Esperada (Ei)", data:Array(labels.length).fill(esperada), type:"line", borderColor:"#f59e0b", borderWidth:2, pointRadius:0 },
      ]
    }});
  }
}

// ──────────────────────────────────────────────────────────────
//  PYTHON METHOD NAV
// ──────────────────────────────────────────────────────────────
document.querySelectorAll('.py-method-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const method = btn.dataset.method;
    document.querySelectorAll('.py-method-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.py-view').forEach(v => { v.classList.remove('active'); v.classList.add('hidden'); });
    btn.classList.add('active');
    const view = document.getElementById(`pyview-${method}`);
    view.classList.remove('hidden'); view.classList.add('active');
  });
});

// ──────────────────────────────────────────────────────────────
//  PYTHON STATUS CHECK
// ──────────────────────────────────────────────────────────────
async function checkPythonStatus() {
  const statusEl   = document.getElementById('pyStatus');
  const statusText = document.getElementById('pyStatusText');
  try {
    const res = await fetch(`${PYTHON_API}/docs`, { method:'HEAD', signal: AbortSignal.timeout(3000) });
    statusEl.classList.remove('err'); statusEl.classList.add('ok');
    statusText.textContent = 'conectado ✓';
  } catch {
    statusEl.classList.remove('ok'); statusEl.classList.add('err');
    statusText.textContent = 'no disponible — ejecuta start.sh';
  }
}

// ──────────────────────────────────────────────────────────────
//  TRAMO MANAGEMENT (Inversa + AR)
// ──────────────────────────────────────────────────────────────
let invTramoCount = 0;
let arTramoCount  = 0;

function addTramo(prefix) {
  const container = document.getElementById(`${prefix}-tramos`);
  const count = prefix === 'inv' ? ++invTramoCount : ++arTramoCount;
  const div = document.createElement('div');
  div.className = 'tramo-card';
  div.id = `${prefix}-tramo-${count}`;
  div.innerHTML = `
    <div class="tramo-num">Tramo ${count}</div>
    <div class="input-group"><label>f(x)</label><input type="text" id="${prefix}_fx_${count}" placeholder="Ej: 2*x" value="" /></div>
    <div class="input-group"><label>a (desde)</label><input type="number" id="${prefix}_a_${count}" step="any" value="0" /></div>
    <div class="input-group"><label>b (hasta)</label><input type="number" id="${prefix}_b_${count}" step="any" value="1" /></div>
    <button class="btn-remove" onclick="removeTramo('${prefix}', ${count})">✕</button>
  `;
  container.appendChild(div);
}

function removeTramo(prefix, count) {
  const el = document.getElementById(`${prefix}-tramo-${count}`);
  if (el) el.remove();
}

function getTramos(prefix) {
  const tramos = [];
  document.querySelectorAll(`#${prefix}-tramos .tramo-card`).forEach(card => {
    const id = card.id.split('-').pop();
    const fx = document.getElementById(`${prefix}_fx_${id}`).value.trim();
    const a  = parseFloat(document.getElementById(`${prefix}_a_${id}`).value);
    const b  = parseFloat(document.getElementById(`${prefix}_b_${id}`).value);
    if (fx) tramos.push({ f_x: fx, a, b });
  });
  return tramos;
}

// Init default tramos
window.addEventListener('DOMContentLoaded', () => {
  addTramo('inv');
  addTramo('ar');
  addCompTramo();
  // Set sensible defaults for first tramo
  setTimeout(() => {
    const invFx = document.getElementById('inv_fx_1');
    if (invFx && !invFx.value) invFx.value = '2*x';
    const arFx = document.getElementById('ar_fx_1');
    if (arFx && !arFx.value) arFx.value = '2*x';
  }, 50);
});

// ──────────────────────────────────────────────────────────────
//  AR MANUAL TOGGLE
// ──────────────────────────────────────────────────────────────
function toggleArManual() {
  const modo = document.getElementById('ar_modo').value;
  const sec  = document.getElementById('ar-manual-section');
  modo === 'manual' ? sec.classList.remove('hidden') : sec.classList.add('hidden');
}

// ──────────────────────────────────────────────────────────────
//  COMPOSICIÓN TRAMOS
// ──────────────────────────────────────────────────────────────
let compTramoCount = 0;

function addCompTramo() {
  const container = document.getElementById('comp-tramos');
  const count = ++compTramoCount;
  const div = document.createElement('div');
  div.className = 'comp-tramo-card';
  div.id = `comp-tramo-${count}`;
  div.innerHTML = `
    <div class="tramo-num">Función ${count}</div>
    <div class="input-group"><label>Área (relativa)</label><input type="number" id="comp_area_${count}" step="any" value="0.5" /></div>
    <div class="input-group"><label>F⁻¹(R) en términos de R</label><input type="text" id="comp_finv_${count}" placeholder="Ej: R**(1/2)" value="" /></div>
    <button class="btn-remove" onclick="removeCompTramo(${count})">✕</button>
  `;
  container.appendChild(div);
}

function removeCompTramo(count) {
  const el = document.getElementById(`comp-tramo-${count}`);
  if (el) el.remove();
}

// ──────────────────────────────────────────────────────────────
//  PYTHON API CALLS
// ──────────────────────────────────────────────────────────────

// Helper: show error toast inline
function showPyError(containerId, message) {
  const el = document.getElementById(containerId);
  if (el) el.innerHTML = `<div class="alert" style="border-left-color:var(--red);background:rgba(239,68,68,0.08)">⚠ ${message}</div>`;
}

// ── Función desde Puntos ──
async function runFuncionDesdePuntos() {
  const payload = {
    x1: parseFloat(document.getElementById('p_x1').value),
    y1: parseFloat(document.getElementById('p_y1').value),
    x2: parseFloat(document.getElementById('p_x2').value),
    y2: parseFloat(document.getElementById('p_y2').value),
  };
  try {
    const res = await fetch(`${PYTHON_API}/api/simulacion/funcion-desde-puntos`, {
      method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error(await res.text());
    const data = await res.json();
    document.getElementById('puntos-result').style.display = 'block';
    document.getElementById('puntos-formula').textContent = `f(x) = ${data.funcion}`;
    document.getElementById('puntos-stats').innerHTML = `
      <div class="stat-card"><div class="stat-label">Pendiente (m)</div><div class="stat-value">${data.pendiente_m}</div></div>
      <div class="stat-card"><div class="stat-label">Intercepto (b)</div><div class="stat-value">${data.interseccion_b}</div></div>
    `;
  } catch (err) {
    alert('Error Python API: ' + err.message);
  }
}

// ── Transformada Inversa Analítica ──
async function runInversaAnalitica() {
  const segmentos = getTramos('inv');
  if (!segmentos.length) return alert('Agrega al menos un tramo f(x).');
  const payload = { cantidad: parseInt(document.getElementById('inv_cantidad').value), segmentos };
  const resultSection = document.getElementById('inversa-result');
  resultSection.classList.add('hidden');

  try {
    const res = await fetch(`${PYTHON_API}/api/simulacion/inversa-analitica`, {
      method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(payload)
    });
    if (!res.ok) throw new Error(await res.text());
    const data = await res.json();
    resultSection.classList.remove('hidden');

    // Desarrollo analítico
    const analisisEl = document.getElementById('inversa-analisis');
    analisisEl.innerHTML = '';
    (data.desarrollo_analitico || []).forEach((seg, idx) => {
      const card = document.createElement('div');
      card.className = 'analisis-card';
      card.innerHTML = `
        <div class="tramo-title">Tramo ${idx+1} — x ∈ ${seg.intervalo_x} | R ∈ ${seg.intervalo_R}</div>
        <div class="analisis-rows">
          <div class="analisis-row"><span class="row-label">f(x) =</span><span class="row-value">${seg.f_densidad}</span></div>
          <div class="analisis-row"><span class="row-label">F(x) =</span><span class="row-value">${seg.F_acumulada}</span></div>
          <div class="analisis-row"><span class="row-label">X = F⁻¹(R) =</span><span class="row-value">${seg.X_despejada}</span></div>
        </div>`;
      analisisEl.appendChild(card);
    });

    // Tabla
    const table = document.getElementById('table-inversa');
    const thead = table.querySelector('thead');
    const tbody = table.querySelector('tbody');
    if (data.tabla && data.tabla.length > 0) {
      const headers = Object.keys(data.tabla[0]);
      thead.innerHTML = `<tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr>`;
      tbody.innerHTML = '';
      data.tabla.forEach(row => {
        const tr = document.createElement('tr');
        headers.forEach(k => { tr.innerHTML += `<td>${row[k] ?? '-'}</td>`; });
        tbody.appendChild(tr);
      });
    }
  } catch (err) {
    alert('Error Python API: ' + err.message);
  }
}

// ── Aceptación y Rechazo ──
async function runAceptacionRechazo() {
  const segmentos = getTramos('ar');
  if (!segmentos.length) return alert('Agrega al menos un tramo f(x).');
  const modo     = document.getElementById('ar_modo').value;
  const cantidad = parseInt(document.getElementById('ar_cantidad').value);
  const mVal     = document.getElementById('ar_M').value;
  const payload = { segmentos, modo, cantidad, M: mVal ? parseFloat(mVal) : null };

  if (modo === 'manual') {
    const r1txt = document.getElementById('ar_r1').value.trim();
    const r2txt = document.getElementById('ar_r2').value.trim();
    payload.numeros_r1 = r1txt ? r1txt.split(',').map(n => parseFloat(n.trim())).filter(n => !isNaN(n)) : [];
    payload.numeros_r2 = r2txt ? r2txt.split(',').map(n => parseFloat(n.trim())).filter(n => !isNaN(n)) : [];
  }

  const resultSection = document.getElementById('rechazo-result');
  resultSection.classList.add('hidden');

  try {
    const res = await fetch(`${PYTHON_API}/api/simulacion/aceptacion-rechazo`, {
      method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(payload)
    });
    if (!res.ok) throw new Error(await res.text());
    const data = await res.json();
    resultSection.classList.remove('hidden');

    // Meta info
    document.getElementById('rechazo-meta').innerHTML = `
      <span>A = <strong>${data.A_global}</strong></span>
      <span>B = <strong>${data.B_global}</strong></span>
      <span>M = <strong>${data.M_utilizado}</strong></span>
      <span>Intentos = <strong>${data.total_intentos}</strong></span>
      <span>Aceptados = <strong style="color:var(--green)">${data.aceptados}</strong></span>
    `;

    // Pasos algebraicos
    const pasosEl = document.getElementById('rechazo-pasos');
    pasosEl.innerHTML = '';
    (data.pasos_algebraicos || []).forEach((paso, idx) => {
      const card = document.createElement('div');
      card.className = 'analisis-card';
      card.innerHTML = `
        <div class="tramo-title">Tramo ${idx+1} — ${paso.tramo}</div>
        <div class="analisis-rows">
          ${Object.entries(paso).filter(([k]) => k.startsWith('Paso')).map(([k,v]) =>
            `<div class="analisis-row"><span class="row-label">${k}</span><span class="row-value">${v}</span></div>`
          ).join('')}
        </div>`;
      pasosEl.appendChild(card);
    });

    // Tabla
    const table = document.getElementById('table-rechazo');
    const thead = table.querySelector('thead');
    const tbody = table.querySelector('tbody');
    if (data.tabla && data.tabla.length > 0) {
      const headers = Object.keys(data.tabla[0]);
      thead.innerHTML = `<tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr>`;
      tbody.innerHTML = '';
      data.tabla.forEach(row => {
        const estado = row.Estado;
        const tr = document.createElement('tr');
        if (estado === 'Acepta') tr.style.background = 'rgba(34,197,94,0.05)';
        if (estado === 'Rechaza') tr.style.opacity = '0.6';
        headers.forEach(k => {
          const v = row[k];
          let cell = `<td>${v ?? '-'}</td>`;
          if (k === 'Estado') cell = `<td style="font-weight:600;color:${estado === 'Acepta' ? 'var(--green)' : 'var(--red)'}">${v}</td>`;
          tr.innerHTML += cell;
        });
        tbody.appendChild(tr);
      });
    }
  } catch (err) {
    alert('Error Python API: ' + err.message);
  }
}

// ── Composición ──
async function runComposicion() {
  const areas = [], funciones_inversas = [];
  document.querySelectorAll('#comp-tramos .comp-tramo-card').forEach(card => {
    const id = card.id.split('-').pop();
    const area = parseFloat(document.getElementById(`comp_area_${id}`).value);
    const finv = document.getElementById(`comp_finv_${id}`).value.trim();
    if (finv) { areas.push(area); funciones_inversas.push(finv); }
  });
  if (!areas.length) return alert('Agrega al menos una función inversa.');

  const payload = { cantidad: parseInt(document.getElementById('comp_cantidad').value), areas, funciones_inversas };
  const resultSection = document.getElementById('composicion-result');
  resultSection.classList.add('hidden');

  try {
    const res = await fetch(`${PYTHON_API}/api/simulacion/composicion`, {
      method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(payload)
    });
    if (!res.ok) throw new Error(await res.text());
    const data = await res.json();
    resultSection.classList.remove('hidden');

    const table = document.getElementById('table-composicion');
    const thead = table.querySelector('thead');
    const tbody = table.querySelector('tbody');
    if (data.tabla && data.tabla.length > 0) {
      const headers = Object.keys(data.tabla[0]);
      thead.innerHTML = `<tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr>`;
      tbody.innerHTML = '';
      data.tabla.forEach(row => {
        const tr = document.createElement('tr');
        headers.forEach(k => {
          const v = row[k];
          tr.innerHTML += `<td>${typeof v === 'number' ? v.toFixed(5) : v}</td>`;
        });
        tbody.appendChild(tr);
      });
    }
  } catch (err) {
    alert('Error Python API: ' + err.message);
  }
}
