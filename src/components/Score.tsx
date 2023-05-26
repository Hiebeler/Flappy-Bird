interface ScoreProps {
    score: number;
}

function Score (props: ScoreProps) {
    return (
        <div className="w-full flex justify-center z-50 ScoreFont">
            <h2 className="text-7xl text-white" style={{fontFamily: 'FlappyBirdNumbers'}}>
                {props.score}
            </h2>
        </div>
    )
}

export default Score;