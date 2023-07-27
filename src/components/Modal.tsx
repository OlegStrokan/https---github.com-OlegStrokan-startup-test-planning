// Modal.js
import React from 'react'
import styles from './Modal.module.css'

export const Modal: React.FC<{ message: string; onClose: () => void }> = ({
    onClose,
    message,
}) => {
    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <button className={styles.closeButton} onClick={onClose}>
                    &times;
                </button>
                {message ? message : 'Loading...'}
            </div>
            <button className={styles.closeButton} onClick={onClose}>
                CLOSE
            </button>
        </div>
    )
}
