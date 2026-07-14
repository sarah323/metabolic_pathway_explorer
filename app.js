/* ======================================================================
   MODULE NAVIGATION
====================================================================== */
const navTabs = document.querySelectorAll('.nav-tab');
const modules = document.querySelectorAll('.module');

navTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const target = tab.getAttribute('data-module');
        navTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        modules.forEach(m => m.classList.remove('active'));
        const targetEl = document.getElementById(target);
        if (targetEl) targetEl.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});

/* ======================================================================
   MODAL CONTROLS
====================================================================== */
function openModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.classList.add('active');
        const closeBtn = modal.querySelector('.modal-close');
        if (closeBtn) closeBtn.focus();
    }
}

function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.remove('active');
}

document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) {
        e.target.classList.remove('active');
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay.active').forEach(m => m.classList.remove('active'));
    }
});

function copyCitation() {
    const text = document.getElementById('citeAPA').innerText;
    navigator.clipboard.writeText(text).then(() => {
        const btn = document.querySelector('#citationModal .copy-btn');
        btn.textContent = 'Copied!';
        setTimeout(() => { btn.textContent = 'Copy APA Citation'; }, 2000);
    });
}

/* ======================================================================
   SECTION 1: PATHWAY MAP (Module 1)
====================================================================== */
const mapComments = {
    normal: 'Normal physiology: Moderate insulin (10 µIU/mL) with high sensitivity (8/10). All signalling cascades are appropriately active – GLUT4 translocates, FOXO1 is suppressed (gluconeogenesis OFF), mTORC1‑SREBP‑1c drives moderate lipogenesis, HSL is inhibited, LPL clears triglycerides efficiently.',
    insulinoma: 'Insulinoma: Excessive insulin (80 µIU/mL) with high sensitivity (9/10). Hyperactivation of the pathway – FOXO1 completely suppressed (risk of hypoglycaemia), SREBP‑1c strongly active (weight gain), HSL inhibited, LPL maximally active. Glucose is driven dangerously low.',
    dka: 'Diabetic ketoacidosis: Absolute insulin deficiency (0 µIU/mL). No signalling through the cascade – GLUT4 stays internalised, FOXO1 fully active (gluconeogenesis maximal), SREBP‑1c off, HSL fully active (rampant lipolysis), LPL absent (lipaemic serum).',
    t2dm: 'Type 2 diabetes with insulin resistance: High insulin (60 µIU/mL) but low sensitivity (2/10). Effective signal is low – GLUT4 translocation fails, FOXO1 remains active (hepatic glucose output), yet mTORC1‑SREBP‑1c is paradoxically active (selective hepatic lipogenesis). HSL is unsuppressed (lipolysis continues), LPL impaired, creating atherogenic dyslipidaemia.'
};

let currentMapPreset = 'normal';

function setMapPreset(type) {
    currentMapPreset = type;
    const insSlider = document.getElementById('mapInsSlider');
    const sensSlider = document.getElementById('mapSensSlider');
    if (type === 'normal') { insSlider.value = 10; sensSlider.value = 8; }
    else if (type === 'insulinoma') { insSlider.value = 80; sensSlider.value = 9; }
    else if (type === 'dka') { insSlider.value = 0; sensSlider.value = 5; }
    else if (type === 't2dm') { insSlider.value = 60; sensSlider.value = 2; }
    updateMap();
    highlightButtons('m1PresetButtons', type);
    document.getElementById('mapComment').innerText = mapComments[type];
}

