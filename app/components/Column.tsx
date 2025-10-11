"use client";
import React, { useState, useRef } from "react";
import { useDrop } from "react-dnd";
import Card from "./Card";
import styles from "../styles/Kanban.module.css";
import { ColumnType, DragItem, MoveParams, Status } from "../types";

interface ColumnProps {
  column: ColumnType;
  allColumns: ColumnType[];
  addCard: (columnId: Status, title: string, description: string) => void;
  deleteCard: (columnId: Status, cardId: string) => void;
  moveCard: (params: MoveParams) => void;
}

const Column: React.FC<ColumnProps> = ({
  column,
  addCard,
  deleteCard,
  moveCard,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleAdd = () => {
    if (title.trim()) {
      addCard(column.title, title, description);
      setTitle("");
      setDescription("");
    }
  };
  const ref = useRef<HTMLDivElement>(null);

  const [, drop] = useDrop<DragItem>({
    accept: "CARD",
    drop: (item, monitor) => {

      if (!monitor.didDrop()) {
        moveCard({
          sourceColId: item.sourceColId,
          targetColId: column.title,
          sourceIndex: item.sourceIndex,
          targetIndex: column.cards.length,
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
      <div className={styles.cardList}>
        {column.cards.map((card, index) => (
          <Card
            key={card.id}
            card={card}
            index={index}
            columnId={column.title}
            deleteCard={deleteCard}
            moveCard={moveCard}
          />
        ))}
      </div>
      <div className={styles.addCard}>
        <input
          type="text"
          value={title}
          placeholder="New card..."
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