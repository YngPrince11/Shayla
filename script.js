// =====================================================
// CONFIG
// =====================================================

const PASSKEY = "1432";

const LETTER = `To My Dearest,

I am writing this little note just because you have been on my mind all day long, which is nothing new since you pretty much live there anyway. Every single time I think about your smile, my heart does a tiny happy dance. I find myself smiling at my phone like a complete fool whenever your name pops up, and honestly, it is my absolute favorite part of the day.

You have this wonderful way of making the whole world feel brighter and sweeter just by being you. Thank you for all the warm hugs, the soft giggles we share, and the beautiful comfort of knowing you are mine.

Being your boyfriend is the happiest thing that has ever happened to me, and I count myself incredibly lucky to hold your hand and walk through life beside you. Please never forget how deeply you are loved and cherished. You are my favorite person, my safest space, and my absolute dream come true.

I love you more than all the stars in the night sky, and I cannot wait until the next time I get to hold you close.

Forever and always yours,
Your Love`;


// =====================================================
// STATE
// =====================================================

let currentStage = "gift-stage";
let enteredCode = "";
let messageTimer = null;
let rosesTimer = null;
let letterTypingTimer = null;


// =====================================================
// STAGE CONTROL
// =====================================================

function goToStage(id) {
  const target = document.getElementById(id);

  if (!target) return;

  document.querySelectorAll(".stage").forEach(stage => {
    stage.classList.remove("active");
  });

  target.classList.add("active");
  currentStage = id;

  // Stop old timers
  if (messageTimer) {
    clearTimeout(messageTimer);
    messageTimer = null;
  }

  if (rosesTimer) {
    clearTimeout(rosesTimer);
    rosesTimer = null;
  }

  if (letterTypingTimer) {
    clearTimeout(letterTypingTimer);
    letterTypingTimer = null;
  }

  // Start stage-specific behavior
  if (id === "roses-stage") {
    startRoses();
  }

  if (id === "message-stage") {
    startMessageTimer();
  }

  if (id === "letter-stage") {
    typeLetter();
  }

  // Scroll gallery/letter back to top when opened
  if (id === "gallery-stage") {
    const gallery = document.getElementById("gallery");
    if (gallery) gallery.scrollTop = 0;
  }
}


// =====================================================
// GIFT
// =====================================================

const giftBox = document.getElementById("giftBox");

if (giftBox) {
  giftBox.addEventListener("click", () => {
    // Prevent multiple clicks
    if (giftBox.classList.contains("open")) return;

    giftBox.classList.add("open");

    setTimeout(() => {
      goToStage("roses-stage");
    }, 800);
  });
}


// =====================================================
// ROSES
// =====================================================

function startRoses() {
  const container = document.getElementById("roses-container");

  if (!container) return;

  container.innerHTML = "";

  const flowers = [
    "🌹",
    "🌸",
    "🌺",
    "💮",
    "🥀"
  ];

  // Create falling flowers
  for (let i = 0; i < 80; i++) {
    const flower = document.createElement("div");

    flower.className = "rose-fall";
    flower.textContent =
      flowers[Math.floor(Math.random() * flowers.length)];

    flower.style.left = Math.random() * 100 + "vw";
    flower.style.animationDuration =
      3 + Math.random() * 4 + "s";

    flower.style.animationDelay =
      Math.random() * 2 + "s";

    flower.style.fontSize =
      20 + Math.random() * 25 + "px";

    flower.style.setProperty(
      "--drift",
      (Math.random() * 160 - 80) + "px"
    );

    container.appendChild(flower);
  }

  // Move to message after the flower animation
  rosesTimer = setTimeout(() => {
    if (currentStage === "roses-stage") {
      goToStage("message-stage");
    }
  }, 5500);
}


// =====================================================
// MESSAGE
// =====================================================

function startMessageTimer() {
  messageTimer = setTimeout(() => {
    if (currentStage === "message-stage") {
      goToStage("quote-stage");
    }
  }, 9000);
}

const messageStage = document.getElementById("message-stage");

if (messageStage) {
  messageStage.addEventListener("click", () => {
    goToStage("quote-stage");
  });
}


// =====================================================
// QUOTE
// =====================================================

const quoteStage = document.getElementById("quote-stage");

if (quoteStage) {
  quoteStage.addEventListener("click", () => {
    goToStage("passkey-stage");
  });
}


// =====================================================
// PASSKEY
// =====================================================

const dots = document.querySelectorAll("#dots span");
const keypad = document.getElementById("keypad");
const passkeyTitle = document.getElementById("passkey-title");

if (keypad) {
  keypad.addEventListener("click", event => {
    const button = event.target.closest("button");

    if (!button) return;

    // Clear
    if (button.classList.contains("clear")) {
      enteredCode = "";
      passkeyTitle.textContent = "Enter Passkey";
      updateDots();
      return;
    }

    const number = button.dataset.num;

    if (number === undefined) return;

    // Maximum 4 digits
    if (enteredCode.length >= 4) return;

    enteredCode += number;
    updateDots();

    // Check after 4 digits
    if (enteredCode.length === 4) {
      if (enteredCode === PASSKEY) {
        unlockPasskey();
      } else {
        wrongPasskey();
      }
    }
  });
}


// =====================================================
// PASSKEY SUCCESS
// =====================================================

function unlockPasskey() {
  dots.forEach(dot => {
    dot.classList.remove("filled");
    dot.classList.add("correct");
  });

  passkeyTitle.textContent = "Unlocked ❤️";

  setTimeout(() => {
    goToStage("loading-stage");
  }, 800);

  setTimeout(() => {
    goToStage("gallery-stage");
  }, 3200);
}


// =====================================================
// PASSKEY WRONG
// =====================================================

function wrongPasskey() {
  passkeyTitle.textContent = "Try again ❤️";

  dots.forEach(dot => {
    dot.classList.add("wrong");
  });

  setTimeout(() => {
    enteredCode = "";

    dots.forEach(dot => {
      dot.classList.remove("filled");
      dot.classList.remove("wrong");
    });

    passkeyTitle.textContent = "Enter Passkey";
  }, 500);
}


// =====================================================
// DOT UPDATE
// =====================================================

function updateDots() {
  dots.forEach((dot, index) => {
    dot.classList.toggle(
      "filled",
      index < enteredCode.length
    );

    dot.classList.remove("correct");
    dot.classList.remove("wrong");
  });
}


// =====================================================
// LETTER TYPEWRITER
// =====================================================

function typeLetter() {
  const element = document.getElementById("letter-text");

  if (!element) return;

  element.textContent = "";

  let index = 0;
  const speed = 28;

  function type() {
    if (index >= LETTER.length) {
      letterTypingTimer = null;
      return;
    }

    element.textContent += LETTER.charAt(index);
    index++;

    letterTypingTimer = setTimeout(type, speed);
  }

  type();
}


// =====================================================
// POLAROID ROTATION
// =====================================================

document.querySelectorAll(".polaroid").forEach(polaroid => {
  const rotation =
    Math.random() * 10 - 5;

  polaroid.style.setProperty(
    "--rot",
    rotation + "deg"
  );
});
