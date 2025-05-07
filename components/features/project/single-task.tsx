"use client";
import { use, useEffect, useRef, useState } from "react";
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
  CalendarDays,
  CalendarIcon,
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useKanbanStore } from "@/shared/store";

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

  useEffect(() => {}, []);

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
  const [isEdited, setIsEdited] = useState(task.isEdited || false);
  const [localTask, setLocalTask] = useState(task);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const updateTask = useKanbanStore((state) => state.updateTask);

  const handleTaskChange = (updatedTask: ITask) => {
    setLocalTask(updatedTask);
  };

  const renderTask = () => {
    if (task.isEdited) {
      return <OnEditTask task={task} onChange={handleTaskChange} />;
    }
    return <SingleTask task={task} onClick={() => setOpen(true)} />;
  };

  const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    if (!wrapperRef.current?.contains(e.relatedTarget as Node)) {
      setLocalTask({ ...localTask, isEdited: false });
      updateTask(localTask!, localTask.projectName!);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <div ref={wrapperRef} onBlur={handleBlur}>
          <SingleTask task={task} onClick={() => setOpen(true)} />
        </div>
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

export function OnEditTask({
  task,
  onChange,
}: {
  task: ITask;
  onChange: (task: ITask) => void;
}) {
  const { color, projectName } = task;
  const variantClass = KANBAN_VARIANT[color!] ?? KANBAN_VARIANT["gray"];
  const [date, setDate] = useState<Date>();

  // Called when focus leaves the entire component

  return (
    <div
      tabIndex={-1}
      className="w-full bg-white min-h-24 p-3 rounded-xl shadow-sm border border-gray-200 flex flex-col gap-1 justify-between cursor-pointer hover:bg-white/25 hover:shadow-none relative"
    >
      <Input
        value={"New Project"}
        className="placeholder:text-gray-300 font-semibold text-black  border-none placeholder:font-bold shadow-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-transparent focus:ring-0 focus:outline-none"
      />
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left pl-3 font-normal flex shadow-none border-none",
              !date && "text-muted-foreground"
            )}
          >
            <span className="mr-auto flex items-center gap-2">
              <CalendarDays className="mr-auto h-2 w-2" />
              {date ? (
                format(date, "PPP")
              ) : (
                <span className="text-xs text-gray-400">Add a date</span>
              )}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      <div className="flex gap-2">
        <Button
          size={"sm"}
          variant={"ghost"}
          className={`text-gray-500 font-semibold rounded-md h-6 ${variantClass.bg} ${variantClass.text} shadow-none hover:${variantClass.text} hover:bg-gray-100 rounded-lg`}
        >
          <div
            className={`rounded-lg px-1 flex gap-1 justify-center items-center ${variantClass.cover}`}
          >
            <span className={`${variantClass.dot} w-2 h-2 rounded-full`}></span>
            {projectName}
          </div>
        </Button>
      </div>
    </div>
  );
}
export function SortableTask({ task }: { task: ITask }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ 
      id: task.id!,
      data: {
        type: 'task',
        task
      }
    });
  
  const style = { 
    transform: CSS.Transform.toString(transform), 
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 1,
    position: 'relative' as const
  };
  
  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...attributes} 
      {...listeners}
      className="touch-none"
    >
      <Task task={task} />
    </div>
  );
}