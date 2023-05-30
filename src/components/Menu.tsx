interface MenuProps {
  score: number;
  startGame: () => void;
}

function Menu(props: MenuProps) {

  function getMedalColor() {
    if (props.score < 10) {
      return "blank";
    } else if (props.score < 20) {
      return "bronze";
    } else if (props.score < 30) {
      return "silver";
    } else if (props.score < 40) {
      return "gold";
    } else {
      return "platin";
    }
  }

  return (
    <div className="w-full h-full flex flex-col justify-center items-center z-50">
      <img src="/GameOver.png" alt="" className="w-[340px]"/>

      <div className="flex flex-row content-between bg-[url('../public/ScoreBoard.svg')] p-5 px-12 bg-contain">
        <div className="flex flex-col mr-16 items-center">
          <h2
            className="uppercase text-4xl text-primary mb-4"
            style={{ textShadow: "#efe9a0 0 3px" }}
          >
            Medal
          </h2>
          <div className="h-[80px] w-[80px]"><img src={`/medal_${getMedalColor()}.png`} alt="" /></div>
        </div>
        <div className="flex flex-col">
          <h2
            className="uppercase text-4xl text-primary"
            style={{ textShadow: "#efe9a0 0 3px" }}
          >
            Score
          </h2>
          <p className="MenuScoreFont text-white text-4xl text-center">
            {props.score}
          </p>
          <h2
            className="uppercase text-4xl text-primary"
            style={{ textShadow: "#efe9a0 0 3px" }}
          >
            Best
          </h2>
          <p className="MenuScoreFont text-white text-4xl text-center">
            {props.score}
          </p>
        </div>
      </div>
      <div className="mt-20 flex flex-row">
        <button
          className="p-5 px-8 w-32 mr-4 flex justify-center items-center bg-[url('../public/ButtonBackground.svg')] bg-contain bg-no-repeat"
          onClick={props.startGame}
        >
          <img src="/playArrow.png" alt="" className="h-[30px]" />
        </button>
        <button className="h-20 p-5 px-8 w-32 mr-4 flex justify-center items-center bg-[url('../public/ButtonBackground.svg')] bg-contain bg-no-repeat">
        <img src="/leaderboard.png" alt="" className="h-[30px]" />
        </button>
      </div>
    </div>
  );
}

export default Menu;
