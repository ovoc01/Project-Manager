import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";

export function ProjectHeader() {
  return (
    <header className="flex justify-between items-center">
      <h1 className="text-2xl font-bold">Project</h1>
      <div className="flex items-center gap-4">
        <Button variant={"ghost"}>
          A-Z
          <ArrowDown />
        </Button>
        <Button variant={"secondary"} className="rounded-lg">Add New Task</Button>
      </div>
    </header>
  );
}
