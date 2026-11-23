# xath.hu 24/7 Regisztrált Felhasználó Keeper & Render Deployment

Ez a modul arra készült, hogy egy **email címmel regisztrált xath.hu fiókot** a nap 24 órájában folyamatosan online tartson az adott szobában (`xmradio`), és felhőben (pl. Render.com, VPS, Heroku) fusson megszakítás nélkül.

---

## 1. Bejelentkezés Email címmel és Jelszóval (Közvetlen)

A script mostantól automatikusan be tud lépni az email címeddel és jelszavaddal a `https://xath.hu/web_gear/chat/register5.php` végponton keresztül.

### A) Helyi beállítás: `account_config.json`
Nyisd meg az `account_config.json` fájlt, és írd be az email címedet és a jelszavadat:
```json
{
  "room": "xmradio",
  "email": "te-emaileden@gmail.com",
  "password": "a_te_jelszavad",
  "nick": "Szaby",
  "avatar": "100",
  "greeting": "Sziasztok!"
}
```

### B) Indítás parancssorból:
```bash
node xath_24_7_keeper.js --email "te-emaileden@gmail.com" --password "a_te_jelszavad" --room xmradio
```

### C) Render.com beállítás (Környezeti változók):
A Render Dashboardon a **Environment Variables** menüpontban add hozzá:
- **`EMAIL`**: `te-emaileden@gmail.com`
- **`PASSWORD`**: `a_te_jelszavad`
- **`ROOM`**: `xmradio`

---

## 2. Render.com Telepítés (Ingyenes 24/7 Web Service)

1. Töltsd fel a mappát egy privát GitHub tárolóba (Repository).
2. A Render Dashboardon kattints a **New +** -> **Web Service** gombra.
3. Válaszd ki a feltöltött GitHub repository-t.
4. Állítsd be a következőket:
   - **Name:** `xath-keeper`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node xath_24_7_keeper.js`
   - **Plan:** `Free`
5. Az **Environment Variables** résznél add hozzá:
   - `EMAIL`: `te-emaileden@gmail.com`
   - `PASSWORD`: `a_te_jelszavad`
   - `ROOM`: `xmradio`
6. Kattints a **Deploy Web Service** gombra.

---

## 3. Hogy ne aludjon el a Render Free csomag (Anti-Sleep)

A Render ingyenes csomagja 15 perc inaktivitás után alvó állapotba küldi a web service-eket, ha nem érkezik rájuk webes kérés.

**Megoldás (1 perc alatt beállítható):**
1. Amikor a Renderen elkészül a deployment, kapsz egy nyilvános linket (pl. `https://xath-keeper.onrender.com`).
2. Regisztrálj az ingyenes [uptimerobot.com](https://uptimerobot.com) vagy [cron-job.org](https://cron-job.org) oldalra.
3. Hozz létre egy új monitort (HTTP ping):
   - **URL:** `https://xath-keeper.onrender.com/health`
   - **Intervallum:** 5 percenként.
4. Ezzel a Render sosem fog elaludni, a szerver 24/7 folyamatosan ébren tartja a botot.

---

## 4. Beépített védelem a kidobás ellen
- **Automatikus bejelentkezés:** Nem kell manuálisan tokeneket vadászni, az email+jelszó párossal közvetlenül a szerverről kéri le az azonosítókat.
- **Automatikus újracsatlakozás (Auto-reconnect):** Ha bármilyen hálózati szakadás történik, a bot azonnal automatikusan újracsatlakozik.
- **`dup` védelem:** Ha belépsz gépről vagy telefonról, a bot érzékeli a duplikált sessiont, vár 10 másodpercet, és utána újra felcsatlakozik anélkül, hogy összeomlana.
- **Stealth Ping (`/s`):** 25 másodpercenként csendes jelenléti csomagot küld a szervernek, így az sosem dobja ki inaktivitás miatt.
