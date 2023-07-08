const UNIT_PER_SECOND_SPEED = 5;
const SNAKE_PIXEL_W = 20;
const SNAKE_BACKGROUND = "#00ff00";
const CANVAS_COLOR = "#000000";
const FOOD_COLOR = "#ff0000";
const SNAKE_LENGTH = 3;
const SPRITE_FOOD_WIDTH = 130;
const MAX_SPRITE_FOOD_COLUMN = 21;

function SnakeGame() {
  this.canvas = document.getElementById("myCanvas");
  this.canvas.style.backgroundColor = CANVAS_COLOR;
  this.ctx = this.canvas.getContext("2d");
  this.fps = UNIT_PER_SECOND_SPEED;
  this.pause_on_collision = false;

  this.initCoreValues = () => {
    this.snake_length = SNAKE_LENGTH;
    this.snake_x = SNAKE_PIXEL_W * (this.snake_length - 1);
    this.snake_y = 0;
    this.snake_cell_array = [];
    this.snakeTurnQueue = [];
    this.moveDirection = "R";
    this.collision = false;
    this.initSnakeArray();
    this.prev_shadow_array = this.snake_cell_array;
  };
  this.initSnakeArray = () => {
    const snakeArray = new Array(this.snake_length).fill(1);
    for (const [index] of snakeArray.entries()) {
      let current_x = this.snake_x - index * SNAKE_PIXEL_W;
      let current_y = this.snake_y;

      this.snake_cell_array[index] = {
        x: current_x,
        y: current_y,
      };
    }
  };
  this.initFoodImage = () => {
    this.foodImage = document.createElement("img");
    this.foodImage.src = "./food-sprite.png";
    this.foodImage.onload = () => {
      this.foodImageLoaded = true;
      console.log("food image loaded");
    };
  };

  this.initEventListeners = () => {
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
  };
  this.beginSnakeAutoMovement = () => {
    this.autoMovement = setInterval(() => {
      if (this.collision == true && this.pause_on_collision == true) return;
      // return;
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
    }, 1000 / this.fps);
  };
  this.drawSnake = () => {
    for (const [index, coord] of this.snake_cell_array.entries()) {
      this.ctx.fillStyle = SNAKE_BACKGROUND;
      this.ctx.fillRect(coord.x, coord.y, SNAKE_PIXEL_W, SNAKE_PIXEL_W);
      this.ctx.strokeStyle = "#000000";
      this.ctx.lineWidth = 1;
      this.ctx.strokeRect(coord.x + 2, coord.y + 2, SNAKE_PIXEL_W - 4, SNAKE_PIXEL_W - 4);
      if (index == 0) {
        this.ctx.fillStyle = "black";
        this.ctx.font = "15px Arial";
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";
        this.ctx.fillText("~", this.snake_x + 10, this.snake_y + 10);
      }
    }
  };
  this.setCanvasheight = () => {
    this.canvas.width = document.documentElement.clientWidth - 20;
    this.canvas.height = document.documentElement.clientHeight - 20;
  };
  this.eraseBoard = () => {
    this.ctx.fillStyle = CANVAS_COLOR;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  };
  this.drawFood = () => {
    this.ctx.drawImage(
      this.foodImage,
      this.food_src_x,
      0,
      SPRITE_FOOD_WIDTH,
      SPRITE_FOOD_WIDTH,
      this.food_x,
      this.food_y,
      SNAKE_PIXEL_W,
      SNAKE_PIXEL_W
    );
  };
  this.initFoodPosition = () => {
    this.food_src_x =
      Math.floor(Math.random() * MAX_SPRITE_FOOD_COLUMN) * SPRITE_FOOD_WIDTH;
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
  this.renderFrame = () => {
    this.eraseBoard();
    this.drawFood();
    this.drawSnake();
  };

  this.snakeMove = (x, y) => {
    let xinc = this.snake_x + x;
    let yinc = this.snake_y + y;
    const snakeEatingItsOwnCellIndex = this.snake_cell_array.findIndex(
      (a, ind) => xinc == a.x && yinc == a.y && ind != 0
    );
    if (snakeEatingItsOwnCellIndex == 1) {
      xinc = this.snake_x - x;
      yinc = this.snake_y - y;
    }
    if (snakeEatingItsOwnCellIndex > 1) {
      console.log("self Collision");
      this.restart();
      return;
    }
    if (xinc <= this.canvas.width && xinc >= 0) {
      this.snake_x = xinc;
    } else {
      // this.collision = true;
      this.restart();
      return;
    }
    if (yinc <= this.canvas.height && yinc >= 0) {
      this.snake_y = yinc;
    } else {
      // this.collision = true;
      this.restart();
      return;
    }

    // Snake Multi Cell History tracking
    this.prev_shadow_array = [...this.snake_cell_array];
    for (const [ind] of this.snake_cell_array.entries()) {
      const isHead = ind == 0;
      if (isHead) {
        this.snake_cell_array[ind] = {
          x: this.snake_x,
          y: this.snake_y,
        };
      } else {
        this.snake_cell_array[ind] = this.prev_shadow_array[ind - 1];
      }
    }

    if (this.food_x == this.snake_x && this.food_y == this.snake_y) {
      this.snake_cell_array.push(this.prev_shadow_array[this.snake_length - 1]);
      this.snake_length += 1;
      this.initFoodPosition();
    }
    this.renderFrame();
    // this.drawPoint();
  };

  this.restart = () => {
    if (this.pause_on_collision) return;
    this.initFoodPosition();
    this.initCoreValues();
    // this.snakeMove(0, 0);
  };

  this.initFoodImage();
  this.setCanvasheight();
  this.initFoodPosition();
  this.initCoreValues();

  this.initEventListeners();
  this.beginSnakeAutoMovement();
}

const Canvas_ = new SnakeGame();
Canvas_.renderFrame();
