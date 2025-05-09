import { ITask } from "@/types/kanban";

export async function fetchBoards() {
  const res = await fetch("/api/projects");
  console.log("Response from /api/projects:", res);
  if (!res.ok) throw new Error("Erreur lors du chargement des projets");
  return res.json();
}

export async function addProjectToBoard(task?: ITask) {
  const res = await fetch("/api/projects", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ task })
  })

  if (!res.ok) throw new Error("Erreur lors de l'ajout d'un projet");
  return res.json();
}