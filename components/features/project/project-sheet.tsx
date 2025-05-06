import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowUpRight,
  AtSign,
  Calendar,
  Check,
  CheckCheck,
  ChevronDownCircle,
  Clock10,
  Loader2,
  LoaderCircle,
  LoaderPinwheel,
  MousePointer2,
  Paperclip,
  Plus,
  Send,
  Signal,
  TextCursor,
  Users,
  Users2,
} from "lucide-react";

export function ProjectSheet() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="bg-primary rounded-xl ">Add New Project</Button>
      </SheetTrigger>
      <SheetContent className="min-w-[700px] p-20">
        <SheetHeader>
          <SheetTitle className="text-3xl text-gray-300 font-bold">
            <div>
              <Input
                className="placeholder:text-gray-300 placeholder:text-3xl border-none placeholder:font-bold shadow-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-transparent focus:ring-0 focus:outline-none "
                placeholder="New Project"
                style={{
                  caretColor: "black",
                  height: "4rem",
                  fontSize: "2rem",
                }}
              />
            </div>
          </SheetTitle>
          <div className="flex gap-4 ">
            <div className="flex gap-1">
              <div className="flex flex-col gap-1">
                <Button
                  size={"sm"}
                  variant={"ghost"}
                  className="text-gray-500 font-semibold rounded-md h-6"
                >
                  <Users />
                  Owner
                </Button>
                <Button
                  size={"sm"}
                  variant={"ghost"}
                  className="text-gray-500 font-semibold rounded-md h-6 text-left"
                >
                  Empty
                </Button>
              </div>
              <div className="flex flex-col gap-1">
                <Button
                  size={"sm"}
                  variant={"ghost"}
                  className="text-gray-500 font-semibold rounded-md h-6"
                >
                  Status
                </Button>
                <Button
                  size={"sm"}
                  variant={"ghost"}
                  className="text-gray-500 font-semibold rounded-md h-6 text-left"
                >
                  <div className="rounded-lg bg-gray-200 px-2 flex gap-1 justify-center items-center">
                    <span className="h-2 w-2 rounded-full bg-gray-500"></span>
                    Backlog
                  </div>
                </Button>
              </div>
            </div>
            <div className="flex gap-1">
              <div className="flex flex-col gap-1">
                <Button
                  size={"sm"}
                  variant={"ghost"}
                  className="text-gray-500 font-semibold rounded-md h-6"
                >
                  <CheckCheck />
                  Completion
                </Button>
                <Button
                  size={"sm"}
                  variant={"ghost"}
                  className="text-gray-500 font-semibold rounded-md h-6 text-left"
                >
                  Empty
                </Button>
              </div>
              <div className="flex flex-col justify-center gap-1">
                <Button
                  size={"sm"}
                  variant={"ghost"}
                  className="text-gray-500 font-semibold rounded-md h-6"
                >
                  <MousePointer2 />
                  Sign off project ?
                </Button>
                <Button
                  disabled
                  size={"sm"}
                  variant={"outline"}
                  className="text-gray-500 font-semibold rounded-md h-6 text-left cursor-not-allowed"
                >
                  Sign off project ?
                </Button>
              </div>
            </div>
          </div>
        </SheetHeader>
        <div className="mt-5 flex gap-4 flex-col">
          <div>
            <h1 className="text-gray-700 font-semibold text-xs">Properties</h1>
            <div className="flex flex-col gap-2">
              <div className="flex gap-2 items-center w-full justify-between">
                <Button
                  variant={"ghost"}
                  className="text-gray-400 text-sm  min-w-[100px]"
                >
                  <Calendar size={10} />
                  <h1 className="text-left">Date</h1>
                </Button>
                <Input
                  size={10}
                  placeholder="Empty"
                  className="border-none w-9/12 shadow-none rounded-md text-xs placeholder:text-sm hover:bg-gray-100"
                />
              </div>
              <div className="flex gap-2 items-center w-full justify-between">
                <Button variant={"ghost"} className="text-gray-400 text-sm ">
                  <ChevronDownCircle size={10} />
                  Priority
                </Button>
                <Input
                  size={10}
                  placeholder="Empty"
                  className="border-none w-9/12 shadow-none rounded-md text-xs placeholder:text-sm hover:bg-gray-100"
                />
              </div>
              <div className="flex gap-2 items-center w-full justify-between">
                <Button variant={"ghost"} className="text-gray-400 text-sm ">
                  <ArrowUpRight size={10} />
                  Is Blocking
                </Button>
                <Input
                  size={10}
                  placeholder="Empty"
                  className="border-none w-9/12 shadow-none rounded-md text-xs placeholder:text-sm hover:bg-gray-100"
                />
              </div>
              <div className="flex gap-2 items-center w-full justify-between">
                <Button variant={"ghost"} className="text-gray-400 text-sm ">
                  <Clock10 size={10} />
                  Duration
                </Button>
                <Input
                  size={10}
                  placeholder="Empty"
                  className="border-none w-9/12 shadow-none rounded-md text-xs placeholder:text-sm hover:bg-gray-100"
                />
              </div>

              <div className="flex gap-2 items-center w-full ">
                <Button
                  variant={"ghost"}
                  className="text-gray-400 text-sm hover:text-gray-400 "
                >
                  <Plus size={10} />
                  Add a property
                </Button>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <h1 className="text-gray-700 font-semibold text-xs">Comments</h1>
            <div className="flex gap-1 items-center border-b py-3">
              <div>
                <Avatar className="h-6 w-6 shadow-sm border">
                  <AvatarFallback className="text-xs bg-white text-gray-500">
                    M
                  </AvatarFallback>
                </Avatar>
              </div>
              <Input
                className="border-none shadow-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-transparent focus:ring-0 focus:outline-none placeholder:text-gray-400"
                placeholder="Add a comment..."
              />
              <div className="flex  items-center">
                <Button
                  size={"icon"}
                  variant={"ghost"}
                  className="text-gray-400 h-6 w-6 hover:text-gray-400"
                >
                  <Paperclip />
                </Button>
                <Button
                  size={"icon"}
                  variant={"ghost"}
                  className="text-gray-400 h-6 w-6 hover:text-gray-400"
                >
                  <AtSign />
                </Button>
                <Button
                  disabled
                  size={"icon"}
                  variant={"ghost"}
                  className="text-gray-400 h-6 w-6 hover:text-gray-400"
                >
                  <Send />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
