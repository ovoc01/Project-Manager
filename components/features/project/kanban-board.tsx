// KanbanBoardWithDndKit.tsx
// Intègre Zustand pour gérer le state global des boards et tâches

"use client";
import React, { useEffect, useState } from "react";
import {
  DndContext,
  closestCenter,
  DragEndEvent,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
  sortableKeyboardCoordinates,
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
    <div ref={setNodeRef} style={style}>
      <SingleBoard
        board={board}
        listeners={listeners}
        attributes={attributes}
      />
    </div>
  );
}
export function KanbanBoardWithDndKit() {
  // Récupère boards et actions depuis le store Zustand
  const fetchBoardsFromDb = useKanbanStore((state) => state.fetchBoardsFromDb);

  useEffect(() => {
    fetchBoardsFromDb();
  }, []);
  const boards = useKanbanStore((state) => state.boards);
  const reorderBoards = useKanbanStore((state) => state.reorderBoards);
  const moveTask = useKanbanStore((state) => state.moveTask);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Increase distance to reduce accidental drags
        delay: 50, // Add a small delay to improve drag detection
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Track active board during drag for visual feedback
  const [activeBoard, setActiveBoard] = useState<string | null>(null);

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    const activeData = active.data.current;

    if (activeData?.type === "task") {
      // Find which board this task belongs to
      for (const board of boards) {
        if (board.tasks.some((task) => task.id === active.id)) {
          setActiveBoard(board.name);
          break;
        }
      }
    }
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Skip if same id
    if (activeId === overId) return;

    const activeData = active.data.current;
    const overData = over.data.current;

    // Only handle task dragging here
    if (activeData?.type !== "task") return;

    // Find source board
    const sourceBoard = boards.find((board) =>
      board.tasks.some((task) => task.id === activeId)
    );

    if (!sourceBoard) return;

    // If hovering over a board or a task
    let targetBoardName = overId;

    // If dropping over a task, get its board
    if (overData?.type === "task") {
      // Find which board contains the target task
      for (const board of boards) {
        if (board.tasks.some((task) => task.id === overId)) {
          targetBoardName = board.name;
          break;
        }
      }
    }

    // Don't do anything if same board
    if (sourceBoard.name === targetBoardName) return;

    // Move the task to the new board
    moveTask(activeId, sourceBoard.name, targetBoardName);
    setActiveBoard(targetBoardName);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveBoard(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Skip if same id
    if (activeId === overId) return;

    const activeData = active.data.current;
    const overData = over.data.current;

    // 1. Reordering boards (columns)
    if (activeData?.type === "board" && overData?.type === "board") {
      const oldIndex = boards.findIndex((b) => b.name === activeId);
      const newIndex = boards.findIndex((b) => b.name === overId);
      if (oldIndex !== -1 && newIndex !== -1) {
        reorderBoards(oldIndex, newIndex);
      }
      return;
    }

    // 2. Task reordering within the same board or between boards
    // (Most task movement is handled in handleDragOver for better UX)
    if (activeData?.type === "task") {
      const sourceBoard = boards.find((board) =>
        board.tasks.some((task) => task.id === activeId)
      );

      if (sourceBoard) {
        let targetBoardName = overId;

        if (overData?.type === "task") {
          // Find which board contains the target task
          for (const board of boards) {
            if (board.tasks.some((task) => task.id === overId)) {
              targetBoardName = board.name;
              break;
            }
          }
        }

        // Only move if not already moved in dragOver
        if (sourceBoard.name !== targetBoardName) {
          moveTask(activeId, sourceBoard.name, targetBoardName);
        }
      }
    }
  }

  function handleDragCancel() {
    setActiveBoard(null);
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <SortableContext
        items={boards.map((b) => b.name)}
        strategy={horizontalListSortingStrategy}
      >
        <div className="flex gap-3 overflow-x-scroll mt-3 no-scrollbar p-2">
          {boards.map((board) => (
            <SortableBoard key={board.name} board={board} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
