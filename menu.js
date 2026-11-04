/*
 * PODRUMIZZA — MENI PICA PREPISAN SA DOSTAVLJENOG MENIJA.
 * Nazivi, cene i čitljivi sastojci pica potiču sa slike koju je dostavio naručilac.
 * Sve pice su 32 cm. Deo sastava stavke Slatkicca je zaklonjen na slici.
 * Alergeni su informativno izvedeni iz sastojaka i tipa proizvoda; nisu potvrđena deklaracija.
 * Ostala jela i pića ostaju prethodni ilustrativni predlog sa generisanim cenama.
 * Konačan sastav, alergene, dostupnost i aktuelne cene potvrđuje restoran.
 */
window.PODRUMIZZA_CATEGORIES = [
  {
    "id": "pizza",
    "label": "Pice",
    "eyebrow": "DOBRA KORA. JOŠ BOLJE DRUŠTVO.",
    "intro": "Od jednostavne Margherite do bogatih kombinacija za one koji vole da probaju nešto novo."
  },
  {
    "id": "rostilj",
    "label": "Roštilj",
    "eyebrow": "ZA LJUBITELJE DOBROG ZALOGAJA.",
    "intro": "Sočno meso, topla lepinja i omiljeni prilozi. Predlog klasika za veliki i mali apetit."
  },
  {
    "id": "salate",
    "label": "Salate i prilozi",
    "eyebrow": "MALO SVEŽINE SA STRANE.",
    "intro": "Hrskavo, sveže i puno boja. Kao lagan obrok ili društvo tvom glavnom jelu."
  },
  {
    "id": "deserti",
    "label": "Nešto slatko",
    "eyebrow": "UVEK IMA MESTA ZA JOŠ.",
    "intro": "Kafa, čokolada, lešnik. Tri slatka razloga da ostaneš još malo."
  },
  {
    "id": "pica",
    "label": "Pića",
    "eyebrow": "PODIGNI ČAŠU ZA DOBRE TRENUTKE.",
    "intro": "Osveženje uz ručak, kafa posle njega i predlog piva za večernje druženje."
  }
];

window.PODRUMIZZA_MENU_SOURCE = {
  "pizzaSource": "Dostavljeni meni",
  "pizzaSize": "32 cm",
  "partialItem": "slatkicca"
};

