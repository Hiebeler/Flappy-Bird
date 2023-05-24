import { useEffect, useState } from "react";
import Bird from "./Bird";
import Obstacle from "./Obstacle";

function GameBoard() {
  const HEIGHT = 700;
  const WIDTH = 1000;
  const BIRDWIDTH = 40;
  const BIRDHEIGHT = 40;
  const GRAVITY = 1;
  const JUMP_SPEED = -14;
  const OBSTACLEWIDTH = 40;
  const OBSTACLESPEED = 3;
  const OBSTACLESPACEBETWEEN = 250;
  const BIRDYPOSITION = 10;
  const [birdSpeed, setBirdSpeed] = useState(0);
  const [birdPosition, setBirdPosition] = useState(HEIGHT / 2 + BIRDHEIGHT);
  const [startedGame, setStartedGame] = useState(false);
  const [dead, setDead] = useState(false);
  const [obstacles, setObstacles] = useState([
    {
      position: 400,
      topHeight: 300,
      bottomHeight: HEIGHT - 100 - OBSTACLESPACEBETWEEN,
    },
    {
      position: 600,
      topHeight: 200,
      bottomHeight: HEIGHT - 100 - OBSTACLESPACEBETWEEN,
    },
    {
      position: 800,
      topHeight: 100,
      bottomHeight: HEIGHT - 100 - OBSTACLESPACEBETWEEN,
    },
    {
      position: 960,
      topHeight: 200,
      bottomHeight: HEIGHT - 100 - OBSTACLESPACEBETWEEN,
    },
  ]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (startedGame) {
      interval = setInterval(() => {
        moveBird(interval);
        moveObstacle();
        checkForCollision(interval);
      }, 24);
    }

    return () => {
      clearInterval(interval);
    };
  });

  function moveBird(interval: ReturnType<typeof setInterval>) {
    if (birdPosition < HEIGHT - BIRDHEIGHT) {
      setBirdPosition((birdPosition) => (birdPosition += birdSpeed));
      setBirdSpeed((birdSpeed) => (birdSpeed += GRAVITY));
    } else {
      dying(interval);
    }
  }

  function dying(interval: ReturnType<typeof setInterval>) {
    setDead(true);
    setStartedGame(false);
    clearInterval(interval);
    setTimeout(() => restart(), 3000);
  }

  function restart() {
    setDead(false);
    setBirdPosition(HEIGHT / 2 + BIRDHEIGHT);
    setBirdSpeed(0);
  }

  function moveObstacle() {
    let obstaclesPositionsCopie = obstacles.map((obstacle) => {
      obstacle.position = obstacle.position - OBSTACLESPEED;
      return obstacle;
    });
    obstaclesPositionsCopie = obstaclesPositionsCopie.filter(
      (obstacle) => obstacle.position + OBSTACLEWIDTH > 0
    );

    setObstacles(obstaclesPositionsCopie);
  }

  function checkForCollision(interval: ReturnType<typeof setInterval>) {
    obstacles.forEach((obstacle) => {
      if (
        obstacle.position - BIRDWIDTH > BIRDYPOSITION ||
        obstacle.position + OBSTACLEWIDTH < BIRDYPOSITION
      ) {
        return;
      }
      if (birdPosition < obstacle.topHeight) {
        dying(interval);
      } else if (birdPosition + BIRDHEIGHT > obstacle.topHeight + OBSTACLESPACEBETWEEN) {
        dying(interval);
      }
    });
  }

  function click() {
    if (dead) return;
    if (!startedGame) setStartedGame(true);
    if (birdPosition > BIRDHEIGHT * -1) {
      setBirdSpeed(JUMP_SPEED);
    }
  }

  return (
    <div
      className={`bg-blue-700 flex flex-row overflow-hidden`}
      style={{ height: HEIGHT, width: WIDTH }}
      onClick={() => click()}
    >
      <Bird
        position={birdPosition}
        BIRDHEIGHT={BIRDHEIGHT}
        BIRDWIDTH={BIRDWIDTH}
        BIRDYPOSITION={BIRDYPOSITION}
      />
      {obstacles.map((obstacle, index) => {
        return (
          <Obstacle
            position={obstacle.position}
            topHeight={obstacle.topHeight}
            spaceBetween={OBSTACLESPACEBETWEEN}
            gameHeight={HEIGHT}
            gameWidht={WIDTH}
            key={index}
          />
        );
      })}
    </div>
  );
}

export default GameBoard;
