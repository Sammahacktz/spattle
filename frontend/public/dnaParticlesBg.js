// dnaParticlesBg.js
// DNA Helix Animation for background (vanilla JS, no React)



// --- Terminal content array (move out of getTerminalContent for direct access) ---
const terminalContentArr = [
    `<p>~DNA/$ Initializing DNA sequence parser ... OK</p>
    <p>~DNA/$ Reading genomic data ... OK</p>
    <p>~DNA/$ Attribute detected: "ENDURANCE"</p>
    <p>Current expression: MODERATE</p>
    <p>~Maximum potential: SUPERIOR</p>
    <p>~Growth potential: 90%</p>
    <p>~[#########---] 90%</p>`,
    `<p>~DNA/$ Scanning for "STRENGTH" gene loci ... FOUND</p>
    <p>~DNA/$ Amplifying myofibril density ... IN PROGRESS</p>
    <p>~DNA/$ Strength phenotype: HIGH</p>
    <p>~DNA/$ Maximum potential: ULTRA</p>
    <p>~DNA/$ Growth potential: 80%</p>
    <p>~DNA/$ Initiating hypertrophy cascade ...</p>
    <p>~DNA/$ Micro-lesion simulation ... OK</p>
    <p>~DNA/$ Protein synthesis: ENHANCED</p>
    <p>~DNA/$ Strength increase: +15%</p>
    <p>~[########----] 80%</p>`,
    `<p>~DNA/$ Locating "SPEED" alleles ... OK</p>
    <p>~DNA/$ Modifying fast-twitch muscle gene expression ... COMPLETE</p>
    <p>~DNA/$ Speed phenotype: FAST</p>
    <p>~DNA/$ Maximum potential: EXTREME</p>
    <p>~DNA/$ Growth potential: 75%</p>
    <p>~DNA/$ Optimizing neural transmission ...</p>
    <p>~DNA/$ Reaction time: IMPROVED</p>
    <p>~DNA/$ Sprint simulation: PASSED</p>
    <p>~DNA/$ Speed increase: +12%</p>
    <p>~[#######-----] 75%</p>`,
    `<p>~DNA/$ Analyzing "RECOVERY" gene cluster ... OK</p>
    <p>~DNA/$ Enhancing cellular repair pathways ... SUCCESS</p>
    <p>~DNA/$ Recovery phenotype: ADVANCED</p>
    <p>~DNA/$ Maximum potential: ELITE</p>
    <p>~DNA/$ Growth potential: 85%</p>
    <p>~DNA/$ Sleep cycle optimization ...</p>
    <p>~DNA/$ Inflammatory response: REDUCED</p>
    <p>~DNA/$ Recovery time: -20%</p>
    <p>~DNA/$ Ready for next adaptation!</p>
    <p>~[#########---] 85%</p>`,
    `<p>~DNA/$ Detecting "COORDINATION" gene network ... OK</p>
    <p>~DNA/$ Upregulating synaptic plasticity ... DONE</p>
    <p>~DNA/$ Coordination phenotype: ENHANCED</p>
    <p>~DNA/$ Maximum potential: SUPERIOR</p>
    <p>~DNA/$ Growth potential: 70%</p>
    <p>~DNA/$ Balance module: ACTIVATED</p>
    <p>~DNA/$ Sensorimotor integration: OPTIMIZED</p>
    <p>~DNA/$ Coordination increase: +10%</p>
    <p>~DNA/$ Reflexes: ENHANCED</p>
    <p>~[#######-----] 70%</p>`,
    `<p>~DNA/$ Monitoring "FLEXIBILITY" gene expression ... OK</p>
    <p>~DNA/$ Adjusting collagen synthesis pathways ... COMPLETE</p>
    <p>~DNA/$ Flexibility phenotype: MODERATE</p>
    <p>~DNA/$ Maximum potential: HIGH</p>
    <p>~DNA/$ Growth potential: 60%</p>
    <p>~DNA/$ Joint mobility: INCREASED</p>
    <p>~DNA/$ Stretching protocol: ACTIVE</p>
    <p>~DNA/$ Injury risk: LOWERED</p>
    <p>~DNA/$ Flexibility increase: +8%</p>
    <p>~[######------] 60%</p>`,
    `<p>~DNA/$ Running mutation analysis ...</p>
    <p>~DNA/$ No deleterious mutations detected</p>
    <p>~DNA/$ All systems optimal</p>
    <p>~DNA/$ Genomic integrity: VERIFIED</p>
    <p>~DNA/$ System scan: PASSED</p>
    <p>~DNA/$ Ready for next operation</p>
    `,
    `<p>~DNA/$ Administering virtual supplement: CREATINE ...</p>
    <p>~DNA/$ ATP synthesis: INCREASED</p>
    <p>~DNA/$ Power output: +12%</p>
    <p>~DNA/$ Muscle fatigue: DELAYED</p>
    <p>~DNA/$ Hydration status: OPTIMAL</p>
    <p>~DNA/$ Supplementation complete</p>
    <p>~DNA/$ Monitoring physiological effects ...</p>
    `,
    `<p>~DNA/$ Simulating altitude adaptation ...</p>
    <p>~DNA/$ Erythrocyte count: INCREASED</p>
    <p>~DNA/$ Oxygen transport: ENHANCED</p>
    <p>~DNA/$ VO2max: INCREASED</p>
    <p>~DNA/$ Endurance increase: +10%</p>
    <p>~DNA/$ Altitude acclimatization: SUCCESSFUL</p>
    <p>~DNA/$ Returning to normoxia ...</p>
    `,
    `<p>~DNA/$ Finalizing genomic optimization ...</p>
    <p>~DNA/$ All sport attributes maximized</p>
    <p>~DNA/$ System rebooting ...</p>
    <p>~DNA/$ New personal bests unlocked</p>
    <p>~DNA/$ Ready for next challenge!</p>
    <p>~DNA/$ Awaiting next command ...</p>
    `,
    `<p>~DNA/$ Initiating advanced diagnostics ...</p>
    <p>~DNA/$ Scanning mitochondria ...</p>
    <p>~DNA/$ Energy output: OPTIMAL</p>
    <p>~DNA/$ Fatigue resistance: HIGH</p>
    <p>~DNA/$ DNA repair enzymes: ACTIVE</p>
    <p>~DNA/$ Diagnostics complete</p>
    <p>~DNA/$ All systems green</p>
    `
];


