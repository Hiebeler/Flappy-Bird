interface ObstacleProps {
  position: number;
  topHeight: number;
  bottomHeight: number;
  gameHeight: number;
  gameWidht: number;
}

function Obstacle(props: ObstacleProps) {

  return (
    <div
      className="w-[40px] absolute"
      style={{ left: props.position, height: props.gameHeight }}
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
          top: 200,
          height: props.bottomHeight,
        }}
      ></div>
    </div>
  );
}

export default Obstacle;
