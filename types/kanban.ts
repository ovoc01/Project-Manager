import { KANBAN_VARIANT } from "@/components/features/project/single-board";

export interface ITask {
    id?: string;
    duration: number;
    label: string;
    color?: keyof typeof KANBAN_VARIANT;
    projectName?: string;
}
export interface Board {
    name: string;
    color?: keyof typeof KANBAN_VARIANT;
    createdAt: Date;
    tasks: ITask[];
}