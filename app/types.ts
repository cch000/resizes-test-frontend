export type Status = "DONE" | "TODO" | "INPROGRESS";

export interface Task {
  id: string;
  status: Status;
  title: string;
  description: string;
}

export interface ColumnType {
  title: Status;
  tasks: Task[];
}

export interface MoveParams {
  sourceColId: Status;
  targetColId: Status;
  task: Task;
}

export interface TaskProps {
  task: Task;
  columnId: Status;
  deletetask: (columnId: Status, taskId: string) => void;
  movetask: (params: MoveParams) => void;
}

export interface DragItem {
  id: string;
  sourceColId: Status;
  task: Task;
}