const INTERVAL_PAUSE = 4000;
const TYPING_SPEED = 30;
const NUM_PARTICLES = 40;
const HELIX_RADIUS = 150;
const HELIX_LENGTH = 1000;
const HELIX_TURNS = 1;
const PARTICLE_SIZE = 6;
const ANIMATION_SPEED = 0.005
const BEND_STRENGTH = 0.75;
const BUILD_DURATION = 1800;
const PULSE_PERIOD = 2; // seconds for a full pulse sweep

const COLOR_TERMINAL_BG = '#001720';
const COLOR_TERMINAL_TEXT = '#00ffea';
const COLOR_TERMINAL_CURSOR = '#00ffea';
const COLOR_HIGHLIGHT = 'red';
const COLOR_PARTICLE = '#BCC8C4';
const COLOR_POPUP_CONNECTOR = '#BCC8C4';
const TERMINAL_PATHS = ["/"]


const COLOR_BG_GRADIENT = 'linear-gradient(130deg, rgb(0 0 0) 0%, #4B56CD 100%)';

const HELIX_COLOR = '#BCC8C4';
const PULSE_COLOR = '#BCC8C4';
const PULSE_LINE_COLOR = '#BCC8C4';

let highlightedIdx = 0, t = 0, animationFrame, buildStartTime = null, buildDone = false;
let mouse = null, particleState = [], particleOpacities = Array(NUM_PARTICLES).fill(0);
let terminal = document.getElementById('terminal');
let prevContentIdx = -1;
let pulseTime = 0;


if (!terminal) {
    terminal = document.createElement("div");
    terminal.id = "terminal";
    terminal.classList.add("open-terminal")
    document.body.appendChild(terminal);
}


const resizeCanvas = canvas => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
};

