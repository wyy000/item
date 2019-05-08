function Background(imgArr, step, x, y) {
	if(imgArr.length === 1) {
		this.img=imgArr[0];	
	}else if(imgArr.length === 2) {
		this.index=parseInt(Math.random()*2);
		this.img=imgArr[this.index];	
	}
	this.step=step;
	this.x=x;
	this.y=y;
}