/*------------make style declarations readable-----------*/
const [box, sizeText, colorText, opacityText, rotationText, growButton, fadeButton] = [
    document.getElementById("box").style,
    document.getElementById("size"),
    document.getElementById("color"),
    document.getElementById("opacity"),
    document.getElementById("rotation"),
    document.getElementById("button1"),
    document.getElementById("button3")
];

/*----------------initial box values--------------------*/
const [initHeight, initWidth, initColor, initOpacity, initRotation] = [
    box.height,
    box.width,
    box.backgroundColor,
    box.opacity || 1,
    parseInt(box.transform.match(/\-?(\d+\.?\d*|\d*\.?\d+)/)) || 0
];

/*-----------variables for grow/shrink button----------*/
let hitMaxSize = false;
let hitMinSize = true;
let maxSize = 350;
let minSize = 50;
let currentHeight = parseInt(initHeight);
let currentWidth = parseInt(initWidth);
let sideRatio = currentWidth/currentHeight;
const growthRate = 2;

//if initial height or initial width is greater than maxSize
if (parseInt(initHeight) >= maxSize || parseInt(initWidth) >= maxSize) {
    hitMaxSize = true;
    hitMinSize = false;
    maxSize = Math.max(parseInt(initHeight), parseInt(initWidth));
    growButton.innerHTML = "Shrink";
} 

//if initial height or width is less than minSize
if (parseInt(initHeight) < minSize || parseInt(initWidth) < minSize) {
    minSize = Math.min(parseInt(initHeight), parseInt(initWidth));
}

//for resetting button
const initHitMaxSize = hitMaxSize;
const initHitMinSize = hitMinSize;


/*--------------variables for color button-------------*/
let currentColor = box.backgroundColor;
const colors = [
    "red",
    "blue",
    "green",
    "yellow",
    "purple",
    "magenta",
    "brown",
    "violet"
];
//adds initial color to array if box starts with a color not in array
if (!colors.includes(initColor)){
    colors.unshift(initColor);
}

/*--------variables for fade/materialize button--------*/
let currentOpacity = parseInt(initOpacity);
let hitMaxOpacity = true;
let hitMinOpacity = false;
let maxOpacity = 1;
let minOpacity = .1;
const fadeRate = Math.round((maxOpacity-minOpacity)*100)/1000

//if initial opacity is less than minOpacity
if (parseInt(initOpacity) <= minOpacity) {
    hitMaxOpacity = false;
    hitMinOpacity = true;
    minOpacity = parseInt(initOpacity);
    fadeButton.innerHTML = "Materialize";
}

//if initial opacity is more than maxOpacity
if(parseInt(initOpacity) > maxOpacity) {
    maxOpacity = parseInt(initOpacity);
}

//for resetting button
const initHitMaxOpacity = hitMaxOpacity;
const initHitMinOpacity = hitMinOpacity;

/*-------------variables for spin button---------------*/
let currentDegree = initRotation;
let resetPosition = initRotation % 360;
const spinRate = 181;

//n value refers to rotational symmetry (see https://en.wikipedia.org/wiki/Rotational_symmetry), 1 will work for any shape
let n = 1;

//squares have 4 points of rotational symmetry, rectangles have 2
if (sideRatio == 1) {
    n = 4;
} else {
    n = 2;
}

/*--------------initial text for reset----------------*/
const [initSizeText, initColorText, initOpacityText, initRotationText, initGrowButton, initFadeButton] = [
    `[ Size ${Math.round(parseInt(initHeight))} x ${Math.round(parseInt(initWidth))} pixels ]`,
    `[ Color ${initColor} ]`,
    `[ Opacity ${initOpacity * 100}% ]`,
    `[ Rotation ${initRotation % (360/n)}&deg ]`,
    growButton.innerHTML,
    fadeButton.innerHTML
];


/*--------------------functions-----------------------*/

//multiplies box size by growthRate then limits size of box to maxSize and minSize
const addToCurrentHeight = (rate) => {

    if(currentHeight >= currentWidth){

        if (!hitMaxSize) {
            
            currentHeight *= rate;

            if (currentHeight >= maxSize) {
                currentHeight = maxSize * rate;
                hitMaxSize = true;
                hitMinSize = false;
                growButton.innerHTML = "Shrink";
            }

            currentWidth = Math.round(currentHeight * sideRatio);
        }

        if (!hitMinSize) {

            currentWidth /= rate;
            
            if (currentWidth <= minSize) {
                currentWidth = minSize;
                hitMinSize = true;
                hitMaxSize = false;
                growButton.innerHTML = "Grow";
            }

            currentHeight = Math.round(currentWidth / sideRatio);
        }

    } else {

        if (!hitMaxSize) {
            
            currentWidth *= rate;
            
            if (currentWidth >= maxSize) {
                currentWidth = maxSize * rate;
                hitMaxSize = true;
                hitMinSize = false;
                growButton.innerHTML = "Shrink";
            }
        
            currentHeight = Math.round(currentWidth / sideRatio);
        }

        if (!hitMinSize) {

            currentHeight /= rate;

            if (currentHeight <= minSize) {
                currentHeight = minSize;
                hitMinSize = true;
                hitMaxSize = false;
                growButton.innerHTML = "Grow";
            }

            currentWidth = Math.round(currentHeight * sideRatio);
        }
    }
}


