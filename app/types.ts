export type Status = "DONE" | "TODO" | "INPROGRESS";

export interface Task {
    id: string;
    status: Status;
    title: string;
    description: string;
}

export interface ColumnType {
    title: Status;
    cards: Task[];
}

export interface MoveParams {
    sourceColId: Status;
    targetColId: Status;
    sourceIndex: number;
    targetIndex: number;
}

export interface CardProps {
    card: Task;
    index: number;
    columnId: Status;
    deleteCard: (columnId: Status, cardId: string) => void;
    moveCard: (params: MoveParams) => void;
}

export interface DragItem {
    id: string,
    sourceColId: Status;
    sourceIndex: number;
}