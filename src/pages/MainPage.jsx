import React, { useEffect, useState } from 'react';
import Block from '../components/Block.jsx';
import Toolbar from '../components/Toolbar.jsx';
import DropDownWithSearch from '../components/DropDownWithSearch.jsx';
import { useParams } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useNavigate } from 'react-router-dom';
import { arraySeries, formatDate } from '../utils/utils.js'

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

    const [workout, setWorkout] = useState({
        date: actualDate,
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

        setWorkout(prevWorkout => ({
            ...prevWorkout,
            blockList: localValue ? JSON.parse(localValue) : [],
            modificable: localState ? JSON.parse(localState) : true,
        }))
    }, [workout.date])

    useEffect(() => { // Guarda la rutina cuando se modifica
        localStorage.setItem(workout.date + "blocklist", JSON.stringify(workout.blockList))
    }, [workout.blockList])

    useEffect(() => { // Guarda el booleano modificable cuando se modifica
        localStorage.setItem(workout.date + "modificable", JSON.stringify(workout.modificable))
    }, [workout.modificable])

    // Funciones de la rutina
    const addBlock = (option) => {
        const newBlock = {
            series: option.value,
            exerciseList: [],
        }

        setWorkout(prevWorkout => ({
            ...prevWorkout,
            blockList: [...prevWorkout.blockList, newBlock]
        }));
    }

    const deleteBlock = (index) => {
        const updatedBlocks = [...workout.blockList]
        updatedBlocks.splice(index, 1)
        setWorkout(prevWorkout => ({
            ...prevWorkout,
            blockList: updatedBlocks
        }));
    }

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

    const deleteExerciseFromBlock = (blockIndex, exerciseIndex) => {
        const updatedBlocks = [...workout.blockList]
        updatedBlocks[blockIndex].exerciseList.splice(exerciseIndex, 1)
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

    const cleanWorkout = () => {
        // deleteWorkout(workout.date)
        setWorkout(prevWorkout => ({
            ...prevWorkout,
            blockList: [],
            modificable: true,
        }))

        localStorage.removeItem(workout.date + "blocklist")
        localStorage.removeItem(workout.date + "modificable")
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

    return (
        <>
            <Toolbar />
            <section className='section-parent'>
                <section className='section-routine'>
                    <h3>Entrenamiento del Día</h3>
                    <ul className='list'>
                        {(workout.blockList).map((block, blockIndex) => {
                            return (
                                <li key={blockIndex} style={{ marginBottom: '30px' }}>
                                    <Block
                                        {...block}
                                        blockIndex={blockIndex}
                                        series={block.series}
                                        exerciseList={block.exerciseList}
                                        modificable={workout.modificable}
                                        addVolume={addVolume}
                                        addExercise={(exercise) => addExerciseToBlock(blockIndex, exercise)}
                                        addWeight={addWeight}
                                        deleteExercise={deleteExerciseFromBlock} />
                                    {workout.modificable && <button className="btn btn-danger" onClick={() => deleteBlock(blockIndex)}>X</button>}
                                </li>
                            )
                        })}
                        {workout.modificable && <DropDownWithSearch onChange={addBlock} options={arraySeries} text="Agregar Bloque..." />}
                    </ul>
                </section>
                <section className='section-calendar'>
                    <Calendar onClickDay={handleDateClick} />
                    <div className='btn-group-vertical text-white' style={{ height: '50vh' }}>
                        <button className='bg-customColor0 ' style={{ width: '55vh', maxHeight: '50px', margin: '10px' }} type="button" onClick={saveWorkout}>{(workout.modificable && "Guardar" || "Modificar")}</button>
                        <button className="bg-customColor0" style={{ width: '55vh', maxHeight: '50px', margin: '10px' }} type="button" onClick={copyWorkout}>Copiar Rutina</button>
                        <button className="bg-customColor0" style={{ width: '55vh', maxHeight: '50px', margin: '10px' }} type="button" onClick={pasteWorkout}>Pegar Rutina</button>
                        <button className="bg-customColor0" style={{ width: '55vh', maxHeight: '50px', margin: '10px' }} type="button" onClick={cleanWorkout}>Limpiar</button>
                    </div>
                </section>
            </section>
        </>
    )
}

