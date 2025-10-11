"use client";
import React, { useState, useRef } from "react";
import { useDrop } from "react-dnd";
import Task from "./Task";
import styles from "../styles/Kanban.module.css";
import { ColumnType, DragItem, MoveParams, Status } from "../types";

interface ColumnProps {
  column: ColumnType;
  allColumns: ColumnType[];
  addtask: (columnId: Status, title: string, description: string) => void;
  deletetask: (columnId: Status, taskId: string) => void;
  movetask: (params: MoveParams) => void;
}

const Column: React.FC<ColumnProps> = ({
  column,
  addtask,
  deletetask,
  movetask,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleAdd = () => {
    if (title.trim()) {
      addtask(column.title, title, description);
      setTitle("");
      setDescription("");
    }
  };
  const ref = useRef<HTMLDivElement>(null);

  const [, drop] = useDrop<DragItem>({
    accept: "TASK",
    drop: (item, monitor) => {

      if (!monitor.didDrop()) {
        movetask({
          sourceColId: item.sourceColId,
          targetColId: column.title,
          sourceIndex: item.sourceIndex,
          targetIndex: column.tasks.length,
        });
      }

    },

    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  drop(ref)

  return (
    <div className={styles.column} ref={ref}>
      <h3>{column.title}</h3>
      <div className={styles.taskList}>
        {column.tasks.map((task, index) => (
          <Task
            key={task.id}
            task={task}
            index={index}
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
          placeholder="New task..."
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