const initParticles = () => {
    const width = window.innerWidth, height = window.innerHeight;
    const centerX = width * 0.22, centerY = height / 2;
    particleState = [];
    for (let i = 0; i < NUM_PARTICLES; i++) {
        const progress = i / NUM_PARTICLES;
        const angle = progress * HELIX_TURNS * Math.PI * 2;
        const expNorm = (Math.exp((progress - 0.5) * 2) - Math.exp(-1)) / (Math.exp(1) - Math.exp(-1));
        const bend = (expNorm - 0.5) * 2 * (width * 0.18 * BEND_STRENGTH);
        const y = centerY + (progress - 0.5) * HELIX_LENGTH;
        const x1 = centerX + Math.cos(angle) * HELIX_RADIUS + bend;
        const x2 = centerX + Math.cos(angle + Math.PI) * HELIX_RADIUS + bend;
        particleState.push({ x1, y1: y, x2, y2: y });
    }
};

const getNextHighlightIdx = (prevContentIdx, len) => {
    // Instead of random, cycle through all indices for even distribution
    return (prevContentIdx + 1) % len;
};

const typeTerminalContentSync = (element, html, speed = TYPING_SPEED) => new Promise(resolve => {
    element.innerHTML = '';
    let prompt = '', rest = html, i = 0, tag = false, temp = '';
    const promptMatch = html.match(/(<p>~DNA\/\$[^<]*<\/p>)/i);
    if (promptMatch) {
        prompt = promptMatch[1];
        rest = html.slice(prompt.length);
    }
    element.innerHTML = prompt;
    function type() {
        if (i < rest.length) {
            let char = rest[i];
            temp += char;
            if (char === '<') tag = true;
            if (char === '>') tag = false;
            if (!tag) element.innerHTML = prompt + temp + '<span class="terminal-cursor">█</span>';
            i++;
            setTimeout(type, tag ? 0 : speed);
        } else {
            element.innerHTML = prompt + temp;
            resolve();
        }
    }
    type();
});

