
console.log("begining of JS prgm");

function randomInt(max) {
  return Math.floor(Math.random() * max);
}

function createSandCell(numId=5){
	let valR=randomInt(255);
	let mapColor = new Map([
		["random", [valR, valR, 0]],
		["jaune", [200, 200, 0]],
		["rouge", [200, 0, 0]],
		["vert", [0, 200, 0]],
		["bleu", [0, 0, 200]]
	]);
	var colorChoice=mapColor.get(couleurSable);
	var cell = {
		name: "sand",
		num: numId,
		color: colorChoice,
		gravity: true,
		liquide: false,
		priority: 5, // si il coule ou pas
		acide:0, //pas du tout acide
		resistanceAcide: 0
	}
	return cell;
}

function createWaterCell(){
	let valR=randomInt(20)-10;
	var cell = {
		num:-2,
		name: "water",
		color: [50+valR,160+valR,250+valR],
		gravity: true,
		liquide: true,
		priority: 3,
		acide:0, //pas du tout acide
		resistanceAcide: 8
	}
	return cell;
}

function createMetalCell(){
	let valR=randomInt(20)-10;
	var cell = {
		num:10,
		name: "metal",
		color: [95+valR,95+valR,115+valR],
		gravity: false,
		liquide: false,
		priority: 10,
		acide:0, //pas du tout acide
		resistanceAcide:5
	}
	return cell;
}


function createNothingCell(){
	var cell = {
		num:-1,
		name: "nothing",
		color: null,
		gravity: false,
		liquide: false,
		priority: 0, //prioritaire devant presque rien
		acide:0, //pas du tout acide
		resistanceAcide:10//le max
	}
	return cell;
}

function createAcideCell(){
	let valR=randomInt(20)-10;
	var cell = {
		num:3,
		name: "acide",
		color: [100+valR,240+valR,40+valR],
		gravity: true,
		liquide: true,
		priority: 2, 
		acide:6, //mange le sable mais pas le métal
		resistanceAcide: 8
	}
	return cell;
}

function createMap(sizeX, sizeY){
	var map=[];
	console.log("taille map: x:"+sizeX+"; y:"+sizeY);
	var nbrCellDepart=0;
	for (let x = 0; x<sizeX; x++){
		map[x]=[]; // new columne
		for (let y=0; y<sizeY; y++){
			if (randomInt(5)===0 && y>(sizeY/2) ){
				map[x][y]=createSandCell();
				nbrCellDepart++;
			} else {
				map[x][y]=createNothingCell();
			}
			/*if (randomInt(5)===0 && y>){
				map[x][y]=createSandCell(nbrCellDepart);
				nbrCellDepart++;
			} else {
				map[x][y]=createNothingCell();
			}*/
		}
	}
	console.log("nbr cell depart:"+nbrCellDepart);
	//drawAscii(map);
	return map;
}

function copieMap(mapAcopier){
	var sizeX=mapAcopier.length;
	var sizeY=mapAcopier[0].length;
	newMap=[];
	for (let x = 0; x<sizeX; x++){
		newMap[x]=[]; // new columne
		for (let y=0; y<sizeY; y++){
			newMap[x][y]=mapAcopier[x][y];
		}
	}
	return newMap;
}

function dessin1(ctx){
	console.log("dessin1");
	ctx.fillStyle= "rgb(200,0,0)";
	ctx.fillRect(10,10,50,50);
	ctx.fillStyle= "rgba(0,200,0,0.5)"; // le 0.5 défini la transparence
	ctx.fillRect(10,20,30,40);
}

function draw(){
	clearCanvas();
	var sizeX=map.length;
	var sizeY=map[0].length;
	for (let x = 0; x<sizeX; x++){
		for (let y=0; y<sizeY; y++){
			drawCell(x,y,map[x][y]);
		}
	}
	requestAnimationFrame(draw); //smoother animation than setInterval
}



function drawCell(x,y,cell){
	if (cell.name==="nothing"){ return;}
	ctx.fillStyle = "rgb("+cell.color[0]+","+cell.color[1]+","+cell.color[2]+")";
	ctx.fillRect(x*SIZE_CELL, y*SIZE_CELL, SIZE_CELL, SIZE_CELL );
}


function clearCanvas(){
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}

/*function moveCell(cell, x1,y1, x2,y2, mapTmp){ // not used
	mapTmp[x2][y2]=cell;
	mapTmp[x1][y1]=null;
}*/

function updateMap(){
	var sizeX=map.length;
	var sizeY=map[0].length;
	var mapTmp=copieMap(map);
	var nbrCell=0;
	for (let y = 0; y<sizeY; y++){
		if (randomInt(2)===0){
			for (let x=0; x<sizeX; x++){
				if(map[x][y].name!="nothing"){nbrCell++;}
				updateCell(x,y,mapTmp);
			}
		} else {
			for (let x=sizeX-1; x>-1; x--){
				if(map[x][y].name!="nothing"){nbrCell++;}
				updateCell(x,y,mapTmp);
			}
		}
	}
	if (randomInt(0)===0){ console.log("nbrCell:"+nbrCell)}
	map=copieMap(mapTmp);
	//drawAscii(map);
}

