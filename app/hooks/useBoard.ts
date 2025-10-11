"use client";

import { useState } from "react";
import { nanoid } from "nanoid";
import { Task, ColumnType, MoveParams } from "../types"; // assumes you have types defined there
import { Status } from "../types"; 

export default function useBoard() {
  const [columns, setColumns] = useState<ColumnType[]>([
    {
      title: "TODO",
      cards: [],
    },
    {
      title: "INPROGRESS",
      cards: [],
    },
    {
      title: "DONE",
      cards: [],
    },
  ]);

  const addCard = (columnTitle: Status, title: string, description: string) => {
    const newCard: Task = {
      id: nanoid(),
      status: columnTitle, // status aligns with column title
      title,
      description,
    };

    setColumns(cols =>
      cols.map(col =>
        col.title === columnTitle
          ? { ...col, cards: [...col.cards, newCard] }
          : col
      )
    );
  };

  const deleteCard = (columnTitle: Status, cardId: string) => {
    setColumns(cols =>
      cols.map(col =>
        col.title === columnTitle
          ? {
              ...col,
              cards: col.cards.filter(card => card.id !== cardId),
            }
          : col
      )
    );
  };

  const moveCard = (params: MoveParams) => {
    const { sourceColId, targetColId, sourceIndex, targetIndex } = params;

    setColumns(cols => {
      const newCols = cols.map(col => ({
        ...col,
        cards: [...col.cards],
      }));

      const sourceCol = newCols.find(col => col.title === sourceColId);
      const targetCol = newCols.find(col => col.title === targetColId);
      if (!sourceCol || !targetCol) return newCols;

      const [movedCard] = sourceCol.cards.splice(sourceIndex, 1);

      // Update the task's status when moving columns
      const updatedCard = { ...movedCard, status: targetColId };

      targetCol.cards.splice(targetIndex, 0, updatedCard);

      return newCols;
    });
  };

  return { columns, addCard, deleteCard, moveCard };
}
