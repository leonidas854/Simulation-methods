// Parámetros por defecto (Mantenemos la lógica intacta)
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
    { id: "m", label: "Módulo (m)", type: "number", val: "30049" },
    { id: "n", label: "Iteraciones (n)", type: "number", val: "50" },
  ],
};

// Configuración EXACTA de las tablas de tus apuntes
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
      "(X_{i-1}+X_{i-n})/m",
      "X_{i+1}",
      "r_i",
    ],
    keys: ["i", "Xi", "suma", "division", "Xi_1", "ri"],
  },
  "congruencial-cuadratico": {
    headers: ["i", "X_i", "aX_i²+bX_i+c", "(aX_i²+bX_i+c)/m", "X_{i+1}", "r_i"],
    keys: ["i", "Xi", "formula", "division", "Xi_1", "ri"],
  },
  "blum-blum-shub": {
    headers: ["i", "X_i", "X_i²", "X_i²/m", "X_{i+1}", "r_i"],
    keys: ["i", "Xi", "formula", "division", "Xi_1", "ri"],
  },
};

const selectMethod = document.getElementById("metodoSelect");
const dynamicInputs = document.getElementById("dynamicInputs");
const form = document.getElementById("simForm");
const tableHead = document.querySelector("table thead");
const tableBody = document.getElementById("tablaResultados");
const alerta = document.getElementById("alertaCiclo");

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
    params.append(input.id, document.getElementById(input.id).value);
  });

  try {
    const response = await fetch(
      `/api/simulacion/${currentMethod}?${params.toString()}`,
    );
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

      if (!cicloDetectado) {
        numerosVistos.add(valorAleatorio);
      }

      if (j >= limiteMostrar) {
        break;
      }

      const tr = document.createElement("tr");

      if (cicloDetectado) {
        tr.style.opacity = "1";
        tr.style.backgroundColor = "rgba(255, 0, 0, 0.05)";
      }

      tableConfig.keys.forEach((key) => {
        const td = document.createElement("td");
        if (key === "ri" || key === "un") {
          td.textContent = Number(fila[key]).toFixed(5);
        } else {
          td.textContent = fila[key];
        }
        tr.appendChild(td);
      });
      tableBody.appendChild(tr);
    }

    if (cicloDetectado) {
      document.getElementById("alertaMensaje").innerHTML =
        `El periodo de vida único es de <strong>${periodo}</strong> números. La sucesión comenzó a repetirse. <br>
                <span style="font-size: 0.85em; opacity: 0.7;">(Mostrando 10 iteraciones adicionales para observar el ciclo)</span>`;
      alerta.classList.remove("hidden");
    } else if (data.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="${tableConfig.headers.length}" class="empty-state">No se generaron resultados.</td></tr>`;
    }
  } catch (error) {
    tableBody.innerHTML = `<tr><td colspan="${tableConfig.headers.length}" style="color: #ef4444; text-align:center;">Error: Verifica los parámetros.</td></tr>`;
    console.error(error);
  }
});
