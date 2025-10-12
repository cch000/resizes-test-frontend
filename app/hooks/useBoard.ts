import { useEffect, useState } from "react";
import { nanoid } from "nanoid";
import axios from "axios";
import { Task, ColumnType, MoveParams, Status } from "../types";

const endpoint_url = "http://localhost:8000/tasks";

export default function useBoard() {
    const [columns, setColumns] = useState<ColumnType[]>([
        { title: "TODO", tasks: [] },
        { title: "INPROGRESS", tasks: [] },
        { title: "DONE", tasks: [] },
    ]);

    useEffect(() => {
        getTasks();
    }, []);

    const getTasks = async () => {
        try {
            const res = await axios.get(endpoint_url);
            const tasks: Task[] = res.data;

            const grouped: Record<Status, Task[]> = {
                TODO: [],
                INPROGRESS: [],
                DONE: [],
            };

            tasks.forEach(task => {
                grouped[task.status].push(task);
            });

            setColumns([
                { title: "TODO", tasks: grouped.TODO },
                { title: "INPROGRESS", tasks: grouped.INPROGRESS },
                { title: "DONE", tasks: grouped.DONE },
            ]);
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    };

    const addtask = async (columnTitle: Status, title: string, description: string) => {
        const newTask: Task = {
            id: nanoid(),
            status: columnTitle,
            title,
            description,
        };

        try {
            await axios.post(endpoint_url, newTask);
            setColumns(cols =>
                cols.map(col =>
                    col.title === columnTitle
                        ? { ...col, tasks: [...col.tasks, newTask] }
                        : col
                )
            );
        } catch (error) {
            console.error("Error adding task:", error);
        }
    };

    const deletetask = async (columnTitle: Status, taskId: string) => {
        try {
            await axios.delete(`${endpoint_url}/${taskId}`);
            setColumns(cols =>
                cols.map(col =>
                    col.title === columnTitle
                        ? { ...col, tasks: col.tasks.filter(task => task.id !== taskId) }
                        : col
                )
            );
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    };

    const movetask = async ({ sourceColId, targetColId, task }: MoveParams) => {
        if (sourceColId === targetColId) return;

        const updatedTask = { ...task, status: targetColId };

        setColumns(cols =>
            cols.map(col => {
                if (col.title === sourceColId) {
                    return { ...col, tasks: col.tasks.filter(t => t.id !== task.id) };
                }
                if (col.title === targetColId) {
                    const filteredTasks = col.tasks.filter(t => t.id !== task.id);
                    return { ...col, tasks: [...col.tasks, updatedTask] };
                }
                return col;
            })
        );

        await axios.put(`${endpoint_url}/${task.id}`, updatedTask);
    };

    return { columns, addtask, deletetask, movetask, getTasks };
}
