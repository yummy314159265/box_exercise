const box = document.getElementById("box");
let randomDegree = 0;
const colors = ["Orange", "Red", "Blue", "Green", "Yellow", "Purple", "Magenta", "Brown", "Violet"];
const randomizer = (range=1) => Math.floor(range * Math.random());

//Randomly grows/shrinks box or resets box size if too big/small
document.getElementById("button1").onclick = () =>  {
    //multiplies current size of the box by some random number between 0 and 2
    let randomSize = randomizer(parseInt(box.style.height)*2); 
    //if new size is greater than 500px or less than 25px, sets size to 150px x 150px
    if (randomSize > 500 || randomSize < 25) {
        randomSize = 150;
    }

    box.style.height = box.style.width = randomSize + "px";
    document.getElementById("size").innerHTML = `Size: ${randomSize}px x ${randomSize}px`;
}

//Randomly changes color of box
document.getElementById("button2").onclick = () => {    
    //chooses a color from array
    let randomColor = colors[randomizer(colors.length)];    
    //prevents same color from being chosen
    while (randomColor.toLowerCase() == box.style.backgroundColor.toLowerCase()) {
        randomColor = colors[randomizer(colors.length)];
    }

    box.style.backgroundColor = randomColor;
    document.getElementById("color").innerHTML = `Color: ${randomColor}`;
}

//Randomly changes opacity of box
document.getElementById("button3").onclick = () => {
    const randomOpacity = randomizer(100);
    box.style.opacity = randomOpacity/100;
    document.getElementById("opacity").innerHTML = `Opacity: ${randomOpacity}%`;
}

//Randomly rotates box
document.getElementById("button4").onclick = () => {
    //set random change in degrees and adds it to global variable, needed to keep box rotating clockwise
    randomDegree += randomizer(180);
    box.style.transform = `rotate(${randomDegree}deg)`;
    document.getElementById("rotation").innerHTML = `Rotation: ${randomDegree%360}°`;
}

//Randomizes every element
document.getElementById("button5").onclick = () => {
    for (let i = 1; i < 5; i++) {document.getElementById(`button${i}`).onclick()}
}

//Resets box to initial values
document.getElementById("button6").onclick = () => {
    const resetDegree = () => randomDegree -= randomDegree%360;
    box.style = `
        height:150px; 
        width:150px; 
        background-color:Orange; 
        margin:100px 25px 110px 100px; 
        transition:all 1.25s; 
        transform:rotate(${resetDegree()}deg)
    `;
    document.getElementById("size").innerHTML = "Size: 150px x 150px";
    document.getElementById("color").innerHTML = "Color: Orange";
    document.getElementById("opacity").innerHTML = "Opacity: 100%";
    document.getElementById("rotation").innerHTML = "Rotation: 0°";
}