interface BirdProps {
  BIRDHEIGHT: number;
  BIRDWIDTH: number;
  BIRDYPOSITION: number;
  position: number;
  movingUpWards: boolean;
}

function Bird(props: BirdProps) {
  return (
    <div
      className="absolute ml-4 z-20"
      style={{
        top: props.position,
        width: props.BIRDWIDTH,
        height: props.BIRDHEIGHT,
        marginLeft: props.BIRDYPOSITION,
        rotate: props.movingUpWards ? '-25deg': '70deg'
      }}
    >
      <img src="/bird.png" alt="bird"/>
    </div>
  );
}

export default Bird;
