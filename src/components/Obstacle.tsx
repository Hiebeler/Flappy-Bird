interface ObstacleProps {
  obstacleWidth: number;
  position: number;
  topHeight: number;
  bottomHeight: number;
  gameHeight: number;
  gameWidht: number;
}

function Obstacle(props: ObstacleProps) {

  return (
    <div
      className="w-[40px] absolute z-10"
      style={{ left: props.position, height: props.gameHeight, width: props.obstacleWidth }}
    >
      <div
        className="relative flex flex-col"
        style={{
          top: 0,
          height: props.topHeight,
        }}
      >
        <img src="/obstacle_bottomPart.png" alt="" className="basis-full"/>
        <img src="/obstacle_topPart.png" alt="" />
      </div>

      <div
        className="relative"
        style={{
          top: props.gameHeight - (props.topHeight + props.bottomHeight),
          height: props.bottomHeight,
        }}
      >
        <img src="/obstacle_topPart.png" alt="" />
        <img src="/obstacle_bottomPart.png" alt="" className="h-full"/>

      </div>
    </div>
  );
}

export default Obstacle;
