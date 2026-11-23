# xat.com Multi-Guest Bot Swarm Engine

Készítette: RITMADA
Platform: Windows / Linux / macOS (Node.js v18+)

Ez a csomag tartalmazza a teljes xat.com nem regisztrált vendég-klienst (WASM Core), a dinamikus credential kezelőt (1789 mentett vendégazonosítóval) és a multi-proxy swarm orkesztrátort.

---

## 1. Telepítés PC-n (Windows / Linux / Mac)

1. Töltsd le és telepítsd a Node.js-t, ha még nincs fent: https://nodejs.org
2. Nyiss egy Parancssort (CMD), PowerShell-t vagy Terminált ebben a mappában.
3. Futtasd a függőségek telepítését:
```bash
npm install
```

---

## 2. Proxyk beállítása (`proxies.txt`)

Ha **több mint 1-2 botot** akarsz egyszerre tartósan a szobában tartani, másolj be működő (lehetőleg lakossági vagy mobil) proxykat a `proxies.txt` fájlba, soronként egyet:

```text
http://IP:PORT
http://felhasználó:jelszó@IP:PORT
socks5://IP:PORT
socks5://felhasználó:jelszó@IP:PORT
```

*Megjegyzés:* Proxyk nélkül a saját IP-dről 1-2 bot tud stabilan bent lenni; a 3. bot belépésekor a xat szervere IP-ütközés (`<dup />`) miatt ledobja a korábbit.

---

## 3. Futtatás

### A) Több bot indítása egyszerre (Swarm):

```bash
# 4 bot felvitele a TestRadio42 szobába 10 percre:
node xat_swarm.js --room TestRadio42 --count 4 --nick Szaby --stay 600

# 10 bot felvitele proxykkal:
node xat_swarm.js --room TestRadio42 --count 10 --nick Szaby --stay 600
```

Kapcsolók:
- `--room <név>`: Cél szoba neve (alapértelmezett: `TestRadio42`)
- `--count <szám>`: Botok száma (pl. `4`)
- `--nick <előtag>`: Nicknév előtag (pl. `Szaby` -> `Szaby_1`, `Szaby_2`, ...)
- `--stay <másodperc>`: Hány másodpercig maradjanak bent a szobában (alapértelmezett: `600` = 10 perc)
- `--proxies <fájl>`: Egyedi proxylista fájl megadása (alapértelmezett: `proxies.txt`)

### B) Egyetlen teszt-bot indítása kézzel:

```bash
node xat_guest_runner.js --room TestRadio42 --nick Szaby --id 1529198937 --k1 12fc2a28bd5b538cfd00 --msg "Szia" --stay 300
```

Proxyval:
```bash
node xat_guest_runner.js --room TestRadio42 --nick Szaby --id 1529198937 --k1 12fc2a28bd5b538cfd00 --proxy http://ip:port --msg "Szia" --stay 300
```
