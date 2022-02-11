//make style declarations more readable
const box = document.getElementById("box").style;
const [sizeText, colorText, opacityText, rotationText] = [document.getElementById("size"), document.getElementById("color"), document.getElementById("opacity"), document.getElementById("rotation")];

//initial values for reset
const [initHeight, initWidth, initColor, initOpacity] = [box.height, box.width, box.backgroundColor, box.opacity];
const [initSizeText, initColorText, initOpacityText, initRotationText] = [sizeText.innerHTML, colorText.innerHTML, opacityText.innerHTML, rotationText.innerHTML];

//variables and function needed for rotation
let randomDegree = 0;
let resetPosition = 0;
const resetDegree = () => {
    randomDegree -= randomDegree%90;
    resetPosition = randomDegree%360;
    return randomDegree;
}

//color array
const colors = ["Orange", "Red", "Blue", "Green", "Yellow", "Purple", "Magenta", "Brown", "Violet"];

//make random integers 
const randomizer = (range=1, min=0) => Math.floor(range * Math.random()) + min;

//randomly grows/shrinks box to some size between 25x25px and 500x500px
document.getElementById("button1").onclick = () =>  {
    const randomSize = randomizer(475, 25);
    box.height = box.width = randomSize + "px";
    sizeText.innerHTML = `Size: ${box.height} x ${box.width}`;
}

//randomly changes color of box
document.getElementById("button2").onclick = () => {    
    
    //chooses a color from array
    let randomColor = colors[randomizer(colors.length)];    
    
    //prevents same color from being chosen
    while (randomColor.toLowerCase() == box.backgroundColor.toLowerCase()) {
        randomColor = colors[randomizer(colors.length)];
    }

    box.backgroundColor = randomColor;
    colorText.innerHTML = `Color: ${randomColor}`;
}

//randomly changes opacity of box
document.getElementById("button3").onclick = () => {
    const randomOpacity = randomizer(100);
    box.opacity = randomOpacity/100;
    opacityText.innerHTML = `Opacity: ${randomOpacity}%`;
}

//randomly rotates box
document.getElementById("button4").onclick = () => {
    //set random change in degrees and adds it to global variable, needed to keep box rotating clockwise
    randomDegree += randomizer(180);
    box.transform = `rotate(${randomDegree}deg)`;
    rotationText.innerHTML = `Rotation: ${(randomDegree-resetPosition)%360}°`;
}

//randomizes every element
document.getElementById("button5").onclick = () => {
    for (let i = 1; i < 5; i++) {document.getElementById(`button${i}`).onclick()}
}

//resets box to initial values
document.getElementById("button6").onclick = () => {
    [box.height, box.width, box.backgroundColor, box.opacity] = [initHeight, initWidth, initColor, initOpacity];
    [sizeText.innerHTML, colorText.innerHTML, opacityText.innerHTML, rotationText.innerHTML] = [initSizeText, initColorText, initOpacityText, initRotationText];

    //resets rotation to the closest rotationally symmetrical position to initial (only works for square, rectangles must be switched to a %180)
    box.transform = `rotate(${resetDegree()}deg)`;
}