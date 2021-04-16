var timer;
var elementIDs;
var mouseOverImg;
var imgData = [["../content/pw/racingwinds_low.png",
                "../content/pw/heatimg_low.png",
                "../content/pw/emotionhub.png",
                "../content/pw/therobots_low.png"], [
                "../content/pw/jack_low.jpg",
                "../content/pw/pathfinder.jpg",
                "../content/pw/autoring_low.jpg"], [
                "../content/pw/whole abc_1.png",
                "../content/pw/picto_low.png"], [
                "../content/pw/2.jpg",
                "../content/pw/1.jpg"
                ]];

function setup(){
    noCanvas();
    elementIDs = document.getElementsByTagName("img");
    for(let i = 0; i < elementIDs.length; i++){
        elementIDs[i].addEventListener("mouseenter", function(){changeImg(i)});
        elementIDs[i].addEventListener("mouseleave", function(){clearInterval(timer);});
    }
}

function draw(){

}

function changeImg(img){
    let currentImg = int(elementIDs[img].id);
    elementIDs[img].src = imgData[img][currentImg];
    timer = setInterval(function(){
        if(currentImg < imgData[img].length-1){
            currentImg++;
        }else{
            currentImg = 0;
        }
        elementIDs[img].src = imgData[img][currentImg];
        elementIDs[img].id = str(currentImg);
    }, 800);
}

/*var timer;              
function changeIMG(){
    currentImg = 1;
    timer = setInterval(function(){
        document.getElementById("microImg").src = microImgSrc[currentImg];
        if(currentImg < microImgSrc.length-1){
            currentImg++;
        }else{
            currentImg = 0;
        }
    }, 500);
}

function stopChange(){
    clearInterval(timer);
}*/
