//Module 1:

var canvas = document.getElementById('canvas');
canvas.width = window.innerWidth;
canvas.height = window.outerHeight;

class Rectangle {
    constructor(x, y, width, height, color) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
    }
}
const rectanglesArray = [];
let dragging = null;
const rectangleObject = {
    x: undefined,
    y: undefined,
    width: undefined,
    height: undefined,
    color: undefined
}
var ctx = canvas.getContext('2d');

//Code for delete/reset button to reset the canvas.

var btn = document.getElementById('btn');
btn.addEventListener('click', clear)
function clear() {
    canvas.removeEventListener('mousedown', startRect);
    canvas.removeEventListener('mousemove', stretchRect);
    canvas.removeEventListener('mouseup', finishRect);
    canvas.removeEventListener('mousedown', startToDrag);
    canvas.removeEventListener('mousemove', continueDrag);
    canvas.removeEventListener('mouseup', stopDragging);

    while (rectanglesArray.length > 0) {
        rectanglesArray.pop();
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

//Code to draw a rectangle on the canvas
var makeRect = document.getElementById('makeRect');
makeRect.addEventListener('click', function () {
    canvas.removeEventListener('mousedown', startToDrag);
    canvas.removeEventListener('mousemove', continueDrag);
    canvas.removeEventListener('mouseup', stopDragging);

    canvas.addEventListener('mousedown', startRect);
    canvas.addEventListener('mousemove', stretchRect);
    canvas.addEventListener('mouseup', finishRect);
});


function startRect(e) {

    rectangleObject.x = e.clientX - canvas.offsetLeft;
    rectangleObject.y = e.clientY - canvas.offsetTop;
    rectangleObject.width = 0;
    rectangleObject.height = 0;

    var randomColor = "rgb(" + Math.random() * 255 + "," + Math.random() * 255 + "," + Math.random() * 255 + ")";
    rectangleObject.color = randomColor;

    ctx.moveTo(rectangleObject.x, rectangleObject.y);
    dragging = true;
}
function stretchRect(e) {
    if (!dragging)                               // if this is  not done then  as soon as cursor enters the canvas a rectangle starts getting drawn
        return;
    ctx.clearRect(rectangleObject.x, rectangleObject.y, rectangleObject.width, rectangleObject.height);     // Clears the rectangle made in previous event as we continue dragging
    draw(rectanglesArray);
    rectangleObject.width = e.clientX - rectangleObject.x - canvas.offsetLeft;
    rectangleObject.height = e.clientY - rectangleObject.y - canvas.offsetTop;
    ctx.fillStyle = rectangleObject.color;
    ctx.fillRect(rectangleObject.x, rectangleObject.y, rectangleObject.width, rectangleObject.height);

}
function finishRect() {
    dragging = false;
    ctx.clearRect(rectangleObject.x, rectangleObject.y, rectangleObject.width, rectangleObject.height);      //Clears everything from the canvas

    var rectangle = new Rectangle(rectangleObject.x, rectangleObject.y, rectangleObject.width, rectangleObject.height, rectangleObject.color);    //Insert the final rectangle from mousemove event into the rectangles array 
    rectanglesArray.push(rectangle);
    draw(rectanglesArray);                       //Draw all the rectangles in the array. Rectangles drawn this way because drawing without using rectangles array  deletes a part of the previously drawn rectangle when drawing an overlapping rectangle.
}
function draw(rectanglesArray) {
    for (var i = 0; i < rectanglesArray.length; i++) {
        ctx.fillStyle = rectanglesArray[i].color;
        ctx.fillRect(rectanglesArray[i].x, rectanglesArray[i].y, rectanglesArray[i].width, rectanglesArray[i].height);
    }
}

//Module 2:


// Code to Drag and Drop a rectangle made on the canvas
const drag = {
    x: undefined,
    y: undefined
}
const mouse = {
    x: undefined,
    y: undefined
}

var dragNdrop = document.getElementById('dragNdrop');
dragNdrop.addEventListener('click', function () {
    canvas.removeEventListener('mousedown', startRect);
    canvas.removeEventListener('mousemove', stretchRect);
    canvas.removeEventListener('mouseup', finishRect);

    canvas.addEventListener('mousedown', startToDrag);
    canvas.addEventListener('mousemove', continueDrag);
    canvas.addEventListener('mouseup', stopDragging);
});
let i;
function startToDrag(e) {
    mouse.x = e.clientX - canvas.offsetLeft;
    mouse.y = e.clientY - canvas.offsetTop;
    i = checkIfInRectangle(mouse, rectanglesArray);
}
function continueDrag(e) {
    if (!dragging)
        return;
    drag.x = e.clientX - canvas.offsetLeft;
    drag.y = e.clientY - canvas.offsetTop;

    if (drag.x > mouse.x)                //mouse dragged towards right
    {
        rectanglesArray[i].x += (drag.x - mouse.x);

        if (drag.y > mouse.y)            //dragged downwards
        {
            rectanglesArray[i].y += (drag.y - mouse.y);
        }
        else if (drag.y < mouse.y)       //dragged upwards
        {
            rectanglesArray[i].y -= (mouse.y - drag.y);
        }
        else                            //neither upward nor downward
        {
            rectanglesArray[i].y += 0;
        }
    }
    else if (drag.x < mouse.x)           //mouse dragged towards left
    {
        rectanglesArray[i].x -= (mouse.x - drag.x);
        if (drag.y > mouse.y)            //dragged downwards
        {
            rectanglesArray[i].y += (drag.y - mouse.y);
        }
        else if (drag.y < mouse.y)       //dragged upwards
        {
            rectanglesArray[i].y -= (mouse.y - drag.y);
        }
        else                            //neither upward nor downward
        {
            rectanglesArray[i].y += 0;
        }
    }
    else                                //not dragged
    {
        rectanglesArray[i].x += 0;
        rectanglesArray[i].y += 0;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    draw(rectanglesArray);
    mouse.x = drag.x;
    mouse.y = drag.y;
}
function stopDragging() {
    dragging = false;
}

function checkIfInRectangle(mouse, incomingRecs) {
    for (var i = incomingRecs.length - 1; i >= 0; i--) {
        if (isInRect(mouse, incomingRecs[i])) {
            dragging = true;
            return i;
        }
    }
}
function isInRect(mouse, rec) {
    //height and width positive
    if (mouse.x > rec.x && mouse.x < (rec.width + rec.x) && mouse.y > rec.y && mouse.y < (rec.height + rec.y)) {
        return true;
    }
    //width negative and height positive
    if (mouse.x < rec.x && mouse.x > (rec.width + rec.x) && mouse.y > rec.y && mouse.y < (rec.height + rec.y)) {
        return true;
    }
    //width and height both negative
    if (mouse.x < rec.x && mouse.x > (rec.width + rec.x) && mouse.y < (rec.y) && mouse.y > (rec.height + rec.y)) {
        return true;
    }
    //width positive and height negative
    if (mouse.x > rec.x && mouse.x < (rec.width + rec.x) && mouse.y < (rec.y) && mouse.y > (rec.height + rec.y)) {
        return true;
    }
}

//Code to delete rectangles on double click

canvas.addEventListener('dblclick', getMousePosition);
function getMousePosition(e) {
    canvas.removeEventListener('mousedown', startToDrag);
    canvas.removeEventListener('mousemove', continueDrag);
    canvas.removeEventListener('mouseup', stopDragging);
    canvas.removeEventListener('mousedown', startRect);
    canvas.removeEventListener('mousemove', stretchRect);
    canvas.removeEventListener('mouseup', finishRect);

    mouse.x = e.clientX - canvas.offsetLeft;
    mouse.y = e.clientY - canvas.offsetTop;
    checkIfInRect(mouse, rectanglesArray);
}
function checkIfInRect(mouse, incomingRecs) {
    for (var i = incomingRecs.length - 1; i >= 0; i--) {
        if (isInRect(mouse, incomingRecs[i])) {
            rectanglesArray.splice(i,1);
            break;
        }
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    draw(rectanglesArray);
}