function updateMap() {
    const insLevel = parseInt(document.getElementById('mapInsSlider').value);
    const sens = parseInt(document.getElementById('mapSensSlider').value) / 10;
    const effectiveSignal = insLevel * sens;
    document.getElementById('mapInsLevel').textContent = insLevel;
    document.getElementById('mapSensLevel').textContent = Math.round(sens * 10);

    const irActive = effectiveSignal >= 1;
    const irsActive = effectiveSignal >= 5;
    const pi3kActive = effectiveSignal >= 7;
    const aktActive = effectiveSignal >= 10;
    const mtorActive = effectiveSignal >= 10;
    const srebpActive = mtorActive;
    const foxoSuppress = effectiveSignal >= 30;
    const as160Active = effectiveSignal >= 25;
    const glut4Active = as160Active;
    const hslInhibit = effectiveSignal >= 25;
    const lplActive = effectiveSignal >= 25;
    const gsk3Inhibit = effectiveSignal >= 25;

    const activeColor = '#3498db';
    const inactiveColor = '#bdc3c7';

    function setArrow(id, active) {
        const el = document.getElementById(id);
        el.setAttribute('stroke', active ? activeColor : inactiveColor);
        el.setAttribute('stroke-width', active ? '4' : '2');
    }

    function setNode(id, active, baseColor) {
        document.getElementById(id).setAttribute('fill', active ? baseColor : inactiveColor);
    }

    setNode('irNode', irActive, '#2c3e50');
    setNode('irsNode', irsActive, '#2c3e50');
    setNode('pi3kNode', pi3kActive, '#2c3e50');
    setNode('aktNode', aktActive, '#2c3e50');
    setNode('as160Node', as160Active, '#9b59b6');
    document.getElementById('glut4Node').setAttribute('fill', glut4Active ? '#2ecc71' : inactiveColor);
    document.getElementById('glut4Status').textContent = glut4Active ? 'Translocation active' : 'No transloc.';
    setNode('foxoNode', true, '#e67e22');
    document.getElementById('foxoStatus').textContent = foxoSuppress ? 'Suppressed' : 'Active';
    document.getElementById('foxoEffect').textContent = foxoSuppress ? '(GNG OFF)' : '(GNG ON)';
    setNode('mtorNode', mtorActive, '#8e44ad');
    setNode('srebpNode', srebpActive, '#2ecc71');
    document.getElementById('srebpStatus').textContent = srebpActive ? 'Active' : 'Inactive';
    document.getElementById('srebpEffect').textContent = srebpActive ? '(Lipogenesis ON)' : '(Lipogenesis OFF)';
    setNode('hslNode', true, '#e74c3c');
    document.getElementById('hslStatus').textContent = hslInhibit ? 'Inhibited' : 'Active';
    document.getElementById('hslEffect').textContent = hslInhibit ? '(Lipolysis low)' : '(Lipolysis HIGH)';
    setNode('lplNode', lplActive, '#3498db');
    document.getElementById('lplStatus').textContent = lplActive ? 'Active' : 'Inactive';
    document.getElementById('lplEffect').textContent = lplActive ? '(TG clearance high)' : '(TG clearance low)';
    setNode('gsk3Node', true, '#f1c40f');
    document.getElementById('gsk3Status').textContent = gsk3Inhibit ? 'Inhibited' : 'Active';
    document.getElementById('gsk3Effect').textContent = gsk3Inhibit ? '(Glycogen synth. ON)' : '(Glycogen synth. OFF)';

    setArrow('arrIR_IRS', irsActive);
    setArrow('arrIRS_PI3K', pi3kActive);
    setArrow('arrPI3K_AKT', aktActive);
    setArrow('arrAKT_AS160', as160Active);
    setArrow('arrAS160_GLUT4', glut4Active);
    setArrow('arrAKT_FOXO', aktActive);
    setArrow('arrAKT_mTOR', mtorActive);
    setArrow('arrmTOR_SREBP', srebpActive);
    setArrow('arrAKT_HSL', aktActive);
    setArrow('arrAKT_LPL', aktActive);
    setArrow('arrAKT_GSK3', aktActive);
}

function highlightButtons(containerId, activeType) {
    const container = document.getElementById(containerId);
    const buttons = container.querySelectorAll('button');
    buttons.forEach(btn => {
        btn.classList.remove('preset-active');
        if (btn.innerText.toLowerCase().includes(activeType)) {
            btn.classList.add('preset-active');
        }
    });
}

setMapPreset('normal');

/* ======================================================================
   SECTION 2: METABOLIC EXPLORER (Module 3)
====================================================================== */
let currentExplorerPreset = 'normal';
const s2_insSlider = document.getElementById('s2_insSlider');
const s2_sensSlider = document.getElementById('s2_sensSlider');
const s2_insVal = document.getElementById('s2_insVal');
const s2_sensVal = document.getElementById('s2_sensVal');
const s2_foxo1Bar = document.getElementById('s2_foxo1Bar');
const s2_foxo1Label = document.getElementById('s2_foxo1Label');
const s2_srebpBar = document.getElementById('s2_srebpBar');
const s2_srebpLabel = document.getElementById('s2_srebpLabel');
const s2_hslBar = document.getElementById('s2_hslBar');
const s2_hslLabel = document.getElementById('s2_hslLabel');
const s2_lplBar = document.getElementById('s2_lplBar');
const s2_lplLabel = document.getElementById('s2_lplLabel');
const s2_glucoseSpan = document.getElementById('s2_glucose');
const s2_tgSpan = document.getElementById('s2_tg');
const s2_ketoneSpan = document.getElementById('s2_ketones');
const s2_modeSpan = document.getElementById('s2_mode');

