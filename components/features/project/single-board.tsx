import { Button } from "@/components/ui/button";
import { Ellipsis, Plus } from "lucide-react";
import { Task } from "./single-task";

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
  createdAt: Date;
  color?: keyof typeof KANBAN_VARIANT;
  tasks: string[];
}

// Map des variantes de couleur

export function SingleBoard({ board }: { board: SingleBoardProps }) {
  const { name, createdAt, tasks, color = "gray" } = board;

  const tasksNumber = tasks.length;
  const variantClass = KANBAN_VARIANT[color] ?? KANBAN_VARIANT["gray"];

  return (
    <div
      className={`min-w-[270px] h-fit  p-1 rounded-xl flex flex-col gap-3 ${variantClass.bg} cursor-grab`}
    >
      <div className="flex justify-between rounded-lg items-center">
        <div
          className={`flex items-center ${variantClass.cover} rounded-xl px-3 flex gap-1 items-start `}
        >
          <span
            className={`w-2 h-2 rounded-full bg-inherit ${variantClass.dot}`}
          ></span>
          <h1 className={`font-semibold text-sm ${variantClass.text}`}>
            {name}
          </h1>
        </div>
        <div className="flex items-center gap-1 text-gray-500 text-sm ">
          <Button variant={"ghost"} size={"icon"} className="h-6 w-6">
            <Ellipsis size={15} className={variantClass.text} />
          </Button>
          <Button variant={"ghost"} size={"icon"} className="h-6 w-6">
            <Plus size={15} className={variantClass.text} />
          </Button>
        </div>
      </div>
      <main className="flex flex-col gap-2 px-1">
        {tasks.map((value) => (
          <Task
            task={{
              label: value,
              duration: 0,
              color: color,
              projectName: name,
            }}
          />
        ))}

        <div className="p-1 w-full">
          <Button
            className={`w-full text-left  ${variantClass.bg} ${variantClass.text} shadow-none border hover:${variantClass.text} hover:bg-gray-100 rounded-lg  `}
          >
            <Plus />
            New project
          </Button>
        </div>
      </main>
    </div>
  );
}
