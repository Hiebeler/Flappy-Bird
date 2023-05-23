interface ObstacleProps {
  position: number;
  topHeight: number;
  spaceBetween: number;
  gameHeight: number;
}

function Obstacle(props: ObstacleProps) {
  return (
    <div
      className="w-[40px] h-full bg-green-700 relative"
      style={{ left: props.position }}
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
