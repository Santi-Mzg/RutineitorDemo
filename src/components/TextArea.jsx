<textarea style={{ height: '20px', width: '40px', backgroundColor: 'white'}} disabled={!modificable} blockIndex={blockIndex} exerciseIndex={exerciseIndex} onClick={addVolume} options={exercise.isometric && arrayTime || arrayReps}
    value={exercise.volume === 0 && "*" ||
        exercise.isometric && exercise.volume !== "Max" && (exercise.volume + "s") ||
        (exercise.volume)}
/>