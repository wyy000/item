function Game(ctx, bird, pipe, land, bg, score) {
	this.ctx=ctx;
	this.bird=bird;
	this.pipeArr=[pipe];
	this.land=land;
	this.bg=bg;
	this.score=score;

	this.iframe = 0;
	this.timer = null;
	this.stop = false;
	this.init();
}
Game.prototype.init=function() {

	this.bird.speed = 0;
	this.bird.x = 100;
	this.bird.y = 100;
	this.bird.state="D"

	this.createPipe(1);
	this.renderScore(1);
	this.ready();
}

Game.prototype.ready=function() {
	var me = this;
	var begin = false;

	this.ctx.canvas.onclick = function(e) {
		var x = e.offsetX;
		var y = e.offsetY;
		if(x > 123 && x < 237 && y > 280 && y < 350) {
			begin = true;
		}
	}

	function renderMenu() {
		if(begin) return me.strat();

		me.iframe++;
		me.clear();
		me.renderBg();
		me.renderLand();

		if(!(me.iframe % 10)) {
			me.bird.fly();
		}
		me.ctx.save();
		me.ctx.drawImage(me.bird.img, 180-me.bird.img.width / 2, 100 -me.bird.img.height / 2);
		me.ctx.drawImage(me.score.pic2, 0, 0, 196, 62, 180-98, 140, 196, 62);
		me.ctx.drawImage(me.score.pic1, 0, 70, 114, 70, 180-57, 300, 114, 70);
		me.ctx.restore();
	
		requestAnimationFrame(renderMenu);
	}	
	renderMenu();
}

Game.prototype.strat=function() {

	this.iframe = 0;   //  在menu中已经开始了技术，若不清零，会多存在一根管子
	var me = this;

	this.timer = setInterval(function() {
		me.iframe++;
		me.bindEvent();
		me.clear();
		me.renderBg();
		me.renderLand();
		if(!(me.iframe % 65)) {
			me.createPipe();
		}
		me.renderPipe();
		me.movePipe();
		me.renderPipePoints();
		me.renderScore();
		me.removePipe();
		me.bird.fillDown();
		if(!(me.iframe % 10)) {
			me.bird.fly();
		}
		me.renderBird();
		me.check();
	}, 16)
}

Game.prototype.clear=function() {
	this.ctx.clearRect(0, 0, 360, 512);
}

Game.prototype.renderBg=function() {
	var img=this.bg.img;
	if(!this.stop) this.bg.x -= this.bg.step;
	if(this.bg.x < -img.width) {
		this.bg.x = 0;
	}
	this.ctx.drawImage(img, this.bg.x, this.bg.y);
	this.ctx.drawImage(img, this.bg.x + img.width, this.bg.y);
	this.ctx.drawImage(img, this.bg.x + img.width*2, this.bg.y);
}
Game.prototype.renderLand=function() {
	var img=this.land.img;
	if(!this.stop) this.land.x -= this.land.step;
	if(this.land.x < -img.width) {
		this.land.x = 0;
	}
	this.ctx.drawImage(img, this.land.x, this.land.y);
	this.ctx.drawImage(img, this.land.x + img.width, this.land.y);
	this.ctx.drawImage(img, this.land.x + img.width*2, this.land.y);
}

Game.prototype.renderBird=function() {
	var img = this.bird.img;
	var deg;
	if(this.stop) {
		deg = Math.PI / 180 * this.bird.speed * this.bird.speed / 2;
	}else {
		deg = this.bird.state === "D" ? Math.PI / 180 * this.bird.speed : -Math.PI / 180 * this.bird.speed;
	}
	this.ctx.save();
	this.ctx.translate(this.bird.x, this.bird.y);
	this.ctx.rotate(deg);
	this.ctx.drawImage(img, -img.width / 2, -img.height / 2);
	this.ctx.restore();
}

Game.prototype.renderScore=function(a) {
	if(!(this.iframe % 65)) {   // 顺序问题，若放在a后面，页面第一次加载后，初始值为1
		this.score.index++;
	}
	if(a) {
		this.score.index=0;
		console.log(this.score.index)
	}
	var a = parseInt(this.score.index / 10);
	var b = this.score.index % 10;
	var imgArr = this.score.imgArr;

	this.ctx.save();
	this.ctx.translate(this.ctx.canvas.width/2 - imgArr[0].x/2 - 5, 50);

	if(this.score.index > 9) {
		this.ctx.drawImage(imgArr[a], -12, 0);
		this.ctx.drawImage(imgArr[b], 12, 0);
	}else {	
		this.ctx.drawImage(imgArr[b], -6, 0);
	}
	this.ctx.restore();
}

