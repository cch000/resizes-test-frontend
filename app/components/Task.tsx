"use client";
import React from "react";
import styles from "../styles/Kanban.module.css";
import { TaskProps } from "../types";

const task: React.FC<TaskProps> = ({
  task,
  columnId,
  deletetask,
}) => {

  return (
    <div className={styles.task}>
      <h1>{task.title}</h1>
      <span>{task.description}</span>
      <button onClick={() => deletetask(columnId, task.id)}>✕</button>
    </div>
  );
};

export default task;