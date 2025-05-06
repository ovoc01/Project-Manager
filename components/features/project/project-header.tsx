import { Button } from "@/components/ui/button";
import {
  ArrowDown,
  ArrowUpDown,
  ChartNoAxesGantt,
  ChartPie,
  Ellipsis,
  ListFilter,
  Search,
  Star,
  Table2,
  Zap,
} from "lucide-react";

export function ProjectHeader() {
  return (
    <header className="flex justify-between border-b border-b-gray-200 max-w-5xl">
      <div className="flex justify-start ">
        <Button variant={"ghost"}>
          <Star />
          Active
        </Button>
        <Button variant={"ghost"}>
          <ChartNoAxesGantt />
          Timeline
        </Button>
        <Button
          variant={"ghost"}
          className="border-b-2 border-b-black rounded-b-none"
        >
          <Table2 />
          Board
        </Button>

        <Button variant={"ghost"}>All</Button>
        <Button variant={"ghost"}>
          <ChartPie />
          Status Breakdown
        </Button>
      </div>
      <div className="flex gap-2">
        <Button size={"icon"} variant={"ghost"} className="text-gray-400">
          <ListFilter />
        </Button>
        <Button size={"icon"} variant={"ghost"} className="text-gray-400">
          <ArrowUpDown />
        </Button>
        <Button size={"icon"} variant={"ghost"} className="text-sky-400">
          <Zap />
        </Button>
        <Button size={"icon"} variant={"ghost"} className="text-gray-400">
          <Search />
        </Button>
        <Button size={"icon"} variant={"ghost"} className="text-gray-400">
          <Ellipsis />
        </Button>
      </div>
    </header>
  );
}
