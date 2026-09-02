// ========== CONFIG ==========
const PASSKEY = "1432";          // ← Change this to any 4-digit code
const LETTER = `To My Dearest,

I am writing this little note just because you have been on my mind all day long, which is nothing new since you pretty much live there anyway. Every single time I think about your smile, my heart does a tiny happy dance. I find myself smiling at my phone like a complete fool whenever your name pops up, and honestly, it is my absolute favorite part of the day.

You have this wonderful way of making the whole world feel brighter and sweeter just by being you. Thank you for all the warm hugs, the soft giggles we share, and the beautiful comfort of knowing you are mine.

Being your boyfriend is the happiest thing that has ever happened to me, and I count myself incredibly lucky to hold your hand and walk through life beside you. Please never forget how deeply you are loved and cherished. You are my favorite person, my safest space, and my absolute dream come true.

I love you more than all the stars in the night sky, and I cannot wait until the next time I get to hold you close.

Forever and always yours,
Your Love`;

// ========== STATE ==========
let currentStage = "gift-stage";
let enteredCode = "";

// ========== HELPERS ==========
function goToStage(id) {
  document.querySelectorAll(".stage").forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
  currentStage = id;

  if (id === "roses-stage") startRoses();
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

// Auto advance message → quote → passkey
setTimeout(() => {
  if (currentStage === "message-stage") goToStage("quote-stage");
}, 9000);

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
      // wrong
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

// Make polaroids slightly rotated
document.querySelectorAll(".polaroid").forEach((p, i) => {
  p.style.setProperty("--rot", (Math.random() * 10 - 5) + "deg");
});