function s2_setCase(type) {
    currentExplorerPreset = type;
    if (type === 'normal') { s2_insSlider.value = 5; s2_sensSlider.value = 8; }
    else if (type === 'insulinoma') { s2_insSlider.value = 9; s2_sensSlider.value = 9; }
    else if (type === 'dka') { s2_insSlider.value = 0; s2_sensSlider.value = 5; }
    else if (type === 't2dm') { s2_insSlider.value = 8; s2_sensSlider.value = 2; }
    s2_update();
    highlightButtons('m3PresetButtons', type);
}

function s2_update() {
    const ins = parseInt(s2_insSlider.value);
    const sens = parseInt(s2_sensSlider.value);
    const normSens = sens / 10;
    const insulinEffect = ins * normSens;
    s2_insVal.textContent = ins;
    s2_sensVal.textContent = sens;

    const foxo1 = Math.max(0, 10 - (ins * normSens * 2.2));
    const srebp = Math.min(10, ins * 0.7 + sens * 0.3);
    const hsl = Math.max(0, 10 - (ins * normSens * 2.0));
    const lpl = Math.min(10, ins * normSens * 2.0);

    s2_foxo1Bar.style.width = (foxo1 * 10) + '%';
    s2_srebpBar.style.width = (srebp * 10) + '%';
    s2_hslBar.style.width = (hsl * 10) + '%';
    s2_lplBar.style.width = (lpl * 10) + '%';

    function label(value, thresholds) {
        if (value <= 2) return thresholds[0];
        else if (value <= 4) return thresholds[1];
        else if (value <= 6) return thresholds[2];
        else if (value <= 8) return thresholds[3];
        else return thresholds[4];
    }
    const foxoLabels = ['Suppressed', 'Low', 'Partial', 'Active', 'Fully Active'];
    s2_foxo1Label.textContent = label(foxo1, foxoLabels);
    const srebpLabels = ['Inactive', 'Low', 'Moderate', 'Active', 'High'];
    s2_srebpLabel.textContent = label(srebp, srebpLabels);
    const hslLabels = ['Inhibited', 'Partially Inhibited', 'Moderate', 'Active', 'High Lipolysis'];
    s2_hslLabel.textContent = label(hsl, hslLabels);
    const lplLabels = ['Impaired', 'Low', 'Moderate', 'High Clearance', 'Maximal Clearance'];
    s2_lplLabel.textContent = label(lpl, lplLabels);

    let glucose_mgdl = 90 - insulinEffect * 10 + foxo1 * 14;
    glucose_mgdl = Math.round(Math.min(450, Math.max(25, glucose_mgdl)));
    s2_glucoseSpan.textContent = glucose_mgdl + ' mg/dL';

    let tgText = 'Normal';
    if (ins === 0) tgText = 'Severely Elevated (Lipaemic)';
    else if (srebp > 6 && lpl < 4) tgText = 'Elevated (Atherogenic)';
    else if (srebp > 6 && lpl >= 4) tgText = 'Normal (lipogenesis balanced)';
    s2_tgSpan.textContent = tgText;

    let ketoneText = 'Low';
    if (ins === 0) ketoneText = 'High (Ketoacidosis)';
    else if (ins < 2) ketoneText = 'Moderate';
    s2_ketoneSpan.textContent = ketoneText;

    let mode = 'Balanced';
    if (ins === 0) mode = 'Catabolic (DKA)';
    else if (ins > 7 && sens < 3) mode = 'Paradoxical (T2DM)';
    else if (ins > 7) mode = 'Anabolic (Hyperinsulinaemia)';
    s2_modeSpan.textContent = mode;
}
s2_setCase('normal');

