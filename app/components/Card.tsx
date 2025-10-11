"use client";
import React, { useRef } from "react";
import { DropTargetMonitor, useDrag, useDrop } from "react-dnd";
import styles from "../styles/Kanban.module.css";
import { CardProps, DragItem } from "../types";

const Card: React.FC<CardProps> = ({
  card,
  index,
  columnId,
  deleteCard,
}) => {
  const ref = useRef<HTMLDivElement | null>(null);

  const [, drag] = useDrag({
    type: "CARD",
    item: {
      id: card.id,
      sourceColId: columnId,
      sourceIndex: index,
    },
  });

  drag(ref);

  return (
    <div className={styles.card} ref={ref}>
      <h1>{card.title}</h1>
      <span>{card.description}</span>
      <button onClick={() => deleteCard(columnId, card.id)}>✕</button>
    </div>
  );
};

export default Card;
