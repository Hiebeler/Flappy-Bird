interface BirdProps {
  BIRDHEIGHT: number;
  BIRDWIDTH: number;
  BIRDYPOSITION: number;
  position: number;
}

function Bird(props: BirdProps) {
  return (
    <div
      className="rounded-full bg-amber-600 absolute ml-4"
      style={{
        top: props.position,
        width: props.BIRDWIDTH,
        height: props.BIRDHEIGHT,
        marginLeft: props.BIRDYPOSITION
      }}
    ></div>
  );
}

export default Bird;
