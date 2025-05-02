import Logo from "./logo";
import { ModeToggle } from "../mode-toggle";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { ProjectSheet } from "./project/project-sheet";

export default function Navbar() {
  return (
    <div className="p-6 flex justify-between items-center w-full ">
      <div className="flex items-center">
        <Logo />
      </div>
      <div className="flex items-center gap-5">
        <ModeToggle />
        <Separator orientation="vertical" className="h-6 w-[2px] bg-gray-400" />
       <ProjectSheet/>
      </div>
    </div>
  );
}