function updateCell(x,y,mapTmp){
	var sizeX=map.length;
	var sizeY=map[0].length;
	var cell=map[x][y];
	if (cell.name!="nothing" && y!=sizeY-1 && cell.name==mapTmp[x][y].name){
		var choice=randomInt(2)*2-1 // -1 or 1
		if (cell.gravity){
			//console.log(choice)
			if (mapTmp[x][y+1].priority<cell.priority && map[x][y+1].name==mapTmp[x][y+1].name){ //chute direct
				mapTmp[x][y]=map[x][y+1];
				mapTmp[x][y+1]=cell;
				
			} else if (x!=sizeX-1 && x!=0){
				if(map[x+choice][y+1].priority<cell.priority && mapTmp[x+choice][y+1].name==map[x+choice][y+1].name){ 
					mapTmp[x][y]=map[x+choice][y+1];
					mapTmp[x+choice][y+1]=cell;

				} else if(map[x-choice][y+1].priority<cell.priority && mapTmp[x-choice][y+1].name==map[x-choice][y+1].name){
					mapTmp[x][y]=map[x-choice][y+1];
					mapTmp[x-choice][y+1]=cell;

				} else if(cell.liquide){
					if(map[x+choice][y].priority<cell.priority && map[x+choice][y].name==mapTmp[x+choice][y].name){
						mapTmp[x][y]=map[x+choice][y];
						mapTmp[x+choice][y]=cell;
					} else if(map[x-choice][y].priority<cell.priority && map[x-choice][y].name==mapTmp[x-choice][y].name){
						mapTmp[x][y]=map[x-choice][y];
						mapTmp[x-choice][y]=cell;
					}
				}
			}
		}
		if (cell.acide>map[x][y+1].resistanceAcide && map[x][y+1].name==mapTmp[x][y+1].name){
			mapTmp[x][y]=createNothingCell();
			mapTmp[x][y+1]=createNothingCell();
		} else if (x!=sizeX-1 && x!=0){
			if(map[x+choice][y+1].resistanceAcide<cell.acide && mapTmp[x+choice][y+1].name==map[x+choice][y+1].name){ 
				mapTmp[x][y]=createNothingCell();
				mapTmp[x+choice][y+1]=createNothingCell();
			} else if(map[x-choice][y+1].resistanceAcide<cell.acide && mapTmp[x-choice][y+1].name==map[x-choice][y+1].name){
				mapTmp[x][y]=createNothingCell();
				mapTmp[x-choice][y+1]=createNothingCell();
			} 
		}
	}
}

function newCell(x,y,cell){

	if (map[x][y].name==="nothing" || cell.name==="nothing"){
		map[x][y]=cell
	}
}

function drawAscii(mapToDraw){
	var sizeXmap=mapToDraw.length;
	var sizeYmap=mapToDraw[0].length;
	var tab="";
	for (let x = 0; x<sizeX; x++){
		for (let y=0; y<sizeY; y++){
			tab=tab+"\t"+mapToDraw[x][y].num;
		}
		tab=tab+"\n";
	}
	console.log(tab);
}

function brush(x,y, size, density=75){
	var sizeXmap=map.length;
	var sizeYmap=map[0].length;
	if (size===1){
		newCell(x,y,brushCell());
		return;
	}
	for (let i=x-size; i<x+size; i++){
		for (let j=y-size; j<y+size; j++){
			if (i>=0 && i<=sizeXmap-1 && j>=0 && j<=sizeYmap-1){
				if (randomInt(100)<=density){
					newCell(i,j,brushCell());
				}
			}
		}
	}
}

function mouseMoveHandler(e){
	var relativeX = e.clientX-canvas.offsetLeft;
	var relativeY = e.clientY-canvas.offsetTop;
	//console.log("mouseMoveHandler:"+relativeX+","+relativeY);
	if (mouseDown){
		brush(Math.round(relativeX/SIZE_CELL), Math.round(relativeY/SIZE_CELL), 3);
	}
}

function mouseDownHandler(e){
	mouseDown=true;
	mouseMoveHandler(e);
}

function mouseUpHandler(e){
	mouseDown=false;
}


var canvas=document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
const SIZE_CELL=10;
sizeX=Math.round(canvas.width/SIZE_CELL);
sizeY=Math.round(canvas.height/SIZE_CELL);
var updateTime=10;
var mouseDown=false;
var couleurSable="random"; // random, jaune, rouge, vert, bleu, noir, blanc
var brushCell=createWaterCell;
var map=createMap(sizeX,sizeY);


//fonction setInterval(nomFonction, delayInMs?)
setInterval(updateMap, updateTime);
draw();
document.addEventListener("mousemove",mouseMoveHandler,false);
document.addEventListener("mousedown",mouseDownHandler,false);
document.addEventListener("mouseup",mouseUpHandler,false);




console.log("end of JS prgm");