const UNIT_PER_SECOND = 5;
const SNAKE_PIXEL_W = 20;

function Canvas() {
  this.canvas = document.getElementById("myCanvas");
  this.ctx = this.canvas.getContext("2d");
  this.fps = UNIT_PER_SECOND;
  this.initCoreValues = () => {
    this.snake_x = 0;
    this.snake_y = 0;
    this.snake_length = 1;
    this.moveDirection = "R";
    this.collision = false;
  };
  this.drawSnake = () => {
    this.ctx.fillStyle = "#00ff00";
    this.ctx.fillRect(this.snake_x, this.snake_y, SNAKE_PIXEL_W, SNAKE_PIXEL_W);
  };
  this.setCanvasheight = () => {
    this.canvas.width = document.documentElement.clientWidth - 20;
    this.canvas.height = document.documentElement.clientHeight - 20;
  };
  this.eraseBoard = () => {
    this.ctx.fillStyle = "#000000";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  };
  this.drawFood = () => {
    this.ctx.fillStyle = "#ff0000";
    this.ctx.fillRect(this.food_x, this.food_y, SNAKE_PIXEL_W, SNAKE_PIXEL_W);
  };
  this.initFoodPosition = () => {
    this.food_x =
      Math.round(
        Math.floor(Math.random() * (this.canvas.width - SNAKE_PIXEL_W)) / SNAKE_PIXEL_W
      ) * SNAKE_PIXEL_W;
    this.food_y =
      Math.round(
        Math.floor(Math.random() * (this.canvas.height - SNAKE_PIXEL_W)) / SNAKE_PIXEL_W
      ) * SNAKE_PIXEL_W;
  };
  this.drawPoint = () => {
    this.ctx.fillStyle = "black";
    this.ctx.font = "15px Arial";
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
    this.ctx.fillText(this.snake_length, this.snake_x + 10, this.snake_y + 10);
  };
  this.snakeMove = (x, y) => {
    const xinc = this.snake_x + x;
    const yinc = this.snake_y + y;
    if (xinc <= this.canvas.width && xinc >= 0) {
      this.snake_x = xinc;
    } else {
      this.collision = true;
      this.restart();
    }
    if (yinc <= this.canvas.height && yinc >= 0) {
      this.snake_y = yinc;
    } else {
      this.collision = true;
      this.restart();
    }

    if (this.food_x == this.snake_x && this.food_y == this.snake_y) {
      this.snake_length += 1;
      this.initFoodPosition();
    }
    this.eraseBoard();
    this.drawFood();
    this.drawSnake();
    this.drawPoint();
  };

  this.setCanvasheight();
  this.initFoodPosition();
  this.initCoreValues();

  this.restart = () => {
    this.initFoodPosition();
    this.initCoreValues();
    this.snakeMove(0, 0);
  };

  setInterval(() => {
    switch (this.moveDirection) {
      case "D":
        this.snakeMove(0, SNAKE_PIXEL_W);
        break;
      case "U":
        this.snakeMove(0, -SNAKE_PIXEL_W);
        break;
      case "L":
        this.snakeMove(-SNAKE_PIXEL_W, 0);
        break;
      case "R":
        this.snakeMove(SNAKE_PIXEL_W, 0);
        break;
    }
    // this.snakeMove(SNAKE_PIXEL_W, 0);
  }, 1000 / this.fps);

  window.addEventListener("resize", () => {
    this.setCanvasheight();
  });
  document.addEventListener("keydown", (event) => {
    switch (event.key) {
      case "ArrowDown":
        // this.snakeMove(0, SNAKE_PIXEL_W);
        this.moveDirection = "D";
        break;
      case "ArrowUp":
        // this.snakeMove(0, -SNAKE_PIXEL_W);
        this.moveDirection = "U";
        break;
      case "ArrowLeft":
        // this.snakeMove(-SNAKE_PIXEL_W, 0);
        this.moveDirection = "L";
        break;
      case "ArrowRight":
        // this.snakeMove(SNAKE_PIXEL_W, 0);
        this.moveDirection = "R";
        break;
    }
  });
}

const Canvas_ = new Canvas();
// Canvas_.drawSnake();
