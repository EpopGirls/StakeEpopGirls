import { useState } from 'react';
import styles from "./SuccessMessagePopup.module.css"

const ErrorMessagePopup = ({ message, onClose }) => {
  return (
    <div className={styles.errorNotice}>
      <p>{message}</p>
      <button onClick={onClose} className={styles.closeButton}>Close</button>
    </div>
  );
};

export default ErrorMessagePopup;
