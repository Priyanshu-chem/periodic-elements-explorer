import { ElementProperties } from "@/types";
import { getCategoryInfo } from "@/data/categories";
import jsPDF from "jspdf";

interface PropItem {
  label: string;
  value: string;
}

function Pi(label: string, value: string): PropItem {
  return { label, value };
}

function hexToRgb(hex: string): [number, number, number] {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!m) return [0, 0, 0];
  return [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)];
}

function lighten(hex: string, factor: number): string {
  const [r, g, b] = hexToRgb(hex);
  const nr = Math.min(255, Math.round(r + (255 - r) * factor));
  const ng = Math.min(255, Math.round(g + (255 - g) * factor));
  const nb = Math.min(255, Math.round(b + (255 - b) * factor));
  return `#${nr.toString(16).padStart(2, "0")}${ng.toString(16).padStart(2, "0")}${nb.toString(16).padStart(2, "0")}`;
}

function normalizeConfig(config: string): string {
  const map: Record<string, string> = {
    "⁰": "0",
    "¹": "1",
    "²": "2",
    "³": "3",
    "⁴": "4",
    "⁵": "5",
    "⁶": "6",
    "⁷": "7",
    "⁸": "8",
    "⁹": "9",
    "⁻": "-",
  };
  return config
    .split("")
    .map((c) => map[c] ?? c)
    .join("");
}

function sanitizeText(text: string): string {
  const map: Record<string, string> = {
    α: "alpha",
    β: "beta",
    γ: "gamma",
    δ: "delta",
    ε: "epsilon",
    θ: "theta",
    λ: "lambda",
    μ: "mu",
    π: "pi",
    σ: "sigma",
    τ: "tau",
    ω: "omega",
    "—": "-",
    "–": "-",
    "−": "-",
    "°": "deg",
    Å: "A",
    "×": "x",
    "→": "->",
    "←": "<-",
    "≥": ">=",
    "≤": "<=",
    "≠": "!=",
  };
  return text
    .split("")
    .map((c) => map[c] ?? (c.charCodeAt(0) <= 127 ? c : "?"))
    .join("");
}

function getShellCounts(config: string): number[] {
  const norm = normalizeConfig(config);
  const shells: number[] = [];
  const re = /(\d+)([spdf])(\d+)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(norm)) !== null) {
    const n = parseInt(m[1], 10);
    const count = parseInt(m[3], 10);
    const idx = n - 1;
    while (shells.length <= idx) shells.push(0);
    shells[idx] += count;
  }
  return shells;
}

function drawBohr(
  doc: jsPDF,
  x: number,
  y: number,
  w: number,
  h: number,
  shellCounts: number[],
  element: ElementProperties,
): void {}

function drawFormula(
  doc: jsPDF,
  text: string,
  x: number,
  y: number,
  fontSize: number,
  color: [number, number, number],
): number {
  let cx = x;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(fontSize);
  doc.setTextColor(color[0], color[1], color[2]);

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const code = ch.charCodeAt(0);

    if (code >= 0x2080 && code <= 0x2089) {
      const digit = String.fromCharCode(code - 0x2080 + 48);
      const subSize = fontSize * 0.65;
      doc.setFontSize(subSize);
      doc.text(digit, cx, y + 1.4);
      cx += doc.getTextWidth(digit);
      doc.setFontSize(fontSize);
    } else if (code === 0x00b2) {
      doc.setFontSize(fontSize * 0.65);
      doc.text("2", cx, y - 1.8);
      cx += doc.getTextWidth("2");
      doc.setFontSize(fontSize);
    } else if (code === 0x00b3) {
      doc.setFontSize(fontSize * 0.65);
      doc.text("3", cx, y - 1.8);
      cx += doc.getTextWidth("3");
      doc.setFontSize(fontSize);
    } else if (code === 0x00b9) {
      doc.setFontSize(fontSize * 0.65);
      doc.text("1", cx, y - 1.8);
      cx += doc.getTextWidth("1");
      doc.setFontSize(fontSize);
    } else if (code >= 0x2070 && code <= 0x2079) {
      const digit = String.fromCharCode(code - 0x2070 + 48);
      doc.setFontSize(fontSize * 0.65);
      doc.text(digit, cx, y - 1.8);
      cx += doc.getTextWidth(digit);
      doc.setFontSize(fontSize);
    } else if (code <= 127) {
      doc.text(ch, cx, y);
      cx += doc.getTextWidth(ch);
    } else {
      cx += doc.getTextWidth(" ");
    }
  }
  return cx;
}

