import { ChartNoAxesGantt } from "lucide-react";

export default function Logo() {
  return (
    <div className="flex gap-4 items-center">
      <div className="p-1 bg-primary rounded-lg">
        <ChartNoAxesGantt className="h-8 w-8 text-white" />
      </div>
      <span className="flex text-xl">
        <h1 className="font-bold ">Kan</h1>
        <h1 className="text-primary">Bancho</h1>
      </span>
    </div>
  );
}
