/**
Title: Javascript Perlin Noise Implementation Island Simulation
Author: Liam Speakman
Notes: N/A
Copyright (C) 2017 Liam Speakman <lspeakman001@gmail.com>
You are free to copy, redistribute, and modify this work with no permission from the author 
**/
function vec2(x, y){
	this.x = x;
	this.y = y;
}
function dot(v1, v2){
	return (v1.x * v2.x + v1.y * v2.y);
}

function lerp(p1, p2, t){
	return ((p2 - p1) * t + p1);
}
function fade(t){
	return t * t * t * (t *(t * 6 - 15) + 10);
}
function getDVec(xg,yg,xn,yn){
	return new vec2(xg-xn, yg-yn);
}
var permutations = [151,160,137,91,90,15,                 
    131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,23,
    190, 6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,
    88,237,149,56,87,174,20,125,136,171,168, 68,175,74,165,71,134,139,48,27,166,
    77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,55,46,245,40,244,
    102,143,54, 65,25,63,161, 1,216,80,73,209,76,132,187,208, 89,18,169,200,196,
    135,130,116,188,159,86,164,100,109,198,173,186, 3,64,52,217,226,250,124,123,
    5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,
    223,183,170,213,119,248,152, 2,44,154,163, 70,221,153,101,155,167, 43,172,9,
    129,22,39,253, 19,98,108,110,79,113,224,232,178,185, 112,104,218,246,97,228,
    251,34,242,193,238,210,144,12,191,179,162,241, 81,51,145,235,249,14,239,107,
    49,192,214, 31,181,199,106,157,184, 84,204,176,115,121,50,45,127, 4,150,254,
    138,236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180,151,160,137,91,90,15,                 
    131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,23,
    190, 6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,
    88,237,149,56,87,174,20,125,136,171,168, 68,175,74,165,71,134,139,48,27,166,
    77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,55,46,245,40,244,
    102,143,54, 65,25,63,161, 1,216,80,73,209,76,132,187,208, 89,18,169,200,196,
    135,130,116,188,159,86,164,100,109,198,173,186, 3,64,52,217,226,250,124,123,
    5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,
    223,183,170,213,119,248,152, 2,44,154,163, 70,221,153,101,155,167, 43,172,9,
    129,22,39,253, 19,98,108,110,79,113,224,232,178,185, 112,104,218,246,97,228,
    251,34,242,193,238,210,144,12,191,179,162,241, 81,51,145,235,249,14,239,107,
    49,192,214, 31,181,199,106,157,184, 84,204,176,115,121,50,45,127, 4,150,254,
    138,236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180];
var finishedNoise = [];
function noise(x,y){
	//create gradients in different directions
	var gradvecs = [
		new vec2(0,-1),new vec2(-1,0),new vec2(0,1),new vec2(1,0),
		new vec2(-1,-1),new vec2(0,-1),new vec2(1,1),new vec2(-1,0),
		new vec2(-1,1),new vec2(1,-1),];
	
	var x0 = Math.floor(x);
	var y0 = Math.floor(y);
	var x1 = x0+1;
	var y1 = y0+1;
	//distance vecs from point
	var aa = getDVec(x,y,x0,y0);
	var ba = getDVec(x,y,x1,y0);
	var ab = getDVec(x,y,x0,y1);
	var bb = getDVec(x,y,x1,y1);
	//dot products, get the values of corners
	var gaa = dot(gradvecs[permutations[permutations[x0 % 255+permutations[y0 % 255]]] % 10], aa);
	var gba = dot(gradvecs[permutations[permutations[x1 % 255+permutations[y0 % 255]]] % 10], ba);
	var gab = dot(gradvecs[permutations[permutations[x0 % 255+permutations[y1 % 255]]] % 10], ab);
	var gbb = dot(gradvecs[permutations[permutations[x1 % 255+permutations[y1 % 255]]] % 10], bb);
	//lerp together to find pixel value
	var sx = fade(x-x0);
	var sy =  fade(y-y0);
	var f1 = lerp(gaa,gba,sx);
	var f2 = lerp(gab,gbb,sx);
	var fbb = lerp(f1,f2,sy);
	return fbb;
}

function getOctavedNoise(x,y,octaves){
	var tempNoise = 0.0;
	for(var i = 1;i<octaves;i++){
	tempNoise += noise(x*(i*.05),y*(i*.05)) * (1-(i-1)*.25);
	}
	tempNoise/=1.5;
	return ((tempNoise+1)/2);
}
function getRiverOctavedNoise(x,y,octaves){
	var tempNoise = 0.0;
	for(var i = 1;i<octaves;i++){
	tempNoise += noise(x*(i*.05),y*(i*.05)) ;
	}
	return Math.abs(tempNoise);
	//river generation -> Math.abs(tempNoise);
}
function init(){
	console.log("Initialized.");
}



function update(){
	
	
}
var x = 0;
var zoomFactor = 0.0;
function render(context){
	x+=.1;
	zoomFactor = Math.sin(x)+1.2;
			for(var i = 0;i<256;i+=1){
		for(var j = 0;j<144;j+=1){
			var noiseTemp = 
			getOctavedNoise((i*zoomFactor)+x*10,j*zoomFactor,4);
		if(noiseTemp < .57)
			context.fillStyle = "rgb(0,0,172)"; //ocean
		
		if(noiseTemp > .56)
			context.fillStyle = "rgb(237, 201, 175)"; //sand
		if(noiseTemp > .6)
			context.fillStyle = "rgb(30,124,46)"; //grass
		if(noiseTemp > .7){
			if((i+j) % 3 == 0){
				context.fillStyle = "green";
			}else{
				context.fillStyle = "darkgreen";
			}
		}
		
		if(noiseTemp <.47)
			context.fillStyle = "rgb(0,0,128)"; //dark blue ocean
		if(noiseTemp <.37)
			context.fillStyle = "rgb(0,0,64)"; //dark dark blue ocean
		if(noiseTemp <.1)
			context.fillStyle = "rgb(0,0,32)"; //dark dark blue ocean
		context.fillRect(i*5,j*5,5,5);
	}
				
			}
	
}
