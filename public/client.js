const socket = io();

// SEND
document.addEventListener('mousemove', (e) => {
    const coords = {
        x: e.clientX,
        y: e.clientY,
    };

    socket.emit('mousemove', coords);
});

const peerPositions = {};

// RECEIVE
socket.on('peer-mousemove', (msg) => {
  console.debug('got message', msg);
  peerPositions[msg.clientId] = msg.coords;
});

socket.on('peer-disconnect', (msg) => {
  delete peerPositions[msg.clientId];
});

const canvasElem = document.getElementById('canvas');
const ctx = canvasElem.getContext('2d');

requestAnimationFrame(draw);

function draw() {
  canvasElem.width = canvasElem.clientWidth;
  canvasElem.height = canvasElem.clientHeight;
  
  ctx.clearRect(0, 0, canvasElem.width, canvasElem.height);

  Object.values(peerPositions).forEach((coords) => {
      ctx.beginPath();
      ctx.arc(coords.x, coords.y, 10, 0, 2 * Math.PI);
      ctx.stroke();
  });

  requestAnimationFrame(draw);
}
