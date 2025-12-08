// Animation canvas (background de header)
const canvas = document.getElementById("bgCanvas");
const header = document.getElementById("home");
const ctx = canvas.getContext("2d");

let width, height;
let particles = [];
const mouse = { x: null, y: null, radius: 150 }; //constante pour suivre la souris de l'utilisateur

//evenement pour suivre la position de la souris
window.addEventListener("mousemove", (e) => {
  const rect = canvas.getBoundingClientRect();
  mouse.x = e.clientX - rect.left;
  mouse.y = e.clientY - rect.top;
});

//ajustement de la taille du canvas par rapport a la section hero
function resize() {
  width = header.offsetWidth;
  height = header.offsetHeight;
  canvas.width = width;
  canvas.height = height;
  initParticles(); //rénitialise la position quand la page est redimensionnée
}

//classe Particule qui défini chaque noeud du réseau (animation bg dans le header)
class Particle {
  constructor() {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.vx = Math.random() * -0.5 + 0.25; //vitesse X aléatoire
    this.vy = Math.random() * -0.5 + 0.25; //vitesse Y aléatoire
    this.size = Math.random() * 2 + 1;
  }

  update() {
    //déplacement des noeuds
    this.x += this.vx;
    this.y += this.vy;
    //rebondissement des noeuds si ils touchent les bords
    if (this.x > width || this.x < 0) {
      return (this.vx = -this.vx);
    }
    if (this.y > height || this.y < 0) {
      return (this.vy = -this.vy);
    }

    //interaction avec la souris (repoussement des noeuds)
    let dx = mouse.x - this.x;
    let dy = mouse.y - this.y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < mouse.radius) {
      //logique d'éloignement des noeuds par rapport au curseur
      if (mouse.x < this.x && this.x < width - 10) this.x += 2;
      if (mouse.x > this.x && this.x > 10) this.x -= 2;
      if (mouse.y < this.y && this.y < width - 10) this.y += 2;
      if (mouse.y > this.y && this.y > 10) this.y -= 2;
    }
  }

  draw() {
    const style = getComputedStyle(document.body);
    ctx.fillStyle = style.getPropertyValue("--dot-color--").trim();
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

//fonction pour créer le nb initial de particules
function initParticles() {
  particles = [];
  let nbParticles = (width * height) / 9000;
  for (let i = 0; i < nbParticles; i++) {
    particles.push(new Particle());
  }
}

//boucle d'animation principale (toute les 60s)
function animate() {
  ctx.clearRect(0, 0, width, height); //efface le cadre précédent
  const style = getComputedStyle(document.body);
  const lineColor = style.getPropertyValue("--line-color").trim();

  for (let i = 0; i < particles.length; i++) {
    particles[i].update();
    particles[i].draw();

    //vérifie la distance pour dessiner entre les noeuds
    for (let j = i; j < particles.length; j++) {
      let dx = particles[i].x - particles[j].x;
      let dy = particles[i].y - particles[j].y;
      let distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < 100) {
        //si les noeuds sont proches (<100px)
        ctx.beginPath();
        ctx.strokeStyle = lineColor;
        ctx.lineWidth = 1;
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
        ctx.closePath();
      }
    }
  }
  requestAnimationFrame(animate); //rappelle la fonction pour la prochaine boucle
}

//lance l'animation au chargement et s'assure qu'elle se redimensionne
window.addEventListener("resize", resize);
resize();
animate();
