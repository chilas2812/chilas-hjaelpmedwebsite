# Chilas Studio

En selvstændig statisk hjemmeside. Alle websitekoncepter er fiktive designøvelser. Ingen kundeanmeldelser er opdigtet.

## Filer

Alt, der skal vises på hjemmesiden, ligger i `dist/`. Bevar mappestrukturen, når projektet lægges i et repository. Wrangler læser `./dist` og kræver ikke en `public`-mappe eller et byggetrin.

Cloudflare Workers: deploy-kommando `npx wrangler deploy` fra projektets rod. Dette offentliggør normalt siden hos Cloudflare; gør det først, når offentlig lancering er godkendt. Den aktuelle Sites-version er privat.

Cloudflare Pages: vælg ingen framework, tom build-kommando, output-mappe `dist`.

## Google-anmeldelser

`dist/reviews.json` er klargjort til en verificeret Google Business-profil. Indsæt den faktiske profils URL og eventuelt det direkte anmeldelseslink i `googleProfileUrl` og `googleReviewUrl`. Tjek begge links før brug. Anmeldelser kan tilføjes som objekter med `name`, `text`, `rating` (1–5), `date` (YYYY-MM-DD) og `sourceUrl` (direkte Google-link). Brug kun ægte anmeldelser, som må gengives, og bevar attribution. Siden linker hver anmeldelse til kilden. Dette er ikke en automatisk Google API-integration; en sådan kræver profil/adgang og særskilt opsætning. Når listen er tom, vises en ærlig tom tilstand.

## Kontakt

Telefon: +45 51 14 40 46. E-mail: chilasclaville@gmail.com. Kontaktformularen klargør en mail, og har kopiér-fallback. Den sender og lagrer ingen henvendelser på serveren.

## Privat visning

Privat adgang håndhæves af Sites, ikke af robots-metadata. Siden har `noindex` indtil offentlig lancering. Fjern dette ved en godkendt offentlig lancering, og opdater privatlivsteksten til den valgte hosting.
