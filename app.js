const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const chars = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

// let x = 0;
// let y = 0;
let drops = [];
const fontSize = 20;
const charFont = 'monospace'
const speed = 5;
const opacity = 0.04;// is background color opacity and it create the effect of the trail
const bgColor = '#000000';
const charColor = '#afff33';
const shadowColor = '#00ff00';
const shadowBlur = 8;
const maxDrops = 20;


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

//update canvas on resize the screen
function resizeCanvas() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	ctx.fillStyle = bgColor;
	ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function initDrops() {
	

}
{
	//fill the background
	ctx.shadowBlur = 0;
	ctx.fillStyle = hexToRgba(bgColor, opacity);
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	drops = drops.filter(d => d.y < canvas.height);

	for (let i = 0; i < maxDrops; i++) {
		if (drops.length < maxDrops) {
			drops.push({ x: (Math.floor(Math.random() * (canvas.width / fontSize))), y: 0 });
		}
		else
			return;
	}

	for (let i = 0; i < drops.length; i++)
	{
		animate(drops[i].x, drops[i].y)
		drops[i].y += speed;
	}

	requestAnimationFrame(handleDrops);
}

function animate(x, y) {

	let randomChar = chars.charAt(Math.floor(Math.random() * chars.length));

	ctx.fillStyle = charColor;
	ctx.font = `${fontSize}px ${charFont}`;
	ctx.shadowBlur = shadowBlur;
	ctx.shadowColor = shadowColor;

	ctx.fillText(randomChar, x, y);
	// y += speed;
	// if (y > canvas.height)
	// 	y = 0;
	// requestAnimationFrame(animate);
}

resizeCanvas();

window.addEventListener('resize', resizeCanvas);