function drawConfigValue(
  doc: jsPDF,
  config: string,
  x: number,
  y: number,
): void {
  const norm = normalizeConfig(config);
  const tokens = norm.split(/\s+/).filter(Boolean);
  let cx = x;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(26, 26, 46);

  for (const token of tokens) {
    const bracket = token.match(/^\[(\w+)\]$/);
    if (bracket) {
      doc.setFontSize(8);
      doc.text(token, cx, y);
      cx += doc.getTextWidth(token) + 1.8;
      continue;
    }

    const orb = token.match(/^(\d+[spdf])(\d+)$/);
    if (orb) {
      doc.setFontSize(8);
      doc.text(orb[1], cx, y);
      cx += doc.getTextWidth(orb[1]);

      doc.setFontSize(5.5);
      doc.text(orb[2], cx, y - 2.2);
      cx += doc.getTextWidth(orb[2]) + 1.8;
    } else {
      doc.setFontSize(8);
      doc.text(token, cx, y);
      cx += doc.getTextWidth(token) + 1.8;
    }
  }
}

function drawCard(
  doc: jsPDF,
  x: number,
  y: number,
  w: number,
  title: string,
  items: PropItem[],
  headerColor: [number, number, number],
): number {
  const headerH = 6;
  const padX = 2.5;
  const padY = 3.5;
  const lh = 3.8;
  const tc: [number, number, number] = [26, 26, 46];

  doc.setFillColor(headerColor[0], headerColor[1], headerColor[2]);
  doc.rect(x, y, w, headerH, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.text(title, x + padX, y + 4.2);

  let cy = y + headerH + padY;
  doc.setFontSize(8);

  for (const item of items) {
    const maxW = w - padX * 2;

    if (item.label) {
      const fullText = `${item.label}: ${item.value}`;
      const lines = doc.splitTextToSize(fullText, maxW);

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        doc.setTextColor(tc[0], tc[1], tc[2]);

        if (i === 0) {
          const labelPart = `${item.label}: `;
          doc.setFont("helvetica", "bold");
          const lw = doc.getTextWidth(labelPart);
          doc.text(labelPart, x + padX, cy);

          doc.setFont("helvetica", "normal");
          const rest = line.substring(labelPart.length);
          if (rest) {
            doc.text(rest, x + padX + lw, cy);
          }
        } else {
          doc.setFont("helvetica", "normal");
          doc.text(line, x + padX, cy);
        }
        cy += lh;
      }
    } else {
      const lines = doc.splitTextToSize(item.value, maxW);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(tc[0], tc[1], tc[2]);
      for (const line of lines) {
        doc.text(line, x + padX, cy);
        cy += lh;
      }
    }
  }

  return cy + 1;
}

