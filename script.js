var Clicked = "";
var prevX;
var prevY;
var controlPoint1 = null;
var controlPoint2 = null;
var isDrawingCurve = false;
var isClipping = false;
var clipRect = { x: 0, y: 0, width: 0, height: 0 };
var offsetX = 0;
var offsetY = 0;
let isClippingMove = false;
let mouseX, mouseY;

document.addEventListener("DOMContentLoaded", () => {
    draw();
    count = 0;

    const canvas2 = document.getElementById("canvas2");
    const ctx2 = canvas2.getContext("2d");

    canvas2.addEventListener("mousedown", (e) => {
        if (Clicked === "Clipping") {
            var x = e.clientX - canvas2.getBoundingClientRect().left;
            var y = e.clientY - canvas2.getBoundingClientRect().top;
            prevX = x;
            prevY = y;
            ctx2.fillStyle = "black";
            ctx2.fillRect(x, y, 1, 1);
        //} else if (Clicked === "ClippingMove") {
            isClippingMove = true;
            offsetX = mouseX - clipRect.x;
            offsetY = mouseY - clipRect.y;
        }
    });

    canvas2.addEventListener("mousemove", (e) => {
        if (isClippingMove) {
            mouseX = e.clientX - canvas2.getBoundingClientRect().left;
            mouseY = e.clientY - canvas2.getBoundingClientRect().top;
            const dx = mouseX - clipRect.x;
            const dy = mouseY - clipRect.y;

            moveClippedRegion(dx, dy);
            drawClippingRegion();
        }
    });

    canvas2.addEventListener("mouseup", (e) => {
        if (Clicked === "Clipping") {
            var x = e.clientX - canvas2.getBoundingClientRect().left;
            var y = e.clientY - canvas2.getBoundingClientRect().top;
            ctx2.fillStyle = "black";
            ctx2.fillRect(x, y, 1, 1);
            for (var i = Math.min(prevX, x); i < Math.max(prevX, x); i++) {
                ctx2.fillRect(i, prevY, 1, 1);
            }
            for (var i = Math.min(prevY, y); i < Math.max(prevY, y); i++) {
                ctx2.fillRect(x, i, 1, 1);
            }
            for (var i = Math.min(prevY, y); i < Math.max(prevY, y); i++) {
                ctx2.fillRect(prevX, i, 1, 1);
            }
            for (var i = Math.min(prevX, x); i < Math.max(prevX, x); i++) {
                ctx2.fillRect(i, y, 1, 1);
            }
            ctx2.clearRect(0, 0, Math.min(prevX, x), 1000);
            ctx2.clearRect(0, 0, 1000, Math.min(prevY, y));
            ctx2.clearRect(Math.max(prevX, x) + 2, Math.min(prevY, y), 1000, 1000);
            ctx2.clearRect(0, Math.max(prevY, y) + 2, 1000, 1000);
        //} else if (Clicked === "ClippingMove") {
            isClippingMove = true;
        }
    });

    canvas2.addEventListener("click", (e) => {
        var x = e.clientX - canvas2.getBoundingClientRect().left;
        var y = e.clientY - canvas2.getBoundingClientRect().top;

        if (Clicked === "Cursor") {

        } else if (Clicked === "Dot") {
            ctx2.fillStyle = "black";
            ctx2.fillRect(x, y, 1, 1);
        } else if (Clicked === "Point") {
            ctx2.fillStyle = "black";
            ctx2.fillRect(x, y, 1, 1);
            ctx2.fillText("(" + Math.round(x - 506) + "," + Math.round(346 - y) + ")", x - 4, y - 4);
        } else if (Clicked === "Line Segment") {
            ctx2.fillText("(" + Math.round(x - 506) + "," + Math.round(346 - y) + ")", x - 4, y - 4);
            if (count === 0) {
                prevX = x;
                prevY = y;
                count++;
            } else {
                lineSegment(prevX, prevY, x, y);
                count = 0;
            }
        } else if (Clicked === "DDA") {
            ctx2.fillText("(" + Math.round(x - 506) + "," + Math.round(346 - y) + ")", x - 4, y - 4);
            if (count === 0) {
                prevX = x;
                prevY = y;
                count++;
            } else {
                DDA(prevX, prevY, x, y);
                count = 0;
            }
        } else if (Clicked === "Bresenham") {
            ctx2.fillText("(" + Math.round(x - 506) + "," + Math.round(346 - y) + ")", x - 4, y - 4);
            if (count === 0) {
                prevX = x;
                prevY = y;
                count++;
            } else {
                Bresenham(prevX, prevY, x, y);
                count = 0;
            }
        } else if (Clicked === "Circle") {
            ctx2.fillText("(" + Math.round(x - 506) + "," + Math.round(346 - y) + ")", x - 4, y - 4);
            if (count === 0) {
                prevX = x;
                prevY = y;
                count++;
            } else {
                drawCircle(prevX, prevY, Math.sqrt(Math.pow(x - prevX, 2) + Math.pow(y - prevY, 2)));
                count = 0;
            }
        } else if (Clicked === "Ellipse") {
            ctx2.fillText("(" + Math.round(x - 506) + "," + Math.round(346 - y) + ")", x - 4, y - 4);
            if (count === 0) {
                prevX = x;
                prevY = y;
                count++;
            } else {
                drawEllipse(prevX, prevY, x, y);
                count = 0;
            }
        } else if (Clicked === "Bezier") {
            ctx2.fillText("(" + Math.round(x - 506) + "," + Math.round(346 - y) + ")", x - 4, y - 4);
            if (count === 0) {
                prevX = x;
                prevY = y;
                count++;
            } else {
                if (controlPoint1 === null) {
                    controlPoint1 = { x: x, y: y };
                } else {
                    controlPoint2 = { x: x, y: y };

                    drawBezierCurve(
                        prevX,
                        prevY,
                        controlPoint1.x,
                        controlPoint1.y,
                        controlPoint2.x,
                        controlPoint2.y,
                        x,
                        y
                    );

                    controlPoint1 = null;
                    controlPoint2 = null;
                    isDrawingCurve = false;
                }
                count = 0;
            }
        } else if (Clicked === "ClippingMove") {}
    });
});

