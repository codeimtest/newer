class Trump{
	
	// Start trumping
	constructor(){
		this.particles = [];
		
		this.colors = {
			blue: 'rgb(0, 40, 104)',
			red: 'rgb(191, 10, 48)',
		};
		
		this.removeQueue = [];
		
		this.fps = 30;
		this.then;
		this.startTime;
		this.now;
		
		this.mouseX = window.innerWidth;
		this.mouseY = window.innerHeight;
		
		this.createCanvas();
		this.addEventListeners();
		this.startAnimating();
		
		this.cursorLegPos = 0;
		
		this.createParticle(window.innerWidth, window.innerHeight);
	}
	
	// Like we didn't already
	startAnimating(fps) {
		this.fpsInterval = 1000 / this.fps;
		this.then = Date.now();
		this.startTime = this.then;

		this.draw();
	}
	
	// Scribble
	draw(){
    this.now = Date.now();
    this.elapsed = this.now - this.then;

		window.requestAnimationFrame(this.draw.bind(this));

    if (this.elapsed > this.fpsInterval) {
			this.then = this.now - (this.elapsed % this.fpsInterval);
			
			this.cursorLegPos += .5;
			this.removeQueue = [];
			this.cleanBg();
		
			this.particles.forEach((o, i)=>{
				if(this.particles[i].type === 'particle'){
					this.drawParticle(i);
				} else if (this.particles[i].type === 'stripe') {
					this.drawStripe(i);
				} else {
					this.drawStar(i);
				}
			});
			
			this.drawTitle();
			
			this.drawCursor(this.mouseX, this.mouseY);
			
			this.removeItems();
    }
	}
	
	// We no longer require your presence
	removeItems(){
		this.particles.splice(this.removeQueue[0], this.removeQueue.length);
	}
	
	// CREATE IT
	createCanvas(){
		this.c = document.createElement('canvas');
		this.ctx = this.c.getContext('2d');
		document.body.appendChild(this.c);
		
		this.c.width = (window.innerWidth * 2);
		this.c.height = (window.innerHeight * 2);
	}
	
	// Shh, listen
	addEventListeners(){
		document.addEventListener('mousedown', (e)=>{
			var x = e.clientX * 2;
			var y = e.clientY * 2;
			
			if(this.lastCreated !== 'particle' && this.lastCreated !== 'stripe'){
				this.lastCreated = 'stripe';
				this.createStripe(x, y);
			} else if (this.lastCreated !== 'star' && this.lastCreated !== 'particle') {
				this.lastCreated = 'particle';
				this.createParticle(x, y);
			} else {
				this.lastCreated = 'star';
				this.createStar(x, y);
			}
		});
		
		document.addEventListener('mousemove', (e)=>{
			this.mouseX = e.clientX * 2;
			this.mouseY = e.clientY * 2;
		});
		
		window.addEventListener('resize', (e)=>{
			this.resize();
		});
	}
	
	// Wanna resize? We can help for you only $1337
	resize(){
		this.c.width = window.innerWidth * 2;
		this.c.height = window.innerHeight * 2;
	}
	
	// Create all the things!
	createParticle(x, y){
		this.particles.push({
			type: 'particle',
			x: x,
			y: y,
			r: 0
		});
	}
	
	createStar(x, y){
		this.particles.push({
			type: 'star',
			x: x,
			y: y,
			r: 0
		});
	}
	
	createStripe(x, y){
		this.particles.push({
			type: 'stripe',
			x: x,
			y: y,
			w: 0
		});
	}
	
	// Dirty bg
	cleanBg(){
		this.ctx.rect(0, 0, this.c.width, this.c.height);
		this.ctx.fillStyle = this.colors.blue;
		this.ctx.fill();
	}
	
	// I changed my mind, now i'm drawing circles but didn't change the name >.>
	drawParticle(i){
		var p = this.particles[i];
		
		this.drawCircle(p.x, p.y, p.r, this.colors.red);
		this.drawCircle(p.x, p.y, p.r - 100, 'white');
		this.drawCircle(p.x, p.y, p.r - 200, this.colors.red);
		this.drawCircle(p.x, p.y, p.r - 300, 'white');
		this.drawCircle(p.x, p.y, p.r - 400, this.colors.blue);
		
		this.particles[i].r += 10;
		
		if(this.particles[i].r > this.c.width * 3){
			this.removeQueue.push(i);
		}
	}
	
	drawCircle(x, y, r, color){
		this.ctx.beginPath();
		this.ctx.arc(x, y, Math.max(0, r), 0, Math.PI * 2);
		this.ctx.fillStyle = color;
		this.ctx.fill();
		this.ctx.closePath();
	}
	
	// What are stars without stripes?
	drawStripe(i){
		var s = this.particles[i];
		
		this.drawLine(s.x, s.w, this.colors.red);
		this.drawLine(s.x, Math.max(s.w - 200, 0), 'white');
		this.drawLine(s.x, Math.max(s.w - 400, 0), this.colors.red);
		this.drawLine(s.x, Math.max(s.w - 600, 0), 'white');
		this.drawLine(s.x, Math.max(s.w - 800, 0), this.colors.blue);
		
		this.particles[i].w += 20;
		
		if(this.particles[i].w > this.c.width * 2.5){
			this.removeQueue.push(i);
		}
	}
	
	drawLine(x, w, color){
		this.ctx.beginPath();
		this.ctx.rect((x - (w / 2)), 0, w, this.c.height);
		this.ctx.fillStyle = color;
		this.ctx.fill();
		this.ctx.closePath();
	}
	
	// Draws shiny shiny stars
	drawStar(i){
		var s = this.particles[i];
		
		this.drawStarShape(s.x, s.y, s.r, this.colors.red);
		this.drawStarShape(s.x, s.y, Math.max(0, s.r - 100), 'white');
		this.drawStarShape(s.x, s.y, Math.max(0, s.r - 200), this.colors.red);
		this.drawStarShape(s.x, s.y, Math.max(0, s.r - 300), 'white');
		this.drawStarShape(s.x, s.y, Math.max(0, s.r - 400), this.colors.blue);
		
		this.particles[i].r += 20;
		
		if(this.particles[i].r > this.c.width * 3){
			this.removeQueue.push(i);
		}
	}
	
	drawStarShape(x, y, r, color){
		this.ctx.beginPath();
		this.ctx.moveTo(x, y - r);
		this.ctx.lineTo(x + r*.3, y - r*.2);
		this.ctx.lineTo(x + r, y - r*.2);
		this.ctx.lineTo(x + r*.4, y + r*.3);
		this.ctx.lineTo(x + r*.6, y + r);
		this.ctx.lineTo(x, y + r*.7);
		this.ctx.lineTo(x - r*.6, y + r);
		this.ctx.lineTo(x - r*.4, y + r*.3);
		this.ctx.lineTo(x - r, y - r*.2);
		this.ctx.lineTo(x - r*.3, y - r*.2);
		this.ctx.fillStyle = color;
		this.ctx.fill();
		this.ctx.closePath();
	}
	
	// Don't forget to vote if you can!
	drawTitle(){
		var mouseDistanceFromCenter = (this.c.width / 2) - (this.mouseX);
		
		this.ctx.beginPath();
		this.ctx.font = '80px Holtwood One SC';
		this.ctx.fillStyle = 'white';
		this.ctx.textAlign = 'center';
		this.ctx.shadowColor = 'rgba(0, 0, 0, .33)';
		this.ctx.shadowBlur = 0;
		this.ctx.shadowOffsetY = 10 + (this.mouseY / 100);
		this.ctx.shadowOffsetX = mouseDistanceFromCenter / 40;
		this.ctx.fillText('⋆ NEW ERA 2047 ⋆', this.c.width / 2, this.c.height - 600);
		this.ctx.closePath();
		
		this.ctx.shadowOffsetX = 0;
		this.ctx.shadowOffsetY = 0;
	}

	// This draws a cute little running elephant
	drawCursor(x, y){
		this.ctx.beginPath();
		
		var i = Math.sin(this.cursorLegPos) * .5;
		var j = Math.sin(this.cursorLegPos - 1);
		var k = Math.sin(this.cursorLegPos - 3);
		
		this.ctx.moveTo(x, y - 20);
		this.ctx.quadraticCurveTo(x + 20, y - 20, x + 20, y + 10);
		this.ctx.quadraticCurveTo(x + 25, y + 15, x + 25, y);
		this.ctx.lineTo(x + 30, y);
		this.ctx.bezierCurveTo(x + 30, y + 25, x + 15, y + 25, x + 10, y);
		this.ctx.lineTo(x + 10 + i, y + 20 + j);
		this.ctx.lineTo(x + i, y + 20 + j);
		this.ctx.lineTo(x, y + 10);
		this.ctx.quadraticCurveTo(x - 5, y + 15, x - 10, y + 10);
		this.ctx.lineTo(x - 10 + i, y + 20 + k);
		this.ctx.lineTo(x - 20 + i, y + 20 + k);
		this.ctx.lineTo(x - 20, y + 10);
		this.ctx.quadraticCurveTo(x - 25, y - 20, x, y - 20);
		
		this.ctx.fillStyle = this.colors.red;
		this.ctx.strokeStyle = 'white';
		this.ctx.lineWidth = 4;
		this.ctx.stroke();
		this.ctx.fill();
		this.ctx.closePath();
	}
}

new Trump();