/* ======================================================================
   SECTION 3: LAB REPORT (Module 4)
====================================================================== */
function s3_generateReport(caseType) {
    const data = {
        normal: { glucose: '70–100 mg/dL', ins: '<10 µIU/mL', cpep: '0.5–2.0 ng/mL', bhb: '≤2.7 mmol/L', tg: 'Normal', ph: '7.35–7.45 / 22–26 mEq/L', note: 'Euglycaemia, balanced metabolism.', color: '#27ae60' },
        insulinoma: { glucose: '<55 mg/dL (Hypoglycaemia)', ins: '≥3 µIU/mL (inappropriately elevated)', cpep: '≥0.6 ng/mL', bhb: '≤2.7 mmol/L', tg: 'Normal', ph: 'Normal', note: 'Weight gain; suppressed ketogenesis; high LPL activity.', color: '#2980b9' },
        dka: { glucose: '>200 mg/dL (Hyperglycaemia)', ins: 'Very low / undetectable', cpep: 'Low / suppressed', bhb: '≥3.0 mmol/L', tg: '>10,000 mg/dL (Lipaemic)', ph: '<7.3 / <15 mEq/L', note: 'Absolute insulin deficiency; massive lipolysis and ketogenesis.', color: '#c0392b' },
        t2dm: { glucose: 'Fasting >126 mg/dL (Hyperglycaemia)', ins: 'High (compensatory)', cpep: 'Elevated', bhb: 'Normal or mildly elevated', tg: 'Elevated (Atherogenic triad)', ph: 'Normal', note: 'Selective hepatic insulin resistance; VLDL overproduction.', color: '#e67e22' }
    };
    const d = data[caseType];
    document.getElementById('s3_glucose').textContent = d.glucose;
    document.getElementById('s3_ins').textContent = d.ins;
    document.getElementById('s3_cpep').textContent = d.cpep;
    document.getElementById('s3_bhb').textContent = d.bhb;
    document.getElementById('s3_tg').textContent = d.tg;
    document.getElementById('s3_ph').textContent = d.ph;
    document.getElementById('s3_note').textContent = d.note;
    const badge = document.getElementById('caseIndicator');
    badge.textContent = 'Current: ' + caseType.charAt(0).toUpperCase() + caseType.slice(1);
    badge.style.backgroundColor = d.color;
    // Update preset buttons in module 4
    const m4btns = document.querySelectorAll('#module4 .preset-btn');
    m4btns.forEach(b => {
        b.classList.remove('preset-active');
        if (b.innerText.toLowerCase().includes(caseType)) b.classList.add('preset-active');
    });
}
s3_generateReport('normal');

/* ======================================================================
   SECTION 4: HEATMAP (Module 5)
====================================================================== */
const caseInfo = {
    normal: { insulin: 5, sensitivity: 8, desc: 'Normal physiology: Balanced insulin effect. FOXO1 suppressed, SREBP‑1c moderate, HSL inhibited, LPL high clearance. Euglycaemia (70–100 mg/dL).' },
    insulinoma: { insulin: 9, sensitivity: 9, desc: 'Insulinoma: Autonomous hypersecretion → hypoglycaemia. FOXO1 suppressed, SREBP‑1c highly active (weight gain), HSL inhibited, LPL maximally active. Ketogenesis suppressed.' },
    dka: { insulin: 0, sensitivity: 5, desc: 'DKA: Absolute insulin deficiency. FOXO1 fully active (gluconeogenesis), SREBP‑1c off, HSL fully active (massive lipolysis), LPL absent. Hyperglycaemia, ketoacidosis, lipaemia.' },
    t2dm: { insulin: 8, sensitivity: 2, desc: 'T2DM: Compensatory hyperinsulinaemia with low sensitivity. FOXO1 active (hepatic glucose output), mTORC1‑SREBP‑1c paradoxically active (lipogenesis), HSL unsuppressed, LPL impaired → atherogenic dyslipidaemia.' }
};

const rowLabels = ['FOXO1', 'SREBP‑1c', 'HSL', 'LPL', 'Glucose', 'Triglycerides', 'Ketones', 'Mode'];

