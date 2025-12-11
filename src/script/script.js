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
    ctx.fillStyle = style.getPropertyValue("--dot-color").trim();
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

//darkmode
const themeToggle = document.getElementById("themeToggle");
const themeIcon = themeToggle.querySelector("i");
let isDarkmode = false;
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  isDarkmode = !isDarkmode;
  themeIcon.classList = isDarkmode ? "ph ph-sun" : "ph ph-moon";
});

//Filtrage des projets
const filterBtns = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");

filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    const filter = btn.getAttribute("data-filter");

    projectCards.forEach((cards) => {
      if (filter === "all" || cards.getAttribute("data-cat") === filter) {
        cards.classList.remove("hidden");
        setTimeout(() => {
          cards.style.opacity = "1";
          cards.style.transform = "scale(1)";
        }, 50);
      } else {
        cards.classList.add("hidden");
        cards.style.opacity = "0";
        cards.style.transform = "scale(0.9)";
      }
    });
  });
});

//MODALE ET LIGHTBOX (cadre projet)
const projects = [
  //chaque {...} = un projet
  {
    title: "Placeholder",
    cat: "catégorie",
    img: "../images/placeholder.png",
    desc: "description",
    tech: ["Placeholder", "Placeholder", "Placeholder"],
  },

  {
    title: "caca",
    cat: "caca",
    img: "../images/placeholder.png",
    desc: "caca",
    tech: ["caca", "caca", "caca"],
  },
];

const modal = document.getElementById("modal");
const mTitle = document.getElementById("m-title");
const mCat = document.getElementById("m-cat");
const mImg = document.getElementById("m-img");
const mDesc = document.getElementById("m-desc");
const mTech = document.getElementById("m-tech");
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");

function openModal(index) {
  const p = projects[index];
  mTitle.innerText = p.title;
  mCat.innerText = p.cat;
  mImg.src = p.img;
  mDesc.innerText = p.desc;
  mTech.innerHTML = "";
  p.tech.forEach((t) => {
    const span = document.createElement("span");
    span.className = "tag";
    span.innerText = t;
    mTech.appendChild(span);
  });
  modal.classList.add("active");
  document.body.classList.add("no-scroll");
}

function closeModal() {
  modal.classList.remove("active");
  document.body.classList.remove("no-scroll");
}

function openLightbox(src) {
  lightboxImg.src = src;
  lightbox.classList.add("active");
}

function closeLightbox() {
  lightbox.classList.remove("active");
}

modal.addEventListener("click", (e) => {
  if (e.target === modal) closeModal();
});

//scroll reveal & navbar
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("active");
    });
  },
  { threshold: 0.1 }
);
document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
const sections = document.querySelectorAll("section, header");
const navLinks = document.querySelectorAll(".nav-link");
window.addEventListener("scroll", () => {
  let current = "";
  sections.forEach((section) => {
    if (scrollY >= section.offsetTop - 200)
      current = section.getAttribute("id");
  });
  navLinks.forEach((li) => {
    li.classList.remove("active");
    if (li.getAttribute("href").includes(current)) li.classList.add("active");
  });
});
