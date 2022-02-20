/*------------make style declarations readable-----------*/
const [box, sizeText, colorText, opacityText, rotationText, growButton, fadeButton, colorButton] = [
    document.getElementById("box").style,
    document.getElementById("size"),
    document.getElementById("color"),
    document.getElementById("opacity"),
    document.getElementById("rotation"),
    document.getElementById("button1"),
    document.getElementById("button3"),
    document.getElementById("button2")
];

/*----------------initial box values--------------------*/
const [initHeight, initWidth, initColor, initOpacity, initRotation] = [
    parseInt(box.height),
    parseInt(box.width),
    box.backgroundColor,
    parseInt(box.opacity) || 1,
    parseInt(box.transform.match(/\-?(\d+\.?\d*|\d*\.?\d+)deg/)) || 0
];

/*-----------variables for grow/shrink button----------*/
let growing;
let currentHeight = initHeight;
let currentWidth = initWidth;
let currentSize = [Math.max(initHeight, initWidth), Math.min(initHeight, initWidth)];
let maxSize = Math.max(900, ...currentSize);
let minSize = Math.min(50, ...currentSize);
let sideRatio = currentSize[0] / currentSize[1];
const growthRate = 2;

//if initial height or initial width is maxSize
if (currentSize[0] == maxSize) {
    growing = false;
    growButton.innerHTML = "Shrink";
} else {
    growing = true;
    growButton.innerHTML = "Grow";
}

//for resetting button
const initGrowing = growing;

/*--------------variables for color button-------------*/
let currentColor = initColor;
colorText.style.color = initColor;

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
if (!colors.includes(initColor)) {
    colors.unshift(initColor);
}

/*--------variables for fade/materialize button--------*/
let fading;
let currentOpacity = initOpacity;
let maxOpacity = Math.max(1, currentOpacity);
let minOpacity = Math.min(.01, currentOpacity);
const fadeRate = Math.round((maxOpacity - minOpacity)*100)/300

//if initial opacity is minOpacity
if (currentOpacity == minOpacity) {
    fading = false;
    fadeButton.innerHTML = "Materialize";
} else {
    fading = true;
    fadeButton.innerHTML = "Fade";
}

//for resetting button
const initFading = fading;

/*-------------variables for spin button---------------*/
let currentDegree = initRotation;
let startDegree = currentDegree;
let resetPosition = initRotation % 360;
let timer;

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
    `${initHeight.toString().padStart(3)} x ${initWidth.toString().padEnd(3)}`,
    `${initColor}`,
    `${initOpacity * 100}%`,
    `${initRotation % (360 / n)}&deg`,
    growButton.innerHTML,
    fadeButton.innerHTML
];


/*--------------------functions-----------------------*/
//sets sides correctly for box size
function setSides(sizeArr) {
    if (currentHeight >= currentWidth) {
        [currentHeight, currentWidth] = sizeArr;
    } else {
        [currentWidth, currentHeight] = sizeArr;
    }
    return;
}

//fix rotation number for display
function rotationTextNum(degree){
    return (initRotation % (360 / n) + degree - resetPosition) % 360
}

//displays animated counter for rotation
function animateRotationText(start, end) {

    if (start === end) return;
    let current = start;
    const countRange = end - start;
    const stepTime = Math.floor(1250 / countRange);

    timer = setInterval(() => {
        current += 1;
        rotationText.innerHTML = `${rotationTextNum(current)}&deg`;
        if (current == end) {
            clearInterval(timer);
        }
    }, stepTime);
    return;
}

//stops rotation text from animating
function clearTimer(){
    if (timer != undefined) {
        clearInterval(timer);
    }
    return;
}

//make random integers 
function randomizer(range = 1, min = 0){
    return Math.round(range * Math.random()) + min;
}

//write the text under buttons
function writeText(thisSizeText, thisColorText, thisOpacityText, thisRotationText = `${rotationTextNum(startDegree)}&deg`){
    [sizeText.innerHTML, colorText.innerHTML, opacityText.innerHTML, rotationText.innerHTML] = [
        thisSizeText,
        thisColorText,
        thisOpacityText,
        thisRotationText
    ];
    return;
};

/*-------------------on click events-------------------*/