function computeHeatmapRow(label, ins, sens) {
    const normSens = sens / 10;
    const effect = ins * normSens;
    if (label === 'FOXO1') {
        const val = Math.max(0, 10 - effect * 2.2);
        const labels = ['Suppressed', 'Low', 'Partial', 'Active', 'Fully Active'];
        const idx = val <= 2 ? 0 : val <= 4 ? 1 : val <= 6 ? 2 : val <= 8 ? 3 : 4;
        return { text: labels[idx] + ' (' + val.toFixed(1) + ')', color: idx <= 1 ? 'green' : idx <= 2 ? 'yellow' : 'red' };
    }
    if (label === 'SREBP‑1c') {
        const val = Math.min(10, ins * 0.7 + sens * 0.3);
        const labels = ['Inactive', 'Low', 'Moderate', 'Active', 'High'];
        const idx = val <= 2 ? 0 : val <= 4 ? 1 : val <= 6 ? 2 : val <= 8 ? 3 : 4;
        return { text: labels[idx] + ' (' + val.toFixed(1) + ')', color: idx <= 1 ? 'green' : idx <= 2 ? 'yellow' : 'red' };
    }
    if (label === 'HSL') {
        const val = Math.max(0, 10 - effect * 2.0);
        const labels = ['Inhibited', 'Partially Inhibited', 'Moderate', 'Active', 'High Lipolysis'];
        const idx = val <= 2 ? 0 : val <= 4 ? 1 : val <= 6 ? 2 : val <= 8 ? 3 : 4;
        return { text: labels[idx] + ' (' + val.toFixed(1) + ')', color: idx <= 1 ? 'green' : idx <= 2 ? 'yellow' : 'red' };
    }
    if (label === 'LPL') {
        const val = Math.min(10, effect * 2.0);
        const labels = ['Impaired', 'Low', 'Moderate', 'High Clearance', 'Maximal Clearance'];
        const idx = val <= 2 ? 0 : val <= 4 ? 1 : val <= 6 ? 2 : val <= 8 ? 3 : 4;
        return { text: labels[idx] + ' (' + val.toFixed(1) + ')', color: idx >= 3 ? 'green' : idx >= 2 ? 'yellow' : 'red' };
    }
    if (label === 'Glucose') {
        if (ins === 0) return { text: '>200 mg/dL (Hyperglycaemia)', color: 'red' };
        if (ins > 7 && sens < 3) return { text: 'Fasting >126 mg/dL (Hyperglycaemia)', color: 'red' };
        if (ins > 7 && sens > 7) return { text: '<55 mg/dL (Hypoglycaemia)', color: 'green' };
        return { text: '70–100 mg/dL', color: 'green' };
    }
    if (label === 'Triglycerides') {
        if (ins === 0) return { text: 'Lipaemic', color: 'red' };
        const srebp = Math.min(10, ins * 0.7 + sens * 0.3);
        const lpl = Math.min(10, effect * 2.0);
        if (srebp > 6 && lpl < 4) return { text: 'Elevated (Atherogenic)', color: 'red' };
        return { text: 'Normal', color: 'green' };
    }
    if (label === 'Ketones') {
        if (ins === 0) return { text: 'High (Ketoacidosis)', color: 'red' };
        if (ins < 2) return { text: 'Moderate', color: 'yellow' };
        return { text: 'Low', color: 'green' };
    }
    if (label === 'Mode') {
        if (ins === 0) return { text: 'Catabolic (DKA)', color: 'red' };
        if (ins > 7 && sens < 3) return { text: 'Paradoxical (T2DM)', color: 'yellow' };
        if (ins > 7) return { text: 'Anabolic (Hyperinsulinaemia)', color: 'yellow' };
        return { text: 'Balanced', color: 'green' };
    }
}

function generateHeatmap() {
    const tbody = document.querySelector('#unifyingHeatmap tbody');
    tbody.innerHTML = '';
    rowLabels.forEach(label => {
        const tr = document.createElement('tr');
        const rowHeader = document.createElement('td');
        rowHeader.className = 'row-label';
        rowHeader.textContent = label;
        rowHeader.setAttribute('onclick', `focusHeatmapRow('${label}')`);
        tr.appendChild(rowHeader);
        for (let type in caseInfo) {
            const { insulin, sensitivity } = caseInfo[type];
            const result = computeHeatmapRow(label, insulin, sensitivity);
            const td = document.createElement('td');
            td.classList.add('col-' + type);
            td.textContent = result.text;
            td.classList.add(result.color);
            tr.appendChild(td);
        }
        tbody.appendChild(tr);
    });
}

function focusHeatmapCase(type) {
    document.querySelectorAll('#unifyingHeatmap td.highlight-col').forEach(td => td.classList.remove('highlight-col'));
    document.querySelectorAll('#unifyingHeatmap th.highlight-col').forEach(th => th.classList.remove('highlight-col'));
    document.querySelectorAll('#unifyingHeatmap .col-' + type).forEach(td => td.classList.add('highlight-col'));
    const headerCell = document.querySelector(`#unifyingHeatmap th[onclick="focusHeatmapCase('${type}')"]`);
    if (headerCell) headerCell.classList.add('highlight-col');
    document.getElementById('heatmapDescription').textContent = caseInfo[type].desc;
}

function focusHeatmapRow(rowLabel) {
    document.querySelectorAll('#unifyingHeatmap tr.highlight-row').forEach(tr => tr.classList.remove('highlight-row'));
    const rows = document.querySelectorAll('#unifyingHeatmap tbody tr');
    rows.forEach(row => {
        const firstCell = row.querySelector('td.row-label');
        if (firstCell && firstCell.textContent === rowLabel) {
            row.classList.add('highlight-row');
        }
    });
}

generateHeatmap();
focusHeatmapCase('normal');

