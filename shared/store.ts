// store.ts
// Zustand store pour gérer globalement les boards et les tâches en utilisant les interfaces définies

import { Board, ITask } from "@/types/kanban";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

// Interface du state et des actions
interface KanbanState {
    boards: Board[];
    // action pour réordonner les colonnes
    reorderBoards: (from: number, to: number) => void;
    // action pour déplacer une tâche d'une colonne à une autre
    moveTask: (taskId: string, fromBoard: string, toBoard: string) => void;
    // action pour ajouter une tâche
    addTask: (boardName: string, task: ITask) => void;
}

// Création du store avec middleware devtools
export const useKanbanStore = create<KanbanState>()(
    devtools((set, get) => ({
        // État initial des boards (sans tâches)
        boards: [
            { name: "Backlog", createdAt: new Date(), tasks: [] },
            { name: "Planning", createdAt: new Date(), tasks: [], color: "blue" },
            { name: "In Progress", createdAt: new Date(), tasks: [], color: "yellow" },
            { name: "Paused", createdAt: new Date(), tasks: [], color: "purple" },
            { name: "Done", createdAt: new Date(), tasks: [], color: "green" },
            { name: "Canceled", createdAt: new Date(), tasks: [], color: "red" },
        ],

        // Réordonner les colonnes
        reorderBoards: (from, to) =>
            set((state) => {
                const b = Array.from(state.boards);
                const [moved] = b.splice(from, 1);
                b.splice(to, 0, moved);
                return { boards: b };
            }, false, "reorderBoards"),

        // Déplacer une tâche entre colonnes
        moveTask: (taskId, fromBoard, toBoard) =>
            set((state) => {
                const boardsCopy: Board[] = state.boards.map((b) => ({ ...b, tasks: [...b.tasks] }));
                const source = boardsCopy.find((b) => b.name === fromBoard);
                const target = boardsCopy.find((b) => b.name === toBoard);
                if (!source || !target) return state;
                const idx = source.tasks.findIndex((t) => t.id === taskId);
                if (idx === -1) return state;
                const [task] = source.tasks.splice(idx, 1);
                target.tasks.push(task);
                return { boards: boardsCopy };
            }, false, "moveTask"),

        // Ajouter une nouvelle tâche
        addTask: (boardName, task) =>
            set((state) => ({
                boards: state.boards.map((b) =>
                    b.name === boardName ? { ...b, tasks: [...b.tasks, task] } : b
                ),
            }), false, "addTask"),
    }))
);
