function Bird(imgArr, x , y) {
	this.imgArr=imgArr;
	this.index=parseInt(Math.random() * imgArr.length);
	this.img=imgArr[this.index];
	this.x=x;
	this.y=y;
	this.speed=0;
	this.state="D";
}
Bird.prototype.rotate = function() {
	this.ctx.canvas.rotate()
}
Bird.prototype.fly = function() {
	this.index++;
	if(this.index > this.imgArr.length - 1) this.index = 0;
	this.img=this.imgArr[this.index];
}
Bird.prototype.fillDown = function() {

	if(this.state=="D") {
		this.speed++;
		this.y += Math.sqrt(this.speed);
	}else {
		this.speed--;
		if(this.speed === 0) {
			this.state="D"
			return;
		}
		this.y -= Math.sqrt(this.speed);
	}
}
Bird.prototype.goUp = function() {
	this.speed = 20;
	this.state="U";
}