/* ======================================================================
   DISEASE EXPLORER (Module 2)
====================================================================== */
const diseaseDetails = {
    normal: {
        pathophysiology: 'Insulin is secreted by pancreatic β‑cells in response to elevated blood glucose. Binding to the insulin receptor triggers autophosphorylation and activation of the IRS1‑PI3K‑AKT cascade, leading to GLUT4 translocation, suppression of hepatic gluconeogenesis (via FOXO1 inhibition), and balanced regulation of lipogenesis and lipolysis.',
        hormonal: 'Fasting insulin <10 µIU/mL; postprandial peaks up to 100 µIU/mL. C‑peptide normal (0.5–2.0 ng/mL). Glucagon appropriately suppressed after meals.',
        biochemical: 'Euglycaemia (70–100 mg/dL fasting). Lipids normal. Ketones low. pH 7.35–7.45.',
        mechanism: 'Full insulin sensitivity with coordinated metabolic and mitogenic signalling.',
        clinical: 'Normal glucose tolerance. No hypoglycaemic or hyperglycaemic episodes.',
        pearls: 'The healthy state represents balanced anabolic and catabolic signalling — the gold standard against which all pathological states are compared.'
    },
    insulinoma: {
        pathophysiology: 'A pancreatic β‑cell tumour autonomously secretes insulin regardless of blood glucose level. This drives continuous activation of the insulin signalling cascade, leading to dangerously low blood glucose. FOXO1 is maximally suppressed (gluconeogenesis OFF), SREBP‑1c is overactive (weight gain from lipogenesis), HSL is inhibited, and LPL is maximally active.',
        hormonal: 'Inappropriately elevated insulin (≥3 µIU/mL) during hypoglycaemia. C‑peptide elevated (≥0.6 ng/mL) — this distinguishes insulinoma from exogenous insulin use. Proinsulin may be elevated.',
        biochemical: 'Fasting hypoglycaemia (<55 mg/dL). Normal triglycerides. Low ketones (ketogenesis suppressed). Normal pH.',
        mechanism: 'Autonomous insulin hypersecretion bypasses normal glucose sensing. The pathway is constitutively active.',
        clinical: 'Whipple triad: hypoglycaemic symptoms + documented low glucose + relief with glucose administration. Weight gain is common due to persistent anabolic signalling.',
        pearls: 'C‑peptide is the key differentiator: elevated in insulinoma, suppressed with exogenous insulin. The 72‑hour fast is the gold‑standard diagnostic test.'
    },
    dka: {
        pathophysiology: 'Absolute insulin deficiency (as in type 1 diabetes or late‑stage type 2 diabetes) means the insulin signalling cascade is completely silent. GLUT4 stays internalised (cells cannot take up glucose), FOXO1 is fully active (maximal gluconeogenesis), HSL is unrestrained (massive lipolysis), and LPL is absent. The liver converts the flood of free fatty acids into ketone bodies, producing metabolic acidosis.',
        hormonal: 'Insulin very low or undetectable. C‑peptide low/suppressed. Glucagon elevated (unopposed), which exacerbates ketogenesis.',
        biochemical: 'Hyperglycaemia (>200 mg/dL, often >400). Metabolic acidosis (pH <7.3, HCO₃⁻ <15 mEq/L). Elevated anion gap. Beta‑hydroxybutyrate ≥3.0 mmol/L. Triglycerides massively elevated (lipaemic serum).',
        mechanism: 'Zero insulin signalling → unrestrained catabolism. The liver behaves as if the body is starving, producing both glucose and ketones simultaneously.',
        clinical: 'Polyuria, polydipsia, weight loss, Kussmaul respirations, fruity breath odour (acetone), altered mental status. A medical emergency requiring IV insulin and fluids.',
        pearls: 'DKA can occur in T2DM under severe stress ("ketosis‑prone T2DM"). The hallmark is the combination of hyperglycaemia, ketosis, and metabolic acidosis.'
    },
    t2dm: {
        pathophysiology: 'Chronic nutrient excess and genetic predisposition lead to insulin resistance. The β‑cells compensate by producing more insulin (hyperinsulinaemia). However, the metabolic arm (IRS1‑PI3K‑AKT) is selectively resistant — FOXO1 remains active (gluconeogenesis continues) and GLUT4 translocation is impaired. Paradoxically, the mTORC1‑SREBP‑1c arm remains sensitive (or even overactive), driving hepatic VLDL production. The result: hyperglycaemia + atherogenic dyslipidaemia.',
        hormonal: 'Fasting insulin is high (compensatory hyperinsulinaemia). C‑peptide is elevated. Incretin effect may be blunted.',
        biochemical: 'Fasting glucose >126 mg/dL. HbA1c ≥6.5%. Triglycerides elevated (atherogenic triad: high TG, low HDL, small dense LDL). Ketones normal or mildly elevated.',
        mechanism: 'Selective insulin resistance: the IRS1‑PI3K‑AKT‑FOXO1 arm is resistant, but the MAPK and mTORC1‑SREBP‑1c arms remain sensitive. This explains the "paradoxical" coexistence of hyperglycaemia and hepatic steatosis.',
        clinical: 'Often asymptomatic initially. May present with fatigue, infections, or complications (retinopathy, nephropathy, neuropathy, cardiovascular disease). Strongly associated with obesity and metabolic syndrome.',
        pearls: 'The concept of "selective insulin resistance" is crucial for understanding why metformin (which reduces hepatic glucose output) and SGLT2 inhibitors are effective in T2DM.'
    }
};

