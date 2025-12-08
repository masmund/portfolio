// Animation canvas (background de header)
const canvas = document.getElementById("bgCanvas");
const header = document.getElementById("home");
const ctx = canvas.getContext("2d");

let width, height;
let particles = [];
const mouse = { x: null, y: null, radius: 150 };

window.addEventListener("mousemove", (e) => {
  const rect = canvas.getBoundingClientRect();
  mouse.x = e.clientX - rect.left;
  mouse.y = e.clientY - rect.top;
});

function resize() {
  width = header.offsetWidth;
  height = header.offsetHeight;
  canvas.width = width;
  canvas.height = height;
  initParticles();
}

class Particle {
  constructor() {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.vx = Math.random() * -0.5 + 0.25;
    this.vy = Math.random() * -0.5 + 0.25;
    this.size = Math.random() * 2 + 1;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x > width || this.x < 0) {
      return (this.vx = -this.vx);
    }
    if (this.y > height || this.y < 0) {
      return (this.vy = -this.vy);
    }

    let dx = mouse.x - this.x;
    let dy = mouse.y - this.y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < mouse.radius) {
      if (mouse.x < this.x && this.x < width - 10) this.x += 2;
      if (mouse.x > this.x && this.x > 10) this.x -= 2;
      if (mouse.y < this.y && this.y < width - 10) this.y += 2;
      if (mouse.y > this.y && this.y > 10) this.y -= 2;
    }
  }
}
