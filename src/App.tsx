// src/App.tsx
import { useEffect, useRef, useState } from 'react'
import { Modal } from './components/Modal'
import styles from './App.module.css'
import { getRandomFact } from './api/getRandomFact.api'
import Completed from './assets/completed.png'
export const App = () => {
    const [showModal, setShowModal] = useState(false)
    const [modalMessage, setModalMessage] = useState('')

    interface ITask {
        id: number
        content: string
        completed: boolean
    }
    interface IPhase {
        id: number
        name: string
        completed: boolean
        tasks: ITask[]
    }

    const [phases, setPhases] = useState<IPhase[]>(
        (JSON.parse(localStorage.getItem('progress') || '{}') as IPhase[]) || [
            {
                id: 1,
                name: 'Foundation',
                completed: false,
                tasks: [
                    {
                        id: 1,
                        content: 'Setup virtual office',
                        completed: false,
                    },
                    {
                        id: 2,
                        content: 'Set mission & visions',
                        completed: false,
                    },
                    {
                        id: 3,
                        content: 'Select business name',
                        completed: false,
                    },
                    {
                        id: 4,
                        content: 'Buy domains',
                        completed: false,
                    },
                ],
            },
            {
                id: 2,
                name: 'Discovery',
                completed: false,
                tasks: [
                    {
                        id: 1,
                        content: 'Create roadmap',
                        completed: false,
                    },
                    {
                        id: 2,
                        content: 'Competitor analysis',
                        completed: false,
                    },
                ],
            },
            {
                id: 3,
                name: 'Delivery',
                completed: false,
                tasks: [
                    {
                        id: 1,
                        content: 'Release marketing website',
                        completed: false,
                    },
                    {
                        id: 2,
                        content: 'Release MVP',
                        completed: false,
                    },
                ],
            },
            // Add more phases as needed
        ]
    )

    useEffect(() => {
        // Load progress from localStorage on initial load
        const savedProgress = JSON.parse(
            localStorage.getItem('progress') || '{}'
        )

        // Merge the existing state with the data from localStorage
        const updatedPhases = phases.map((phase) => {
            const savedPhase = savedProgress.find(
                (savedPhase: IPhase) => savedPhase.id === phase.id
            )
            return {
                ...phase,
                completed: savedPhase ? savedPhase.completed : phase.completed,
            }
        })

        // Update the state with the merged data
        setPhases(updatedPhases)
    }, [])

    useEffect(() => {
        // Save progress to localStorage whenever phases change
        localStorage.setItem('progress', JSON.stringify(phases))
        const allTasksCompleted = phases.every((phase) =>
            phase.tasks.every((task) => task.completed)
        )

        if (allTasksCompleted) {
            handleShowRandomFact()
        }
    }, [phases])

    const handleTaskCompletion = (phaseId: number, taskId: number) => {
        setPhases((prevPhases) =>
            prevPhases.map((phase) => {
                if (phase.id === phaseId) {
                    const updatedTasks = phase.tasks.map((task) => {
                        if (task.id === taskId) {
                            return {
                                ...task,
                                completed: !task.completed, // Toggle the completed property for the task
                            }
                        }
                        return task
                    })

                    // Check if all tasks in the phase are completed
                    const allTasksCompleted = updatedTasks.every(
                        (task) => task.completed
                    )

                    // Set the phase's completed flag based on the result
                    return {
                        ...phase,
                        completed: allTasksCompleted, // Set the completed flag for the phase
                        tasks: updatedTasks, // Update the tasks array for the phase
                    }
                }
                return phase
            })
        )

        // Show modal if all phases are completed
        const allPhasesCompleted = phases.every((phase) => phase.completed)
        if (allPhasesCompleted) {
            setShowModal(true)
            setModalMessage('Congratulations! All phases are completed.')
        }
    }

    // ... rest of your code ...

    const allPreviousTasksCompleted = (phaseId: number, taskId: number) => {
        const currentPhase = phases.find((phase) => phase.id === phaseId)

        // Find the previous phase based on phaseId
        const previousPhase = phases.find((phase) => phase.id === phaseId - 1)

        // Check if the previous phase exists and if all its tasks are completed
        const allPreviousTasksCompleted =
            !previousPhase ||
            previousPhase.tasks.every((task) => task.completed)

        // Check if the current phase's tasks include the taskId
        const taskExistsInCurrentPhase = currentPhase?.tasks.some(
            (task) => task.id === taskId
        )

        // Return the final result
        return allPreviousTasksCompleted && taskExistsInCurrentPhase
    }
    // Function to get a random fact from the API

    const handleShowRandomFact = async () => {
        setShowModal(true)
        const randomFact = await getRandomFact()
        setModalMessage(randomFact)
        setShowModal(true)
    }

    const handleCloseModal = () => {
        // Reset all tasks to "not completed" when the modal is closed
        const updatedPhases = phases.map((phase) => ({
            ...phase,
            completed: false,
            tasks: phase.tasks.map((task) => ({ ...task, completed: false })),
        }))
        setPhases(updatedPhases)

        // Close the modal
        setShowModal(false)
    }

    return (
        <div className={styles.app}>
            <div className={styles.mb_40}>
                <h2>My startup progress</h2>
            </div>
            {phases.map((phase) => (
                <div key={phase.id} className={styles.mb_20}>
                    <div className={[styles.flex, styles.mb_20].join(' ')}>
                        <div className={styles.index}>{phase.id}</div>
                        <div className={styles.subtitle}>{phase.name}</div>
                        {phase.completed && (
                            <div className={styles.ml_30}>
                                <img
                                    className={styles.completed}
                                    src={Completed}
                                    alt="Completed phase"
                                />
                            </div>
                        )}
                    </div>
                    <div className={styles.ul}>
                        {phase.tasks.map((task) => (
                            <label
                                key={task.id}
                                className={[
                                    styles.mb_10,
                                    styles.checkbox_container,
                                ].join(' ')}
                            >
                                <input
                                    type="checkbox"
                                    checked={task.completed}
                                    className={styles.checkbox_input}
                                    onChange={() => {
                                        if (
                                            allPreviousTasksCompleted(
                                                phase.id,
                                                task.id
                                            )
                                        ) {
                                            handleTaskCompletion(
                                                phase.id,
                                                task.id
                                            )
                                        } else {
                                            setModalMessage(
                                                'Complete all previous tasks first!'
                                            )
                                            setShowModal(true)
                                        }
                                    }}
                                />
                                <span className={styles.checkbox_label}>
                                    {task.content}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>
            ))}
            {showModal && (
                <Modal message={modalMessage} onClose={handleCloseModal} />
            )}
        </div>
    )
}
