import { ProjectBoard } from "./project-board";
import { ProjectHeader } from "./project-header";

export function ProjectArea() {
  return (
    <div className="shadow-sm rounded-2xl h-fit col-span-9 p-4 bg-white">
      <ProjectHeader />
      <ProjectBoard />
    </div>
  );
}