function handleClicked(e) {
    console.log("clicked", e);
    document.getElementById("selected").innerHTML = "Selected:" + e;
    Clicked = e;
    const canvas2 = document.getElementById("canvas2");
    const ctx2 = canvas2.getContext("2d");
    if (e === "Clear") {
        ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
        isClippingMove = false;
    } else if (e === "ClippingMove") {
        isClippingMove = true;
    }
}

function handleCanvasClick(e) {
    var x = e.clientX - canvas2.getBoundingClientRect().left;
    var y = e.clientY - canvas2.getBoundingClientRect().top;

    if (!isDrawingCurve) {
        ctx2.fillStyle = "black";
        ctx2.fillRect(x, y, 1, 1);
        controlPoint1 = { x: x, y: y };
        isDrawingCurve = true;
    } else {
        ctx2.fillStyle = "black";
        ctx2.fillRect(x, y, 1, 1);
        controlPoint2 = { x: x, y: y };

        drawBezierCurve(
            prevX,
            prevY,
            controlPoint1.x,
            controlPoint1.y,
            controlPoint2.x,
            controlPoint2.y,
            x,
            y
        );

        controlPoint1 = null;
        controlPoint2 = null;
        isDrawingCurve = false;
    }
}

function drawBezierCurve(x0, y0, x1, y1, x2, y2, x3, y3) {
    const canvas2 = document.getElementById("canvas2");
    const ctx2 = canvas2.getContext("2d");

    const numberOfPoints = 1000;
    for (let i = 0; i <= numberOfPoints; i++) {
        const t = i / numberOfPoints;
        const x = Math.pow(1 - t, 3) * x0 + 3 * Math.pow(1 - t, 2) * t * x1 + 3 * (1 - t) * t * t * x2 + Math.pow(t, 3) * x3;
        const y = Math.pow(1 - t, 3) * y0 + 3 * Math.pow(1 - t, 2) * t * y1 + 3 * (1 - t) * t * t * y2 + Math.pow(t, 3) * y3;

        ctx2.fillRect(Math.round(x), Math.round(y), 1, 1);
    }
}

