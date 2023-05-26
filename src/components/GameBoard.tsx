import { useEffect, useState } from "react";
import Bird from "./Bird";
import Obstacle from "./Obstacle";
import Score from "./Score";
import Menu from "./Menu";

interface IObstacle {
  position: number;
  topHeight: number;
  bottomHeight: number;
  counted: boolean;
}

function GameBoard() {
  const HEIGHT = 700;
  const WIDTH = 1000;
  const BIRDWIDTH = 17 * 3.3;
  const BIRDHEIGHT = 12 * 3.3;
  const GRAVITY = 1.3;
  const JUMP_SPEED = -12;
  const MAXSPEED = 15;
  const OBSTACLEWIDTH = 60;
  const OBSTACLESPEED = 3;
  const OBSTACLESPACEBETWEEN = 180;
  const BIRDYPOSITION = 300;
  const OBSTACLESSPACEBETWEENHORIZONTAL = 200;
  const [birdSpeed, setBirdSpeed] = useState(0);
  const [birdPosition, setBirdPosition] = useState(HEIGHT / 2 + BIRDHEIGHT);
  const [startedGame, setStartedGame] = useState(false);
  const [dead, setDead] = useState(false);
  const [obstacles, setObstacles] = useState<IObstacle[]>([]);
  const [score, setScore] = useState<number>(0);
  const [menu, setMenu] = useState<boolean>(false);

  useEffect(() => {
    initializeObstacles(500);
  }, []);

  function initializeObstacles(startingPosition: number) {
    let obstaclesArr: IObstacle[] = [];
    let position = startingPosition;
    while (position < WIDTH) {
      const topHeight =
        Math.random() * (HEIGHT - OBSTACLESPACEBETWEEN - 50 - 50) + 50;
      obstaclesArr.push({
        position: position,
        topHeight: topHeight,
        bottomHeight: HEIGHT - topHeight - OBSTACLESPACEBETWEEN,
        counted: false,
      });
      position += OBSTACLESSPACEBETWEENHORIZONTAL;
    }
    setObstacles(obstaclesArr);
  }

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (startedGame) {
      interval = setInterval(() => {
        if (dead) {
          if (birdPosition < HEIGHT - BIRDHEIGHT) {
            setBirdSpeed(MAXSPEED);
            setBirdPosition((birdPosition) => (birdPosition += birdSpeed));
          } else {
            setBirdPosition(HEIGHT - BIRDHEIGHT);
            setBirdSpeed(MAXSPEED);
          }
        } else {
          moveBird(interval);
          moveObstacle();
          checkForCollision(interval);
        }
      }, 24);
    }

    return () => {
      clearInterval(interval);
    };
  });

  function moveBird(interval: ReturnType<typeof setInterval>) {
    if (birdPosition < HEIGHT - BIRDHEIGHT) {
      setBirdPosition((birdPosition) => (birdPosition += birdSpeed));
      setBirdSpeed((birdSpeed) => {
        if (birdSpeed + GRAVITY > MAXSPEED) {
          return MAXSPEED;
        }
        return (birdSpeed += GRAVITY);
      });
    } else {
      dying(interval);
    }
  }

  function dying(interval: ReturnType<typeof setInterval>) {
    setDead(true);
    setMenu(true);
    clearInterval(interval);
  }

  function restart() {
    setMenu(false);
    setScore(0);
    setStartedGame(false);
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
          setScore((score) => {
            return score + 1;
          });
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
      className={`bg-cyan-200 flex relative overflow-hidden select-none`}
      style={{ height: HEIGHT, width: WIDTH }}
      onClick={() => click()}
    >
      {menu ? <Menu score={score} startGame={() => restart()}/> : <Score score={score} />}
      <Bird
        position={birdPosition}
        BIRDHEIGHT={BIRDHEIGHT}
        BIRDWIDTH={BIRDWIDTH}
        BIRDYPOSITION={BIRDYPOSITION}
        movingUpWards={birdSpeed < 12}
      />
      {obstacles.map((obstacle, index) => {
        return (
          <Obstacle
            obstacleWidth={OBSTACLEWIDTH}
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
