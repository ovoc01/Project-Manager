// single-board.tsx
// Mise à jour pour rendre chaque colonne droppable et accueillir des tâches draggable

import React from "react";
import { Button } from "@/components/ui/button";
import { Ellipsis, Plus } from "lucide-react";
import {  SortableTask } from "./single-task";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import { ITask } from "@/types/kanban";

export const KANBAN_VARIANT = {
  blue: {
    bg: "bg-sky-50",
    cover: "bg-sky-100",
    text: "text-sky-600",
    dot: "bg-sky-600",
  },
  yellow: {
    bg: "bg-yellow-50/50",
    cover: "bg-yellow-400/30",
    text: "text-yellow-900",
    dot: "bg-yellow-600",
  },
  green: {
    bg: "bg-green-50/50 ",
    cover: "bg-green-600/20",
    text: "text-green-900",
    dot: "bg-green-900",
  },
  red: {
    bg: "bg-red-50/50 ",
    cover: "bg-red-600/20",
    text: "text-red-900",
    dot: "bg-red-800",
  },
  gray: {
    bg: "bg-gray-200/20",
    cover: "bg-gray-600/20",
    text: "text-gray-900/40",
    dot: "bg-gray-600/40",
  },
  purple: {
    bg: "bg-purple-50/50",
    cover: "bg-purple-600/20",
    text: "text-purple-800",
    dot: "bg-purple-900",
  },
} as const;
export interface SingleBoardProps {
  name: string;
  color?: keyof typeof KANBAN_VARIANT;
  createdAt: Date;
  tasks: ITask[];
}

export function SingleBoard({ board }: { board: SingleBoardProps }) {
  const { name, tasks, color = "gray" } = board;
  const variantClass = KANBAN_VARIANT[color] ?? KANBAN_VARIANT.gray;

  // Définir la zone droppable pour les tâches de cette colonne
  const { setNodeRef: setDroppableRef } = useDroppable({ id: name });

  return (
    <div
      className={`min-w-[270px] p-1 rounded-xl flex flex-col gap-3 ${variantClass.bg} cursor-grab`}
    >
      {/* En-tête */}
      <div className="flex justify-between items-center px-3">
        <div
          className={`flex items-center ${variantClass.cover} rounded-xl px-2 py-1 gap-1`}
        >
          <span className={`w-2 h-2 rounded-full ${variantClass.dot}`}></span>
          <h2 className={`font-semibold text-sm ${variantClass.text}`}>
            {name}
          </h2>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon">
            <Ellipsis className={variantClass.text} />
          </Button>
          <Button variant="ghost" size="icon">
            <Plus className={variantClass.text} />
          </Button>
        </div>
      </div>

      {/* Liste des tâches droppable + sortable */}
      <div
        ref={setDroppableRef}
        className="flex flex-col gap-2 px-1"
        data-testid={`droppable-${name}`}
      >
        <SortableContext
          items={tasks.map((t) => t.id!)}
          strategy={rectSortingStrategy}
        >
          {tasks.map((task) => (
            <SortableTask key={task.id} task={task} />
          ))}
        </SortableContext>
      </div>

      {/* Bouton nouvelle tâche */}
      <div className="p-1 w-full">
          <Button
            className={`w-full text-left  ${variantClass.bg} ${variantClass.text} shadow-none border hover:${variantClass.text} hover:bg-gray-100 rounded-lg ` }
          >
            <Plus />
            New project
          </Button>
        </div>
    </div>
  );
}
