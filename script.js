const canvas = document.getElementById("gameCanv");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//Konfiguracija elemenata igre
const brickRowCount = 5;
const brickColumnCount = 20;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 50;
const brickOffsetLeft = 30;
const paddleHeight = 20;
const paddleWidth = 130;
const ballRadius = 10;

let score = 0;
let highScore = localStorage.getItem("highScore") || 0;
let bricks = [];
let paddleX = (canvas.width - paddleWidth) / 2;
let ballX = canvas.width / 2;
let ballY = canvas.height - 30;
let ballSpeedX_cord = 3;
let ballSpeedY_cord = -3;
let right_arrow_Pressed = false;
let left_arrow_Pressed = false;
let gameOver_alert = false;

//Inicijalizacija cigli 
function initBricks_funct() {
    for (let c = 0; c < brickColumnCount; c++) {
        bricks[c] = [];
        for (let r = 0; r < brickRowCount; r++) {
            bricks[c][r] = { x: 0, y: 0, status: 1 }; // status 1 znači da cigla nije razbijena(još uvijek postoji)
        }
    }
}

// Detekcija pritiska tipke za pomak
document.addEventListener("keydown", (e) => {
    if (e.key === "Right" || e.key === "ArrowRight") right_arrow_Pressed = true;
    if (e.key === "Left" || e.key === "ArrowLeft") left_arrow_Pressed = true;
});

document.addEventListener("keyup", (e) => {
    if (e.key === "Right" || e.key === "ArrowRight") right_arrow_Pressed = false;
    if (e.key === "Left" || e.key === "ArrowLeft") left_arrow_Pressed = false;
});

//funkcija koja crta cigle na ekran te određuje oblikovanje
function drawBricks_funct() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status === 1) {
                let brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
                let brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;

                ctx.shadowColor = "rgba(0, 0, 0, 0.5)"; 
                ctx.shadowBlur = 10; 
                ctx.shadowOffsetX = 5; 
                ctx.shadowOffsetY = 5; 

                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#00ff00"; 
                ctx.fill();
                ctx.closePath();

                ctx.shadowColor = "transparent";
            }
        }
    }
}


// Funkcija za crtanje palice na ekran
function drawPaddle_funct() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.shadowColor = "#333";
    ctx.shadowBlur = 10;
    ctx.fill();
    ctx.closePath();
}

// Funkcija za crtanje loptice na ekran
function drawBall_funct() {
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#e32214";
    ctx.fill();
    ctx.closePath();
}

// Funkcija za detekciju sudara loptice i cigli
function collisionDetection_funct() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            let b = bricks[c][r];
            if (b.status === 1 && ballX > b.x && ballX < b.x + brickWidth && ballY > b.y && ballY < b.y + brickHeight) {
                ballSpeedY_cord = -ballSpeedY_cord;
                b.status = 0;
                score++;
                if (score > highScore) {
                    highScore = score;
                    localStorage.setItem("highScore", highScore);
                }
                if (score === brickRowCount * brickColumnCount) {
                    alert("Congratulations,you won!");
                    document.location.reload();
                }
            }
        }
    }
}

// Funkcija za inicijalizaciju igre i provjeru kretanja
function draw_funct() {
    if (gameOver_alert) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBricks_funct();
    drawBall_funct();
    drawPaddle_funct();

    ctx.font = "16px Arial";
    ctx.fillStyle = "#fff";
    ctx.textAlign = "right"; 
    ctx.fillText("Bodovi: " + score, canvas.width - 20, 20);
    ctx.fillText("Rekord: " + highScore, canvas.width - 20, 40); 

    collisionDetection_funct();

    if (ballX + ballSpeedX_cord > canvas.width - ballRadius || ballX + ballSpeedX_cord < ballRadius) {
        ballSpeedX_cord = -ballSpeedX_cord;
    }
    if (ballY + ballSpeedY_cord < ballRadius) {
        ballSpeedY_cord = -ballSpeedY_cord;
    } else if (ballY + ballSpeedY_cord > canvas.height - ballRadius) {
        if (ballX > paddleX && ballX < paddleX + paddleWidth) {
            ballSpeedY_cord = -ballSpeedY_cord;
        } else {
            gameOver_alert = true;
            ctx.font = "25px Arial";
            ctx.fillText("GAME OVER", canvas.width / 2 - 60, canvas.height / 2);
            return;
        }
    }

    ballX += ballSpeedX_cord;
    ballY += ballSpeedY_cord;

    if (right_arrow_Pressed && paddleX < canvas.width - paddleWidth) paddleX += 5;
    if (left_arrow_Pressed && paddleX > 0) paddleX -= 5;

    requestAnimationFrame(draw_funct);
}

initBricks_funct();
draw_funct();
