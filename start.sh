#!/usr/bin/env bash
# =========================================================
#  start.sh  —  Levanta Python FastAPI (:8000) +
#               Spring Boot (:8080) con un solo comando
# =========================================================
set -e
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# ── Colores ──────────────────────────────────────────────
CYAN='\033[0;36m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'
RED='\033[0;31m'; RESET='\033[0m'; BOLD='\033[1m'

echo -e ""
echo -e "${CYAN}${BOLD}╔══════════════════════════════════════════╗${RESET}"
echo -e "${CYAN}${BOLD}║       Simulation Methods  — Startup      ║${RESET}"
echo -e "${CYAN}${BOLD}╚══════════════════════════════════════════╝${RESET}"
echo -e ""

# ── Verificar dependencias ───────────────────────────────
command -v java   >/dev/null 2>&1 || { echo -e "${RED}✗ Java no encontrado. Instala JDK 17+${RESET}"; exit 1; }
command -v python3 >/dev/null 2>&1 || { echo -e "${RED}✗ Python3 no encontrado.${RESET}"; exit 1; }

# ── Instalar dependencias Python ─────────────────────────
echo -e "${YELLOW}→ Instalando dependencias Python...${RESET}"
python3 -m pip install -r requirements.txt -q --break-system-packages 2>/dev/null \
  || python3 -m pip install -r requirements.txt -q 2>/dev/null \
  || true

# ── Iniciar Python FastAPI ───────────────────────────────
echo -e "${YELLOW}→ Iniciando Python FastAPI en http://localhost:8000${RESET}"
python3 -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload \
  > /tmp/python-sim.log 2>&1 &
PYTHON_PID=$!

# ── Iniciar Spring Boot ──────────────────────────────────
echo -e "${YELLOW}→ Iniciando Spring Boot en http://localhost:8080${RESET}"
./mvnw spring-boot:run \
  > /tmp/java-sim.log 2>&1 &
JAVA_PID=$!

# ── Esperar a que los servicios arranquen ────────────────
echo -e "${YELLOW}→ Esperando que los servicios estén listos...${RESET}"

wait_for_port() {
  local port=$1; local name=$2; local retries=30
  for i in $(seq 1 $retries); do
    if curl -s -o /dev/null "http://localhost:$port" 2>/dev/null || \
       nc -z localhost "$port" 2>/dev/null; then
      echo -e "  ${GREEN}✓ $name listo${RESET}"
      return 0
    fi
    sleep 1
  done
  echo -e "  ${RED}✗ $name tardó demasiado. Revisa /tmp/${name,,}-sim.log${RESET}"
}

wait_for_port 8000 "Python API"
wait_for_port 8080 "Spring Boot"

echo -e ""
echo -e "${GREEN}${BOLD}✓ Ambos servicios corriendo:${RESET}"
echo -e "  ${CYAN}Frontend:    http://localhost:8080${RESET}"
echo -e "  ${CYAN}Python API:  http://localhost:8000/docs${RESET}"
echo -e ""
echo -e "  Logs: /tmp/python-sim.log  |  /tmp/java-sim.log"
echo -e ""
echo -e "${YELLOW}Presiona Ctrl+C para detener ambos servicios.${RESET}"
echo -e ""

# ── Cleanup al salir ─────────────────────────────────────
cleanup() {
  echo -e ""
  echo -e "${YELLOW}→ Deteniendo servicios...${RESET}"
  kill "$PYTHON_PID" 2>/dev/null || true
  kill "$JAVA_PID"   2>/dev/null || true
  # Matar proceso Maven hijo si sigue vivo
  pkill -f "spring-boot:run" 2>/dev/null || true
  wait "$PYTHON_PID" 2>/dev/null || true
  wait "$JAVA_PID"   2>/dev/null || true
  echo -e "${GREEN}✓ Servicios detenidos.${RESET}"
}
trap cleanup EXIT INT TERM

# ── Mantener vivo el script ──────────────────────────────
wait
