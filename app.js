const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const chars = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const fontSize = 20;
const charFont = 'monospace'
const opacity = 0.04;// is background color opacity and it create the effect of the trail
const bgColor = '#000000';
const charColor = '#afff33';
const shadowColor = '#00ff00';
const shadowBlur = 8;

//hex to rgb
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

function initDrops() {
	const columns = Math.floor(canvas.width / fontSize);
	drops = [];

	for (var i = 0; i < columns; i++) {
		drops[i] = Math.floor(Math.random() * -50);
	}
}

//update canvas on resize the screen
function resizeCanvas() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	ctx.fillStyle = bgColor;
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	initDrops();
}

function animate(x, y) {

	ctx.shadowBlur = 0;
	ctx.fillStyle = hexToRgba(bgColor, opacity);
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	ctx.fillStyle = charColor;
	ctx.font = `${fontSize}px ${charFont}`;
	ctx.shadowBlur = shadowBlur;
	ctx.shadowColor = shadowColor;

	for (var i = 0; i < drops.length; i++) {
		const randomChar = chars.charAt(Math.floor(Math.random() * chars.length));

		const x = i * fontSize;
		const y = drops[i] * fontSize;

		ctx.fillText(randomChar, x, y);

		if (y > canvas.height && Math.random() > 0.990) {
			drops[i] = 0;
		}

		drops[i]++;
	}

	requestAnimationFrame(animate);
}

resizeCanvas();
animate();

window.addEventListener('resize', resizeCanvas);

