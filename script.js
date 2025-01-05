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

        const gameSound = document.getElementById("game-sound");

        let score = 0;
        let lives = 3;
        let gameActive = false;
        let basketLeft = 50;
        let basketMoveSpeed = 10;
        let fallingSpeed = 5;

        function getRandomColor() {
            const colors = ["red", "blue", "green", "yellow", "purple", "orange", "pink"];
            return colors[Math.floor(Math.random() * colors.length)];
        }

        function resetFallingObject() {
            fallingObject.style.top = "0px";
            fallingObject.style.left = Math.random() * 90 + "%";
            fallingObject.style.backgroundColor = getRandomColor();
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
            gameSound.play();
        });

        document.addEventListener("keydown", (e) => {
            if (!gameActive) return;

            if (e.key === "ArrowLeft") {
                basketLeft = Math.max(0, basketLeft - basketMoveSpeed);
            } else if (e.key === "ArrowRight") {
                basketLeft = Math.min(100, basketLeft + basketMoveSpeed);
            }

            basket.style.left = basketLeft + "%";
        });

        basket.addEventListener("touchstart", (e) => {
            if (!gameActive) return;
            const touch = e.touches[0];
            const basketRect = basket.getBoundingClientRect();
            const basketCenterX = basketRect.left + basketRect.width / 2;

            basket.offsetX = touch.clientX - basketCenterX;
        });

        basket.addEventListener("touchmove", (e) => {
            if (!gameActive) return;

            const touch = e.touches[0];
            const gameContainerRect = gameContainer.getBoundingClientRect();
            const newBasketLeft = touch.clientX - gameContainerRect.left - basket.offsetX;

            const maxLeft = gameContainerRect.width - basket.offsetWidth;
            basket.style.left = Math.max(0, Math.min(newBasketLeft, maxLeft)) + "px";
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
