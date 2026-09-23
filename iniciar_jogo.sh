#!/usr/bin/env bash
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if [ -d "$DIR/jogo_castelo_do_coracao" ]; then
    cd "$DIR/jogo_castelo_do_coracao"
else
    cd "$DIR"
fi

if command -v python3 >/dev/null 2>&1; then
    echo "Iniciando servidor local na porta 8080..."
    (sleep 1 && xdg-open "http://localhost:8080/index.html" 2>/dev/null || sensible-browser "http://localhost:8080/index.html" 2>/dev/null) &
    python3 -m http.server 8080
else
    xdg-open "index.html" 2>/dev/null || sensible-browser "index.html" 2>/dev/null
fi
