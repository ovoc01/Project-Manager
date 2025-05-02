import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dot, Ellipsis, Plus } from "lucide-react";
import { useTheme } from "next-themes";

export interface SingleBoardProps {
  name: string;
  createdAt: Date;
  color?: keyof typeof KANBAN_VARIANT;
  tasks: string[];
}

// Map des variantes de couleur

const KANBAN_VARIANT = {
  blue: {
    bg: "bg-blue-50",
    cover: "bg-blue-100",
    text: "text-blue-600",
  },
  yellow: {
    bg: "bg-yellow-50",
    cover: "bg-yellow-100",
    text: "text-yellow-600",
  },
  green: {
    bg: "bg-green-50 ",
    cover: "bg-green-100",
    text: "text-green-800",
  },
  red: {
    bg: "bg-red-50 ",
    cover: "bg-red-100",
    text: "text-red-800",
  },
  gray: {
    bg: "bg-gray-50",
    cover: "bg-gray-100",
    text: "text-gray-800",
  },
  purple: {
    bg: "bg-purple-50",
    cover: "bg-purple-100",
    text: "text-purple-800",
  },
} as const;

export function SingleBoard({ board }: { board: SingleBoardProps }) {
  const { name, createdAt, tasks, color = "gray" } = board;

  const tasksNumber = tasks.length;
  const variantClass = KANBAN_VARIANT[color] ?? KANBAN_VARIANT["gray"];

  return (
    <div
      className={`w-full  p-1 rounded-xl flex flex-col gap-3 ${variantClass.bg}`}
    >
      <div className="flex justify-between rounded-lg items-center">
        <div
          className={`flex items-center ${variantClass.cover} rounded-xl px-5 `}
        >
          <h1 className="font-semibold text-sm">{name}</h1>
        </div>
        <div className="flex items-center gap-1 text-gray-500 text-sm">
          <Ellipsis size={15} />
          <Plus size={15} />
        </div>
      </div>
      <div className="p-1 w-full">
        <Button
          className={`w-full text-left  ${variantClass.bg} ${variantClass.text} shadow-none border hover:${variantClass.text} hover:bg-gray-100 rounded-lg  `}
        >
          <Plus />
          New project
        </Button>
      </div>
    </div>
  );
}