function draw() {
    var canvas1 = document.getElementById('canvas1');
    var canvas2 = document.getElementById('canvas2');
    if (!canvas1.getContext) {
        return;
    }

    //---SETTINGS FOR CANVAS---
    const ctx = canvas1.getContext('2d');
    ctx.fillStyle = "black";
    ctx.lineWidth = 1;
    // x line
    ctx.beginPath();
    ctx.moveTo(5, 346);
    ctx.lineTo(1006, 346);
    ctx.stroke();
    // y line
    ctx.beginPath();
    ctx.moveTo(506, 5);
    ctx.lineTo(506, 686);
    ctx.stroke();

    // split into every 20 px x line 
    ctx.font = "7px Arial";
    for (let i = 1; i <= 1001; i += 20) {
        ctx.fillRect(i + 5, 342, 1, 5);
        ctx.fillText(`${i - 501}`, i, 357);
    }
    ctx.font = "15px Arial";
    ctx.fillText(`X`, 1005, 340);
    ctx.font = "7px Arial";
    // split into every 30 px y line 
    for (let i = 1; i <= 681; i += 20) {
        ctx.fillRect(504, i + 5, 5, 1);
        ctx.fillText(`${341 - i}`, 510, i + 5);
    }
    ctx.font = "15px Arial";
    ctx.fillText(`Y`, 490, 690);
    //---END SETTINGS FOR CANVAS---
}

// Dropdown
function myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
}

window.onclick = function (event) {
    if (!event.target.matches('.dropbtn')) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
};

function myFunction1() {
    document.getElementById("my2Dropdown").classList.toggle("show");
}

// Corrected combined window.onclick
window.onclick = function (event) {
    if (!event.target.matches('.dropbtn')) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
};

//DDA ALGORITHM
function DDA(x0, y0, x1, y1) {
    const canvas2 = document.getElementById("canvas2");
    const ctx2 = canvas2.getContext('2d');
    const dx = x1 - x0;
    const dy = y1 - y0;
    const length = Math.max(Math.abs(dx), Math.abs(dy));
    const xinc = dx / length;
    const yinc = dy / length;

    for (var i = 1; i <= length; i++) {
        ctx2.fillRect(Math.round(x0), Math.round(y0), 1, 1);
        x0 += xinc;
        y0 += yinc;
    }
}


//Line Segment
function lineSegment(x0,y0,x1,y1){
    var dx=x1-x0;var dy=y1-y0;var m=dy/dx;var b = y0-m*x0;
    var canvas2=document.getElementById("canvas2")
    var ctx2 = canvas2.getContext('2d');
    console.log("m",m)
    console.log("b",b)
    console.log("x0:",x0)
    console.log("y0:",y0)
    console.log("x1:",x1)
    console.log("y1:",y1)
    if(m==Infinity || m==-Infinity){
        if(y0>y1){
            for(var i=y1;i<=y0;i++){
                ctx2.fillRect(Math.round(x0),Math.round(i),1,1)
            }
        }
        else{
            for(var i=y0;i<=y1;i++){
                ctx2.fillRect(Math.round(x0),Math.round(i),1,1)
            }
        }
    }
    if(dx>0){
        dx=1;
        for(var i=x0;i<=x1;i+=dx){
            ctx2.fillRect(i,Math.round(y0),1,1)
            y0=m*i+b;
        }
    }
    else{
        dx=-1;
        for(var i=x0;i>=x1;i+=dx){
            ctx2.fillRect(i,Math.round(y0),1,1)
            y0=m*i+b;
        }
    }
}

