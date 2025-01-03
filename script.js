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

const gameSound = document.getElementById("game-sound"); // Single audio element for the ringtone

let score = 0;
let lives = 3;
let gameActive = false;
let basketLeft = 50; // Start at center (50% left of the screen)
let fallingSpeed = 5;

// Function to get a random color
function getRandomColor() {
    const colors = ["red", "blue", "green", "yellow", "purple", "orange", "pink"];
    return colors[Math.floor(Math.random() * colors.length)];
}

// Function to reset the falling object
function resetFallingObject() {
    fallingObject.style.top = "0px";
    fallingObject.style.left = Math.random() * 90 + "%";  // Randomize horizontal position
    fallingObject.style.backgroundColor = getRandomColor();  // Assign random color
}

// Track touch events on mobile devices
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener("touchstart", (e) => {
    touchStartX = e.touches[0].clientX;
});

document.addEventListener("touchmove", (e) => {
    touchEndX = e.touches[0].clientX;
});

document.addEventListener("touchend", () => {
    if (!gameActive) return;

    const moveThreshold = 20; // Minimum movement threshold to consider direction

    if (touchStartX - touchEndX > moveThreshold) {
        basketLeft = Math.max(0, basketLeft - 5); // Move left
    } else if (touchEndX - touchStartX > moveThreshold) {
        basketLeft = Math.min(100, basketLeft + 5); // Move right
    }

    // Update basket position to maintain equal movement range on both sides
    basket.style.left = basketLeft + "%";
});

document.addEventListener("keydown", (e) => {
    if (!gameActive) return;

    const moveAmount = 5; // Define the movement step amount
    if (e.key === "ArrowLeft") {
        basketLeft = Math.max(0, basketLeft - moveAmount); // Move left
    } else if (e.key === "ArrowRight") {
        basketLeft = Math.min(100, basketLeft + moveAmount); // Move right
    }

    // Update basket position
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
        gameSound.play(); // Play sound when the object is caught
    } else if (parseInt(fallingObject.style.top) > 500) {
        lives--;
        livesDisplay.textContent = `Lives: ${lives}`;
        resetFallingObject();
        gameSound.play(); // Play sound when the player loses a life

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
    gameSound.play(); // Play sound when the game starts
});

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