Game.prototype.renderPipe=function() {
	var me = this;
	this.pipeArr.forEach(function(value, index) {
		var img_up = value.pipe_down;
		var up_x = 0;
		var up_y = img_up.height - value.y;
		var up_w = img_up.width;
		var up_h = value.y;
		var canvas_x = me.ctx.canvas.width - value.count*value.step;  //
		var canvas_y = 0;
		var canvas_w = img_up.width;
		var canvas_h = value.y;
		me.ctx.drawImage(img_up, up_x, up_y, up_w, up_h, canvas_x, canvas_y, canvas_w, canvas_h);

		var img_down = value.pipe_up;
		var down_x = 0;
		var down_y = 0;
		var down_w = img_up.width;
		var down_h = 250 - up_h;
		var can_x = me.ctx.canvas.width - value.count*value.step;
		var can_y = value.y + 150;
		var can_w = img_up.width;
		var can_h = 250 - up_h;
		me.ctx.drawImage(img_down, down_x, down_y, down_w, down_h, can_x, can_y, can_w, can_h);
	})
}

Game.prototype.createPipe=function(a) {
	var pipe = this.pipeArr[0].createPipe();
	this.pipeArr.push(pipe);
	if(a) {
		this.pipeArr.splice(0,this.pipeArr.length - 1);   
		// 初始化时，再次开始创建水管，继续按照之前位置创建，需要清除游戏结束前已渲染的移动的对象，只保留最后一项(防止渲染时报错)
	}
}

Game.prototype.movePipe=function() {
	for(var i =0; i < this.pipeArr.length; i++) {	
		this.pipeArr[i].count++;
	}
}

Game.prototype.removePipe=function() {
	for(var i = 0; i < this.pipeArr.length; i++) {
		var pipe = this.pipeArr[i];
		if(pipe.x - pipe.count*pipe.step < -pipe.pipe_up.width) {
			this.pipeArr.splice(i,1);
			// console.log(pipe.x - pipe.count*pipe.step)
			return;
		}
	}
}

		/*判断时根据数组地一根柱子位置来检测，鸟的x值并不变，所以只检测管子的x值即可，数组遍历，
		每项值刚刚到达小鸟位置时就有新的项插入进来，其定位置随记改变*/
Game.prototype.renderPipePoints = function() {
	for(var i = 0; i < this.pipeArr.length; i++) {
		var pipe = this.pipeArr[0];   
		var up_A = {
			x: pipe.x - pipe.count*pipe.step,
			y: 0
		}
		var up_B = {
			x: pipe.x - pipe.count*pipe.step + pipe.pipe_up.width,
			y: 0
		}
		var up_C = {
			x: pipe.x - pipe.count*pipe.step,
			y: pipe.y
		}
		var up_D = {
			x: pipe.x - pipe.count*pipe.step + pipe.pipe_up.width,
			y: pipe.y
		}

		var down_A = {
			x: pipe.x - pipe.count*pipe.step,
			y: 150 + pipe.y
		}
		var down_B = {
			x: pipe.x - pipe.count*pipe.step + pipe.pipe_up.width,
			y: 150 + pipe.y
		}
		var down_C = {
			x: pipe.x - pipe.count*pipe.step,
			y: 400
		}
		var down_D = {
			x: pipe.x - pipe.count*pipe.step + pipe.pipe_up.width,
			y: 400
		}
	}

	Game.prototype.check = function() {
		var r = this.bird.img.width / 2;

		if(this.bird.y + this.bird.img.width / 2 - 6 >= 400 || this.bird.y - this.bird.img.width / 2 + 12 <= 0) {
			this.gameOver();
		}
		if(up_C.x <= 100 + r - 5 && up_C.x >= 100 - pipe.pipe_up.width && this.bird.y - r + 5 <= up_C.y) {
			this.gameOver();
		} 
		if(up_C.x <= 100 + r - 5 && up_C.x >= 100 - pipe.pipe_up.width && this.bird.y + r - 5 >= down_A.y) {
			this.gameOver();	
		} 
	}
}

Game.prototype.gameOver=function() {

	clearInterval(this.timer);
	var me = this;
	var idx = 0;
	var step = 5;
	this.stop = true;
	
	function over() {

		idx++;
		if(me.bird.y + 20 < 400 && idx > 20) {
			me.bird.speed++;
			me.bird.y += Math.sqrt(me.bird.speed);
		}

		me.clear();
		me.renderBg();
		me.renderLand();
		me.renderPipe();
		me.renderBird();
	
		if(me.bird.y + 20 >= 400) {
			var pic = me.score.pic;
			step += 15;
			var y = 500 - step;
		
			me.ctx.save();
			me.ctx.translate(me.ctx.canvas.width/2, 80);
			me.ctx.drawImage(pic, -204 / 2, y);
			me.ctx.drawImage(me.score.pic1, 0, 0, 114, 70, -114 / 2, y + 110, 114, 70);
			me.ctx.restore();

			if(y <= 0) {
				me.click();
				me.stop=false;
				return;
			}		
		}
		requestAnimationFrame(over);
	}
	over();
}

Game.prototype.click=function() {
	var me = this;

	this.ctx.canvas.onclick = function(e) {
		var x = e.offsetX;
		var y = e.offsetY;
		if(x > 123 && x < 237 && y > 190 && y < 260) {
			me.init();
		}
	}
}

Game.prototype.bindEvent=function() {
	var me = this;
	me.ctx.canvas.onclick = function() {
		me.bird.goUp();
	}
}

//全局变量不能被垃圾回收机制回收