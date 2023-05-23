interface BirdProps {
  BIRDHEIGHT: number;
  BIRDWIDTH: number;
  position: number;
}

function Bird(props: BirdProps) {
  return (
    <div
      className="rounded-full bg-red-700 absolute ml-4"
      style={{
        top: props.position,
        width: props.BIRDWIDTH,
        height: props.BIRDHEIGHT,
      }}
    ></div>
  );
}

export default Bird;
