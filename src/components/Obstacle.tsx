import { useEffect, useState } from "react";

interface ObstacleProps {
  position: number;
  topHeight: number;
  spaceBetween: number;
  gameHeight: number;
  gameWidht: number;
}

function Obstacle(props: ObstacleProps) {
  const [position, setPosition] = useState(0);
  useEffect(() => {
    console.log(window.innerWidth);
    let innerWidth = window.innerWidth;
    console.log(innerWidth / 2 - props.gameWidht/2 + props.position);
    setPosition(innerWidth / 2 - props.gameWidht/2 + props.position);
  })

  return (
    <div
      className="w-[40px] bg-green-700 absolute"
      style={{ left: position, height: props.gameHeight }}
    >
      <div
        className="bg-green-900 relative"
        style={{
          top: 0,
          height: props.topHeight,
        }}
      ></div>

      <div
        className="bg-green-900 relative"
        style={{
          top: props.spaceBetween,
          height: props.gameHeight - props.spaceBetween - props.topHeight,
        }}
      ></div>
    </div>
  );
}

export default Obstacle;
