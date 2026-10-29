import { chromium } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

const outputPath = path.resolve(
  'public/downloads/passit-velkoobchodny-katalog.pdf'
);

const htmlContent = `<!DOCTYPE html>
<html lang="sk">
<head>
<meta charset="utf-8">
<title>PASSIT — Veľkoobchodný katalóg surovín pre HoReCa</title>
<style>
  @page {
    size: A4 portrait;
    margin: 14mm 16mm 14mm 16mm;
  }
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    color: #121314;
    background: #FFFFFF;
    font-size: 9.5pt;
    line-height: 1.45;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    border-bottom: 2px solid #121314;
    padding-bottom: 12px;
    margin-bottom: 16px;
  }
  .logo-block {
    display: flex;
    flex-direction: column;
  }
  .logo-title {
    font-size: 26pt;
    font-weight: 900;
    letter-spacing: -0.03em;
    color: #D2232A;
    line-height: 1;
  }
  .logo-sub {
    font-size: 8pt;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #121314;
    margin-top: 4px;
  }
  .header-meta {
    text-align: right;
    font-size: 8pt;
    color: #6A6D72;
    line-height: 1.4;
  }
  .badge-row {
    display: flex;
    gap: 8px;
    margin-bottom: 14px;
  }
  .badge {
    background: #F8F8FA;
    border: 1px solid #E5E5E8;
    padding: 3px 8px;
    font-size: 7.5pt;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #121314;
  }
  .badge-red {
    background: #D2232A;
    border-color: #D2232A;
    color: #FFFFFF;
  }
  .intro-box {
    background: #F8F8FA;
    border: 1px solid #E5E5E8;
    padding: 10px 14px;
    margin-bottom: 16px;
  }
  .intro-title {
    font-size: 10pt;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: #121314;
    margin-bottom: 3px;
  }
  .intro-p {
    font-size: 8.5pt;
    color: #4A4D52;
    line-height: 1.4;
  }
  .section-title {
    font-size: 11pt;
    font-weight: 800;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: #121314;
    border-bottom: 1px solid #121314;
    padding-bottom: 4px;
    margin-top: 14px;
    margin-bottom: 8px;
    display: flex;
    justify-content: space-between;
    align-items: baseline;
  }
  .section-origin {
    font-size: 7.5pt;
    font-weight: 600;
    color: #6A6D72;
    letter-spacing: 0.1em;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 12px;
    font-size: 8pt;
  }
  th {
    background: #F4F4F6;
    border: 1px solid #E5E5E8;
    padding: 5px 8px;
    text-align: left;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: #121314;
    font-size: 7pt;
  }
  td {
    border: 1px solid #E5E5E8;
    padding: 5px 8px;
    color: #121314;
    vertical-align: top;
  }
  tr:nth-child(even) td {
    background: #FAFAFC;
  }
  .item-code {
    font-family: monospace;
    font-weight: 700;
    color: #D2232A;
  }
  .item-name {
    font-weight: 700;
    color: #121314;
  }
  .item-spec {
    color: #6A6D72;
    font-size: 7.5pt;
    margin-top: 1px;
  }
  .storage-pill {
    display: inline-block;
    padding: 1px 5px;
    font-size: 6.5pt;
    font-weight: 700;
    border-radius: 2px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .chill { background: #EBF3FC; color: #155FA0; }
  .frozen { background: #E6F7F5; color: #0C6B5E; }
  .dry { background: #F5EFEB; color: #8C4E1A; }
  .page-break {
    page-break-before: always;
  }
  .footer-box {
    margin-top: 16px;
    border-top: 2px solid #121314;
    padding-top: 10px;
    display: flex;
    justify-content: space-between;
    font-size: 7.5pt;
    color: #6A6D72;
    line-height: 1.4;
  }
  .footer-contacts strong {
    color: #121314;
  }
</style>
</head>
<body>

  <!-- HEADER -->
  <div class="header">
    <div class="logo-block">
      <span class="logo-title">PASSIT</span>
      <span class="logo-sub">B2B Distribúcia prémiových talianskych surovín · HoReCa</span>
    </div>
    <div class="header-meta">
      <strong>Katalóg a technické listy surovín</strong><br>
      Aktualizácia: Sezóna 2026/2027<br>
      Garancia pôvodu &amp; D.O.P. / I.G.P.
    </div>
  </div>

  <div class="badge-row">
    <span class="badge badge-red">Priamy dovoz od výrobcov</span>
    <span class="badge">Chladený režim +2&nbsp;°C až +4&nbsp;°C</span>
    <span class="badge">Mrazený režim -18&nbsp;°C IQF</span>
    <span class="badge">Závozy PO — PIA</span>
    <span class="badge">Slovensko &amp; gastro prevádzky</span>
  </div>

  <div class="intro-box">
    <div class="intro-title">Oznámenie pre šéfkuchárov, prevádzkarov a nákupcov</div>
    <div class="intro-p">
      Tento katalóg obsahuje technické špecifikácie hlavných gastro surovín určených pre profesionálne pizzerie, reštaurácie a hotely. 
      Všetky produkty dovážame priamo od certifikovaných producentov bez sprostredkovateľov. Presné cenové podmienky a týždenné alokácie závozov pripravujeme individuálne podľa objemu odberu na <strong>harmata@passit.sk</strong> alebo <strong>+421 905 528 554</strong>.
    </div>
  </div>

  <!-- 1. MÚKY — LE 5 STAGIONI -->
  <div class="section-title">
    <span>1. Múky &amp; gastro semoly — Le 5 Stagioni (Agugiaro &amp; Figna)</span>
    <span class="section-origin">Curtarolo (Padova), Taliansko</span>
  </div>
  <table>
    <thead>
      <tr>
        <th style="width: 12%;">Kód</th>
        <th style="width: 38%;">Surovina &amp; špecifikácia</th>
        <th style="width: 20%;">Technické parametre</th>
        <th style="width: 15%;">Balenie / Karton</th>
        <th style="width: 15%;">Režim</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="item-code">L5S-NAP25</td>
        <td>
          <div class="item-name">Múka Tipo 00 Napoletana AVPN</div>
          <div class="item-spec">Oficiálna múka schválená Associazione Verace Pizza Napoletana.</div>
        </td>
        <td>W 300–320 · P/L 0,60<br>Kysnutie 24–48 h</td>
        <td>25 kg vrece<br>(paleta 40 ks)</td>
        <td><span class="storage-pill dry">Suchý sklad</span></td>
      </tr>
      <tr>
        <td class="item-code">L5S-SUP25</td>
        <td>
          <div class="item-name">Múka Tipo 00 Superiore</div>
          <div class="item-spec">Vysokoproteínová múka pre dlhé zrenia a vysokú hydratáciu (70%+).</div>
        </td>
        <td>W 320–340 · P/L 0,65<br>Kysnutie 48–72 h</td>
        <td>25 kg vrece<br>(paleta 40 ks)</td>
        <td><span class="storage-pill dry">Suchý sklad</span></td>
      </tr>
      <tr>
        <td class="item-code">L5S-SEM10</td>
        <td>
          <div class="item-name">Semola di Grano Duro Rimacinata</div>
          <div class="item-spec">Dvakrát mletá tvrdá pšenica na podsypávanie pizze a domáce cestoviny.</div>
        </td>
        <td>Jemná zrnitosť<br>Zlatistá farba</td>
        <td>10 kg vrece<br>(paleta 50 ks)</td>
        <td><span class="storage-pill dry">Suchý sklad</span></td>
      </tr>
      <tr>
        <td class="item-code">L5S-MAN25</td>
        <td>
          <div class="item-name">Múka Manitoba Tipo 0</div>
          <div class="item-spec">Silná múka pre posilnenie zmesí, panettone, briošky a focacciu.</div>
        </td>
        <td>W 390–410 · P/L 0,70<br>Extrémna elasticita</td>
        <td>25 kg vrece<br>(paleta 40 ks)</td>
        <td><span class="storage-pill dry">Suchý sklad</span></td>
      </tr>
    </tbody>
  </table>

  <!-- 2. SYRY — CASEIFICIO VALCOLATTE -->
  <div class="section-title">
    <span>2. Čerstvé syry &amp; mozzarella — Caseificio Valcolatte (od 1914)</span>
    <span class="section-origin">Pontenure (Piacenza), Taliansko</span>
  </div>
  <table>
    <thead>
      <tr>
        <th style="width: 12%;">Kód</th>
        <th style="width: 38%;">Surovina &amp; špecifikácia</th>
        <th style="width: 20%;">Gastro vlastnosti</th>
        <th style="width: 15%;">Balenie / Karton</th>
        <th style="width: 15%;">Režim</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="item-code">VAL-MOZJUL</td>
        <td>
          <div class="item-name">Mozzarella Julienne Gastro 100% Latte</div>
          <div class="item-spec">Rezance 4×4 mm pripravené na okamžité sypanie pizze bez prepúšťania vody.</div>
        </td>
        <td>Dokonalé tavenie<br>Neprihára v peci</td>
        <td>2,5 kg gastro sáčok<br>Karton 4 × 2,5 kg</td>
        <td><span class="storage-pill chill">+2 až +4 °C</span></td>
      </tr>
      <tr>
        <td class="item-code">VAL-BUF250</td>
        <td>
          <div class="item-name">Mozzarella di Bufala Campana D.O.P.</div>
          <div class="item-spec">Originálne byvolie mlieko z regiónu Kampánia. Garantovaný pôvod D.O.P.</div>
        </td>
        <td>Šťavnaté jadro<br>Typická plná chuť</td>
        <td>250 g (2 × 125 g)<br>Karton 8 ks</td>
        <td><span class="storage-pill chill">+2 až +4 °C</span></td>
      </tr>
      <tr>
        <td class="item-code">VAL-BUR125</td>
        <td>
          <div class="item-name">Burrata Pugliese Fresca</div>
          <div class="item-spec">Ručne plnený mešec s jemnou stracciatellou a smotanou.</div>
        </td>
        <td>Krémová textúra<br>Trvanlivosť 18 dní</td>
        <td>125 g téglik<br>Karton 8 ks</td>
        <td><span class="storage-pill chill">+2 až +4 °C</span></td>
      </tr>
      <tr>
        <td class="item-code">VAL-RIC150</td>
        <td>
          <div class="item-name">Ricotta Fresca Tradizionale</div>
          <div class="item-spec">Jemný srvátkový syr do plniek cestovín, calzone a dezertov cannoli.</div>
        </td>
        <td>Hladká štruktúra<br>Min. sušina 30 %</td>
        <td>1,5 kg vedierko<br>Karton 4 ks</td>
        <td><span class="storage-pill chill">+2 až +4 °C</span></td>
      </tr>
    </tbody>
  </table>

  <!-- PAGE BREAK FOR PAGE 2 -->
  <div class="page-break"></div>

  <!-- HEADER PAGE 2 -->
  <div class="header">
    <div class="logo-block">
      <span class="logo-title">PASSIT</span>
      <span class="logo-sub">Gastro sortiment · Údeniny, morské plody &amp; špeciality</span>
    </div>
    <div class="header-meta">
      Strana 2 / 2<br>
      Veľkoobchodný katalóg HoReCa
    </div>
  </div>

  <!-- 3. ÚDENINY — COATI & SIMONINI -->
  <div class="section-title">
    <span>3. Talianske salumi &amp; mäsové špeciality — Coati &amp; Simonini</span>
    <span class="section-origin">Verona &amp; Castelvetro di Modena, Taliansko</span>
  </div>
  <table>
    <thead>
      <tr>
        <th style="width: 12%;">Kód</th>
        <th style="width: 38%;">Surovina &amp; špecifikácia</th>
        <th style="width: 20%;">Pôvod &amp; zrenie</th>
        <th style="width: 15%;">Balenie / Karton</th>
        <th style="width: 15%;">Režim</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="item-code">COA-COTTO</td>
        <td>
          <div class="item-name">Prosciutto Cotto Alta Qualità Gastro</div>
          <div class="item-spec">Varená šunka najvyššej kvality bez pridanej vody a polyfosfátov.</div>
        </td>
        <td>Celý sval<br>Jemná aróma bylín</td>
        <td>cca 8,5 kg blok<br>Karton 2 ks</td>
        <td><span class="storage-pill chill">+2 až +4 °C</span></td>
      </tr>
      <tr>
        <td class="item-code">SIM-PARMA</td>
        <td>
          <div class="item-name">Prosciutto di Parma D.O.P. (24 mesiacov)</div>
          <div class="item-spec">Autentická parmská šunka solená morskou soľou, vyzretá v kopcoch Parmy.</div>
        </td>
        <td>D.O.P. certifikácia<br>Zrenie 24 mes.</td>
        <td>cca 7,5 kg vykostená<br>Karton 2 ks</td>
        <td><span class="storage-pill chill">+2 až +4 °C</span></td>
      </tr>
      <tr>
        <td class="item-code">COA-SPIAN</td>
        <td>
          <div class="item-name">Salame Spianata Calabra Piccante</div>
          <div class="item-spec">Pikantná kalábrijská saláma s mletým čili pepperoncinom, tvarovaná na plátky.</div>
        </td>
        <td>Ideálna na pizzu<br>Diavola / Piccante</td>
        <td>cca 2,0 kg kus<br>Karton 4 ks</td>
        <td><span class="storage-pill chill">+2 až +4 °C</span></td>
      </tr>
      <tr>
        <td class="item-code">SIM-GUANC</td>
        <td>
          <div class="item-name">Guanciale Stagionato al Pepe</div>
          <div class="item-spec">Tradičný sušený bravčový lalok obalený v čiernom korení na pravé Carbonara.</div>
        </td>
        <td>Vysoký podiel tuku<br>Kultová chuť</td>
        <td>cca 1,6 kg vákuum<br>Karton 4 ks</td>
        <td><span class="storage-pill chill">+2 až +4 °C</span></td>
      </tr>
    </tbody>
  </table>

  <!-- 4. MORSKÉ PLODY — GALANA SEAFOOD -->
  <div class="section-title">
    <span>4. Morské plody &amp; ryby — Galana Seafood (Seaboy)</span>
    <span class="section-origin">Waregem, Belgicko / Divoký atlantický odlov</span>
  </div>
  <table>
    <thead>
      <tr>
        <th style="width: 12%;">Kód</th>
        <th style="width: 38%;">Surovina &amp; špecifikácia</th>
        <th style="width: 20%;">Veľkosť / Úprava</th>
        <th style="width: 15%;">Balenie / Karton</th>
        <th style="width: 15%;">Režim</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="item-code">GAL-ARG-L1</td>
        <td>
          <div class="item-name">Gamberi Argentini L1 (Pleoticus muelleri)</div>
          <div class="item-spec">Divoký odlov Južný Atlantik. Šokové mrazenie priamo na rybárskej lodi.</div>
        </td>
        <td>Veľkosť L1 (10–20 ks/kg)<br>Celé s hlavou</td>
        <td>2,0 kg box<br>Karton 6 × 2 kg</td>
        <td><span class="storage-pill frozen">-18 °C IQF</span></td>
      </tr>
      <tr>
        <td class="item-code">GAL-VAN-EP</td>
        <td>
          <div class="item-name">Krevety Vannamei Easy Peel 16/20</div>
          <div class="item-spec">Narezaný chrbát pre rýchlu prípravu na panvici a grile, minimálna glazúra.</div>
        </td>
        <td>Veľkosť 16/20 ks/lb<br>Easy Peel s chvostíkom</td>
        <td>1,0 kg gastro vrecko<br>Karton 10 × 1 kg</td>
        <td><span class="storage-pill frozen">-18 °C IQF</span></td>
      </tr>
      <tr>
        <td class="item-code">GAL-CAL-CLE</td>
        <td>
          <div class="item-name">Kalamáre celé čistené U5 (Loligo)</div>
          <div class="item-spec">Čisté tuby a chápadlá, pripravené na plnenie, grilovanie alebo fritovanie.</div>
        </td>
        <td>Veľkosť U5<br>IQF zmrazenie</td>
        <td>1,0 kg gastro sáčok<br>Karton 10 × 1 kg</td>
        <td><span class="storage-pill frozen">-18 °C IQF</span></td>
      </tr>
    </tbody>
  </table>

  <!-- 5. PARADAJKY & GASTRO ZÁKLADY -->
  <div class="section-title">
    <span>5. Paradajky &amp; gastronómia — San Marzano D.O.P. &amp; špeciality</span>
    <span class="section-origin">Agro Sarnese-Nocerino, Neapol, Taliansko</span>
  </div>
  <table>
    <thead>
      <tr>
        <th style="width: 12%;">Kód</th>
        <th style="width: 38%;">Surovina &amp; špecifikácia</th>
        <th style="width: 20%;">Certifikácia &amp; chuť</th>
        <th style="width: 15%;">Balenie / Karton</th>
        <th style="width: 15%;">Režim</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="item-code">SMZ-DOP25</td>
        <td>
          <div class="item-name">Pomodoro San Marzano dell'Agro Sarnese D.O.P.</div>
          <div class="item-spec">Celé lúpané podlhovasté paradajky v hustej šťave. Sopečná pôda Vezuvu.</div>
        </td>
        <td>D.O.P. pečať<br>Nízka kyslosť, sladkosť</td>
        <td>2 500 g plechovka<br>Karton 6 ks</td>
        <td><span class="storage-pill dry">Suchý sklad</span></td>
      </tr>
      <tr>
        <td class="item-code">EVO-ITA05</td>
        <td>
          <div class="item-name">Olio Extra Vergine di Oliva 100% Italiano</div>
          <div class="item-spec">Za studena lisovaný extra panenský olivový olej na finišovanie pizze a šalátov.</div>
        </td>
        <td>Kyslosť &lt; 0,3 %<br>Ovocno-bylinný tón</td>
        <td>5 l kanister gastro<br>Karton 2 ks</td>
        <td><span class="storage-pill dry">Suchý sklad</span></td>
      </tr>
    </tbody>
  </table>

  <!-- LOGISTICS & FOOTER -->
  <div class="footer-box">
    <div class="footer-contacts">
      <strong>PASSIT s. r. o.</strong> · Stránske 452, 013 13 Stránske<br>
      IČO: 47358840 · DIČ: 2023846665 · IČ DPH: SK2023846665<br>
      E-mail: <strong>harmata@passit.sk</strong> · Tel: <strong>+421 905 528 554</strong>
    </div>
    <div style="text-align: right;">
      <strong>ZÁVOZOVÝ PORIADOK &amp; OBJEDNÁVKY:</strong><br>
      Objednávky prijaté do 14:00 závozujeme podľa harmonogramu trás.<br>
      Vozidlá s duálnym chladením (+2 až +4 °C a -18 °C) certifikované ATP.
    </div>
  </div>

</body>
</html>`;

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.setContent(htmlContent, { waitUntil: 'load' });
  await page.pdf({
    path: outputPath,
    format: 'A4',
    printBackground: true,
    margin: {
      top: '12mm',
      bottom: '12mm',
      left: '14mm',
      right: '14mm',
    },
  });

  await browser.close();
  console.log(
    `[generate-catalog-pdf] Generated: ${outputPath} (${fs.statSync(outputPath).size} bytes)`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