//Bresenham ALGORITHM
function Bresenham(x0, y0, x1, y1) {
    var x = x0;
    var y = y0;
    var dx = Math.abs(x1 - x0);
    var dy = Math.abs(y1 - y0);
    var sx = (x0 < x1) ? 1 : -1;
    var sy = (y0 < y1) ? 1 : -1;
    var err = dx - dy;

    const canvas2 = document.getElementById("canvas2");
    const ctx2 = canvas2.getContext("2d");

    while (true) {
        ctx2.fillRect(x, y, 1, 1);

        if ((x === x1) && (y === y1)) {
            break;
        }

        var e2 = 2 * err;
        if (e2 > -dy) {
            err -= dy;
            x += sx;
        }
        if (e2 < dx) {
            err += dx;
            y += sy;
        }
    }
}
// Circle Drawing Algorithm (Midpoint Circle Algorithm)
function drawCircle(xc, yc, radius) {
    const canvas2 = document.getElementById("canvas2");
    const ctx2 = canvas2.getContext("2d");
    let x = radius;
    let y = 0;
    let decisionOver2 = 1 - x; // Decision criterion divided by 2 evaluated at x=r, y=0

    while (y <= x) {
        ctx2.fillRect(xc + x, yc - y, 1, 1);
        ctx2.fillRect(xc - x, yc - y, 1, 1);
        ctx2.fillRect(xc + x, yc + y, 1, 1);
        ctx2.fillRect(xc - x, yc + y, 1, 1);
        ctx2.fillRect(xc + y, yc - x, 1, 1);
        ctx2.fillRect(xc - y, yc - x, 1, 1);
        ctx2.fillRect(xc + y, yc + x, 1, 1);
        ctx2.fillRect(xc - y, yc + x, 1, 1);

        y++;
        if (decisionOver2 <= 0) {
            decisionOver2 += 2 * y + 1; // Change in decision criterion for y -> y+1
        } else {
            x--;
            decisionOver2 += 2 * (y - x) + 1; // Change for y -> y+1, x -> x-1
        }
    }
}

// Ellipse Drawing Algorithm (Midpoint Ellipse Algorithm)
function drawEllipse(xc, yc, a, b) {
    const canvas2 = document.getElementById("canvas2");
    const ctx2 = canvas2.getContext("2d");
    let x = 0;
    let y = b;
    let d1 = b * b - a * a * b + a * a / 4;
    ctx2.fillRect(xc + x, yc - y, 1, 1);
    ctx2.fillRect(xc - x, yc - y, 1, 1);

    while (a * a * (y - 0.5) > b * b * (x + 1)) {
        if (d1 < 0) {
            d1 = d1 + b * b * (2 * x + 3);
            x++;
        } else {
            d1 = d1 + b * b * (2 * x + 3) + a * a * (-2 * y + 2);
            x++;
            y--;
        }
        ctx2.fillRect(xc + x, yc - y, 1, 1);
        ctx2.fillRect(xc - x, yc - y, 1, 1);
        ctx2.fillRect(xc + x, yc + y, 1, 1);
        ctx2.fillRect(xc - x, yc + y, 1, 1);
    }

    let d2 = b * b * (x + 0.5) * (x + 0.5) + a * a * (y - 1) * (y - 1) - a * a * b * b;
    while (y > 0) {
        if (d2 < 0) {
            d2 = d2 + b * b * (2 * x + 2) + a * a * (-2 * y + 3);
            x++;
            y--;
        } else {
            d2 = d2 + a * a * (-2 * y + 3);
            y--;
        }
        ctx2.fillRect(xc + x, yc - y, 1, 1);
        ctx2.fillRect(xc - x, yc - y, 1, 1);
        ctx2.fillRect(xc + x, yc + y, 1, 1);
        ctx2.fillRect(xc - x, yc + y, 1, 1);
    }
}
function moveClippedRegion(dx, dy) {
    const canvas2 = document.getElementById("canvas2");
    const ctx2 = canvas2.getContext("2d");

    // Klipleme bölgesindeki tüm noktaları taşı
    const imageData = ctx2.getImageData(clipRect.x, clipRect.y, clipRect.width, clipRect.height);
    ctx2.clearRect(clipRect.x, clipRect.y, clipRect.width, clipRect.height);

    // Yeni konumları hesapla
    clipRect.x += dx;
    clipRect.y += dy;

    // Yeni konumda işaretlenen bölgeyi çiz
    ctx2.putImageData(imageData, clipRect.x, clipRect.y);
}
function drawClippingRegion() {
    const canvas2 = document.getElementById("canvas2");
    const ctx2 = canvas2.getContext("2d");

    ctx2.strokeRect(clipRect.x, clipRect.y, clipRect.width, clipRect.height);
}
