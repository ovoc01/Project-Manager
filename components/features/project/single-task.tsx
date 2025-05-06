"use client";
import { useEffect, useRef, useState } from "react";
import { KANBAN_VARIANT } from "./single-board";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  ArrowUpRight,
  Copy,
  CornerUpRight,
  Delete,
  Ellipsis,
  Link2,
  List,
  MessageSquareText,
  MoveUpRight,
  PencilLine,
  Smile,
  Star,
  Trash,
  Trash2,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

import { CSS } from "@dnd-kit/utilities";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useHover } from "@/hooks/use-hover";
import { useSortable } from "@dnd-kit/sortable";
import { ITask } from "@/types/kanban";


export function SingleTask({
  task,
  onClick,
}: {
  task: ITask;
  onClick?: () => void;
}) {
  const { duration, label, color, projectName } = task;
  const variantClass = KANBAN_VARIANT[color!] ?? KANBAN_VARIANT["gray"];
  const closeTimeout = useRef<number>();
  const [hoverRef, isHovered] = useHover<HTMLDivElement>();

  useEffect(() => {
    console.log(isHovered);
  }, [isHovered]);

  return (
    <div
      onClick={(e) => {
        if ((e.target as HTMLElement).closest("button")) return;
        onClick!();
      }}
      className="w-full bg-white min-h-20 p-3 rounded-xl shadow-sm border border-gray-200 flex flex-col justify-between cursor-pointer hover:bg-white/25 hover:shadow-none relative"
      ref={hoverRef}
    >
      {isHovered && (
        <div className="absolute top-2 right-2 flex items-center z-10 gap-1">
          <Button variant="ghost" className="bg-white h-7 w-7 text-xs p-0">
            <PencilLine size={10} className="text-gray-500" />
          </Button>
          <Separator orientation="vertical" className="h-5" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="bg-white h-7 w-7 text-xs p-0">
                <Ellipsis size={14} className="text-gray-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuItem>
                <Star size={12} />
                <span>Add to favorites</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link2 size={12} className="-rotate-45" />
                <span>Copy link</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Copy size={12} />
                <span>Duplicate</span>
                <DropdownMenuShortcut>⌘D</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CornerUpRight size={12} />
                <span>Move to</span>
                <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Trash2 size={12} />
                <span>Delete</span>
                <DropdownMenuShortcut>Del</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Smile size={12} />
                <span>Icon</span>
              </DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <List size={12} />
                  <span>Edit property</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem>Email</DropdownMenuItem>
                    <DropdownMenuItem>Message</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>More...</DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <MessageSquareText size={12} />
                <span>Comment</span>
                <DropdownMenuShortcut>⇧⌘M</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <ArrowUpRight size={12} />
                  <span>Open in</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem>New tab</DropdownMenuItem>
                    <DropdownMenuItem>New window</DropdownMenuItem>
                    <DropdownMenuItem>Side peek</DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      <h1 className="text-sm font-semibold">{label}</h1>
      <div className="flex gap-2">
        <Button
          size={"sm"}
          variant={"ghost"}
          className={`text-gray-500 font-semibold rounded-md h-6 ${variantClass.bg} ${variantClass.text} shadow-none  hover:${variantClass.text} hover:bg-gray-100 rounded-lg  `}
        >
          <div
            className={`rounded-lg  px-1 flex gap-1 justify-center items-center ${variantClass.cover}`}
          >
            <span className={`${variantClass.dot} w-2 h-2 rounded-full`}></span>
            {projectName}
          </div>
        </Button>
      </div>
    </div>
  );
}

export function Task({ task }: { task: ITask }) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <SingleTask task={task} onClick={() => setOpen(true)} />
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Add New Project</SheetTitle>
          <SheetDescription>
            Make changes to your profile here. Click save when you're done.
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}

// Wrapper pour une tâche draggable
export function SortableTask({ task }: { task: ITask }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: task.id! });
  const style = { transform: CSS.Transform.toString(transform), transition };
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Task task={task} />
    </div>
  );
}
