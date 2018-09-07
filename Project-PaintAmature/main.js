var canvas;
var ctx;
var startX = 0, startY = 0, dragging = false;
var selectedColor = document.getElementById("selectedColor");
var myPallet = document.getElementById("myPallet");
var palletColors = document.getElementsByClassName("palletColor");
var lineWeightValue = document.getElementById("lineWeightValue");
var inputColors = document.getElementById("inputColors");
var coordi = document.getElementById("coordi");

function initialize(event) {
	canvas = document.getElementById("myCanvas");
	ctx = canvas.getContext("2d");
	
	var palletColorsLength = palletColors.length;
	
	for (var i=0; i<palletColorsLength; i++) {
		if (palletColors[i].value) {
			palletColors[i].style.backgroundColor = palletColors[i].value;
		}
	}
	
	myPallet.addEventListener("click", setStrokeStyle);
	inputColors.addEventListener("change", setStrokeStyle);
	
	canvas.addEventListener("mousedown", down);
	canvas.addEventListener("mouseup", up);
	canvas.addEventListener("mousemove", move);
	canvas.addEventListener("mouseout", out);
};

function setStrokeStyle(e) {
	// 색상 설정. click(button.value) -> strokeStyle: value,id:selectedColor, background-color:value
	if (e.target.value) {		
		selectedColor.style.backgroundColor = e.target.value;
		
		var oldColors = inputColors.getElementsByClassName("palletColor");
		// input type=color의 value를 inputColors의 button value에 저장
		if (e.target.id == "inputColor" && e.target.value != oldColors[1].value) {
			
			oldColors[0].value = (oldColors[1].value)? oldColors[1].value : "";
			oldColors[0].style.backgroundColor = oldColors[0].value; 
			oldColors[1].value = e.target.value;
			oldColors[1].style.backgroundColor = oldColors[1].value;
		}
	}
};

function draw(currentX, currentY) {
	ctx.beginPath();
	ctx.strokeStyle = selectedColor.style.backgroundColor;
	ctx.lineWidth = lineWeightValue.value;
	ctx.moveTo(startX, startY);
	ctx.lineTo(currentX, currentY);
	ctx.stroke();
};

function down(e) {
	dragging = true;
	startX = e.offsetX;
	startY = e.offsetY;
};

function up() {
	dragging = false;
};

function move(e) {
	coordi.innerHTML = "X = " + e.offsetX + ",<br>Y = " + e.offsetY;
	if (!dragging) return;
	
	var currentX = e.offsetX;
	var currentY = e.offsetY;
		
	draw(currentX, currentY);
	startX = currentX;
	startY = currentY;
};

function out() {
	dragging = false;
};