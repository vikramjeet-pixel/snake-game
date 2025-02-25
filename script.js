const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startBtn = document.getElementById('start-btn');
const scoreEl = document.getElementById('score');

// Game settings
const gridSize = 20; // Size of each grid square
const tileCount = canvas.width / gridSize; // 20x20 grid
let snake = [{ x: 10, y: 10 }]; // Snake starts in the middle
let food = { x: 15, y: 15 }; // Initial food position
let dx = 0; // Horizontal velocity
let dy = 0; // Vertical velocity
let score = 0;
let gameLoop = null;

// Colors
const snakeColor = '#40c4ff'; // Sky blue
const foodColor = '#ab47bc'; // Soft magenta
const gridColor = '#26355a'; // Muted blue-purple

// Start or restart game
startBtn.addEventListener('click', () => {
    if (gameLoop) {
        clearInterval(gameLoop);
    }
    resetGame();
    gameLoop = setInterval(update, 100); // 100ms per frame
    startBtn.textContent = "Restart Game";
});

// Handle keyboard input
document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowUp':
            if (dy === 0) { dx = 0; dy = -1; }
            break;
        case 'ArrowDown':
            if (dy === 0) { dx = 0; dy = 1; }
            break;
        case 'ArrowLeft':
            if (dx === 0) { dx = -1; dy = 0; }
            break;
        case 'ArrowRight':
            if (dx === 0) { dx = 1; dy = 0; }
            break;
    }
});

// Reset game state
function resetGame() {
    snake = [{ x: 10, y: 10 }];
    food = { x: 15, y: 15 };
    dx = 0;
    dy = 0;
    score = 0;
    scoreEl.textContent = score;
}

// Update game state
function update() {
    // Move snake
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);

    // Check if snake ate food
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreEl.textContent = score;
        generateFood();
    } else {
        snake.pop(); // Remove tail if no food eaten
    }

    // Check collision with walls or self
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount || snakeCollision(head)) {
        clearInterval(gameLoop);
        gameLoop = null;
        alert(`Game Over! Score: ${score}`);
        startBtn.textContent = "Start Game";
        return;
    }

    // Draw game
    draw();
}

// Check if snake collides with itself
function snakeCollision(head) {
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }
    return false;
}

// Generate new food position
function generateFood() {
    food.x = Math.floor(Math.random() * tileCount);
    food.y = Math.floor(Math.random() * tileCount);
    // Ensure food doesn't spawn on snake
    for (let segment of snake) {
        if (food.x === segment.x && food.y === segment.y) {
            generateFood();
            break;
        }
    }
}

// Draw the game on canvas
function draw() {
    // Clear canvas
    ctx.fillStyle = gridColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw snake
    ctx.fillStyle = snakeColor;
    snake.forEach(segment => {
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
    });

    // Draw food
    ctx.fillStyle = foodColor;
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
}

// Initial draw
draw();