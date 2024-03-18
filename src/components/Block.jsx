import React, { useEffect, useState } from 'react';
import DropDown from "./DropDown";
import DropDownWithSearch from "./DropDownWithSearch";
import { exercises } from '../utils/exercises.json';
import { arrayReps, arrayTime, arrayWeights } from '../utils/utils.js'

export default function Block({ blockIndex, series, exerciseList, modificable, updateSeries, addVolume, addExercise, addWeight, moveExerciseDown, moveExerciseUp, deleteExercise }) {

    return (
        <>
            <div className="btn-group" style={{ borderBottom: '2px solid black', padding: '5px', margin: '3px' }}>
                <DropDown modificable={modificable} blockIndex={blockIndex} onClick={updateSeries} options={[1, 2, 3, 4, 5, 6]}
                    text={series}
                />
                {"\u00A0"} {series > 1 && "series" || "serie"} {" de:"}
            </div>
            <ul className="list">
                {exerciseList && exerciseList.map((exercise, exerciseIndex) => {
                    return (
                        <li key={exerciseIndex} className='btn-group' style={{ marginBottom: '5px' }}>
                                <DropDown modificable={modificable} blockIndex={blockIndex} exerciseIndex={exerciseIndex} onClick={addVolume} options={exercise.isometric && arrayTime || arrayReps}
                                    text={exercise.volume === 0 && "*" ||
                                        exercise.isometric && exercise.volume !== "Max" && (exercise.volume + "s") ||
                                        (exercise.volume)}
                                />

                                {'\u00A0' + exercise.label + '\u00A0'}
                                {exercise.weighted &&
                                    <DropDown modificable={modificable} blockIndex={blockIndex} exerciseIndex={exerciseIndex} onClick={addWeight} options={exercise.weighted && arrayWeights}
                                        text={exercise.weight === null && "Lastre" ||
                                            exercise.weight === "Libre" && exercise.weight ||
                                            exercise.weight === "Banda" && ("con " + exercise.weight) ||
                                            ("con " + exercise.weight + " kg")}
                                    />}

                                {'\u00A0 \u00A0'}

                                {modificable && 
                                <div>
                                    {(exerciseIndex < exerciseList.length - 1) && 
                                    <button className="btn btn-success" onClick={() => moveExerciseDown(blockIndex, exerciseIndex)}>v</button>}
                                    {(exerciseIndex > 0) &&
                                    <button className="btn btn-success" onClick={() => moveExerciseUp(blockIndex, exerciseIndex)}>^</button>}
                                    <button className="btn btn-danger" onClick={() => deleteExercise(blockIndex, exerciseIndex)}>x</button>
                                </div>
                                }
                        </li>
                    )
                })}
                {modificable && <DropDownWithSearch onChange={addExercise} options={exercises} text={"Agregar Ejercicio..."} />}
            </ul>
        </>
    )
}