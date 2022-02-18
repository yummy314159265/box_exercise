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
    box.height,
    box.width,
    box.backgroundColor,
    box.opacity || 1,
    parseInt(box.transform.match(/\-?(\d+\.?\d*|\d*\.?\d+)deg/)) || 0
];

/*-----------variables for grow/shrink button----------*/
let hitMaxSize = false;
let hitMinSize = true;
let currentHeight = parseInt(initHeight);
let currentWidth = parseInt(initWidth);
let currentSize = [Math.max(currentHeight, currentWidth), Math.min(currentHeight, currentWidth)]
let maxSize = Math.max(900, ...currentSize);
let minSize = Math.min(50, ...currentSize);
let sideRatio = currentSize[0]/currentSize[1];
const growthRate = 2;   

//if initial height or initial width is maxSize
if (currentSize[0] == maxSize) {
    hitMaxSize = true;
    hitMinSize = false;
    growButton.innerHTML = "Shrink";
} else {
    growButton.innerHTML = "Grow";
}

//for resetting button
const initHitMaxSize = hitMaxSize;
const initHitMinSize = hitMinSize;

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
if (!colors.includes(initColor)){
    colors.unshift(initColor);
}

/*--------variables for fade/materialize button--------*/
let currentOpacity = parseInt(initOpacity);
let hitMaxOpacity = true;
let hitMinOpacity = false;
let maxOpacity = Math.max(1, currentOpacity);
let minOpacity = Math.min(.01, currentOpacity);
const fadeRate = Math.round((maxOpacity-minOpacity)*100)/333

//if initial opacity is minOpacity
if (currentOpacity== minOpacity) {
    hitMaxOpacity = false;
    hitMinOpacity = true;
    fadeButton.innerHTML = "Materialize";
} else {
    fadeButton.innerHTML = "Fade";
}

//for resetting button
const initHitMaxOpacity = hitMaxOpacity;
const initHitMinOpacity = hitMinOpacity;

/*-------------variables for spin button---------------*/
let currentDegree = initRotation;
let startDegree = currentDegree;
let resetPosition = initRotation % 360;

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
    `${(currentHeight)} x ${(currentWidth)}`,
    `${initColor}`,
    `${initOpacity * 100}%`,
    `${initRotation % (360/n)}&deg`,
    growButton.innerHTML,
    fadeButton.innerHTML
];


/*--------------------functions-----------------------*/

//multiplies box size by growthRate then limits size of box to maxSize and minSize
const addToCurrentSize = (rate, bigSide = Math.max(currentHeight, currentWidth), littleSide = Math.min(currentHeight, currentWidth)) => {

    if (!hitMaxSize) {
            
        bigSide *= rate;
        
        if (bigSide >= maxSize) {
            bigSide = maxSize * rate;
            hitMaxSize = true;
            hitMinSize = false;
            growButton.innerHTML = "Shrink";
        }

        littleSide = Math.round(bigSide / sideRatio);
    }

    if (!hitMinSize) {

        littleSide /= rate;
            
        if (littleSide <= minSize) {
            littleSide = minSize;
            hitMinSize = true;
            hitMaxSize = false;
            growButton.innerHTML = "Grow";            
        }

        bigSide = Math.round(littleSide * sideRatio);
    }

    return [bigSide, littleSide]
}

//adds fadeRate to opacity then limits opacity to maxOpacity and minOpacity
const addToCurrentOpacity = (rate, opacity = currentOpacity) => {

    if (!hitMaxOpacity) {
        opacity = Math.round((opacity + rate)*100)/100;
        if(opacity >= maxOpacity) {
            opacity = maxOpacity + rate;
            hitMaxOpacity = true;
            hitMinOpacity = false;
            fadeButton.innerHTML = "Fade";
        }
    }

    if (!hitMinOpacity) {
        opacity = Math.round((opacity - rate)*100)/100;
        if(opacity <= minOpacity) {
            opacity = minOpacity;
            hitMinOpacity = true;
            hitMaxOpacity = false;
            fadeButton.innerHTML = "Materialize";
        }
    }

    return opacity;
}

//display readable text for opacity
const opacityTextNum = () => Math.round(currentOpacity*100);

//resets rotation to closest point of rotational symmetry
const resetDegree = () => {
    currentDegree -= (currentDegree - initRotation) % (360/n);
    resetPosition = currentDegree % 360;
    return currentDegree;
}

//display correct text for rotation
const rotationTextNum = (degrees) => ((initRotation%(360/n) + degrees - resetPosition)%360)

const animateRotationText = (start, end) => {
    let current = start;
    const countRange = end - start;
    const duration = 1250;
    const stepTime = Math.floor(duration / countRange);
    const timer = setInterval(() => {
        current += 1;
        rotationText.innerHTML = `${rotationTextNum(current)}&deg`;
        if (current == end) {
            clearInterval(timer);
        }
    }, stepTime);
}

//make random integers 
const randomizer = (range = 1, min = 0) => Math.round(range * Math.random()) + min;

//write the text under buttons
const writeText = (thisSizeText, thisColorText, thisOpacityText, thisRotationText) => {
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

    currentSize = addToCurrentSize(growthRate);

    if (currentHeight >= currentWidth) {
        [currentHeight, currentWidth] = currentSize;
    } else {
        [currentWidth, currentHeight] = currentSize;
    }

    box.height = Math.round(currentHeight) + "px";
    box.width = Math.round(currentWidth) + "px";
    sizeText.innerHTML = `${Math.round(currentHeight)} x ${Math.round(currentWidth)}`;
}


//color button
document.getElementById("button2").onclick = () => {

    if (colors.indexOf(box.backgroundColor) < (colors.length-1)) {
        currentColor = colors[colors.indexOf(box.backgroundColor)+1];
    } else {
        currentColor = colors[0];
    }

    box.backgroundColor = colorText.style.color = currentColor;
    colorText.innerHTML = `${currentColor}`;
}


//fade/materialize button
document.getElementById("button3").onclick = () => {
    
    currentOpacity = addToCurrentOpacity(fadeRate);

    box.opacity = currentOpacity;
    opacityText.innerHTML = `${opacityTextNum()}%`
}


//spin button
document.getElementById("button4").onclick = () => {

    startDegree = currentDegree;
    currentDegree += randomizer(180, 180);
    
    box.transform = `rotate(${currentDegree}deg)`; 
    animateRotationText(startDegree, currentDegree);
}


//randomize all button
document.getElementById("button5").onclick = () => {

    //randomizes box size
    const randomSize = randomizer(maxSize-minSize, minSize);
    currentSize = [randomSize, Math.round(randomSize/sideRatio)];

    if (currentHeight >= currentWidth) {
        [currentHeight, currentWidth] = currentSize;
    } else {
        [currentWidth, currentHeight] = currentSize;
    }

    //randomizes color
    currentColor = colors[randomizer(colors.length-1)];
    //prevents same color from being chosen
    if (currentColor == box.backgroundColor) {
        currentColor = colors[colors.indexOf(currentColor)+1] || colors[0];
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
    ];

    //writes text under buttons
    writeText(`${currentHeight} x ${currentWidth}`, `${currentColor}`, `${opacityTextNum()}%`, `${rotationTextNum(currentDegree)}&deg`);
    colorText.style.color = currentColor;
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
    let start = currentDegree;
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
    colorText.style.color = initColor;
}

/*--------------initial function calls--------------*/

//write inital text under buttons
writeText(initSizeText, initColorText, initOpacityText, initRotationText);
