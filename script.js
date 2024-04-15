"use strict";

const wrapper = document.querySelector(".wrapper");
const restartBtn = document.querySelector(".game__btn-restart");
const upBtn = document.querySelector(".game__btn-up");
const downBtn = document.querySelector(".game__btn-down");
const leftBtn = document.querySelector(".game__btn-left");
const rightBtn = document.querySelector(".game__btn-right");
const shootBtn = document.querySelector(".game__btn-shoot");

const gameBoard = document.querySelector(".game__board > .game__canvas-cont");
const playerTankImgUp = document.getElementById("#playerTankUp");
const playerTankImgDown = document.getElementById("#playerTankDown");
const playerTankImgLeft = document.getElementById("#playerTankLeft");
const playerTankImgRight = document.getElementById("#playerTankRight");

const enemyTankImgUp = document.getElementById("#enemyTankUp");
const enemyTankImgDown = document.getElementById("#enemyTankDown");
const enemyTankImgLeft = document.getElementById("#enemyTankLeft");
const enemyTankImgRight = document.getElementById("#enemyTankRight");

const wallBaseState = document.getElementById("#wall1st");
const wallDam1State = document.getElementById("#wall2st");
const wallDam2State = document.getElementById("#wall3st");

const expl1 = document.getElementById("#expl1");
const expl2 = document.getElementById("#expl2");
const expl3 = document.getElementById("#expl3");

let touch = false;
let intervalID;