//adds fadeRate to opacity then limits opacity to maxOpacity and minOpacity
const addToCurrentOpacity = (rate) => {

    if (!hitMaxOpacity) {
        currentOpacity = Math.round((currentOpacity+rate)*100)/100;
        if(currentOpacity >= maxOpacity) {
            currentOpacity = maxOpacity + rate;
            hitMaxOpacity = true;
            hitMinOpacity = false;
            fadeButton.innerHTML = "Fade";
        }
    }

    if (!hitMinOpacity) {
        currentOpacity = Math.round((currentOpacity-rate)*100)/100;
        if(currentOpacity <= minOpacity) {
            currentOpacity = minOpacity;
            hitMinOpacity = true;
            hitMaxOpacity = false;
            fadeButton.innerHTML = "Materialize";
        }
    }
}

//display readable text for opacity
const opacityTextNum = () => Math.round(currentOpacity*100);


//resets rotation to closest point of rotational symmetry
function resetDegree() {
    currentDegree -= (currentDegree - initRotation) % (360/n);
    resetPosition = currentDegree % 360;
    return currentDegree;
}

//display correct text for rotation
const rotationTextNum = () => (initRotation%(360/n) + currentDegree - resetPosition)%360


//make random integers 
const randomizer = (range = 1, min = 0) => Math.round(range * Math.random()) + min;


//write the text under buttons
function writeText(thisSizeText, thisColorText, thisOpacityText, thisRotationText) {
    [sizeText.innerHTML, colorText.innerHTML, opacityText.innerHTML, rotationText.innerHTML] = [
        thisSizeText,
        thisColorText,
        thisOpacityText,
        thisRotationText
    ];
};

/*-------------------on click events-------------------*/

//grow/shrink button
document.getElementById("button1").onclick = () => {

    addToCurrentHeight(growthRate);
    
    box.height = Math.round(currentHeight) + "px";
    box.width = Math.round(currentWidth) + "px";
    sizeText.innerHTML = `[ Size: ${Math.round(currentHeight)} x ${Math.round(currentWidth)} pixels ]`;
}


//color button
document.getElementById("button2").onclick = () => {

    if (colors.indexOf(box.backgroundColor) < (colors.length-1)) {
        currentColor = colors[colors.indexOf(box.backgroundColor)+1];
    } else {
        currentColor = colors[0];
    }

    box.backgroundColor = currentColor;
    colorText.innerHTML = `[ Color: ${currentColor} ]`;
}


//fade/materialize button
document.getElementById("button3").onclick = () => {
    
    addToCurrentOpacity(fadeRate);

    box.opacity = currentOpacity;
    opacityText.innerHTML = `[ Opacity: ${opacityTextNum()}% ]`
}


//spin button
document.getElementById("button4").onclick = () => {
    
    currentDegree += spinRate;
    
    box.transform = `rotate(${currentDegree}deg)`;
    rotationText.innerHTML = `[ Rotation: ${rotationTextNum()}&deg ]`;
}


//randomize all button
document.getElementById("button5").onclick = () => {

    //randomizes box size
    if(currentHeight >= currentWidth){
        currentHeight = randomizer((maxSize - minSize), minSize);
        currentWidth = Math.round(currentHeight * sideRatio);
    } else {
        currentWidth = randomizer((maxSize - minSize), minSize);
        currentHeight = Math.round(currentWidth / sideRatio);
    }

    //randomizes color
    currentColor = colors[randomizer(colors.length)];
    //prevents same color from being chosen
    while (currentColor == box.backgroundColor) {
        currentColor = colors[randomizer(colors.length)];
    }
    
    //randomizes opacity
    currentOpacity = randomizer((maxOpacity - minOpacity)*100, minOpacity*100)/100;
    
    //randomizes rotation
    currentDegree += randomizer(180);

    //set box properties
    [box.height, box.width, box.backgroundColor, box.opacity, box.transform] = [
        currentHeight + "px",
        currentWidth + "px",
        currentColor,
        currentOpacity,
        `rotate(${currentDegree}deg)`
    ]

    //writes text under buttons
    writeText(`[ Size: ${Math.round(currentHeight)} x ${Math.round(currentWidth)} pixels ]`, `[ Color: ${box.backgroundColor} ]`, `[ Opacity: ${opacityTextNum()}% ]`, `[ Rotation: ${rotationTextNum()}&deg ]`);
}


//reset button
document.getElementById("button6").onclick = () => {

    //reset height, width, color, opacity
    [box.height, box.width, box.backgroundColor, box.opacity] = [
        initHeight,
        initWidth,
        initColor,
        initOpacity
    ];

    //reset rotation
    box.transform = `rotate(${resetDegree()}deg)`;

    //reset grow/shrink button, fade/materialize button
    growButton.innerHTML = initGrowButton;
    hitMaxSize = initHitMaxSize;
    hitMinSize = initHitMinSize;
    
    fadeButton.innerHTML = initFadeButton;
    hitMaxOpacity = initHitMaxOpacity;
    hitMinOpacity = initHitMinOpacity;

    //reset variables for height, width, color, opacity
    [currentHeight, currentWidth, currentColor, currentOpacity] = [
        parseInt(initHeight),
        parseInt(initWidth),
        initColor,
        parseInt(initOpacity)
    ];

    //resets text under buttons
    writeText(initSizeText, initColorText, initOpacityText, initRotationText);
}

/*--------------initial function calls--------------*/

//write inital text under buttons
writeText(initSizeText, initColorText, initOpacityText, initRotationText);
