import { SingleBoard, SingleBoardProps } from "./single-board";

const boards: SingleBoardProps[] = [
  {
    name: "Backlog",
    createdAt: new Date(),
    tasks: [],
  },
  {
    name: "Planning",
    createdAt: new Date(),
    tasks: [],
    color: "blue",
  },
  {
    name: "In Progress",
    createdAt: new Date(),
    tasks: [],
    color: "yellow",
  },
  {
    name: "Paused",
    createdAt: new Date(),
    tasks: [],
    color: "purple",
  },
  {
    name: "Done",
    createdAt: new Date(),
    tasks: [],
    color: "green",
  },
  {
    name: "Canceled",
    createdAt: new Date(),
    tasks: [],
    color: "red",
  },
];
export function ProjectBoard() {
  return (
    <div className="rounded-2xl flex  gap-2 mt-4  overflow-x-scroll no-scrollbar">
      {boards.map((board) => {
        return <SingleBoard board={board} />;
      })}
    </div>
  );
}
