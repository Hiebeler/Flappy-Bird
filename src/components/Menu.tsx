interface MenuProps {
  score: number;
  startGame: () => void;
}

function Menu(props: MenuProps) {
  return (
    <div className="w-full h-full flex flex-col justify-center items-center z-50">
      <h2 className="text-8xl text-primary MenuGameOverFont mb-10">
        Game Over
      </h2>

      <div className="flex flex-row content-between bg-[#ded996] p-5 px-8 pixelCorners">
        <div className="flex flex-col mr-16 items-center">
          <h2
            className="uppercase text-4xl text-primary mb-4"
            style={{ textShadow: "#efe9a0 0 3px" }}
          >
            Medal
          </h2>
          <div className="h-[80px] w-[80px] bg-amber-400 rounded-full"></div>
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
          className="bg-white p-5 px-8 rounded-lg w-32 mr-4 flex justify-center"
          onClick={props.startGame}
        >
          <img src="/playArrow.png" alt="" className="h-[30px]" />
        </button>
        <button className="bg-white rounded-lg w-32 ml-4 h-20">
          <div className="p-5 px-8 ">Leaderboard</div>
        </button>
      </div>
    </div>
  );
}

export default Menu;