window.onload = () => {
  const canvas = document.createElement("canvas");
  canvas.setAttribute("width", "350px");
  canvas.setAttribute("height", "280px");
  gameBoard.insertAdjacentElement("beforeend", canvas);
  const ctx = canvas.getContext("2d");

  const game = {
    width: 350,
    height: 280,
    x: 0,
    y: 0,
  };
  const gameplay = {
    width: 280,
    height: 280,
    x: 0,
    y: 0,
  };

  let playerTank = {
    width: 13,
    height: 13,
    x: gameplay.width / 2 - 20,
    y: gameplay.height - 20 * 2,
    dura: 4,
  };

  let enemyTanks = [];
  let enemyProjectiles = [];
  let shot = false;
  let playerGun = {
    x: 0,
    y: 0,
  };
  let playerProjectiles = [];

  let playerDirection = 1;

  let walls = [];
  let damDirection = 1;

  let reload = false;

  let gameOver = false;
  let gameWon = false;
  createWalls();
  createEnemyTanks();

  skullDraw();
  wonEmojiDraw();
  setInterval(() => {
    if (playerTank.dura == 0) {
      drawGameOver();
      gameOver = true;
      window.addEventListener("click", (e) => {
        if (e.target == restartBtn) {
          playerTank = {
            width: 13,
            height: 13,
            x: gameplay.width / 2 - 20,
            y: gameplay.height - 20 * 2,
            dura: 4,
          };
          playerProjectiles = [];
          enemyTanks = [];
          enemyProjectiles = [];
          walls = [];
          createWalls();
          createEnemyTanks();
          gameOver = false;
          gameWon = false;
        }
      });
      return;
    }
    if (enemyTanks.length == 0) {
      drawGameWin();
      gameWon = true;
      window.addEventListener("click", (e) => {
        if (e.target == restartBtn) {
          playerTank = {
            width: 13,
            height: 13,
            x: gameplay.width / 2 - 20,
            y: gameplay.height - 20 * 2,
            dura: 4,
          };
          playerProjectiles = [];
          enemyTanks = [];
          enemyProjectiles = [];
          walls = [];
          createWalls();
          createEnemyTanks();
          gameOver = false;
          gameWon = false;
        }
      });
      return;
    }
    drawAScreen();
    drawPlayerTank();
    enemyMove();
    drawEnemyTanks();
    playerShoot();
    enemyShootMoving();
    checkCollision();
    drawWalls();
    drawEnemies();
    drawHealth();
  }, 40);

  setInterval(() => {
    enemyChangeDir();
  }, Math.floor(Math.random() * (4000 - 1000) + 1000));

  setInterval(() => {
    enemyShoot();
  }, 1200);

  function drawAScreen() {
    ctx.beginPath();
    ctx.fillStyle = "grey";
    ctx.fillRect(game.x, game.y, game.width, game.height);
    ctx.closePath();
    ctx.beginPath();
    ctx.fillStyle = "#000";
    ctx.fillRect(gameplay.x, gameplay.y, gameplay.width, gameplay.height);
    ctx.closePath();
  }

  function drawPlayerTank() {
    if (playerDirection == 1) {
      ctx.beginPath();
      ctx.drawImage(
        playerTankImgUp,
        playerTank.x,
        playerTank.y,
        playerTank.width,
        playerTank.height
      );
      ctx.closePath();
    }
    if (playerDirection == 2) {
      ctx.beginPath();
      ctx.drawImage(
        playerTankImgDown,
        playerTank.x,
        playerTank.y,
        playerTank.width,
        playerTank.height
      );
      ctx.closePath();
    }
    if (playerDirection == 3) {
      ctx.beginPath();
      ctx.drawImage(
        playerTankImgLeft,
        playerTank.x,
        playerTank.y,
        playerTank.width,
        playerTank.height
      );
      ctx.closePath();
    }
    if (playerDirection == 4) {
      ctx.beginPath();
      ctx.drawImage(
        playerTankImgRight,
        playerTank.x,
        playerTank.y,
        playerTank.width,
        playerTank.height
      );
      ctx.closePath();
    }
  }

  function playerShoot() {
    for (let i = 0; i < playerProjectiles.length; i++) {
      if (playerProjectiles[i].direct == 1) {
        ctx.beginPath();
        ctx.fillStyle = "white";
        playerProjectiles[i].y -= 2;
        ctx.fillRect(playerProjectiles[i].x, playerProjectiles[i].y, 2, 2);
        ctx.closePath();
      } else if (playerProjectiles[i].direct == 2) {
        ctx.beginPath();
        ctx.fillStyle = "white";
        playerProjectiles[i].y += 2;
        ctx.fillRect(playerProjectiles[i].x, playerProjectiles[i].y, 2, 2);
        ctx.closePath();
      } else if (playerProjectiles[i].direct == 3) {
        ctx.beginPath();
        ctx.fillStyle = "white";
        playerProjectiles[i].x -= 2;
        ctx.fillRect(playerProjectiles[i].x, playerProjectiles[i].y, 2, 2);
        ctx.closePath();
      } else if (playerProjectiles[i].direct == 4) {
        ctx.beginPath();
        ctx.fillStyle = "white";
        playerProjectiles[i].x += 2;
        ctx.fillRect(playerProjectiles[i].x, playerProjectiles[i].y, 2, 2);
        ctx.closePath();
      }
      if (
        playerProjectiles[i].x < 0 ||
        playerProjectiles[i].x > gameplay.width ||
        playerProjectiles[i].y < 0 ||
        playerProjectiles[i] > gameplay.height
      ) {
        playerProjectiles.shift();
      }
    }
  }

  function checkCollision() {
    //Checking tanks coll with walls
    function checkWallsTanksColl(tank, direction) {
      if (tank.x < 3) {
        tank.x = 3;
      }
      if (tank.x + tank.width > gameplay.width - 3) {
        tank.x = gameplay.width - tank.width - 3;
      }
      if (tank.y + tank.height > gameplay.height) {
        tank.y = gameplay.height - tank.height;
      }
      tank;
      if (tank.y < 0) {
        tank.y = 0;
      }

      for (let i = 0; walls.length > i; i++) {
        if (
          tank.x + tank.width >= walls[i].x &&
          tank.x <= walls[i].x + walls[i].width
        ) {
          if (
            tank.y + playerTank.height >= walls[i].y &&
            tank.y <= walls[i].y + walls[i].height
          ) {
            if (direction == 1) {
              tank.y = walls[i].y + walls[i].height + 3;
            }
            if (direction == 2) {
              tank.y = walls[i].y - walls[i].height - 3;
            }
            if (direction == 3) {
              tank.x = walls[i].x + walls[i].width + 3;
            }
            if (direction == 4) {
              tank.x = walls[i].x - walls[i].width - 3;
            }
          }
        }
      }
    }
    checkWallsTanksColl(playerTank, playerDirection);
    for (let i = 0; enemyTanks.length > i; i++) {
      checkWallsTanksColl(enemyTanks[i], enemyTanks[i].direction);
    }

    //Checking wall/projectile coll
    function projectileHitsWall(projectiles) {
      for (let i = 0; projectiles.length > i; i++) {
        for (let j = 0; walls.length > j; j++) {
          if (
            projectiles[i].x >= walls[j].x &&
            projectiles[i].x <= walls[j].x + walls[j].width
          ) {
            if (
              projectiles[i].y >= walls[j].y &&
              projectiles[i].y <= walls[j].y + walls[j].height
            ) {
              walls[j].dura -= 1;
              walls[j].damageDir = projectiles[i].damageDir;
              if (walls[j].damageDir == 2) {
                walls[j].y += 16 * (1 / 3);
              }
              if (walls[j].damageDir == 4) {
                walls[j].x += 16 * (1 / 3);
              }
              drawExplosion(projectiles[i].x, projectiles[i].y);
              projectiles.splice(i, 1);
              return;
            }
          }
        }
      }
    }
    function projectileHitsGameWall(projectiles) {
      for (let i = 0; projectiles.length > i; i++) {
        if (
          projectiles[i].x <= 0 ||
          projectiles[i].x >= gameplay.width ||
          projectiles[i].y <= 0 ||
          projectiles[i].y >= gameplay.height
        ) {
          projectiles.splice(i, 1);
        }
      }
    }
    projectileHitsWall(playerProjectiles);
    projectileHitsWall(enemyProjectiles);
    projectileHitsGameWall(playerProjectiles);
    projectileHitsGameWall(enemyProjectiles);

    //Checking tank/tankCollision
    function tankToTankColl(tank, colltank, direction) {
      if (
        tank.x + tank.width >= colltank.x &&
        tank.x <= colltank.x + colltank.width
      ) {
        if (
          tank.y + playerTank.height >= colltank.y &&
          tank.y <= colltank.y + colltank.height
        ) {
          if (direction == 1) {
            tank.y = colltank.y + colltank.height + 3;
          }
          if (direction == 2) {
            tank.y = colltank.y - colltank.height - 3;
          }
          if (direction == 3) {
            tank.x = colltank.x + colltank.width + 3;
          }
          if (direction == 4) {
            tank.x = colltank.x - colltank.width - 3;
          }
        }
      }
    }
    for (let i = 0; enemyTanks.length > i; i++) {
      tankToTankColl(playerTank, enemyTanks[i], playerDirection);
      tankToTankColl(enemyTanks[i], playerTank, enemyTanks[i].direction);
      // for (let j = 0; enemyTanks.length > j; j++) {
      if (enemyTanks[i + 1]) {
        tankToTankColl(
          enemyTanks[i],
          enemyTanks[i + 1],
          enemyTanks[i].direction
        );
      }
      // }
    }
    //player/enemy project collision
    function hittedByGun(projectile, target) {
      for (let i = 0; projectile.length > i; i++) {
        if (
          projectile[i].x >= target.x &&
          projectile[i].x <= target.x + target.width
        ) {
          if (
            projectile[i].y >= target.y &&
            projectile[i].y <= target.y + target.height
          ) {
            target.dura -= 1;
            drawExplosion(projectile[i].x, projectile[i].y);
            projectile.splice(i, 1);
          }
        }
      }
    }
    hittedByGun(enemyProjectiles, playerTank);
    for (let i = 0; enemyTanks.length > i; i++) {
      hittedByGun(playerProjectiles, enemyTanks[i]);
      if (enemyTanks[i].dura == 0) {
        enemyTanks.splice(i, 1);
      }
    }
  }

  function drawWalls() {
    for (let i = 0; walls.length > i; i++) {
      if (walls[i].dura == 3) {
        ctx.drawImage(
          wallBaseState,
          walls[i].x,
          walls[i].y,
          walls[i].width,
          walls[i].height
        );
      }
      if (walls[i].damageDir == 1) {
        if (walls[i].dura == 2) {
          walls[i].height = 16 * (2 / 3);
          ctx.drawImage(
            wallDam1State,
            walls[i].x,
            walls[i].y,
            walls[i].width,
            walls[i].height
          );
        }
        if (walls[i].dura == 1) {
          walls[i].height = 16 * (1 / 3);
          ctx.drawImage(
            wallDam2State,
            walls[i].x,
            walls[i].y,
            walls[i].width,
            walls[i].height
          );
        }
      }
      if (walls[i].damageDir == 2) {
        if (walls[i].dura == 2) {
          walls[i].height = 16 * (2 / 3);
          ctx.drawImage(
            wallDam1State,
            walls[i].x,
            walls[i].y,
            walls[i].width,
            walls[i].height
          );
        }
        if (walls[i].dura == 1) {
          walls[i].height = 16 * (1 / 3);
          ctx.drawImage(
            wallDam2State,
            walls[i].x,
            walls[i].y,
            walls[i].width,
            walls[i].height
          );
        }
      }
      if (walls[i].damageDir == 3) {
        if (walls[i].dura == 2) {
          walls[i].width = 16 * (2 / 3);
          ctx.drawImage(
            wallDam1State,
            walls[i].x,
            walls[i].y,
            walls[i].width,
            walls[i].height
          );
        }
        if (walls[i].dura == 1) {
          walls[i].width = 16 * (1 / 3);
          ctx.drawImage(
            wallDam2State,
            walls[i].x,
            walls[i].y,
            walls[i].width,
            walls[i].height
          );
        }
      }
      if (walls[i].damageDir == 4) {
        if (walls[i].dura == 2) {
          walls[i].width = 16 * (2 / 3);
          ctx.drawImage(
            wallDam1State,
            walls[i].x,
            walls[i].y,
            walls[i].width,
            walls[i].height
          );
        }
        if (walls[i].dura == 1) {
          walls[i].width = 16 * (1 / 3);
          walls[i].x;
          ctx.drawImage(
            wallDam2State,
            walls[i].x,
            walls[i].y,
            walls[i].width,
            walls[i].height
          );
        }
      }
      if (walls[i].dura == 0) {
        walls.splice(i, 1);
      }
    }
  }

  function createWalls() {
    let x = -12;
    for (let i = 0; 17 > i; i++) {
      x += 16;
      let wall = {
        width: 16,
        height: 16,
        x: x,
        y: gameplay.height / 2,
        dura: 3,
      };
      walls.push(wall);
    }
  }
  function drawEnemyTanks() {
    for (let i = 0; enemyTanks.length > i; i++) {
      if (enemyTanks[i].direction == 2) {
        ctx.drawImage(
          enemyTankImgDown,
          enemyTanks[i].x,
          enemyTanks[i].y,
          enemyTanks[i].width,
          enemyTanks[i].height
        );
      }
      if (enemyTanks[i].direction == 1) {
        ctx.drawImage(
          enemyTankImgUp,
          enemyTanks[i].x,
          enemyTanks[i].y,
          enemyTanks[i].width,
          enemyTanks[i].height
        );
      }
      if (enemyTanks[i].direction == 3) {
        ctx.drawImage(
          enemyTankImgLeft,
          enemyTanks[i].x,
          enemyTanks[i].y,
          enemyTanks[i].width,
          enemyTanks[i].height
        );
      }
      if (enemyTanks[i].direction == 4) {
        ctx.drawImage(
          enemyTankImgRight,
          enemyTanks[i].x,
          enemyTanks[i].y,
          enemyTanks[i].width,
          enemyTanks[i].height
        );
      }
    }
  }
  function createEnemyTanks() {
    let x = 0;

    for (let i = 0; 4 > i; i++) {
      x += 50;
      let enemyTank = {
        width: 13,
        height: 13,
        x: x,
        y: 30,
        dura: 2,
        direction: 2,
        moveDir: 1,
      };
      enemyTanks.push(enemyTank);
    }
  }

  function enemyMove() {
    enemyTanks.forEach((el) => {
      if (el.direction == 2) {
        el.y += 0.2;
      } else if (el.direction == 1) {
        el.y -= 0.2;
      } else if (el.direction == 3) {
        el.x -= 0.2;
      } else if (el.direction == 4) {
        el.x += 0.2;
      }
    });
  }
  function enemyChangeDir() {
    for (let i = 0; enemyTanks.length > i; i++) {
      enemyTanks[i].direction = Math.round(Math.random() * (4 - 1) + 1);
    }
  }
  function enemyShoot() {
    for (let i = 0; enemyTanks.length > i; i++) {
      if (
        enemyTanks[i].x + enemyTanks[i].width >= playerTank.x &&
        enemyTanks[i].x <= playerTank.x + playerTank.width
      ) {
        if (playerTank.y > enemyTanks[i].y) {
          enemyTanks[i].direction = 2;
          shot = true;
        }
        if (playerTank.y < enemyTanks[i].y) {
          enemyTanks[i].direction = 1;
          shot = true;
        }
      }
      if (
        enemyTanks[i].y + enemyTanks[i].height >= playerTank.y &&
        enemyTanks[i].y <= playerTank.y + playerTank.height
      ) {
        if (playerTank.x > enemyTanks[i].x) {
          enemyTanks[i].direction = 4;
          shot = true;
        }
        if (playerTank.x < enemyTanks[i].x) {
          enemyTanks[i].direction = 3;
          shot = true;
        }
      }
      if (shot) {
        if (enemyTanks[i].direction == 1) {
          let enemyProjectile = {
            x: enemyTanks[i].x + enemyTanks[i].width / 2,
            y: enemyTanks[i].y,
            direction: 1,
            damageDir: 1,
          };
          enemyProjectiles.push(enemyProjectile);
        } else if (enemyTanks[i].direction == 2) {
          let enemyProjectile = {
            x: enemyTanks[i].x + enemyTanks[i].width / 2,
            y: enemyTanks[i].y + enemyTanks[i].height,
            direction: 2,
            damageDir: 2,
          };
          enemyProjectiles.push(enemyProjectile);
        } else if (enemyTanks[i].direction == 4) {
          let enemyProjectile = {
            x: enemyTanks[i].x + enemyTanks[i].width,
            y: enemyTanks[i].y + enemyTanks[i].height / 2,
            direction: 3,
            damageDir: 3,
          };
          enemyProjectiles.push(enemyProjectile);
        } else if (enemyTanks[i].direction == 3) {
          let enemyProjectile = {
            x: enemyTanks[i].x,
            y: enemyTanks[i].y + enemyTanks[i].height / 2,
            direction: 4,
            damageDir: 4,
          };
          enemyProjectiles.push(enemyProjectile);
        }
        shot = false;
      }
    }
  }

  function enemyShootMoving() {
    for (let i = 0; enemyProjectiles.length > i; i++) {
      ctx.fillStyle = "red";
      if (enemyProjectiles[i].direction == 1) {
        enemyProjectiles[i].y -= 2;
      }
      if (enemyProjectiles[i].direction == 2) {
        enemyProjectiles[i].y += 2;
      }
      if (enemyProjectiles[i].direction == 3) {
        enemyProjectiles[i].x += 2;
      }
      if (enemyProjectiles[i].direction == 4) {
        enemyProjectiles[i].x -= 2;
      }
      ctx.fillRect(enemyProjectiles[i].x, enemyProjectiles[i].y, 2, 2);
    }
  }

  function drawExplosion(x, y) {
    ctx.drawImage(expl1, x - 21 / 2, y - 22 / 2, 21, 22);
    setTimeout(() => {
      ctx.drawImage(expl2, x - 21 / 2, y - 22 / 2, 21, 22);
    }, 20);
    setTimeout(() => {
      ctx.drawImage(expl3, x - 21 / 2, y - 22 / 2, 21, 22);
    }, 20);
  }

  function drawGameOver() {
    ctx.beginPath();
    ctx.fillStyle = "rgba(255,0,0,0.2)";
    ctx.fillRect(gameplay.x, gameplay.y, gameplay.width, gameplay.height);
    ctx.closePath();

    ctx.beginPath();
    ctx.font = '60px "Pixelify Sans"';
    ctx.fillStyle = "white";
    ctx.fillText(
      "YOU DEAD",
      gameplay.x + gameplay.width / 22,
      gameplay.y + gameplay.height / 3
    );
    ctx.closePath();
  }

  function drawGameWin() {
    ctx.beginPath();
    ctx.fillStyle = "rgba(20,30,50,0.2)";
    ctx.fillRect(gameplay.x, gameplay.y, gameplay.width, gameplay.height);
    ctx.closePath();

    ctx.beginPath();
    ctx.font = '60px "Pixelify Sans"';
    ctx.fillStyle = "white";
    ctx.fillText(
      "YOUR WiN !",
      gameplay.x + gameplay.width / 45,
      gameplay.y + gameplay.height / 3
    );
    ctx.closePath();
  }

  function skullDraw() {
    setInterval(() => {
      if (gameOver) {
        ctx.font = "100px sans";
        ctx.fillText(
          "💀",
          gameplay.x + gameplay.width / 4,
          gameplay.y + gameplay.height * (2 / 2.5)
        );
      }
    }, 1800);
  }
  function wonEmojiDraw() {
    setInterval(() => {
      if (gameWon) {
        ctx.font = "100px sans";
        ctx.fillText(
          "💥",
          gameplay.x + gameplay.width / 4,
          gameplay.y + gameplay.height * (2 / 2.5)
        );
      }
    }, 1800);
  }
  function drawHealth() {
    ctx.fillStyle = "brown";
    ctx.font = '20px "Pixelify Sans"';
    ctx.fillText(`❤️X${playerTank.dura}`, (game.width * 4) / 5, 40);
  }
  function drawEnemies() {
    ctx.fillStyle = "brown";
    ctx.font = '20px "Pixelify Sans"';
    ctx.fillText(`👾X${enemyTanks.length}`, (game.width * 4) / 5, 80);
  }

  window.addEventListener("keydown", (e) => {
    if (e.code == "ArrowUp") {
      playerDirection = 1;
      playerTank.y -= 1;
    }
    if (e.code == "ArrowDown") {
      playerDirection = 2;
      playerTank.y += 1;
    }
    if (e.code == "ArrowLeft") {
      playerDirection = 3;
      playerTank.x -= 1;
    }
    if (e.code == "ArrowRight") {
      playerDirection = 4;
      playerTank.x += 1;
    }
    if (e.code == "KeyW") {
      enemyTanks[0].direction = 1;
      enemyTanks[0].y -= 1;
    }
    if (e.code == "KeyS") {
      enemyTanks[0].direction = 2;
      enemyTanks[0].y += 1;
    }
    if (e.code == "KeyA") {
      enemyTanks[0].direction = 3;
      enemyTanks[0].x -= 1;
    }
    if (e.code == "KeyD") {
      enemyTanks[0].direction = 4;
      enemyTanks[0].x += 1;
    }
  });

  window.addEventListener("keydown", function shooting(e) {
    if (e.code == "Space") {
      if (playerDirection == 1) {
        playerGun = {
          x: playerTank.x + playerTank.width / 2,
          y: playerTank.y,
        };
      } else if (playerDirection == 2) {
        playerGun = {
          x: playerTank.x + playerTank.width / 2,
          y: playerTank.y + playerTank.height,
        };
      } else if (playerDirection == 4) {
        playerGun = {
          x: playerTank.x + playerTank.width,
          y: playerTank.y + playerTank.height / 2,
        };
      } else if (playerDirection == 3) {
        playerGun = {
          x: playerTank.x,
          y: playerTank.y + playerTank.height / 2,
        };
      }

      let playerProjectile = {
        x: playerGun.x,
        y: playerGun.y,
        direct: 1,
        damageDir: playerDirection,
      };
      if (playerDirection == 1) {
        playerProjectile.direct = 1;
      } else if (playerDirection == 2) {
        playerProjectile.direct = 2;
      } else if (playerDirection == 4) {
        playerProjectile.direct = 4;
      } else if (playerDirection == 3) {
        playerProjectile.direct = 3;
      }
      playerProjectiles.push(playerProjectile);
      window.removeEventListener("keydown", shooting);
      this.setTimeout(() => {
        window.addEventListener("keydown", shooting);
      }, 1500);
    }
  });

  window.addEventListener("touchstart", function moveOnTouch(e) {
    switch (e.target) {
      case upBtn:
        intervalID = setInterval(() => {
          playerDirection = 1;
          playerTank.y -= 1;
        }, 40);
        break;
      case downBtn:
        intervalID = setInterval(() => {
          playerDirection = 2;
          playerTank.y += 1;
        }, 40);
        break;
      case leftBtn:
        intervalID = setInterval(() => {
          playerDirection = 3;
          playerTank.x -= 1;
        }, 40);
        break;
      case rightBtn:
        intervalID = setInterval(() => {
          playerDirection = 4;
          playerTank.x += 1;
        }, 40);
        break;
      case shootBtn:
        if (!reload) {
          if (playerDirection == 1) {
            playerGun = {
              x: playerTank.x + playerTank.width / 2,
              y: playerTank.y,
            };
          } else if (playerDirection == 2) {
            playerGun = {
              x: playerTank.x + playerTank.width / 2,
              y: playerTank.y + playerTank.height,
            };
          } else if (playerDirection == 4) {
            playerGun = {
              x: playerTank.x + playerTank.width,
              y: playerTank.y + playerTank.height / 2,
            };
          } else if (playerDirection == 3) {
            playerGun = {
              x: playerTank.x,
              y: playerTank.y + playerTank.height / 2,
            };
          }
          let playerProjectile = {
            x: playerGun.x,
            y: playerGun.y,
            direct: 1,
            damageDir: playerDirection,
          };
          if (playerDirection == 1) {
            playerProjectile.direct = 1;
          } else if (playerDirection == 2) {
            playerProjectile.direct = 2;
          } else if (playerDirection == 4) {
            playerProjectile.direct = 4;
          } else if (playerDirection == 3) {
            playerProjectile.direct = 3;
          }
          playerProjectiles.push(playerProjectile);
          reload = true;
          setTimeout(() => {
            reload = false;
          }, 1500);
        }
        break;
    }

    window.addEventListener("touchend", (e) => {
      clearInterval(intervalID);
    });
  });
};
