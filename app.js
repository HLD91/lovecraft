particlesJS(
    {
    "particles": {
      "number": {
        "value": 100,
        "density": {
          "enable": true,
          "value_area": 800
        }
      },
      "color": {
        "value": "#000000"
      },
      "shape": {
        "type": "circle",
        "stroke": {
          "width": 0,
          "color": "#000000"
        },
        "polygon": {
          "nb_sides": 5
        },
        "image": {
          "src": "img/github.svg",
          "width": 100,
          "height": 100
        }
      },
      "opacity": {
        "value": 0.5,
        "random": true,
        "anim": {
          "enable": false,
          "speed": 1,
          "opacity_min": 0.1,
          "sync": false
        }
      },
      "size": {
        "value": 3,
        "random": true,
        "anim": {
          "enable": true,
          "speed": 20,
          "size_min": 0.1,
          "sync": false
        }
      },
      "line_linked": {
        "enable": true,
        "distance": 150,
        "color": "#000000",
        "opacity": 0.4,
        "width": 1
      },
      "move": {
        "enable": true,
        "speed": 6,
        "direction": "none",
        "random": true,
        "straight": false,
        "out_mode": "out",
        "bounce": false,
        "attract": {
          "enable": true,
          "rotateX": 600,
          "rotateY": 1200
        }
      }
    },
    "interactivity": {
      "detect_on": "canvas",
      "events": {
        "onhover": {
          "enable": true,
          "mode": "repulse"
        },
        "onclick": {
          "enable": false,
          "mode": "push"
        },
        "resize": true
      },
      "modes": {
        "grab": {
          "distance": 400,
          "line_linked": {
            "opacity": 1
          }
        },
        "bubble": {
          "distance": 400,
          "size": 40,
          "duration": 2,
          "opacity": 8,
          "speed": 3
        },
        "repulse": {
          "distance": 200,
          "duration": 0.4
        },
        "push": {
          "particles_nb": 4
        },
        "remove": {
          "particles_nb": 2
        }
      }
    },
    "retina_detect": true
  }
  )

  var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
var mask;

var pointCount = 500;
var str = "necronomicon";
var fontStr = "bold 128pt Helvetica Neue, Helvetica, Arial, sans-serif";

ctx.font = fontStr;
ctx.textAlign = "center";
c.width = ctx.measureText(str).width;
c.height = 128; // Set to font size

var whitePixels = [];
var points = [];
var point = function(x,y,vx,vy){
  this.x = x;
  this.y = y;
  this.vx = vx || 1;
  this.vy = vy || 1;
}
point.prototype.update = function() {
  ctx.beginPath();
  ctx.fillStyle = "#95a5a6";
  ctx.arc(this.x,this.y,1,0,2*Math.PI);
  ctx.fill();
  ctx.closePath();
  
  // Change direction if running into black pixel
  if (this.x+this.vx >= c.width || this.x+this.vx < 0 || mask.data[coordsToI(this.x+this.vx, this.y, mask.width)] != 255) {
    this.vx *= -1;
    this.x += this.vx*2;
  }
  if (this.y+this.vy >= c.height || this.y+this.vy < 0 || mask.data[coordsToI(this.x, this.y+this.vy, mask.width)] != 255) {
    this.vy *= -1;
    this.y += this.vy*2;
  }
  
  for (var k = 0, m = points.length; k<m; k++) {
    if (points[k]===this) continue;
    
    var d = Math.sqrt(Math.pow(this.x-points[k].x,2)+Math.pow(this.y-points[k].y,2));
    if (d < 5) {
      ctx.lineWidth = .2;
      ctx.beginPath();
      ctx.moveTo(this.x,this.y);
      ctx.lineTo(points[k].x,points[k].y);
      ctx.stroke();
    }
    if (d < 20) {
      ctx.lineWidth = .1;
      ctx.beginPath();
      ctx.moveTo(this.x,this.y);
      ctx.lineTo(points[k].x,points[k].y);
      ctx.stroke();
    }
  }
  
  this.x += this.vx;
  this.y += this.vy;
}

function loop() {
  ctx.clearRect(0,0,c.width,c.height);
  for (var k = 0, m = points.length; k < m; k++) {
    points[k].update();
  }
}

function init() {
  // Draw text
  ctx.beginPath();
  ctx.fillStyle = "#000";
  ctx.rect(0,0,c.width,c.height);
  ctx.fill();
  ctx.font = fontStr;
  ctx.textAlign = "left";
  ctx.fillStyle = "#fff";
  ctx.fillText(str,0,c.height/2+(c.height / 2));
  ctx.closePath();
  
  // Save mask
  mask = ctx.getImageData(0,0,c.width,c.height);
  
  // Draw background
  ctx.clearRect(0,0,c.width,c.height);
  
  // Save all white pixels in an array
  for (var i = 0; i < mask.data.length; i += 4) {
    if (mask.data[i] == 255 && mask.data[i+1] == 255 && mask.data[i+2] == 255 && mask.data[i+3] == 255) {
      whitePixels.push([iToX(i,mask.width),iToY(i,mask.width)]);
    }
  }
  
  for (var k = 0; k < pointCount; k++) {
    addPoint();
  }
}

function addPoint() {
  var spawn = whitePixels[Math.floor(Math.random()*whitePixels.length)];
  
  var p = new point(spawn[0],spawn[1], Math.floor(Math.random()*2-1), Math.floor(Math.random()*2-1));
  points.push(p);
}

function iToX(i,w) {
  return ((i%(4*w))/4);
}
function iToY(i,w) {
  return (Math.floor(i/(4*w)));
}
function coordsToI(x,y,w) {
  return ((mask.width*y)+x)*4;

}

setInterval(loop,50);
init();