window.PODRUMIZZA_MENU = [
  {
    "id": "margherita",
    "name": "Margherita",
    "category": "pizza",
    "description": "Fior di latte mozzarella, pelat, bosiljak.",
    "ingredients": [
      "fior di latte mozzarella",
      "pelat",
      "bosiljak"
    ],
    "allergens": [
      "gluten",
      "mleko"
    ],
    "allergenNote": "Informativno prema sastojcima; deklaraciju i moguće tragove alergena potvrđuje osoblje.",
    "price": 740,
    "unit": "32 cm",
    "source": "provided-menu"
  },
  {
    "id": "capricciosa",
    "name": "Capricciosa",
    "category": "pizza",
    "description": "Pelat/bešamel, fior di latte mozzarella, šunkarica, šampinjoni, origano, masline.",
    "ingredients": [
      "pelat/bešamel",
      "fior di latte mozzarella",
      "šunkarica",
      "šampinjoni",
      "origano",
      "masline"
    ],
    "allergens": [
      "gluten",
      "mleko"
    ],
    "allergenNote": "Informativno prema sastojcima; deklaraciju i moguće tragove alergena potvrđuje osoblje.",
    "price": 870,
    "unit": "32 cm",
    "source": "provided-menu"
  },
  {
    "id": "vesuvio",
    "name": "Vesuvio",
    "category": "pizza",
    "description": "Pelat/bešamel, fior di latte mozzarella, šunkarica.",
    "ingredients": [
      "pelat/bešamel",
      "fior di latte mozzarella",
      "šunkarica"
    ],
    "allergens": [
      "gluten",
      "mleko"
    ],
    "allergenNote": "Informativno prema sastojcima; deklaraciju i moguće tragove alergena potvrđuje osoblje.",
    "price": 840,
    "unit": "32 cm",
    "source": "provided-menu"
  },
  {
    "id": "madjarica",
    "name": "Mađarica",
    "category": "pizza",
    "description": "Pelat, fior di latte mozzarella, šunkarica, šampinjoni, kulen, feferoni.",
    "ingredients": [
      "pelat",
      "fior di latte mozzarella",
      "šunkarica",
      "šampinjoni",
      "kulen",
      "feferoni"
    ],
    "allergens": [
      "gluten",
      "mleko"
    ],
    "allergenNote": "Informativno prema sastojcima; deklaraciju i moguće tragove alergena potvrđuje osoblje.",
    "price": 940,
    "unit": "32 cm",
    "source": "provided-menu"
  },
  {
    "id": "diavolo",
    "name": "Diavolo",
    "category": "pizza",
    "description": "Pelat, fior di latte mozzarella, šunkarica, šampinjoni, domaća ljuta kobasica, grilovani cherry u marinadi od belog luka, tucana paprika, tabasco.",
    "ingredients": [
      "pelat",
      "fior di latte mozzarella",
      "šunkarica",
      "šampinjoni",
      "domaća ljuta kobasica",
      "grilovani cherry u marinadi od belog luka",
      "tucana paprika",
      "tabasco"
    ],
    "allergens": [
      "gluten",
      "mleko"
    ],
    "allergenNote": "Informativno prema sastojcima; deklaraciju i moguće tragove alergena potvrđuje osoblje.",
    "price": 1150,
    "unit": "32 cm",
    "source": "provided-menu"
  },
  {
    "id": "carbonara",
    "name": "Carbonara",
    "category": "pizza",
    "description": "Bešamel, fior di latte mozzarella, slanina, biber, krema od jaja, rukola, parmezan.",
    "ingredients": [
      "bešamel",
      "fior di latte mozzarella",
      "slanina",
      "biber",
      "krema od jaja",
      "rukola",
      "parmezan"
    ],
    "allergens": [
      "gluten",
      "mleko",
      "jaja"
    ],
    "allergenNote": "Informativno prema sastojcima; deklaraciju i moguće tragove alergena potvrđuje osoblje.",
    "price": 1100,
    "unit": "32 cm",
    "source": "provided-menu"
  },
  {
    "id": "mortadella-pistachio",
    "name": "Mortadella Pistachio",
    "category": "pizza",
    "description": "Bešamel, fior di latte mozzarella, mortadella, mrvljeni pistać, krema od pistaća, stracciatella, bosiljak.",
    "ingredients": [
      "bešamel",
      "fior di latte mozzarella",
      "mortadella",
      "mrvljeni pistać",
      "krema od pistaća",
      "stracciatella",
      "bosiljak"
    ],
    "allergens": [
      "gluten",
      "mleko",
      "pistaći"
    ],
    "allergenNote": "Informativno prema sastojcima; deklaraciju i moguće tragove alergena potvrđuje osoblje.",
    "price": 1290,
    "unit": "32 cm",
    "source": "provided-menu"
  },
  {
    "id": "daniela",
    "name": "Daniela",
    "category": "pizza",
    "description": "Pelat, crveni luk, fior di latte mozzarella, pršuta, grilovani cherry u marinadi od belog luka, rukola, parmezan, aceto krema.",
    "ingredients": [
      "pelat",
      "crveni luk",
      "fior di latte mozzarella",
      "pršuta",
      "grilovani cherry u marinadi od belog luka",
      "rukola",
      "parmezan",
      "aceto krema"
    ],
    "allergens": [
      "gluten",
      "mleko"
    ],
    "allergenNote": "Informativno prema sastojcima; deklaraciju i moguće tragove alergena potvrđuje osoblje.",
    "price": 1190,
    "unit": "32 cm",
    "source": "provided-menu"
  },
  {
    "id": "quattro-formaggi",
    "name": "Quattro Formaggi",
    "category": "pizza",
    "description": "Bešamel, fior di latte mozzarella, gorgonzola, stracciatella, parmezan, orasi.",
    "ingredients": [
      "bešamel",
      "fior di latte mozzarella",
      "gorgonzola",
      "stracciatella",
      "parmezan",
      "orasi"
    ],
    "allergens": [
      "gluten",
      "mleko",
      "orasi"
    ],
    "allergenNote": "Informativno prema sastojcima; deklaraciju i moguće tragove alergena potvrđuje osoblje.",
    "price": 1150,
    "unit": "32 cm",
    "source": "provided-menu"
  },
  {
    "id": "chicken-pesto",
    "name": "Chicken Pesto",
    "category": "pizza",
    "description": "Pesto podloga, fior di latte mozzarella, grilovana piletina, sušeni paradajz, pesto genovese, parmezan.",
    "ingredients": [
      "pesto podloga",
      "fior di latte mozzarella",
      "grilovana piletina",
      "sušeni paradajz",
      "pesto genovese",
      "parmezan"
    ],
    "allergens": [
      "gluten",
      "mleko"
    ],
    "allergenNote": "Informativno prema sastojcima; deklaraciju i moguće tragove alergena potvrđuje osoblje. Sastav pesta i eventualne orašaste plodove obavezno proveriti sa osobljem.",
    "price": 1050,
    "unit": "32 cm",
    "source": "provided-menu"
  },
  {
    "id": "prosciutto-burrata",
    "name": "Prosciutto Burrata",
    "category": "pizza",
    "description": "Pelat, fior di latte mozzarella, pršuta, cherry paradajz, parmezan, rukola, burrata, aceto krema.",
    "ingredients": [
      "pelat",
      "fior di latte mozzarella",
      "pršuta",
      "cherry paradajz",
      "parmezan",
      "rukola",
      "burrata",
      "aceto krema"
    ],
    "allergens": [
      "gluten",
      "mleko"
    ],
    "allergenNote": "Informativno prema sastojcima; deklaraciju i moguće tragove alergena potvrđuje osoblje.",
    "price": 1450,
    "unit": "32 cm",
    "source": "provided-menu"
  },
  {
    "id": "pesto-burrata",
    "name": "Pesto Burrata",
    "category": "pizza",
    "description": "Pesto podloga, fior di latte mozzarella, bosiljak, sušeni/svež cherry paradajz, pesto genovese, burrata.",
    "ingredients": [
      "pesto podloga",
      "fior di latte mozzarella",
      "bosiljak",
      "sušeni/svež cherry paradajz",
      "pesto genovese",
      "burrata"
    ],
    "allergens": [
      "gluten",
      "mleko"
    ],
    "allergenNote": "Informativno prema sastojcima; deklaraciju i moguće tragove alergena potvrđuje osoblje. Sastav pesta i eventualne orašaste plodove obavezno proveriti sa osobljem.",
    "price": 1090,
    "unit": "32 cm",
    "source": "provided-menu"
  },
  {
    "id": "bolognese",
    "name": "Bolognese",
    "category": "pizza",
    "description": "Bolognese sos, fior di latte mozzarella, bosiljak, parmezan.",
    "ingredients": [
      "bolognese sos",
      "fior di latte mozzarella",
      "bosiljak",
      "parmezan"
    ],
    "allergens": [
      "gluten",
      "mleko"
    ],
    "allergenNote": "Informativno prema sastojcima; deklaraciju i moguće tragove alergena potvrđuje osoblje.",
    "price": 950,
    "unit": "32 cm",
    "source": "provided-menu"
  },
  {
    "id": "posna-pizza",
    "name": "Posna Pizza",
    "category": "pizza",
    "description": "Pelat, crveni luk, biljni sir, tuna u komadima, šampinjoni, kukuruz šećerac, cherry.",
    "ingredients": [
      "pelat",
      "crveni luk",
      "biljni sir",
      "tuna u komadima",
      "šampinjoni",
      "kukuruz šećerac",
      "cherry"
    ],
    "allergens": [
      "gluten",
      "riba"
    ],
    "allergenNote": "Informativno prema sastojcima; deklaraciju i moguće tragove alergena potvrđuje osoblje. Sastav biljnog sira takođe treba potvrditi; posna pizza sadrži tunu.",
    "price": 1090,
    "unit": "32 cm",
    "source": "provided-menu"
  },
  {
    "id": "vegetariana",
    "name": "Vegetariana",
    "category": "pizza",
    "description": "Pelat, biljni sir/mozzarella, crveni luk, paprika, tikvice, kukuruz, šampinjoni.",
    "ingredients": [
      "pelat",
      "biljni sir/mozzarella",
      "crveni luk",
      "paprika",
      "tikvice",
      "kukuruz",
      "šampinjoni"
    ],
    "allergens": [
      "gluten",
      "mleko u varijanti sa mozzarellom"
    ],
    "allergenNote": "Informativno prema sastojcima; deklaraciju i moguće tragove alergena potvrđuje osoblje. Prisustvo mleka zavisi od izbora biljnog sira ili mozzarelle; sastav biljnog sira treba proveriti.",
    "price": 850,
    "unit": "32 cm",
    "source": "provided-menu"
  },
  {
    "id": "slatkicca",
    "name": "Slatkicca",
    "category": "pizza",
    "description": "Nutela, mrvljena plazma, krema od pistaća, šećer u prahu. Deo sastava je zaklonjen na dostavljenom meniju; kompletan sastav proveriti sa osobljem.",
    "ingredients": [
      "Nutela",
      "mrvljena plazma",
      "krema od pistaća",
      "šećer u prahu"
    ],
    "allergens": [
      "gluten",
      "mleko",
      "lešnici",
      "pistaći",
      "soja"
    ],
    "allergenNote": "Informativno prema sastojcima; deklaraciju i moguće tragove alergena potvrđuje osoblje. Dostavljeni sastav nije potpun; ne oslanjajte se na ovaj spisak bez potvrde osoblja.",
    "price": 850,
    "unit": "32 cm",
    "source": "provided-menu",
    "incomplete": true
  },
  {
    "id": "cevapi",
    "name": "Ćevapi u lepinji",
    "category": "rostilj",
    "description": "Ćevapi od junećeg mesa, topla lepinja, seckani luk i kajmak sa strane.",
    "ingredients": [
      "juneće meso",
      "začini",
      "pšenična lepinja",
      "crni luk",
      "kajmak"
    ],
    "allergens": [
      "gluten",
      "mleko"
    ],
    "tag": "Naš predlog",
    "price": 690,
    "unit": "porcija",
    "source": "concept"
  },
  {
    "id": "pljeskavica",
    "name": "Klasična pljeskavica",
    "category": "rostilj",
    "description": "Juneća pljeskavica sa lukom, ajvarom i svežim povrćem u toploj lepinji.",
    "ingredients": [
      "juneće meso",
      "začini",
      "pšenična lepinja",
      "crni luk",
      "paradajz",
      "zelena salata",
      "ajvar"
    ],
    "allergens": [
      "gluten"
    ],
    "price": 590,
    "unit": "porcija",
    "source": "concept"
  },
  {
    "id": "gurmanska-pljeskavica",
    "name": "Gurmanska pljeskavica",
    "category": "rostilj",
    "description": "Bogata kombinacija junećeg mesa, sira, slanine i ljute paprike.",
    "ingredients": [
      "juneće meso",
      "kačkavalj",
      "slanina",
      "ljuta paprika",
      "pšenična lepinja",
      "crni luk"
    ],
    "allergens": [
      "gluten",
      "mleko"
    ],
    "tag": "Ljuto",
    "price": 750,
    "unit": "porcija",
    "source": "concept"
  },
  {
    "id": "punjena-vesalica",
    "name": "Punjena bela vešalica",
    "category": "rostilj",
    "description": "Svinjski kare punjen sirom i slaninom, uz krompir i svežu salatu.",
    "ingredients": [
      "svinjski kare",
      "kačkavalj",
      "slanina",
      "krompir",
      "paradajz",
      "krastavac"
    ],
    "allergens": [
      "mleko"
    ],
    "price": 1090,
    "unit": "porcija",
    "source": "concept"
  },
  {
    "id": "pileci-file",
    "name": "Pileći file",
    "category": "rostilj",
    "description": "File piletine sa grilovanim povrćem i kremastim sosom od jogurta.",
    "ingredients": [
      "pileći file",
      "tikvice",
      "paprika",
      "crveni luk",
      "jogurt",
      "beli luk"
    ],
    "allergens": [
      "mleko"
    ],
    "price": 790,
    "unit": "porcija",
    "source": "concept"
  },
  {
    "id": "rostilj-plata",
    "name": "Roštilj plata za deljenje",
    "category": "rostilj",
    "description": "Predlog za društvo: ćevapi, pljeskavica i piletina uz lepinju, luk i kajmak.",
    "ingredients": [
      "juneće meso",
      "pileći file",
      "začini",
      "pšenična lepinja",
      "crni luk",
      "kajmak",
      "ajvar"
    ],
    "allergens": [
      "gluten",
      "mleko"
    ],
    "price": 2390,
    "unit": "za 2 osobe",
    "source": "concept"
  },
  {
    "id": "sopska-salata",
    "name": "Šopska salata",
    "category": "salate",
    "description": "Paradajz, krastavac, paprika i luk pod slojem belog sira.",
    "ingredients": [
      "paradajz",
      "krastavac",
      "paprika",
      "crni luk",
      "beli sir",
      "ulje"
    ],
    "allergens": [
      "mleko"
    ],
    "tag": "Vegetarijansko",
    "price": 390,
    "unit": "porcija",
    "source": "concept"
  },
  {
    "id": "cezar-salata",
    "name": "Cezar salata",
    "category": "salate",
    "description": "Hrskava salata, piletina, krutoni i parmezan sa bogatim Cezar prelivom.",
    "ingredients": [
      "zelena salata",
      "pileći file",
      "pšenični krutoni",
      "parmezan",
      "jaja",
      "senf",
      "inćuni",
      "maslinovo ulje"
    ],
    "allergens": [
      "gluten",
      "mleko",
      "jaja",
      "senf",
      "riba"
    ],
    "price": 690,
    "unit": "porcija",
    "source": "concept"
  },
  {
    "id": "rukola-parmezan",
    "name": "Rukola i parmezan",
    "category": "salate",
    "description": "Sveža rukola, čeri paradajz i listići parmezana sa limunovim prelivom.",
    "ingredients": [
      "rukola",
      "čeri paradajz",
      "parmezan",
      "limun",
      "maslinovo ulje"
    ],
    "allergens": [
      "mleko"
    ],
    "price": 490,
    "unit": "porcija",
    "source": "concept"
  },
  {
    "id": "pomfrit",
    "name": "Hrskavi pomfrit",
    "category": "salate",
    "description": "Zlatni krompirići sa morskom solju. Jednostavan prilog koji svi vole.",
    "ingredients": [
      "krompir",
      "suncokretovo ulje",
      "morska so"
    ],
    "allergens": [],
    "tag": "Vegetarijansko",
    "price": 320,
    "unit": "porcija",
    "source": "concept"
  },
  {
    "id": "tiramisu",
    "name": "Tiramisu",
    "category": "deserti",
    "description": "Slojevi piškota, kafe i maskarpone krema, sa završnim dodirom kakaa.",
    "ingredients": [
      "pšenične piškote",
      "maskarpone",
      "jaja",
      "kafa",
      "šećer",
      "kakao"
    ],
    "allergens": [
      "gluten",
      "mleko",
      "jaja"
    ],
    "tag": "Naš predlog",
    "price": 450,
    "unit": "porcija",
    "source": "concept"
  },
  {
    "id": "cokoladni-sufle",
    "name": "Čokoladni sufle",
    "category": "deserti",
    "description": "Topao čokoladni kolač sa mekom sredinom i kuglom sladoleda od vanile.",
    "ingredients": [
      "crna čokolada sa sojinim lecitinom",
      "pšenično brašno",
      "jaja",
      "puter",
      "šećer",
      "mlečni sladoled od vanile"
    ],
    "allergens": [
      "gluten",
      "mleko",
      "jaja",
      "soja"
    ],
    "price": 490,
    "unit": "porcija",
    "source": "concept"
  },
  {
    "id": "palacinke",
    "name": "Palačinke čokolada & lešnik",
    "category": "deserti",
    "description": "Tanke palačinke sa kremom od čokolade i lešnika i komadićima pečenog lešnika.",
    "ingredients": [
      "pšenično brašno",
      "mleko",
      "jaja",
      "čokoladni krem sa lešnikom i sojinim lecitinom",
      "lešnici"
    ],
    "allergens": [
      "gluten",
      "mleko",
      "jaja",
      "lešnici",
      "soja"
    ],
    "price": 390,
    "unit": "porcija",
    "source": "concept"
  },
  {
    "id": "limunada",
    "name": "Limunada",
    "category": "pica",
    "description": "Limun, voda i led, sa grančicom nane za dodatnu svežinu.",
    "ingredients": [
      "limun",
      "voda",
      "led",
      "nana",
      "šećer po želji"
    ],
    "allergens": [],
    "price": 290,
    "unit": "0,3 l",
    "source": "concept"
  },
  {
    "id": "espresso",
    "name": "Espresso",
    "category": "pica",
    "description": "Kratka pauza, puna aroma. Kafa za početak ili kraj dobrog obroka.",
    "ingredients": [
      "kafa",
      "voda"
    ],
    "allergens": [],
    "price": 170,
    "unit": "šoljica",
    "source": "concept"
  },
  {
    "id": "cappuccino",
    "name": "Cappuccino",
    "category": "pica",
    "description": "Espresso, toplo mleko i fina mlečna pena u jednoj šolji.",
    "ingredients": [
      "kafa",
      "mleko",
      "voda"
    ],
    "allergens": [
      "mleko"
    ],
    "price": 230,
    "unit": "šoljica",
    "source": "concept"
  },
  {
    "id": "mineralna-voda",
    "name": "Mineralna voda",
    "category": "pica",
    "description": "Predlog negazirane ili gazirane vode uz svaki obrok.",
    "ingredients": [
      "mineralna voda"
    ],
    "allergens": [],
    "price": 190,
    "unit": "0,25 l",
    "source": "concept"
  },
  {
    "id": "gazirani-sokovi",
    "name": "Gazirani sokovi",
    "category": "pica",
    "description": "Osveženje po izboru. Dostupne brendove i ukuse potvrđujemo uz konačni meni.",
    "ingredients": [
      "sastav prema deklaraciji odabranog napitka"
    ],
    "allergens": [],
    "price": 250,
    "unit": "0,33 l",
    "source": "concept"
  },
  {
    "id": "lager-pivo",
    "name": "Lager pivo",
    "category": "pica",
    "description": "Predlog lager piva uz picu i roštilj. Alkoholno piće namenjeno punoletnima.",
    "ingredients": [
      "voda",
      "ječmeni slad",
      "hmelj",
      "kvasac"
    ],
    "allergens": [
      "gluten"
    ],
    "price": 320,
    "unit": "0,5 l",
    "source": "concept"
  }
];