export async function exportElementToPdf(
  element: ElementProperties,
): Promise<void> {
  const doc = new jsPDF("portrait", "mm", "a4");

  const PW = 210;
  const PH = 297;
  const LM = 10;
  const TM = 10;
  const BM = 10;
  const UW = PW - LM * 2;
  const UB = PH - BM;
  const CW = 92;
  const CG = 6;
  const LX = LM;
  const RX = LM + CW + CG;

  const cat = getCategoryInfo(element.category);
  const catRgb = hexToRgb(cat.color);
  const catDark = hexToRgb(cat.darkColor);
  const lightBg = lighten(cat.color, 0.7);
  const lightRgb = hexToRgb(lightBg);

  let y = TM;

  function needPage(needed: number): void {
    if (y + needed > UB) {
      doc.addPage();
      y = TM;
    }
  }

  // ──────────────────────────────────────────────────
  // HEADER CARD
  // ──────────────────────────────────────────────────
  const boxSz = 26;
  doc.setFillColor(catRgb[0], catRgb[1], catRgb[2]);
  doc.rect(LM, y, boxSz, boxSz, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  const symW = doc.getTextWidth(element.symbol);
  doc.text(element.symbol, LM + (boxSz - symW) / 2, y + boxSz / 2 + 5);

  const tx = LM + boxSz + 5;
  doc.setTextColor(26, 26, 46);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.text(String(element.atomicNumber), tx, y + 6);
  const anW = doc.getTextWidth(String(element.atomicNumber));

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text(element.name, tx + anW + 1, y + 10);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text(`${cat.label}  |  ${element.phase}`, tx, y + 18);

  y += boxSz + 4;

  // ── divider ──
  needPage(4);
  doc.setDrawColor(200, 200, 200);
  doc.line(LM, y, LM + UW, y);
  y += 5;

  // ──────────────────────────────────────────────────
  // STATS 4×1 GRID
  // ──────────────────────────────────────────────────
  needPage(17);
  const sc = 4;
  const sw = 45;
  const sg = (UW - sc * sw) / (sc - 1);
  const statLabels = ["Protons", "Neutrons", "Electrons", "Atomic Mass"];
  const neutrons = Math.max(
    0,
    Math.round(element.atomicWeight - element.atomicNumber),
  );
  const statValues = [
    String(element.atomicNumber),
    String(neutrons),
    String(element.atomicNumber),
    element.atomicMass,
  ];

  for (let i = 0; i < sc; i++) {
    const sx = LM + i * (sw + sg);
    doc.setFillColor(lightRgb[0], lightRgb[1], lightRgb[2]);
    doc.rect(sx, y, sw, 15, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.setTextColor(80, 80, 80);
    const lw = doc.getTextWidth(statLabels[i]);
    doc.text(statLabels[i], sx + (sw - lw) / 2, y + 4);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(26, 26, 46);
    const vw = doc.getTextWidth(statValues[i]);
    doc.text(statValues[i], sx + (sw - vw) / 2, y + 11);
  }

  y += 15 + 6;

  // ──────────────────────────────────────────────────
  // ELECTRON CONFIG & VALENCE
  // ──────────────────────────────────────────────────
  needPage(20);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(26, 26, 46);
  doc.text("Electronic Configuration", LM, y);
  y += 5;

  drawConfigValue(doc, element.electronConfiguration, LM, y);
  y += 4.5;

  if (element.electronConfigurationSemantic) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(26, 26, 46);
    doc.text("Semantic: ", LM, y);
    const sw2 = doc.getTextWidth("Semantic: ");
    drawConfigValue(doc, element.electronConfigurationSemantic, LM + sw2, y);
    y += 4.5;
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(26, 26, 46);
  doc.text("Valence Electrons: ", LM, y);
  const veW = doc.getTextWidth("Valence Electrons: ");
  doc.setFont("helvetica", "normal");
  doc.text(String(element.valenceElectrons), LM + veW, y);
  y += 5;

  // ──────────────────────────────────────────────────
  // BASIC + PHYSICAL (two columns)
  // ──────────────────────────────────────────────────
  needPage(60);

  const basicItems: PropItem[] = [
    Pi("Atomic Number", String(element.atomicNumber)),
    Pi("Group", element.group != null ? String(element.group) : "N/A"),
    Pi("Period", String(element.period)),
    Pi("Block", element.block.toUpperCase()),
    Pi("Category", element.categoryName),
  ];

  const physicalItems: PropItem[] = [
    Pi("Phase", element.phase),
    Pi(
      "Density",
      element.density != null ? `${element.density} g/cm\xB3` : "N/A",
    ),
    Pi(
      "Melting Point",
      element.meltingPoint != null ? `${element.meltingPoint} K` : "N/A",
    ),
    Pi(
      "Boiling Point",
      element.boilingPoint != null ? `${element.boilingPoint} K` : "N/A",
    ),
    Pi(
      "Thermal Cond.",
      element.thermalConductivity != null
        ? `${element.thermalConductivity} W/(m\xB7K)`
        : "N/A",
    ),
    Pi(
      "Electrical Cond.",
      element.electricalConductivity != null
        ? `${element.electricalConductivity} S/m`
        : "N/A",
    ),
    Pi(
      "Heat Capacity",
      element.heatCapacity != null
        ? `${element.heatCapacity} J/(kg\xB7K)`
        : "N/A",
    ),
  ];

  const cardBasic = drawCard(
    doc,
    LX,
    y,
    CW,
    "Basic Information",
    basicItems,
    catDark,
  );
  const cardPhys = drawCard(
    doc,
    RX,
    y,
    CW,
    "Physical Properties",
    physicalItems,
    catDark,
  );
  y = Math.max(cardBasic, cardPhys) + 4;

  // ──────────────────────────────────────────────────
  // ATOMIC + CRYSTAL (two columns)
  // ──────────────────────────────────────────────────
  needPage(60);

  const atomicItems: PropItem[] = [
    Pi(
      "Electronegativity",
      element.electronegativity != null
        ? String(element.electronegativity)
        : "N/A",
    ),
    Pi(
      "Electron Affinity",
      element.electronAffinity != null
        ? `${element.electronAffinity} kJ/mol`
        : "N/A",
    ),
    Pi(
      "Ionization Energy",
      element.ionizationEnergy != null
        ? `${element.ionizationEnergy} eV`
        : "N/A",
    ),
    Pi(
      "Atomic Radius",
      element.atomicRadius != null ? `${element.atomicRadius} pm` : "N/A",
    ),
    Pi(
      "Covalent Radius",
      element.covalentRadius != null ? `${element.covalentRadius} pm` : "N/A",
    ),
    Pi(
      "Ionic Radius",
      element.ionicRadius != null ? `${element.ionicRadius} pm` : "N/A",
    ),
    Pi(
      "Van der Waals R.",
      element.vanDerWaalsRadius != null
        ? `${element.vanDerWaalsRadius} pm`
        : "N/A",
    ),
  ];

  const xtalItems: PropItem[] = [
    Pi("Type", element.crystalStructure?.type ?? "N/A"),
    Pi("Space Group", element.crystalStructure?.spaceGroup ?? "N/A"),
    Pi(
      "Coord. Number",
      element.crystalStructure?.coordinationNumber != null
        ? String(element.crystalStructure.coordinationNumber)
        : "N/A",
    ),
    Pi(
      "a",
      element.crystalStructure?.parameters?.a != null
        ? `${element.crystalStructure.parameters.a} \xC5`
        : "N/A",
    ),
    Pi(
      "b",
      element.crystalStructure?.parameters?.b != null
        ? `${element.crystalStructure.parameters.b} \xC5`
        : "N/A",
    ),
    Pi(
      "c",
      element.crystalStructure?.parameters?.c != null
        ? `${element.crystalStructure.parameters.c} \xC5`
        : "N/A",
    ),
  ];

  const cardAtomic = drawCard(
    doc,
    LX,
    y,
    CW,
    "Atomic Properties",
    atomicItems,
    catDark,
  );
  const cardXtal = drawCard(
    doc,
    RX,
    y,
    CW,
    "Crystal Structure",
    xtalItems,
    catDark,
  );
  y = Math.max(cardAtomic, cardXtal) + 4;

  // ──────────────────────────────────────────────────
  // HISTORY (full width)
  // ──────────────────────────────────────────────────
  needPage(20);

  const historyItems: PropItem[] = [
    Pi("Discoverer", element.discoverer ?? "Unknown"),
    Pi(
      "Year Discovered",
      element.yearDiscovered != null
        ? String(element.yearDiscovered)
        : "Unknown",
    ),
    Pi("Name Origin", element.nameOrigin ?? "N/A"),
  ];

  y = drawCard(doc, LM, y, UW, "History", historyItems, catDark) + 3;

  // ──────────────────────────────────────────────────
  // COMPOUNDS + APPLICATIONS (two columns)
  // ──────────────────────────────────────────────────
  const compounds = element.commonCompounds ?? [];
  const apps = element.industrialApplications ?? [];

  if (compounds.length > 0 || apps.length > 0) {
    needPage(45);

    if (compounds.length > 0 && apps.length > 0) {
      // Compounds left — manual render for formula support
      doc.setFillColor(catDark[0], catDark[1], catDark[2]);
      doc.rect(LX, y, CW, 6, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.text("Common Compounds", LX + 2.5, y + 4.2);

      let compY = y + 9;
      doc.setFontSize(8);
      doc.setTextColor(26, 26, 46);
      for (const c of compounds) {
        doc.setFont("helvetica", "bold");
        drawFormula(doc, c, LX + 2.5, compY, 8, [26, 26, 46]);
        compY += 4;
      }
      const compBot = compY + 2;

      // Applications right
      const appItems: PropItem[] = apps.map((a) => Pi("", a));
      const appBot = drawCard(
        doc,
        RX,
        y,
        CW,
        "Applications",
        appItems,
        catDark,
      );

      y = Math.max(compBot, appBot) + 3;
    } else if (compounds.length > 0) {
      doc.setFillColor(catDark[0], catDark[1], catDark[2]);
      doc.rect(LM, y, UW, 6, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.text("Common Compounds", LM + 2.5, y + 4.2);

      let compY = y + 9;
      doc.setFontSize(8);
      doc.setTextColor(26, 26, 46);
      for (const c of compounds) {
        doc.setFont("helvetica", "bold");
        drawFormula(doc, c, LM + 2.5, compY, 8, [26, 26, 46]);
        compY += 4;
      }
      y = compY + 5;
    } else {
      const appItems: PropItem[] = apps.map((a) => Pi("", a));
      y = drawCard(doc, LM, y, UW, "Applications", appItems, catDark) + 3;
    }
  }

  // ──────────────────────────────────────────────────
  // PAGE 2 — ABUNDANCE & SAFETY
  // ──────────────────────────────────────────────────
  needPage(10);

  const safetyItems: PropItem[] = [
    Pi(
      "Crust Abundance",
      element.abundanceCrust != null
        ? `${element.abundanceCrust} mg/kg`
        : "N/A",
    ),
    Pi(
      "Universe Abundance",
      element.abundanceUniverse != null
        ? `${element.abundanceUniverse}`
        : "N/A",
    ),
    Pi("Natural Occurrence", element.naturalOccurrence ?? "N/A"),
    Pi("Hazards", element.hazards ?? "N/A"),
    Pi("Safety Information", element.safetyInformation ?? "N/A"),
  ];

  y = drawCard(doc, LM, y, UW, "Abundance & Safety", safetyItems, catDark) + 3;

  // ─── INTERESTING FACTS ───
  if (element.facts && element.facts.length > 0) {
    needPage(Math.max(15, element.facts.length * 4 + 12));
    const factItems: PropItem[] = element.facts.map((f, i) =>
      Pi(`Fact ${i + 1}`, f),
    );
    y = drawCard(doc, LM, y, UW, "Interesting Facts", factItems, catDark) + 3;
  }

  // ─── BIOLOGICAL ROLE ───
  if (element.biologicalImportance) {
    needPage(15);
    y =
      drawCard(
        doc,
        LM,
        y,
        UW,
        "Biological Role",
        [Pi("", element.biologicalImportance)],
        catDark,
      ) + 3;
  }

  // ─── ISOTOPES ───
  if (element.isotopes && element.isotopes.length > 0) {
    const isoRows = element.isotopes.map((iso) => [
      String(iso.massNumber),
      iso.mass.toFixed(2),
      iso.abundance > 0 ? `${iso.abundance.toFixed(2)}%` : "Trace",
      iso.halfLife ?? "-",
      iso.decayMode ?? "-",
    ]);

    needPage(Math.max(20, isoRows.length * 5 + 25));
    y = Math.max(y, TM + 22);

    const isColWs = [16, 35, 32, 45, 62];
    const isHeaders = [
      "Mass #",
      "Mass (u)",
      "Abundance",
      "Half-Life",
      "Decay Mode",
    ];

    doc.setFillColor(catDark[0], catDark[1], catDark[2]);
    doc.rect(LM, y, UW, 9, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    let hx = LM + 3;
    for (let c = 0; c < isHeaders.length; c++) {
      doc.text(isHeaders[c], hx, y + 4.8);
      hx += isColWs[c];
    }
    y += 9;

    doc.setFontSize(7.5);
    for (let r = 0; r < isoRows.length; r++) {
      needPage(5);
      if (r % 2 === 0) {
        doc.setFillColor(245, 245, 245);
        doc.rect(LM, y - 2, UW, 5, "F");
      }
      doc.setTextColor(26, 26, 46);
      doc.setFont("helvetica", "normal");
      hx = LM + 3;
      for (let c = 0; c < isoRows[r].length; c++) {
        doc.text(sanitizeText(isoRows[r][c]), hx, y + 1);
        hx += isColWs[c];
      }
      y += 5;
    }
    y += 3;
  }

  // ──────────────────────────────────────────────────
  // FOOTER
  // ──────────────────────────────────────────────────
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(150, 150, 150);
    doc.text("Generated by Periodic Elements Explorer", 105, 290, {
      align: "center",
    });
  }

  doc.save(`${element.symbol}_${element.name}.pdf`);
}
