// store.ts - Updated Zustand store with improved task movement logic
import { Board, ITask } from "@/types/kanban";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { fetchBoards } from "@/lib/api";
import { Project } from "@/lib/generated/prisma";
// Interface du state et des actions
interface KanbanState {
    boards: Board[];
    // action pour réordonner les colonnes
    reorderBoards: (from: number, to: number) => void;
    // action pour déplacer une tâche d'une colonne à une autre
    moveTask: (taskId: string, fromBoard: string, toBoard: string) => void;
    // action pour ajouter une tâche
    addTask: (boardName: string, task: ITask) => void;
    // action pour mettre à jour une tâche
    updateTask: (updatedTask: ITask, boardName: string) => void;
    fetchBoardsFromDb: () => Promise<void>;
}

// Création du store avec middleware devtools
export const useKanbanStore = create<KanbanState>()(
    devtools((set, get) => ({
        // État initial des boards (sans tâches)
        boards: [],
        fetchBoardsFromDb: async () => {
            const data = await fetchBoards();
            const formatted = data.map((p: Board) => ({
                name: p.name,
                createdAt: new Date(p.createdAt),
                color: p.color,
                tasks: p.tasks
                
            }));
            set({ boards: formatted });
            console.log("Fetched boards from DB:", formatted);
        },

        // Réordonner les colonnes
        reorderBoards: (from, to) =>
            set((state) => {
                const b = Array.from(state.boards);
                const [moved] = b.splice(from, 1);
                b.splice(to, 0, moved);
                return { boards: b };
            }, false, "reorderBoards"),

        // Déplacer une tâche entre colonnes - version améliorée
        moveTask: (taskId, fromBoard, toBoard) =>
            set((state) => {
                // Si même board, ne rien faire
                if (fromBoard === toBoard) return state;

                const boardsCopy: Board[] = JSON.parse(JSON.stringify(state.boards));

                const sourceIndex = boardsCopy.findIndex((b) => b.name === fromBoard);
                const targetIndex = boardsCopy.findIndex((b) => b.name === toBoard);

                if (sourceIndex === -1 || targetIndex === -1) return state;

                const source = boardsCopy[sourceIndex];
                const target = boardsCopy[targetIndex];

                // Trouver l'index de la tâche à déplacer
                const taskIndex = source.tasks.findIndex((t) => t.id === taskId);
                if (taskIndex === -1) return state;

                // Copier la tâche et ajuster son projectName pour correspondre au board cible
                const taskToMove = { ...source.tasks[taskIndex] };
                taskToMove.projectName = toBoard;
                taskToMove.color = boardsCopy[targetIndex].color;

                // Retirer la tâche du board source
                source.tasks.splice(taskIndex, 1);

                // Ajouter la tâche au board cible
                target.tasks.push(taskToMove);

                return { boards: boardsCopy };
            }, false, "moveTask"),

        // Ajouter une nouvelle tâche
        addTask: (boardName, task) =>
            set((state) => ({
                boards: state.boards.map((b) =>
                    b.name === boardName ? { ...b, tasks: [...b.tasks, task] } : b
                ),
            }), false, "addTask"),

        // Mettre à jour une tâche existante
        updateTask: (updatedTask, boardName) =>
            set((state) => ({
                boards: state.boards.map((b) =>
                    b.name === boardName
                        ? {
                            ...b,
                            tasks: b.tasks.map((t) =>
                                t.id === updatedTask.id ? updatedTask : t
                            ),
                        }
                        : b
                ),
            }), false, "updateTask"),
    })),
);