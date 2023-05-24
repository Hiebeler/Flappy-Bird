import { useEffect, useState } from "react";
import Bird from "./Bird";
import Obstacle from "./Obstacle";

interface Obstacle {
  position: number;
  topHeight: number;
  bottomHeight: number;
  counted: boolean;
}

function GameBoard() {
  const HEIGHT = 700;
  const WIDTH = 1000;
  const BIRDWIDTH = 40;
  const BIRDHEIGHT = 40;
  const GRAVITY = 1.3;
  const JUMP_SPEED = -14;
  const OBSTACLEWIDTH = 40;
  const OBSTACLESPEED = 3;
  const OBSTACLESPACEBETWEEN = 200;
  const BIRDYPOSITION = 300;
  const OBSTACLESSPACEBETWEENHORIZONTAL = 170;
  const [birdSpeed, setBirdSpeed] = useState(0);
  const [birdPosition, setBirdPosition] = useState(HEIGHT / 2 + BIRDHEIGHT);
  const [startedGame, setStartedGame] = useState(false);
  const [dead, setDead] = useState(false);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [score, setScore] = useState<number>(0);

  useEffect(() => {
    initializeObstacles(500);
  }, []);

  function initializeObstacles(startingPosition: number) {
    let obstaclesArr: Obstacle[] = [];
    let position = startingPosition;
    while (position < WIDTH) {
      const topHeight =
        Math.random() * (HEIGHT - OBSTACLESPACEBETWEEN - 50 - 50) + 50;
      obstaclesArr.push({
        position: position,
        topHeight: topHeight,
        bottomHeight: HEIGHT - topHeight - OBSTACLESPACEBETWEEN,
        counted: false
      });
      position += OBSTACLESSPACEBETWEENHORIZONTAL;
    }
    setObstacles(obstaclesArr);
  }

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
    initializeObstacles(500);
    setDead(false);
    setBirdPosition(HEIGHT / 2 + BIRDHEIGHT);
    setBirdSpeed(0);
  }

  function moveObstacle() {
    checkIfShouldSpawnNewObstacle(obstacles[obstacles.length - 1]);
    let obstaclesPositionsCopie = obstacles.map((obstacle) => {
      obstacle.position = obstacle.position - OBSTACLESPEED;
      return obstacle;
    });
    obstaclesPositionsCopie = obstaclesPositionsCopie.filter(
      (obstacle) => obstacle.position + OBSTACLEWIDTH > 0
    );

    setObstacles(obstaclesPositionsCopie);
  }

  function checkIfShouldSpawnNewObstacle(obstacle: any) {
    if (obstacle.position < WIDTH - OBSTACLESSPACEBETWEENHORIZONTAL) {
      spawnObstacle();
    }
  }

  function spawnObstacle(position?: number) {
    const topHeight =
      Math.random() * (HEIGHT - OBSTACLESPACEBETWEEN - 50 - 50) + 50;
    const bottomHeight = HEIGHT - topHeight - OBSTACLESPACEBETWEEN;
    let obstaclesCopie = obstacles;
    obstaclesCopie.push({
      position: position ?? WIDTH,
      topHeight: topHeight,
      bottomHeight: bottomHeight,
      counted: false,
    });
    setObstacles(obstaclesCopie);
  }

  function checkForCollision(interval: ReturnType<typeof setInterval>) {
    obstacles.forEach((obstacle) => {
      if (
        obstacle.position - BIRDWIDTH > BIRDYPOSITION ||
        obstacle.position + OBSTACLEWIDTH < BIRDYPOSITION
      ) {
        return;
      } else {
        if (!obstacle.counted) {
          setScore((score) => {return score + 1})
          obstacle.counted = true;
        }
      }
      if (birdPosition < obstacle.topHeight) {
        dying(interval);
      } else if (
        birdPosition + BIRDHEIGHT >
        obstacle.topHeight + OBSTACLESPACEBETWEEN
      ) {
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
      className={`bg-blue-700 flex flex-row relative overflow-hidden`}
      style={{ height: HEIGHT, width: WIDTH }}
      onClick={() => click()}
    >
      {score}
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
            bottomHeight={obstacle.bottomHeight}
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
