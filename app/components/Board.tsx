"use client";
import React from "react";
import Column from "./Column";
import useBoard from "../hooks/useBoard";
import styles from "../styles/Kanban.module.css";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useEffect } from "react";

const Board: React.FC = () => {
  const { columns, addCard, deleteCard, moveCard, getTasks } = useBoard();

  useEffect(() => { getTasks(); }, [])

  return (

    <DndProvider backend={HTML5Backend}>
      <div className={styles.board}>
        {columns.map((col) => (
          <Column
            key={col.title}
            column={col}
            allColumns={columns}
            addCard={addCard}
            deleteCard={deleteCard}
            moveCard={moveCard}
          />
        ))}
      </div>

    </DndProvider>
  );
};

export default Board;
