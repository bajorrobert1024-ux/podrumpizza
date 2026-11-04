# Podrumizza — prethodni dizajn, novi meni i mobilne padajuće kategorije

Sajt ponovo koristi glavni `index.html` sa jelovnikom, pričom i galerijom, uz zasebnu stranicu `rezervacija.html`. Na računaru ostaju raniji raspored, tipografija i kategorije menija. Na telefonu (do 760 px) kategorije su velike slikovne kartice koje otvaraju padajuće liste.

## Šta je uključeno

- 16 pica prepisanih sa dostavljenog menija, sa cenama i veličinom 32 cm.
- Prethodnih 19 stavki ostale ponude: 6 sa roštilja, 4 salate/priloga, 3 deserta i 6 pića. Ova ponuda i njene cene ostaju ilustrativni predlog.
- Pet mobilnih padajućih kategorija, uključujući kartu pića, sa sastojcima, cenama i detaljima.
- Zajednička pretraga, uključujući pretragu bez dijakritika.
- Hero sa tihim MP4 videom, dugmetom za pauzu i fotografijom kao rezervnim prikazom.
- Raniji obrazac za upit za rezervaciju sa obaveznim brojem gostiju i izborom obroka unapred ili po dolasku.
- Nema korpe, dodavanja na listu, naplate ili automatskog slanja poruka.

## Pokretanje

Raspakujte ceo paket i otvorite `index.html` u savremenom pregledaču. Za lokalni razvoj iz ovog direktorijuma:

```sh
python3 -m http.server 8082 --bind 127.0.0.1
```

Prenesite sadržaj direktorijuma na statički hosting za objavljivanje. Sačuvajte relativne putanje. Nema npm instalacije, kompilacije ili spoljašnjih fontova.

## Hero video

`assets/hero-ambience.mp4` je ilustrativna animacija postojećih fotografija pice i roštilja, napravljena na izričit zahtev naručioca. Nije snimak stvarnog restorana. Traje približno 16 sekundi, koristi H.264 i nema audio zapis. Video se ponavlja, može da se pauzira i zaustavlja se van vidljivog dela stranice. Kada pregledač ima uključeno smanjeno kretanje, čeka se ručno pokretanje.

Pravi snimak može zameniti ovaj MP4 uz isto ime fajla. `assets/hero-pizza.webp` služi kao poster i rezervni prikaz. Za ponovno generisanje ilustrativnog videa iz fotografija, uz instaliran FFmpeg:

```sh
python3 artifacts/render-video.py
```

Ovaj razvojni alat nije potreban za rad sajta.

## Uređivanje

- `index.html`: glavna stranica i pozivi za rezervaciju.
- `styles.css`: prethodni osnovni dizajn.
- `app.js`: desktop kategorije, pretraga i zajednički prozori sa detaljima.
- `mobile-menu.js` i `mobile-menu.css`: slikovne padajuće kategorije samo za telefon.
- `hero-video.js` i `hero-video.css`: video, pauziranje, smanjeno kretanje i rezervni prikaz.
- `menu.js`: svih 35 stavki, cene, sastojci i poreklo podataka.
- `rezervacija.html`, `rezervacija.css`, `rezervacija.js`: upit za rezervaciju.

## Napomene o meniju

Nazivi i cene 16 pica prepisani su sa dostavljene slike. Poslednja stavka je vidljiva kao „Slatkicca”; deo njenog sastava zaklanja Instagram traka. U prikazu je zato jasno navedeno da kompletan sastav treba proveriti sa osobljem. Nisu dodavani izmišljeni zaklonjeni sastojci.

Alergeni uz pice su informativno izvedeni iz sastojaka i ne predstavljaju potvrđenu deklaraciju. Dostupnost, aktuelne cene, konačnu recepturu i moguće tragove alergena potvrđuje osoblje. Ostala jela i pića su raniji predlog, što je označeno u prikazu.

Fotografije i video su ilustrativni, generisani za ovaj koncept. Fontovi DM Sans i Fraunces koriste SIL Open Font License; licence su u `assets`.

## Rezervacije i provere

Obrazac priprema tekst upita za pregled, izmenu, kopiranje ili preuzimanje. Posetilac ga sam prosleđuje restoranu preko navedenog Instagram profila. Sto, termin i pripremu jela za dolazak potvrđuje osoblje. Podaci se ne upisuju u localStorage ili bazu i ne šalju automatski.

Aktuelni snimci ekrana i izveštaj nalaze se u `artifacts`. Razvojni test zahteva Python Playwright i Chromium, uz pokrenut server na portu 8082:

```sh
python3 artifacts/smoke.py
```