(function () {
    let canvas = document.getElementById('dna-bg');
    if (!canvas) {
        canvas = document.createElement('canvas');
        canvas.id = 'dna-bg';
        Object.assign(canvas.style, {
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: -1,
            pointerEvents: 'none',
            background: COLOR_BG_GRADIENT,
            transition: 'filter 0.5s',
        });
        document.body.appendChild(canvas);
    }
    let ctx = canvas.getContext('2d');
    resizeCanvas(canvas);
    window.addEventListener('resize', () => { resizeCanvas(canvas); initParticles(); });
    initParticles();

    window.addEventListener('mousemove', e => { mouse = { x: e.clientX, y: e.clientY }; });
    window.addEventListener('mouseout', () => { mouse = null; });
    window.addEventListener('beforeunload', () => {
        if (animationFrame) cancelAnimationFrame(animationFrame);
        window.removeEventListener('mousemove', () => { });
        window.removeEventListener('mouseout', () => { });
        window.removeEventListener('resize', () => { });
    });

    const drawHelix = () => {
        const width = window.innerWidth, height = window.innerHeight;
        ctx.clearRect(0, 0, width, height);
        const centerX = width * 0.22, centerY = height / 2;
        // Calculate pulse position (0 to 1, top to bottom)
        const pulsePhase = (pulseTime % PULSE_PERIOD) / PULSE_PERIOD;
        // Draw all connecting lines (base pairs) first
        for (let i = 0; i < NUM_PARTICLES; i++) {
            const progressI = i / NUM_PARTICLES;
            const angle = progressI * HELIX_TURNS * Math.PI * 2 + t;
            const expNorm = (Math.exp((progressI - 0.5) * 2) - Math.exp(-1)) / (Math.exp(1) - Math.exp(-1));
            const bend = (expNorm - 0.5) * 2 * (width * 0.18 * BEND_STRENGTH);
            let y = centerY + (progressI - 0.5) * HELIX_LENGTH;
            let x1 = centerX + Math.cos(angle) * HELIX_RADIUS + bend;
            let x2 = centerX + Math.cos(angle + Math.PI) * HELIX_RADIUS + bend;
            let state = particleState[i];
            // Mouse interaction
            if (mouse) {
                const dist1 = Math.hypot(mouse.x - state.x1, mouse.y - state.y1);
                const dist2 = Math.hypot(mouse.x - state.x2, mouse.y - state.y2);
                const repelRadius = 100;
                if (dist1 < repelRadius) {
                    const a = Math.atan2(state.y1 - mouse.y, state.x1 - mouse.x);
                    const s = (repelRadius - dist1) * 0.5;
                    x1 += Math.cos(a) * s;
                    y += Math.sin(a) * s * 0.2;
                }
                if (dist2 < repelRadius) {
                    const a = Math.atan2(state.y2 - mouse.y, state.x2 - mouse.x);
                    const s = (repelRadius - dist2) * 0.5;
                    x2 += Math.cos(a) * s;
                    y += Math.sin(a) * s * 0.2;
                }
            }
            state.x1 = x1; state.y1 = y; state.x2 = x2; state.y2 = y;
            // Pulse effect for lines
            const pulsePhase = (pulseTime % PULSE_PERIOD) / PULSE_PERIOD;
            let pulseStrength = Math.exp(-((progressI - pulsePhase) ** 2) / 0.01); // Gaussian pulse
            let pulseGlow = Math.min(1, pulseStrength) * 0.5;
            // Draw lines
            const dExpNorm = (2 * Math.exp((progressI - 0.5) * 2)) / (Math.exp(1) - Math.exp(-1));
            const tangent = Math.atan2(1, dExpNorm * width * 0.18 * BEND_STRENGTH * 2);
            const midX = (state.x1 + state.x2) / 2, midY = (state.y1 + state.y2) / 2;
            const perpAngle = tangent + Math.PI / 2;
            const curveOffset = Math.abs(state.x2 - state.x1) * 0.25;
            const ctrlX = midX + Math.cos(perpAngle) * curveOffset;
            const ctrlY = midY + Math.sin(perpAngle) * curveOffset;
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(state.x1, state.y1);
            ctx.quadraticCurveTo(ctrlX, ctrlY, state.x2, state.y2);
            ctx.strokeStyle = (i === highlightedIdx) ? COLOR_HIGHLIGHT : HELIX_COLOR;
            ctx.lineWidth = (i === highlightedIdx) ? 3 + pulseGlow * 2 : 2 + pulseGlow * 2;
            ctx.globalAlpha = (buildDone ? 1 : particleOpacities[i]) * (1 - 0.3 * pulseGlow);
            if (i === highlightedIdx) {
                ctx.shadowColor = "red";
            } else if (pulseGlow > 0.1) {
                ctx.shadowColor = PULSE_LINE_COLOR;
            } else {
                ctx.shadowColor = "transparent";
            }
            ctx.shadowBlur = (i === highlightedIdx) ? 16 : pulseGlow * 24;
            ctx.stroke();
            ctx.shadowBlur = 0;
            ctx.globalAlpha = 1;
            ctx.restore();
            if (i === highlightedIdx && terminal.style.display !== "none") {
                const popupRect = terminal.getBoundingClientRect();
                const popupX = popupRect.left, popupY = popupRect.top;
                const dist1 = Math.hypot(state.x1 - popupX, state.y1 - popupY);
                const dist2 = Math.hypot(state.x2 - popupX, state.y2 - popupY);
                let fromX = dist1 < dist2 ? state.x1 : state.x2;
                let fromY = dist1 < dist2 ? state.y1 : state.y2;
                ctx.save();
                ctx.beginPath();
                ctx.moveTo(fromX + 10, fromY);
                ctx.lineTo(popupX, popupY);
                ctx.strokeStyle = COLOR_POPUP_CONNECTOR;
                ctx.lineWidth = 1;
                ctx.globalAlpha = 0.5;
                ctx.stroke();
                ctx.restore();
            }
        }
        // Draw all particles after all lines
        for (let i = 0; i < NUM_PARTICLES; i++) {
            const state = particleState[i];
            const opacity = buildDone ? 1 : particleOpacities[i];
            // Pulse effect: particles near the pulsePhase get a glow and scale
            const progressI = i / NUM_PARTICLES;
            let pulseStrength = Math.exp(-((progressI - pulsePhase) ** 2) / 0.01); // Gaussian pulse
            let pulseGlow = Math.min(1, pulseStrength) * 0.8;
            let pulseScale = 1 + pulseGlow * 0.4;
            ctx.globalAlpha = opacity;
            ctx.save();
            ctx.beginPath();
            ctx.arc(state.x1, state.y1, PARTICLE_SIZE * pulseScale, 0, Math.PI * 2);
            ctx.fillStyle = (i === highlightedIdx) ? COLOR_HIGHLIGHT : COLOR_PARTICLE;
            ctx.shadowColor = (i === highlightedIdx || pulseGlow > 0.1) ? PULSE_COLOR : 'transparent';
            ctx.shadowBlur = (i === highlightedIdx) ? 16 : pulseGlow * 32;
            ctx.fill();
            ctx.beginPath();
            ctx.arc(state.x2, state.y2, PARTICLE_SIZE * pulseScale, 0, Math.PI * 2);
            ctx.fillStyle = (i === highlightedIdx) ? COLOR_HIGHLIGHT : COLOR_PARTICLE;
            ctx.shadowColor = (i === highlightedIdx || pulseGlow > 0.1) ? PULSE_COLOR : 'transparent';
            ctx.shadowBlur = (i === highlightedIdx) ? 16 : pulseGlow * 32;
            ctx.fill();
            ctx.shadowBlur = 0;
            ctx.restore();
            ctx.globalAlpha = 1;
        }
    }

    const animateBuildHelix = ts => {
        if (!buildStartTime) buildStartTime = ts;
        const elapsed = ts - buildStartTime;
        for (let i = 0; i < NUM_PARTICLES; i++) {
            const appearAt = (i / NUM_PARTICLES) * BUILD_DURATION;
            const fadeProgress = Math.max(0, Math.min(1, (elapsed - appearAt) / 400));
            particleOpacities[i] = fadeProgress;
        }
        t += ANIMATION_SPEED;
        pulseTime += 1 / 60;
        drawHelix();
        if (elapsed / BUILD_DURATION < 1 || particleOpacities.some(o => o < 1)) {
            animationFrame = requestAnimationFrame(animateBuildHelix);
        } else {
            buildDone = true;
            animationFrame = requestAnimationFrame(animate);
        }
    }

    const animate = () => {
        t += ANIMATION_SPEED;
        pulseTime += 1 / 60;
        drawHelix();
        animationFrame = requestAnimationFrame(animate);
    }

    const syncTerminalAndHighlight = async () => {
        while (!buildDone) await new Promise(res => setTimeout(res, 100));
        // On first load, start with the middle message and highlight
        let firstIdx = Math.floor(terminalContentArr.length / 2);
        prevContentIdx = firstIdx - 1; // So first getNextHighlightIdx gives firstIdx
        let nextContentIdx = getNextHighlightIdx(prevContentIdx, terminalContentArr.length);
        prevContentIdx = nextContentIdx;
        highlightedIdx = Math.floor((nextContentIdx / terminalContentArr.length) * NUM_PARTICLES);
        await typeTerminalContentSync(terminal, terminalContentArr[nextContentIdx], TYPING_SPEED);
        await new Promise(res => setTimeout(res, INTERVAL_PAUSE));
        // Continue cycling as before
        while (true) {
            nextContentIdx = getNextHighlightIdx(prevContentIdx, terminalContentArr.length);
            prevContentIdx = nextContentIdx;
            highlightedIdx = Math.floor((nextContentIdx / terminalContentArr.length) * NUM_PARTICLES);
            await typeTerminalContentSync(terminal, terminalContentArr[nextContentIdx], TYPING_SPEED);
            await new Promise(res => setTimeout(res, INTERVAL_PAUSE));
        }
    };

    requestAnimationFrame(animateBuildHelix);
    if (terminal) syncTerminalAndHighlight();
})();