function selectDisease(type) {
    currentMapPreset = type;
    document.querySelectorAll('#diseaseGrid .disease-card').forEach(c => c.classList.remove('selected'));
    const card = document.querySelector(`#diseaseGrid .disease-card[data-disease="${type}"]`);
    if (card) {
        card.classList.add('selected');
        card.setAttribute('aria-pressed', 'true');
    }
    document.querySelectorAll('#diseaseGrid .disease-card').forEach(c => {
        if (c.getAttribute('data-disease') !== type) c.setAttribute('aria-pressed', 'false');
    });
    // Update pathway
    setMapPreset(type);
    // Show disease detail
    const d = diseaseDetails[type];
    document.getElementById('diseaseDetail').innerHTML = `
        <h4>Pathophysiology</h4><p>${d.pathophysiology}</p>
        <h4>Hormonal Profile</h4><p>${d.hormonal}</p>
        <h4>Biochemical Abnormalities</h4><p>${d.biochemical}</p>
        <h4>Mechanism</h4><p>${d.mechanism}</p>
        <h4>Clinical Manifestations</h4><p>${d.clinical}</p>
        <h4>🔑 Key Learning Pearls</h4><p>${d.pearls}</p>
    `;
}
selectDisease('normal');

/* ======================================================================
   QUIZ (Module 6)
====================================================================== */
const quizQuestions = [
    {
        q: 'Which molecule serves as the docking platform that recruits PI3K to the insulin receptor?',
        options: ['AKT', 'IRS-1', 'GLUT4', 'FOXO1'],
        correct: 1,
        explanation: 'IRS‑1 (Insulin Receptor Substrate‑1) is phosphorylated by the activated insulin receptor and serves as the docking site for PI3K, linking receptor activation to downstream signalling.'
    },
    {
        q: 'In insulin resistance, which transcription factor remains active and continues driving hepatic gluconeogenesis?',
        options: ['SREBP‑1c', 'FOXO1', 'mTORC1', 'AS160'],
        correct: 1,
        explanation: 'FOXO1 is normally phosphorylated and excluded from the nucleus by AKT. In insulin resistance, AKT activation is impaired, so FOXO1 stays nuclear and keeps gluconeogenic genes (PEPCK, G6Pase) switched on.'
    },
    {
        q: 'GLUT4 translocation to the cell membrane requires phosphorylation of which protein?',
        options: ['HSL', 'AS160', 'GSK3', 'LPL'],
        correct: 1,
        explanation: 'AKT phosphorylates AS160, which relieves its inhibitory effect on Rab GTPases, allowing GLUT4‑containing vesicles to translocate to the plasma membrane.'
    },
    {
        q: 'A patient presents with hypoglycaemia, elevated insulin, and elevated C‑peptide. What is the most likely diagnosis?',
        options: ['Exogenous insulin use', 'Insulinoma', 'Type 2 diabetes', 'DKA'],
        correct: 1,
        explanation: 'Elevated C‑peptide during hypoglycaemia indicates endogenous insulin secretion. In exogenous insulin use, C‑peptide would be suppressed. This is the key diagnostic distinction for insulinoma.'
    },
    {
        q: 'Which enzyme is primarily responsible for the massive lipolysis seen in DKA?',
        options: ['LPL', 'SREBP‑1c', 'HSL', 'GSK3'],
        correct: 2,
        explanation: 'Hormone‑Sensitive Lipase (HSL) is normally inhibited by insulin via AKT. In DKA, absolute insulin deficiency means HSL is fully active, driving unrestrained lipolysis and flooding the liver with free fatty acids for ketogenesis.'
    },
    {
        q: 'In type 2 diabetes, which signalling arm remains paradoxically active despite insulin resistance?',
        options: ['IRS1‑PI3K‑AKT', 'AS160‑GLUT4', 'mTORC1‑SREBP‑1c', 'FOXO1 suppression'],
        correct: 2,
        explanation: 'The mTORC1‑SREBP‑1c arm remains sensitive (or even overactive) in T2DM, driving hepatic VLDL production and contributing to atherogenic dyslipidaemia. This is the concept of "selective insulin resistance."'
    },
    {
        q: 'Which laboratory finding is most characteristic of DKA?',
        options: ['Low beta‑hydroxybutyrate', 'Elevated C‑peptide', 'pH <7.3 with elevated anion gap', 'Normal triglycerides'],
        correct: 2,
        explanation: 'DKA features metabolic acidosis (pH <7.3) with an elevated anion gap due to accumulation of ketone bodies (beta‑hydroxybutyrate ≥3.0 mmol/L).'
    },
    {
        q: 'Lipoprotein Lipase (LPL) activity is regulated by insulin. What happens to LPL in insulin deficiency?',
        options: ['LPL is maximally active', 'LPL is impaired/absent', 'LPL converts to HSL', 'LPL only affects HDL'],
        correct: 1,
        explanation: 'Insulin activates LPL, which clears triglycerides from the circulation. In insulin deficiency (DKA), LPL is absent, contributing to lipaemic serum with triglyceride levels exceeding 10,000 mg/dL.'
    },
    {
        q: 'What is the effective insulin signal if insulin level is 8 and sensitivity is 2/10?',
        options: ['16', '1.6', '8', '4'],
        correct: 1,
        explanation: 'Effective signal = insulin × sensitivity (normalized). 8 × (2/10) = 1.6. This is low, explaining why T2DM patients with high insulin still have impaired glucose uptake and active FOXO1.'
    },
    {
        q: 'Which drug class targets hepatic glucose output by reducing FOXO1‑driven gluconeogenesis?',
        options: ['SGLT2 inhibitors', 'Metformin', 'Sulfonylureas', 'DPP‑4 inhibitors'],
        correct: 1,
        explanation: 'Metformin activates AMPK, which inhibits hepatic gluconeogenesis by reducing expression of PEPCK and G6Pase — the same genes driven by FOXO1. This is why metformin is the first‑line agent for T2DM.'
    }
];

