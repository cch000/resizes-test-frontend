"use client";
import React, { useRef } from "react";
import { useDrag } from "react-dnd";
import styles from "../styles/Kanban.module.css";
import { TaskProps } from "../types";

const task: React.FC<TaskProps> = ({
  task,
  index,
  columnId,
  deletetask,
}) => {
  const ref = useRef<HTMLDivElement | null>(null);

  const [, drag] = useDrag({
    type: "TASK",
    item: {
      id: task.id,
      sourceColId: columnId,
      sourceIndex: index,
    },
  });

  drag(ref);

  return (
    <div className={styles.task} ref={ref}>
      <h1>{task.title}</h1>
      <span>{task.description}</span>
      <button onClick={() => deletetask(columnId, task.id)}>✕</button>
    </div>
  );
};

export default task;
