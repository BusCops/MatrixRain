const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const chars = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const charFont = 'monospace';
const trailOpacity = 0.04;
const bgColor = '#000000';

const layers = [
    {
        fontSize: 11,
        fadeInSpeed: 0.04,
        stepDelay: 3,          
        rgbColor: '175, 255, 51',
        maxOpacity: 0.4,
        shadowBlur: 0,
        density: 0.3,
        drops: [],
        headOpacity: [],
        currentChars: [],
        stepCounters: []
    },
    {
        fontSize: 18,
        fadeInSpeed: 0.07,
        stepDelay: 2,
        rgbColor: '175, 255, 51',
        maxOpacity: 0.8,
        shadowBlur: 4,
        density: 0.4,
        drops: [],
        headOpacity: [],
        currentChars: [],
        stepCounters: []
    },
    {
        fontSize: 26,
        fadeInSpeed: 0.1,
        stepDelay: 1,
        rgbColor: '175, 255, 51',
        maxOpacity: 1.0,
        shadowBlur: 10,
        density: 0.5,
        drops: [],
        headOpacity: [],
        currentChars: [],
        stepCounters: []
    }
];

function hexToRgba(hex, alpha) {
    let fullHex = hex.replace('#', '');
    if (fullHex.length === 3) {
        fullHex = fullHex.split('').map(c => c + c).join('');
    }
    const r = parseInt(fullHex.substring(0, 2), 16);
    const g = parseInt(fullHex.substring(2, 4), 16);
    const b = parseInt(fullHex.substring(4, 6), 16);

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function getRandomChar() {
    return chars.charAt(Math.floor(Math.random() * chars.length));
}

function initDrops() {
    layers.forEach(layer => {
        const totalColumns = Math.floor(canvas.width / layer.fontSize);
        const totalRows = Math.floor(canvas.height / layer.fontSize);

        layer.drops = [];
        layer.headOpacity = [];
        layer.currentChars = [];
        layer.stepCounters = [];

        for (let i = 0; i < totalColumns; i++) {
            if (Math.random() < layer.density) {
                layer.drops[i] = Math.floor(Math.random() * (totalRows + 40)) - 40;
                layer.headOpacity[i] = Math.random();
                layer.currentChars[i] = getRandomChar();
                layer.stepCounters[i] = 0;
            } else {
                layer.drops[i] = null;
            }
        }
    });
}

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    initDrops();
}

function animate() {
    ctx.shadowBlur = 0;
    ctx.fillStyle = hexToRgba(bgColor, trailOpacity);
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    layers.forEach(layer => {
        ctx.font = `${layer.fontSize}px ${charFont}`;

        for (let i = 0; i < layer.drops.length; i++) {
            if (layer.drops[i] === null) continue;

            const x = i * layer.fontSize;
            const y = layer.drops[i] * layer.fontSize;

            layer.headOpacity[i] += layer.fadeInSpeed;

            const currentAlpha = Math.min(layer.headOpacity[i], 1) * layer.maxOpacity;
            
            ctx.fillStyle = `rgba(${layer.rgbColor}, ${currentAlpha})`;
            ctx.shadowColor = `rgba(${layer.rgbColor}, ${currentAlpha})`;
            ctx.shadowBlur = layer.shadowBlur * Math.min(layer.headOpacity[i], 1);

            ctx.fillText(layer.currentChars[i], x, y);

            if (layer.headOpacity[i] >= 1.0) {
                layer.stepCounters[i]++;

                if (layer.stepCounters[i] >= layer.stepDelay) {
                    layer.headOpacity[i] = 0.0;
                    layer.stepCounters[i] = 0;
                    layer.currentChars[i] = getRandomChar();
                    
                    layer.drops[i]++;

                    if (y > canvas.height && Math.random() > 0.975) {
                        layer.drops[i] = Math.floor(Math.random() * -20);
                    }
                }
            }
        }
    });

    requestAnimationFrame(animate);
}

resizeCanvas();
animate();

window.addEventListener('resize', resizeCanvas);