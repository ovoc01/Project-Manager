import { SingleBoard, SingleBoardProps } from "./single-board";

const boards: SingleBoardProps[] = [
  {
    name: "Not Started",
    createdAt: new Date(),
    tasks: [],
  },
  {
    name: "In Progress",
    createdAt: new Date(),
    tasks: [],
    color: "yellow",
  },
  {
    name: "To Fix",
    createdAt: new Date(),
    tasks: [],
    color: "purple",
  },
  {
    name: "Finished",
    createdAt: new Date(),
    tasks: [],
    color: "green",
  },
];
export function ProjectBoard() {
  return (
    <div className="h-full rounded-2xl flex items-center gap-2 mt-4 p-3 overflow-x-scroll w-full">
      {boards.map((board) => {
        return <SingleBoard board={board} />;
      })}
    </div>
  );
}
