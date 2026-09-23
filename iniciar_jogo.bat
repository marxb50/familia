:: 2>/dev/null; true << 'BATCH_EOF'
@echo off
title O Castelo que Nasce do Coracao - O Jogo
echo ===================================================
echo    O CASTELO QUE NASCE DO CORACAO - O JOGO 2D
echo ===================================================
echo.
echo Iniciando no Windows...

if exist "jogo_castelo_do_coracao" (
    cd /d "%~dp0jogo_castelo_do_coracao"
) else (
    cd /d "%~dp0"
)

where python >nul 2>&1
if %ERRORLEVEL% equ 0 (
    echo Iniciando servidor local (Python)...
    start "" "http://localhost:8080/index.html"
    python -m http.server 8080
    exit /b
)

where py >nul 2>&1
if %ERRORLEVEL% equ 0 (
    echo Iniciando servidor local (Py Launcher)...
    start "" "http://localhost:8080/index.html"
    py -m http.server 8080
    exit /b
)

start "" "index.html"
exit /b
BATCH_EOF

# --- LINUX BASH EXECUTION ---
SCRIPT_DIR="$(dirname "$(readlink -f "$0")")"

if [ -d "$SCRIPT_DIR/jogo_castelo_do_coracao" ]; then
    cd "$SCRIPT_DIR/jogo_castelo_do_coracao"
else
    cd "$SCRIPT_DIR"
fi

# Inicia servidor local se nao estiver rodando
if ! curl -s --connect-timeout 1 http://localhost:8080/index.html >/dev/null 2>&1; then
    python3 -m http.server 8080 >/dev/null 2>&1 &
    sleep 1
fi

export DISPLAY="${DISPLAY:-:0}"
if command -v google-chrome >/dev/null 2>&1; then
    google-chrome "http://localhost:8080/index.html" >/dev/null 2>&1 &
elif command -v xdg-open >/dev/null 2>&1; then
    xdg-open "http://localhost:8080/index.html" >/dev/null 2>&1 &
fi
exit 0
