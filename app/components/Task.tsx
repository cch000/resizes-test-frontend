"use client";
import React, { useRef } from "react";
import { useDrag } from "react-dnd";
import styles from "../styles/Kanban.module.css";
import { DragItem, TaskProps } from "../types";

const Task: React.FC<TaskProps> = ({
  task,
  columnId,
  deletetask,
}) => {
  const ref = useRef<HTMLDivElement | null>(null);

  const [, drag] = useDrag<DragItem>(() => ({
    type: "TASK",
    item: {
      id: task.id,
      task,
      sourceColId: columnId,
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  drag(ref);

  return (
    <div
      className={styles.task}
      ref={ref}
    >
      <h4>{task.title}</h4>
      <p>{task.description}</p>
      <button onClick={() => deletetask(columnId, task.id)}>✕</button>
    </div>
  );
};

export default Task;