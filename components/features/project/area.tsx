
import { KanbanBoardWithDndKit } from "./kanban-board";
import { ProjectBoard } from "./project-board";
import { ProjectHeader } from "./project-header";

export function ProjectArea() {
  return (
    <div className=" rounded-2xl h-fit flex flex-col p-10 bg-white">
      <ProjectHeader />
      
      <KanbanBoardWithDndKit />
    </div>
  );
}
