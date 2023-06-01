import { useEffect, useRef, useState } from "react";
import Bird from "./Bird";
import Obstacle from "./Obstacle";
import Score from "./Score";
import Menu from "./Menu";
import { request } from "https";

interface IObstacle {
  position: number;
  topHeight: number;
  bottomHeight: number;
  counted: boolean;
}

function GameBoard() {
  const requestRef = useRef<any>();
  const lastUpdateTimeRef = useRef(0);
  const progressTimeRef = useRef(0);
  const lastDeltaTime = useRef(0);
  const gameSpeed = 20;

  const [HEIGHT, setHeight] = useState<number>(500);
  const [WIDTH, setWidth] = useState<number>(1000);
  const BIRDWIDTH = 17 * 3.3;
  const BIRDHEIGHT = 12 * 3.3;
  const GRAVITY = 0.04;
  const JUMP_SPEED = -14;
  const MAXSPEED = 0.3;
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
  const score = useRef(0);
  const [menu, setMenu] = useState<boolean>(false);

  useEffect(() => {
    setHeight(window.innerHeight - 100);
    setWidth(window.innerWidth);

    initializeObstacles(500, window.innerHeight - 100, window.innerWidth);
  }, []);

  function initializeObstacles(
    startingPosition: number,
    height: number,
    widht: number
  ) {
    let obstaclesArr: IObstacle[] = [];
    let position = startingPosition;
    while (position < window.innerWidth) {
      const topHeight =
        Math.random() * (height - OBSTACLESPACEBETWEEN - 50 - 50) + 50;
      obstaclesArr.push({
        position: position,
        topHeight: topHeight,
        bottomHeight: height - topHeight - OBSTACLESPACEBETWEEN,
        counted: false,
      });
      position += OBSTACLESSPACEBETWEENHORIZONTAL;
    }
    setObstacles(obstaclesArr);
  }

  const update = (time: any) => {
    requestRef.current = requestAnimationFrame(update);
    if (!lastUpdateTimeRef.current) {
      lastUpdateTimeRef.current = time;
    }
    const deltaTime = time - lastUpdateTimeRef.current;
    progressTimeRef.current += deltaTime;
    if (progressTimeRef.current > gameSpeed) {
      if (startedGame) {
        lastDeltaTime.current = progressTimeRef.current;
        eachFrame(progressTimeRef.current);
      }
      progressTimeRef.current = 0;
    }
    lastUpdateTimeRef.current = time;
  };

  function eachFrame(deltaTime: number) {
    if (dead) {
      if (birdPosition < HEIGHT - BIRDHEIGHT) {
        setBirdSpeed(MAXSPEED * deltaTime);
        setBirdPosition((birdPosition) => (birdPosition += birdSpeed));
      } else {
        setBirdPosition(HEIGHT - BIRDHEIGHT);
        setBirdSpeed(14);
      }
    } else {
      moveBird(deltaTime);
      moveObstacle();
      checkForCollision();
    }
  }

  useEffect(() => {
    requestRef.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(requestRef.current);
  });

  /* useEffect(() => {
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
*/
  function moveBird(detlaTime: number) {
    if (birdPosition < HEIGHT - BIRDHEIGHT) {
      setBirdPosition((birdPosition) => (birdPosition += birdSpeed));
      setBirdSpeed((birdSpeed) => {
        if (birdSpeed + GRAVITY * detlaTime > MAXSPEED * detlaTime) {
          return MAXSPEED * detlaTime;
        }
        return (birdSpeed += GRAVITY * detlaTime);
      });
    } else {
      dying();
    }
  }

  function dying() {
    setDead(true);
    setMenu(true);
  }

  function restart() {
    setMenu(false);
    score.current = 0;
    setStartedGame(false);
    initializeObstacles(500, window.innerHeight - 100, window.innerWidth);
    setDead(false);
    setBirdPosition(HEIGHT / 2 + BIRDHEIGHT);
    setBirdSpeed(JUMP_SPEED);
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

  function checkForCollision() {
    let birdYPositionCollision = BIRDYPOSITION;
    let birdWidth = BIRDWIDTH;
    if (birdSpeed > (MAXSPEED - 0.1) * lastDeltaTime.current) {
      birdYPositionCollision += 10;
      birdWidth -= 20;
    } else {
      birdYPositionCollision += 5;
      birdWidth -= 5;
    }
    obstacles.forEach((obstacle) => {
      if (
        obstacle.position - birdWidth > birdYPositionCollision ||
        obstacle.position + OBSTACLEWIDTH < birdYPositionCollision
      ) {
        return;
      } else {
        if (!obstacle.counted) {
          score.current += 1;
          obstacle.counted = true;
        }
      }
      if (birdPosition < obstacle.topHeight) {
        dying();
      } else if (
        birdPosition + BIRDHEIGHT >
        obstacle.topHeight + OBSTACLESPACEBETWEEN
      ) {
        dying();
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

  useEffect(() => {
    window.addEventListener("keypress", (e) => {
      keyPress(e.key);
    });

    const keyPress = (key: string) => {
      if (key === " ") {
        click();
      }
    };

    return () => {
      window.removeEventListener("keypress", (e) => {
        keyPress(e.key);
      });
    };
  });

  return (
    <div>
      <div
        className={`bg-cyan-200 flex relative overflow-hidden select-none bg-[url('../public/background.png')] bg-repeat-x bg-bottom`}
        style={{ height: HEIGHT, width: WIDTH }}
        onClick={() => click()}
      >
        {menu ? (
          <Menu score={score.current} startGame={() => restart()} />
        ) : (
          <Score score={score.current} />
        )}
        <Bird
          position={birdPosition}
          BIRDHEIGHT={BIRDHEIGHT}
          BIRDWIDTH={BIRDWIDTH}
          BIRDYPOSITION={BIRDYPOSITION}
          movingUpWards={
            birdSpeed <
            (lastDeltaTime.current === 0
              ? 1
              : (MAXSPEED - 0.1) * lastDeltaTime.current)
          }
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
      <div className="relative h-[100px] w-full bg-slate-500 bottom-0 flex flex-row">
        <img src="/floor.png" alt="" className="h-[100px]" />
        <img src="/floor.png" alt="" className="h-[100px]" />
        <img src="/floor.png" alt="" className="h-[100px]" />
      </div>
    </div>
  );
}

export default GameBoard;
