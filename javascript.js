//make style declarations more readable
const box = document.getElementById("box").style;
let [sizeText, colorText, opacityText, rotationText] = [document.getElementById("size"), document.getElementById("color"), document.getElementById("opacity"), document.getElementById("rotation")];

//initial values for reset
const [initHeight, initWidth, initColor, initOpaciSty] = [box.height, box.width, box.backgroundColor, box.opacity];
const [initsizeText, initColorText, initOpacityText, initRotationText] = [sizeText.innerHTML, colorText.innerHTML, opacityText.innerHTML, rotationText.innerHTML];

//variable and function needed for rotation
let randomDegree = 0;
const resetDegree = () => randomDegree -= randomDegree%360;

//color array
const colors = ["Orange", "Red", "Blue", "Green", "Yellow", "Purple", "Magenta", "Brown", "Violet"];

//function to make random integers 
const randomizer = (range=1, initial=0) => Math.floor(range * Math.random()) + initial;

//Randomly grows/shrinks within a range
document.getElementById("button1").onclick = () =>  {
    let randomSize = randomizer(475, 25);
    box.height = box.width = randomSize + "px";
    sizeText.innerHTML = `Size: ${randomSize}px x ${randomSize}px`;
}

//Randomly changes color of box
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

//Randomly changes opacity of box
document.getElementById("button3").onclick = () => {
    const randomOpacity = randomizer(100);
    box.opacity = randomOpacity/100;
    opacityText.innerHTML = `Opacity: ${randomOpacity}%`;
}

//Randomly rotates box
document.getElementById("button4").onclick = () => {
    //set random change in degrees and adds it to global variable, needed to keep box rotating clockwise
    randomDegree += randomizer(180);
    box.transform = `rotate(${randomDegree}deg)`;
    rotationText.innerHTML = `Rotation: ${randomDegree%360}°`;
}

//Randomizes every element
document.getElementById("button5").onclick = () => {
    for (let i = 1; i < 5; i++) {document.getElementById(`button${i}`).onclick()}
}

//Resets box to initial values
document.getElementById("button6").onclick = () => {
    [box.height, box.width, box.backgroundColor, box.opacity] = [initHeight, initWidth, initColor, initOpacity];
    [sizeText.innerHTML, colorText.innerHTML, opacityText.innerHTML, rotationText.innerHTML]= [initsizeText, initColorText, initOpacityText, initRotationText];

    //reset only by maximum one rotation
    box.transform = `rotate(${resetDegree()}deg)`;
}