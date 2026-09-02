// ========== CONFIG ==========
const PASSKEY = "2709";

const LETTER = `To My Dearest,

I am writing this little note just because you have been on my mind all day long, which is nothing new since you pretty much live there anyway. Every single time I think about your smile, my heart does a tiny happy dance. I find myself smiling at my phone like a complete fool whenever your name pops up, and honestly, it is my absolute favorite part of the day.

You have this wonderful way of making the whole world feel brighter and sweeter just by being you. Thank you for all the warm hugs, the soft giggles we share, and the beautiful comfort of knowing you are mine.

Being your boyfriend is the happiest thing that has ever happened to me, and I count myself incredibly lucky to hold your hand and walk through life beside you. Please never forget how deeply you are loved and cherished. You are my favorite person, my safest space, and my absolute dream come true.

I love you more than all the stars in the night sky, and I cannot wait until the next time I get to hold you close.

Forever and always yours,
Your Love`;

// ========== YOUR MEDIA LIST ==========
const mediaList = [
  { type: "video", src: "https://res.cloudinary.com/srfgkyqw/video/upload/v1788388943/VIDEO-2025-01-01-01-53-35.mp4" }
];

// ========== STATE ==========
let currentStage = "gift-stage";
let enteredCode = "";
let currentMediaIndex = 0;

// ========== HELPERS ==========
function goToStage(id) {
  document.querySelectorAll(".stage").forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
  currentStage = id;

  if (id === "roses-stage") startRoses();
  if (id === "gallery-stage") startSlideshow();
  if (id === "letter-stage") typeLetter();
}

// ========== GIFT ==========
document.getElementById("giftBox").addEventListener("click", () => {
  document.getElementById("giftBox").classList.add("open");
  setTimeout(() => goToStage("roses-stage"), 800);
});

// ========== ROSES ==========
function startRoses() {
  const container = document.getElementById("roses-container");
  container.innerHTML = "";
  const roses = ["🌹", "🥀", "💮", "🌸", "🌺"];
  
  for (let i = 0; i < 80; i++) {
    const rose = document.createElement("div");
    rose.className = "rose-fall";
    rose.textContent = roses[Math.floor(Math.random() * roses.length)];
    rose.style.left = Math.random() * 100 + "vw";
    rose.style.animationDuration = (3 + Math.random() * 4) + "s";
    rose.style.animationDelay = Math.random() * 2 + "s";
    rose.style.fontSize = (20 + Math.random() * 25) + "px";
    container.appendChild(rose);
  }

  setTimeout(() => goToStage("message-stage"), 5500);
}

document.getElementById("message-stage").addEventListener("click", () => goToStage("quote-stage"));
document.getElementById("quote-stage").addEventListener("click", () => goToStage("passkey-stage"));

// ========== PASSKEY ==========
const dots = document.querySelectorAll("#dots span");
const keypad = document.getElementById("keypad");

keypad.addEventListener("click", (e) => {
  if (!e.target.dataset.num && !e.target.classList.contains("clear")) return;

  if (e.target.classList.contains("clear")) {
    enteredCode = "";
    updateDots();
    return;
  }

  if (enteredCode.length < 4) {
    enteredCode += e.target.dataset.num;
    updateDots();
  }

  if (enteredCode.length === 4) {
    if (enteredCode === PASSKEY) {
      dots.forEach(d => d.classList.add("correct"));
      document.getElementById("passkey-title").textContent = "Unlocked";
      setTimeout(() => goToStage("loading-stage"), 800);
      setTimeout(() => goToStage("gallery-stage"), 3200);
    } else {
      enteredCode = "";
      setTimeout(updateDots, 400);
    }
  }
});

function updateDots() {
  dots.forEach((d, i) => {
    d.classList.toggle("filled", i < enteredCode.length);
    d.classList.remove("correct");
  });
}

// ========== SLIDESHOW ==========
function startSlideshow() {
  const gallery = document.getElementById("gallery");
  gallery.innerHTML = `
    <div class="slideshow-container">
      <div id="media-display"></div>
      <div class="slide-counter" id="slide-counter"></div>
    </div>
  `;
  showNextMedia();
}

function showNextMedia() {
  if (currentMediaIndex >= mediaList.length) {
    // After all media finished → go to letter
    goToStage("letter-stage");
    return;
  }

  const item = mediaList[currentMediaIndex];
  const display = document.getElementById("media-display");
  const counter = document.getElementById("slide-counter");

  counter.textContent = `${currentMediaIndex + 1} / ${mediaList.length}`;

  if (item.type === "image") {
    display.innerHTML = `
      <div class="zoom-image">
        <img src="${item.src}" alt="memory">
      </div>
    `;
    // Show image for 3 seconds then next
    setTimeout(() => {
      currentMediaIndex++;
      showNextMedia();
    }, 3000);
  } 
  else if (item.type === "video") {
    display.innerHTML = `
      <video id="current-video" autoplay playsinline>
        <source src="${item.src}" type="video/mp4">
      </video>
    `;

    const video = document.getElementById("current-video");
    video.onended = () => {
      currentMediaIndex++;
      showNextMedia();
    };
  }
}

// ========== LETTER TYPEWRITER ==========
function typeLetter() {
  const el = document.getElementById("letter-text");
  el.textContent = "";
  let i = 0;
  const speed = 28;

  function type() {
    if (i < LETTER.length) {
      el.textContent += LETTER.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }
  type();
}
