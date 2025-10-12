"use client";
import React, { useState, useRef } from "react";
import { useDrop } from "react-dnd";
import Task from "./Task";
import styles from "../styles/Kanban.module.css";
import { ColumnType, DragItem, MoveParams, Status } from "../types";

interface ColumnProps {
  column: ColumnType;
  addtask: (columnId: Status, title: string, description: string) => void;
  deletetask: (columnId: Status, taskId: string) => void;
  movetask: (params: MoveParams) => void;
}

const Column: React.FC<ColumnProps> = ({ column, addtask, deletetask, movetask }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  const [, drop] = useDrop<DragItem>(() => ({
    accept: "TASK",
    drop: ({ sourceColId, task }) => {
      if (sourceColId !== column.title) {
        movetask({ sourceColId, targetColId: column.title, task });
      }
    },
  }));

  drop(ref);

  const handleAdd = () => {
    if (title.trim()) {
      addtask(column.title, title.trim(), description.trim());
      setTitle("");
      setDescription("");
    }
  };

  return (
    <div className={styles.column} ref={ref}>
      <h3>{column.title}</h3>
      <div className={styles.taskList}>
        {column.tasks.map((task) => (
          <Task
            key={task.id}
            task={task}
            columnId={column.title}
            deletetask={deletetask}
            movetask={movetask}
          />
        ))}
      </div>
      <div className={styles.addtask}>
        <input
          type="text"
          value={title}
          placeholder="New task title..."
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          value={description}
          placeholder="Description..."
          onChange={(e) => setDescription(e.target.value)}
        />
        <button onClick={handleAdd}>Add</button>
      </div>
    </div>
  );
};

export default Column;