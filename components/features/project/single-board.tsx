// single-board.tsx
// Mise à jour pour rendre chaque colonne droppable et accueillir des tâches draggable
"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Ellipsis, Plus } from "lucide-react";
import { SortableTask, Task } from "./single-task";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import { ITask } from "@/types/kanban";
import { useKanbanStore } from "@/shared/store";

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

// Update SingleBoard component to use SortableTask instead of Task in single-board.tsx
export function SingleBoard({
  board,
  listeners,
  attributes,
}: {
  board: SingleBoardProps;
  listeners?: any;
  attributes?: any;
}) {
  const { name, tasks, color = "gray" } = board;
  const variantClass = KANBAN_VARIANT[color] ?? KANBAN_VARIANT.gray;

  // Définir la zone droppable pour les tâches de cette colonne
  const { setNodeRef: setDroppableRef } = useDroppable({
    id: name,
    data: {
      type: "board",
      name,
    },
  });

  const addTask = useKanbanStore((state) => state.addTask);

  const handleAddTask = () => {
    console.log("Adding task to board:", name);
    const newTask: ITask = {
      id: Date.now().toString(),
      label: "New Task",
      duration: 0,
      color: color,
      projectName: name,
      isEdited: true,
    };
    addTask(name, newTask);
  };

  return (
    <div
      className={`min-w-[270px] p-1 rounded-xl flex flex-col transition-shadow gap-3 ${variantClass.bg} `}
    >
      <div>
        {/* En-tête */}
        <div
          {...listeners}
          {...attributes}
          className="flex justify-between items-center px-3 cursor-grab"
        >
          <div
            className={`flex items-center ${variantClass.cover} rounded-xl px-2  gap-1`}
          >
            <span className={`w-2 h-2 rounded-full ${variantClass.dot}`}></span>
            <h2 className={`font-semibold text-xs ${variantClass.text}`}>
              {name}
            </h2>
            <span className={`text-xs font-semibold ${variantClass.text} ml-1`}>
              {tasks.length}
            </span>
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
          className={`flex flex-col gap-2  ${
            tasks.length > 0 ? "mt-2" : ""
          }  rounded-md transition-colors`}
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
      </div>

      {/* Bouton nouvelle tâche */}
      <div className="p-1 w-full">
        <Button
          onClick={(e) => {
            e.stopPropagation();
            handleAddTask();
          }}
          className={`w-full text-left z-40 ${variantClass.bg} ${variantClass.text} shadow-none border hover:${variantClass.text} hover:bg-gray-100 rounded-lg `}
        >
          <Plus />
          New project
        </Button>
      </div>
    </div>
  );
}
