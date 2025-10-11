import { useState } from "react";
import { nanoid } from "nanoid";
import { Task, ColumnType, MoveParams } from "../types";
import { Status } from "../types";
import axios from "axios";

const endpoint_url = "http://localhost:8000/tasks";

export default function useBoard() {
    const [columns, setColumns] = useState<ColumnType[]>([
        {
            title: "TODO",
            tasks: [],

        },
        {
            title: "INPROGRESS",
            tasks: [],
        },
        {
            title: "DONE",
            tasks: [],
        },
    ]);


    const getTasks = () => {
        axios.get(endpoint_url).then((res) => {
            const tasks: Array<Task> = res.data;
            const todo: Array<Task> = [];
            const inprogress: Array<Task> = [];
            const done: Array<Task> = [];

            tasks.map((task) => {
                console.log(task.id)
                switch (task.status) {
                    case "TODO": todo.push(task); break;
                    case "INPROGRESS": inprogress.push(task); break;
                    case "DONE": done.push(task); break;
                }
            })
            setColumns([
                { title: "TODO", tasks: todo },
                { title: "INPROGRESS", tasks: inprogress },
                { title: "DONE", tasks: done },
            ]);

        })
    }

    const addtask = (columnTitle: Status, title: string, description: string) => {
        const newtask: Task = {
            id: nanoid(),
            status: columnTitle,
            title,
            description,
        };

        setColumns(cols =>
            cols.map(col =>
                col.title === columnTitle
                    ? { ...col, tasks: [...col.tasks, newtask] }
                    : col
            )
        );

        axios.post(endpoint_url, newtask)
    };

    const deletetask = (columnTitle: Status, taskId: string) => {
        axios.delete(`${endpoint_url}/${taskId}`)

        setColumns(cols =>
            cols.map(col =>
                col.title === columnTitle
                    ? {
                        ...col,
                        tasks: col.tasks.filter(task => task.id !== taskId),
                    }
                    : col
            )

        );
    };

    const movetask = (params: MoveParams) => {
        const { sourceColId, targetColId, sourceIndex, targetIndex } = params;

        setColumns(cols => {
            const newCols = cols.map(col => ({
                ...col,
                tasks: [...col.tasks],
            }));

            const sourceCol = newCols.find(col => col.title === sourceColId);
            const targetCol = newCols.find(col => col.title === targetColId);

            if (!sourceCol || !targetCol) return newCols;

            const [movedtask] = sourceCol.tasks.splice(sourceIndex, 1);

            const updatedtask = { ...movedtask, status: targetColId };

            axios.put(endpoint_url + "/" + updatedtask.id,
                updatedtask
            )

            targetCol.tasks.splice(targetIndex, 0, updatedtask);

            return newCols;
        });
    };

    return { columns, addtask, deletetask, movetask, getTasks };
}
