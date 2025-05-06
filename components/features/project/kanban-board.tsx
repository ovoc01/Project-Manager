// KanbanBoardWithDndKit.tsx
// Intègre Zustand pour gérer le state global des boards et tâches

"use client";
import React from "react";
import {
  DndContext,
  closestCenter,
  DragEndEvent,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { SingleBoard, SingleBoardProps } from "./single-board";

import { useKanbanStore } from "@/shared/store";
// Wrapper pour une colonne draggable
function SortableBoard({ board }: { board: SingleBoardProps }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: board.name });
  const style = { transform: CSS.Transform.toString(transform), transition };
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <SingleBoard board={board} />
    </div>
  );
}

export function KanbanBoardWithDndKit() {
  // Récupère boards et actions depuis le store Zustand
  const boards = useKanbanStore((state) => state.boards);
  const reorderBoards = useKanbanStore((state) => state.reorderBoards);
  const moveTask = useKanbanStore((state) => state.moveTask);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // 1️⃣ Réordonner les colonnes
    const oldIndex = boards.findIndex((b) => b.name === activeId);
    const newIndex = boards.findIndex((b) => b.name === overId);
    if (oldIndex !== -1 && newIndex !== -1) {
      reorderBoards(oldIndex, newIndex);
      return;
    }

    // 2️⃣ Déplacer une tâche entre colonnes
    // Trouver source et target
    let sourceName = "";
    let targetName = "";
    boards.forEach((b) => {
      if (b.tasks.some((t) => t.id === activeId)) sourceName = b.name;
      // si on drop sur une tâche, overId peut être id de tâche => déterminer sa colonne
      if (b.tasks.some((t) => t.id === overId)) targetName = b.name;
      // ou si on drop sur le conteneur, overId = board.name
      if (b.name === overId) targetName = b.name;
    });
    if (sourceName && targetName) {
      moveTask(activeId, sourceName, targetName);
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={boards.map((b) => b.name)}
        strategy={horizontalListSortingStrategy}
      >
        <div className="flex gap-2 overflow-x-scroll mt-3 no-scrollbar">
          {boards.map((board) => (
            <SortableBoard key={board.name} board={board} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
