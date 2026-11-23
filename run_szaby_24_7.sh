#!/bin/bash
cd /storage/emulated/0/Download/xat_bot
echo "[SUPERVISOR] Szaby 24/7 Service started at $(date)"
while true; do
    node xath_guest_runner.js --config account_config.json --stay 0 --silent
    echo "[SUPERVISOR] Runner exited. Re-launching in 3 seconds..."
    sleep 3
done
