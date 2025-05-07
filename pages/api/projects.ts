import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@/lib/generated/prisma";
import { Board, ITask } from "@/types/kanban";
import { KANBAN_VARIANT } from "@/components/features/project/single-board";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Définir les boards avec noms, couleurs, etc.
  const boards: Board[] = [
    { name: "Backlog", color: "gray", createdAt: new Date(), tasks: [] },
    { name: "Planning", color: "blue", createdAt: new Date(), tasks: [] },
    { name: "InProgress", color: "yellow", createdAt: new Date(), tasks: [] },
    { name: "Paused", color: "purple", createdAt: new Date(), tasks: [] },
    { name: "Done", color: "green", createdAt: new Date(), tasks: [] },
    { name: "Cancelled", color: "red", createdAt: new Date(), tasks: [] },

  ];

  try {
    // Récupérer tous les projets avec leurs tâches
    const projects = await prisma.project.findMany({
      include: { tasks: true },
    });

    // Pour chaque projet, l’ajouter dans le board correspondant à son status
    for (const project of projects) {
      const status = project.status; // ex: "InProgress"
      if (status === project.status) {
        const taskData: ITask = {
          id: project.id.toString(),
          label: project.label,
          color: project.color as keyof typeof KANBAN_VARIANT,
          projectName: status,
          isEdited: false,
          duration: 0
        }

        const board = boards.find((b) => b.name === status);
        if (board) {
          board.tasks.push(taskData);
        }
      }
    }

    res.status(200).json(boards);
  } catch (error) {
    console.error("Erreur lors de la récupération des projets:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
}
