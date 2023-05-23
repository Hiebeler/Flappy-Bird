import { useEffect, useState } from "react";
import Bird from "./Bird";

function GameBoard() {
  const HEIGHT = 700;
  const WIDTH = 1000;
  const BIRDWIDTH = 40;
  const BIRDHEIGHT = 40;
  const GRAVITY = 1;
  const JUMP_SPEED = -14;
  const [birdSpeed, setBirdSpeed] = useState(0);
  const [birdPosition, setBirdPosition] = useState(HEIGHT / 2 + BIRDHEIGHT);
  const [startedGame, setStartedGame] = useState(false);
 
  useEffect(() => {
    console.log("start")
    let gravityInterval: ReturnType<typeof setInterval>;
    if (startedGame) {
      gravityInterval = setInterval(() => {
        if (birdPosition < HEIGHT - BIRDHEIGHT) {
            setBirdPosition((birdPosition) => (birdPosition += birdSpeed));
            setBirdSpeed((birdSpeed) => (birdSpeed += GRAVITY))
        } else {
            setStartedGame(false);
            clearInterval(gravityInterval);
            console.log("dead");
            setTimeout(() => restart(), 3000)
        }
      }, 24);
    }

    return (() => {
        clearInterval(gravityInterval);
    })
  });

  function restart() {
    setBirdPosition(HEIGHT / 2 + BIRDHEIGHT);
    setBirdSpeed(0);
  }

  function click() {
    if (!startedGame) setStartedGame(true);
    if (birdPosition > 0) {
        setBirdSpeed(JUMP_SPEED);
    }
  }

  return (
    <div className={`bg-blue-700`} style={{ height: HEIGHT, width: WIDTH }} onClick={() => click()}>
      <Bird
        position={birdPosition}
        BIRDHEIGHT={BIRDHEIGHT}
        BIRDWIDTH={BIRDWIDTH}
      />
    </div>
  );
}

export default GameBoard;