//grow/shrink button
document.getElementById("button1").onclick = () => {

    if (growing) {

        currentSize[0] *= growthRate;

        if (currentSize[0] >= maxSize) {
            currentSize[0] = maxSize;
            growing = false;
            growButton.innerHTML = "Shrink";
        }

        currentSize[1] = Math.round(currentSize[0] / sideRatio);
    
    } else {

        currentSize[1] /= growthRate;

        if (currentSize[1] <= minSize) {
            currentSize[1] = minSize;
            growing = true;
            growButton.innerHTML = "Grow";
        }

        currentSize[0] = Math.round(currentSize[1] * sideRatio);
    }

    setSides(currentSize);

    box.height = Math.round(currentHeight) + "px";
    box.width = Math.round(currentWidth) + "px";
    sizeText.innerHTML = `${Math.round(currentHeight).toString().padStart(3)} x ${Math.round(currentWidth).toString().padEnd(3)}`;
}


//color button
document.getElementById("button2").onclick = () => {

    if (colors.indexOf(box.backgroundColor) < (colors.length - 1)) {
        currentColor = colors[colors.indexOf(box.backgroundColor) + 1];
    } else {
        currentColor = colors[0];
    }

    box.backgroundColor = colorText.style.color = currentColor;
    colorText.innerHTML = `${currentColor}`;
}


//fade/materialize button
document.getElementById("button3").onclick = () => {

    if (fading) {

        currentOpacity = currentOpacity - fadeRate;
        
        if (currentOpacity <= minOpacity) {
            currentOpacity = minOpacity;
            fading = false;
            fadeButton.innerHTML = "Materialize";
        }

    } else {
        
        currentOpacity = currentOpacity + fadeRate;
        
        if (currentOpacity >= maxOpacity) {
            currentOpacity = maxOpacity;
            fading = true;
            fadeButton.innerHTML = "Fade";
        }
    }

    box.opacity = currentOpacity;
    opacityText.innerHTML = `${Math.round(currentOpacity * 100)}%`
}


//spin button
document.getElementById("button4").onclick = () => {
    
    clearTimer();

    startDegree = currentDegree;
    currentDegree += randomizer(180, 180);

    box.transform = `rotate(${currentDegree}deg)`;
    animateRotationText(startDegree, currentDegree);
}


//randomize all button
document.getElementById("button5").onclick = () => {

    clearTimer();
    
    //randomizes box size
    const randomSize = randomizer((maxSize - minSize), minSize);
    currentSize = [randomSize, Math.round(randomSize / sideRatio)];
    setSides(currentSize);

    //randomizes color
    currentColor = colors[randomizer(colors.length - 1)];
    //prevents same color from being chosen
    if (currentColor == box.backgroundColor) {
        currentColor = colors[colors.indexOf(currentColor) + 1] || colors[0];
    }

    //randomizes opacity
    currentOpacity = randomizer((maxOpacity - minOpacity) * 100, minOpacity * 100) / 100;

    //randomizes rotation
    startDegree = currentDegree;
    currentDegree += randomizer(360);

    //set box properties
    [box.height, box.width, box.backgroundColor, box.opacity, box.transform] = [
        currentHeight + "px",
        currentWidth + "px",
        currentColor,
        currentOpacity,
        `rotate(${currentDegree}deg)`
    ];

    //writes text under buttons
    writeText(`${currentHeight.toString().padStart(3)} x ${currentWidth.toString().padEnd(3)}`, `${currentColor}`, `${Math.round(currentOpacity * 100)}%`);
    animateRotationText(startDegree, currentDegree);
    colorText.style.color = currentColor;
}


//reset button
document.getElementById("button6").onclick = () => {
    
    clearTimer();

    //reset height, width, color, opacity
    [box.height, box.width, box.backgroundColor, box.opacity] = [
        `${initHeight}px`,
        `${initWidth}px`,
        initColor,
        initOpacity
    ];

    //reset rotation
    currentDegree -= (currentDegree - initRotation) % (360 / n);
    resetPosition = currentDegree % 360;
    box.transform = `rotate(${currentDegree}deg)`;

    //reset grow/shrink button, fade/materialize button
    growButton.innerHTML = initGrowButton;
    growing = initGrowing;

    fadeButton.innerHTML = initFadeButton;
    fading = initFading;

    //reset variables for height, width, color, opacity
    [currentHeight, currentWidth, currentColor, currentOpacity] = [
        initHeight,
        initWidth,
        initColor,
        initOpacity
    ];

    currentSize = [Math.max(currentHeight, currentWidth), Math.min(currentHeight, currentWidth)];

    //resets text under buttons
    writeText(initSizeText, initColorText, initOpacityText, initRotationText);
    colorText.style.color = initColor;
}

/*--------------initial function calls--------------*/

//write inital text under buttons
writeText(initSizeText, initColorText, initOpacityText, initRotationText);
