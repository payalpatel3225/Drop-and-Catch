const startScreen = document.getElementById("start-screen");
const startBtn = document.getElementById("start-btn");
const gameContainer = document.getElementById("game-container");
const basket = document.getElementById("basket");
const fallingObject = document.getElementById("falling-object");
const scoreDisplay = document.getElementById("score");
const livesDisplay = document.getElementById("lives");
const gameOverScreen = document.getElementById("game-over-screen");
const restartBtn = document.getElementById("restart-btn");
const homeBtn = document.getElementById("home-btn");
const leftBtn = document.getElementById("left-btn");
const rightBtn = document.getElementById("right-btn");
const mobileControls = document.getElementById("mobile-controls");

const gameSound = document.getElementById("game-sound");

let score = 0;
let lives = 3;
let gameActive = false;
let basketLeft = 50;
let fallingSpeed = 5;

// Function to get a random color
function getRandomColor() {
    const colors = ["red", "blue", "green", "yellow", "purple", "orange", "pink"];
    return colors[Math.floor(Math.random() * colors.length)];
}

// Function to reset the falling object
function resetFallingObject() {
    fallingObject.style.top = "0px";
    fallingObject.style.left = Math.random() * 90 + "%";
    fallingObject.style.backgroundColor = getRandomColor();
}

// Show mobile controls only after the game starts
startBtn.addEventListener("click", () => {
    startScreen.style.display = "none";
    gameContainer.style.display = "block";
    scoreDisplay.style.display = "block";
    livesDisplay.style.display = "block";
    gameActive = true;
    score = 0;
    lives = 3;
    scoreDisplay.textContent = `Score: ${score}`;
    livesDisplay.textContent = `Lives: ${lives}`;
    resetFallingObject();
    animateFallingObject();
    gameSound.play();

    // Show mobile controls after game starts
    if (window.innerWidth <= 600) {
        mobileControls.style.display = "flex";
    }
});

// Handle the resizing of the screen
function checkScreenSize() {
    if (window.innerWidth <= 600 && gameActive) {
        mobileControls.style.display = "flex";
    } else {
        mobileControls.style.display = "none";
    }
}
checkScreenSize();
window.addEventListener("resize", checkScreenSize);

// Add event listeners for mobile buttons
leftBtn.addEventListener("click", () => {
    if (!gameActive) return;
    basketLeft = Math.max(0, basketLeft - 5);
    basket.style.left = basketLeft + "%";
});

rightBtn.addEventListener("click", () => {
    if (!gameActive) return;
    basketLeft = Math.min(100, basketLeft + 5);
    basket.style.left = basketLeft + "%";
});

document.addEventListener("keydown", (e) => {
    if (!gameActive) return;

    const moveAmount = 5;
    if (e.key === "ArrowLeft") {
        basketLeft = Math.max(0, basketLeft - moveAmount);
    } else if (e.key === "ArrowRight") {
        basketLeft = Math.min(100, basketLeft + moveAmount);
    }

    basket.style.left = basketLeft + "%";
});

function checkCollision() {
    const basketRect = basket.getBoundingClientRect();
    const objectRect = fallingObject.getBoundingClientRect();

    if (
        objectRect.bottom >= basketRect.top &&
        objectRect.left < basketRect.right &&
        objectRect.right > basketRect.left
    ) {
        score++;
        scoreDisplay.textContent = `Score: ${score}`;
        resetFallingObject();
        gameSound.play();
    } else if (parseInt(fallingObject.style.top) > 500) {
        lives--;
        livesDisplay.textContent = `Lives: ${lives}`;
        resetFallingObject();
        gameSound.play();

        if (lives <= 0) {
            gameOver();
        }
    }
}

function animateFallingObject() {
    if (!gameActive) return;

    const currentTop = parseInt(fallingObject.style.top || 0);
    fallingObject.style.top = currentTop + fallingSpeed + "px";

    checkCollision();
    requestAnimationFrame(animateFallingObject);
}

function gameOver() {
    gameActive = false;
    gameContainer.style.display = "none";
    gameOverScreen.style.display = "flex";
}

restartBtn.addEventListener("click", () => {
    gameOverScreen.style.display = "none";
    gameContainer.style.display = "block";
    score = 0;
    lives = 3;
    scoreDisplay.textContent = `Score: ${score}`;
    livesDisplay.textContent = `Lives: ${lives}`;
    gameActive = true;
    resetFallingObject();
    animateFallingObject();
});

homeBtn.addEventListener("click", () => {
    gameOverScreen.style.display = "none";
    startScreen.style.display = "flex";
});
