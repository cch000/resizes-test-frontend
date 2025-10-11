"use client";
import React from "react";
import Column from "./Column";
import useBoard from "../hooks/useBoard";
import styles from "../styles/Kanban.module.css";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useEffect } from "react";

const Board: React.FC = () => {
  const { columns, addtask, deletetask, movetask, getTasks } = useBoard();

  useEffect(() => { getTasks(); }, [getTasks])

  return (

    <DndProvider backend={HTML5Backend}>
      <div className={styles.board}>
        {columns.map((col) => (
          <Column
            key={col.title}
            column={col}
            allColumns={columns}
            addtask={addtask}
            deletetask={deletetask}
            movetask={movetask}
          />
        ))}
      </div>

    </DndProvider>
  );
};

export default Board;
