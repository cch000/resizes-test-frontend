import { useState } from "react";
import { nanoid } from "nanoid";
import { Task, ColumnType, MoveParams } from "../types"; // assumes you have types defined there
import { Status } from "../types";
import axios from "axios";

const endpoint_url = "http://localhost:8000/tasks";

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


    const getTasks = () => {
        axios.get(endpoint_url).then((res) => {
            let tasks: Array<Task> = res.data;

            let todo: Array<Task> = [];
            let inprogress: Array<Task> = [];
            let done: Array<Task> = [];

            tasks.map((task) => {
                console.log(task.id)
                switch (task.status) {
                    case "TODO": todo.push(task); break;
                    case "INPROGRESS": inprogress.push(task); break;
                    case "DONE": done.push(task); break;
                }
            })
            // Update columns based on grouped tasks
            setColumns([
                { title: "TODO", cards: todo },
                { title: "INPROGRESS", cards: inprogress },
                { title: "DONE", cards: done },
            ]);

        })
    }

    const addCard = (columnTitle: Status, title: string, description: string) => {
        const newCard: Task = {
            id: nanoid(),
            status: columnTitle,
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

        axios.post(endpoint_url, newCard)
    };

    const deleteCard = (columnTitle: Status, cardId: string) => {

        axios.delete(`${endpoint_url}/${cardId}`)

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

            axios.put(endpoint_url + "/" + updatedCard.id,
                updatedCard
            )

            targetCol.cards.splice(targetIndex, 0, updatedCard);

            return newCols;
        });
    };

    return { columns, addCard, deleteCard, moveCard, getTasks };
}
