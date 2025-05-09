import { Board } from "@/types/kanban";

export const PROJECT_BOARDS: Board[] = [
    { name: "Backlog", color: "gray", createdAt: new Date(), tasks: [] },
    { name: "Planning", color: "blue", createdAt: new Date(), tasks: [] },
    { name: "InProgress", color: "yellow", createdAt: new Date(), tasks: [] },
    { name: "Paused", color: "purple", createdAt: new Date(), tasks: [] },
    { name: "Done", color: "green", createdAt: new Date(), tasks: [] },
    { name: "Cancelled", color: "red", createdAt: new Date(), tasks: [] },
];