import React, { useEffect, useState } from 'react';
import Block from '../components/Block.jsx';
import Toolbar from '../components/Toolbar.jsx';
import DropDownWithSearch from '../components/DropDownWithSearch.jsx';
import { useParams } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useNavigate } from 'react-router-dom';
import { arraySeries, arrayTypes, formatDate } from '../utils/utils.js'
import { parse } from 'postcss';

export default function MainPage() {

    // const { user } = useAuth()
    // const { workout, setWorkout, getWorkout, createOrUpdateWorkout, deleteWorkout } = useWorkout()

    // Constantes
    const { date } = useParams() // Obtiene la fecha pasada en la URL de la página

    const todayDate = new Date() // Obtiene la fecha de hoy
    todayDate.setHours(0, 0, 0, 0)

    const actualDate = date ?? formatDate(todayDate) // Si date es undefined se iguala a todayDate

    const localValue = localStorage.getItem(actualDate + "blocklist")
    const localState = localStorage.getItem(actualDate + "modificable")
    const localType = localStorage.getItem(actualDate + "tipo")

    const [workout, setWorkout] = useState({
        date: actualDate,
        type: localType ? JSON.parse(localType) : null,
        blockList: localValue ? JSON.parse(localValue) : [],
        modificable: localState ? JSON.parse(localState) : true,
    })

    // Hooks de actualización
    useEffect(() => {
        // La función del estado se ejecutará cada vez que cambie la fecha cargando los estados correpondientes
        setWorkout(prevWorkout => ({
            ...prevWorkout,
            date: date ?? formatDate(todayDate)
        }))

    }, [date])

    useEffect(() => {
        // La función del estado se ejecutará cada vez que cambie la fecha cargando los estados correpondientes
        // getWorkout(workout.date)
        const localValue = localStorage.getItem(actualDate + "blocklist")
        const localState = localStorage.getItem(actualDate + "modificable")
        const localType = localStorage.getItem(actualDate + "tipo")

        setWorkout(prevWorkout => ({
            ...prevWorkout,
            type: localType ? JSON.parse(localType) : null,
            blockList: localValue ? JSON.parse(localValue) : [],
            modificable: localState ? JSON.parse(localState) : true,
        }))
    }, [workout.date])

    useEffect(() => { // Guarda la rutina cuando se modifica
        // if (!workout.blockList.length)
        //     localStorage.setItem(workout.date + "blocklist", JSON.stringify(workout.blockList))
        // else {
        //     localStorage.removeItem(workout.date + "blocklist")
        //     localStorage.removeItem(workout.date + "modificable")
        // }
        localStorage.setItem(actualDate + "blocklist", JSON.stringify(workout.blockList))
    }, [workout.blockList])

    useEffect(() => { // Guarda el booleano modificable cuando se modifica
        localStorage.setItem(actualDate + "modificable", JSON.stringify(workout.modificable))
    }, [workout.modificable])

    useEffect(() => { // Guarda el booleano modificable cuando se modifica
        localStorage.setItem(actualDate + "tipo", JSON.stringify(workout.type))
    }, [workout.type])

    // Funciones de la rutina
    // Funciones para manejo de bloques
    const createWorkout = (option) => {
        setWorkout(prevWorkout => ({
            ...prevWorkout,
            type: option.value
        }));
        addBlock(0)
    }

    const addBlock = (blockIndex) => {
        const newBlock = {
            series: 3,
            exerciseList: [],
        }
        const updatedBlocks = [...workout.blockList]
        updatedBlocks.splice(blockIndex, 0, newBlock)
        setWorkout(prevWorkout => ({
            ...prevWorkout,
            blockList: updatedBlocks
        }));
    }

    const updateSeries = (blockIndex, exerciseIndex, option) => {
        const updatedBlocks = [...workout.blockList]
        updatedBlocks[blockIndex].series = option
        setWorkout(prevWorkout => ({
            ...prevWorkout,
            blockList: updatedBlocks
        }))
    }

    // const updateExerciseList = (blockIndex, newExerciseList) => {
    //     const updatedBlocks = [...workout.blockList]
    //     updatedBlocks[blockIndex].exerciseList = newExerciseList
    //     setWorkout(prevWorkout => ({
    //         ...prevWorkout,
    //         blockList: updatedBlocks
    //     }))
    // }

    const deleteBlock = (blockIndex) => {
        const updatedBlocks = [...workout.blockList]
        updatedBlocks.splice(blockIndex, 1)
        setWorkout(prevWorkout => ({
            ...prevWorkout,
            blockList: updatedBlocks
        }));
    }


    // Funciones para manejo de ejercicios
    const addExerciseToBlock = (blockIndex, exercise) => {
        const newExercise = {
            label: exercise.label,
            isometric: exercise.isometric,
            weighted: exercise.weighted,
            volume: 0,
            weight: null,
        }
        const updatedBlocks = [...workout.blockList]
        updatedBlocks[blockIndex].exerciseList.push(newExercise)
        setWorkout(prevWorkout => ({
            ...prevWorkout,
            blockList: updatedBlocks
        }))
    }

    const addVolume = (blockIndex, exerciseIndex, volume) => {
        const updatedBlocks = [...workout.blockList]
        updatedBlocks[blockIndex].exerciseList[exerciseIndex].volume = volume
        setWorkout(prevWorkout => ({
            ...prevWorkout,
            blockList: updatedBlocks
        }))
    }

    const addWeight = (blockIndex, exerciseIndex, weight) => {
        const updatedBlocks = [...workout.blockList]
        updatedBlocks[blockIndex].exerciseList[exerciseIndex].weight = weight
        setWorkout(prevWorkout => ({
            ...prevWorkout,
            blockList: updatedBlocks
        }))
    }

    const moveExerciseDown = (blockIndex, exerciseIndex) => {
        if(exerciseIndex < workout.blockList[blockIndex].exerciseList.length - 1) {
            const updatedBlocks = [...workout.blockList]
            const updatedExercises = [...workout.blockList[blockIndex].exerciseList]
            const temp = updatedExercises[exerciseIndex]
            updatedExercises[exerciseIndex] = updatedExercises[exerciseIndex + 1]
            updatedExercises[exerciseIndex + 1] = temp
            updatedBlocks[blockIndex].exerciseList = updatedExercises
            setWorkout(prevWorkout => ({
                ...prevWorkout,
                blockList: updatedBlocks
            }))
        }
        
    }

    const moveExerciseUp = (blockIndex, exerciseIndex) => {
        if(exerciseIndex > 0) {
            const updatedBlocks = [...workout.blockList]
            const updatedExercises = [...workout.blockList[blockIndex].exerciseList]
            const temp = updatedExercises[exerciseIndex]
            updatedExercises[exerciseIndex] = updatedExercises[exerciseIndex - 1]
            updatedExercises[exerciseIndex - 1] = temp
            updatedBlocks[blockIndex].exerciseList = updatedExercises
            setWorkout(prevWorkout => ({
                ...prevWorkout,
                blockList: updatedBlocks
            }))
        }   
    }

    const deleteExerciseFromBlock = (blockIndex, exerciseIndex) => {
        const updatedBlocks = [...workout.blockList]
        updatedBlocks[blockIndex].exerciseList.splice(exerciseIndex, 1)
        setWorkout(prevWorkout => ({
            ...prevWorkout,
            blockList: updatedBlocks
        }))
    }


    // Funciones de los botones

    const saveWorkout = () => {
        // if (modificable)
        //     createOrUpdateWorkout(workout)
        const prevState = workout.modificable
        setWorkout(prevWorkout => ({
            ...prevWorkout,
            modificable: !prevState
        }))
    }

    const copyWorkout = () => {
        localStorage.setItem("clipboard", JSON.stringify(workout.blockList))
    }

    const pasteWorkout = () => {
        const prevBlockList = [...workout.blockList]
        const localValue = localStorage.getItem("clipboard")
        setWorkout(prevWorkout => ({
            ...prevWorkout,
            blockList: localValue ? JSON.parse(localValue) : prevBlockList
        }))
    }

    const deleteWorkout = () => {
        // deleteWorkout(workout.date)
        setWorkout(prevWorkout => ({
            ...prevWorkout,
            type: null,
            blockList: [],
            modificable: true,
        }))
        localStorage.removeItem(actualDate + "tipo")
        localStorage.removeItem(actualDate + "blocklist")
        localStorage.removeItem(actualDate + "modificable")
    }


    // Función del calendario
    const navigate = useNavigate()

    const handleDateClick = date => {
        if (date.getTime() === todayDate.getTime()) {
            navigate(`/workout`)
        }
        else {
            const formattedDate = formatDate(date)
            navigate(`/workout/${formattedDate}`)
        }
    }

    const tileClassName = ({ date, view }) => {
        // Check if the tile represents the current date
        const formattedDate = formatDate(date)

        if (view === 'month' && formattedDate === actualDate) {
            // Return the class name for the selected date
            return 'selected-day';
        }
        else if (view === 'month' && date.getTime() === todayDate.getTime()) {
            // Return the class name for the current date
            return 'current-day';
        }
        else {
            const localValue = localStorage.getItem(formattedDate + "tipo")
            const parseValue = localValue ? JSON.parse(localValue) : ""

            if (view === 'month' && parseValue && parseValue.length > 0) {
                return 'workout-day';
            }
        };
        return null;
    }

    return (
        <>
            <Toolbar />
            <section className='parent-section'>
                <section className='routine-section'>
                    <div style={{ fontSize: '20px' }}>
                        <h2 >Entrenamiento del Día:</h2>
                        <h2 style={{ color: '#f3969a', fontWeight: 'bold', textAlign: 'center', marginBottom: '20px' }}>{workout.type}</h2>
                    </div>
                    <ul className='list'>
                        {(workout.blockList).map((block, blockIndex) => {
                            return (
                                <li key={blockIndex} style={{ marginBottom: '30px' }}>
                                    <div style={{ border: '2px solid black', padding: '10px', margin: '5px' }}>
                                        <Block
                                            {...block}
                                            blockIndex={blockIndex}
                                            series={block.series}
                                            exerciseList={block.exerciseList}
                                            modificable={workout.modificable}
                                            updateSeries={updateSeries}
                                            addVolume={addVolume}
                                            addExercise={(exercise) => addExerciseToBlock(blockIndex, exercise)}
                                            addWeight={addWeight}
                                            moveExerciseDown={moveExerciseDown}
                                            moveExerciseUp={moveExerciseUp}
                                            deleteExercise={deleteExerciseFromBlock} />
                                    </div>
                                    {workout.modificable && 
                                        <div>
                                            <button className="btn btn-danger" onClick={() => deleteBlock(blockIndex)}>x</button>
                                            <button className="btn btn-success" onClick={() => addBlock(blockIndex + 1)}>+</button>
                                        </div>
                                    }
                                </li>
                            )
                        })}
                        {workout.modificable && !workout.type && <DropDownWithSearch onChange={createWorkout} options={arrayTypes} text="Crear..." />}                        
                    </ul>
                </section>
                <section className='calendar-section'>
                    <div>
                        <div className='btn-group text-white' style={{ width: '50vh' }}>
                            <button className="big-button" type="button" onClick={saveWorkout}>{(workout.modificable && "Guardar" || "Modificar")}</button>
                            <button className="big-button" type="button" onClick={copyWorkout}>Copiar Rutina</button>
                            <button className="big-button" type="button" onClick={pasteWorkout}>Pegar Rutina</button>
                            <button className="big-button" type="button" onClick={deleteWorkout}>Borrar</button>
                        </div>
                        <Calendar
                            onClickDay={handleDateClick}
                            tileClassName={tileClassName}
                        />
                    </div>
                </section>
            </section>
        </>
    )
}