let quizAnswered = {};
let quizScore = 0;

function buildQuiz() {
    const container = document.getElementById('quizContainer');
    container.innerHTML = '';
    quizQuestions.forEach((q, i) => {
        const div = document.createElement('div');
        div.className = 'quiz-question';
        div.id = 'q' + i;
        div.innerHTML = `<h4>Q${i+1}. ${q.q}</h4>`;
        q.options.forEach((opt, j) => {
            const btn = document.createElement('button');
            btn.className = 'quiz-option';
            btn.textContent = opt;
            btn.onclick = () => answerQuiz(i, j, btn);
            div.appendChild(btn);
        });
        const fb = document.createElement('div');
        fb.className = 'quiz-feedback';
        fb.id = 'fb' + i;
        div.appendChild(fb);
        container.appendChild(div);
    });
    updateQuizScore();
}

function answerQuiz(qIdx, optIdx, btn) {
    if (quizAnswered[qIdx] !== undefined) return;
    quizAnswered[qIdx] = optIdx;
    const q = quizQuestions[qIdx];
    const allBtns = document.querySelectorAll('#q' + qIdx + ' .quiz-option');
    allBtns.forEach(b => b.disabled = true);
    if (optIdx === q.correct) {
        btn.classList.add('correct');
        quizScore++;
    } else {
        btn.classList.add('wrong');
        allBtns[q.correct].classList.add('correct');
    }
    document.getElementById('fb' + qIdx).innerHTML =
        `<span style="color:${optIdx===q.correct?'#27ae60':'#c0392b'}">${optIdx===q.correct?'✅ Correct!':'❌ Incorrect.'}</span> ${q.explanation}`;
    updateQuizScore();
}

function updateQuizScore() {
    document.getElementById('quizScore').textContent = 'Score: ' + quizScore + ' / ' + quizQuestions.length;
}

function resetQuiz() {
    quizAnswered = {};
    quizScore = 0;
    buildQuiz();
    document.getElementById('quizScore').textContent = 'Score: 0 / ' + quizQuestions.length;
}

buildQuiz();

/* ======================================================================
   INITIALIZATION
====================================================================== */
function init() {
    // Hide loading screen after a short delay
    setTimeout(() => {
        const loader = document.getElementById('loadingOverlay');
        if (loader) loader.classList.add('hidden');
    }, 500);
}

window.addEventListener('load', init);