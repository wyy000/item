// 每个实例对象为一组管子，直接传入两张图片路径作为参数，实例化后遍历分别为其设置样式
function Pipe(pipe_down, pipe_up, step, x) {
	this.pipe_down=pipe_down;
	this.pipe_up=pipe_up;
	this.step=step;
	this.x=x;
	this.y=parseInt(Math.random() * 230) + 10;
	this.count=0;
}
Pipe.prototype.createPipe = function() {
	return new Pipe(this.pipe_down, this.pipe_up, this.step, this.x)
}