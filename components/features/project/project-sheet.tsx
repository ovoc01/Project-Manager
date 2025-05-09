"use client";
import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { PROJECT_BOARDS } from "@/constants/colors";
import { useKanbanStore } from "@/shared/store";
import { ITask } from "@/types/kanban";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import {
    ArrowUpRight,
    AtSign,
    Calendar,
    CheckCheck,
    ChevronDownCircle,
    Clock10,
    MousePointer2,
    Paperclip,
    Plus,
    Send,
    Users,
} from "lucide-react";
import { useState } from "react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"; // Added for explicit item usage

// Interface for project details form
interface ProjectFormParams {
    date: string;
    priority: string;
    isBlocking: string;
    duration: number;
}

// --- Reusable Sub-Components ---

// Component for Project Title Input
interface ProjectTitleEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}
const ProjectTitleEditor: React.FC<ProjectTitleEditorProps> = ({ value, onChange, placeholder }) => (
    <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="placeholder:text-gray-300 text-black placeholder:text-3xl border-none placeholder:font-bold shadow-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-transparent focus:ring-0 focus:outline-none "
        placeholder={placeholder || "New Project"}
        style={{
            caretColor: "black",
            height: "4rem",
            fontSize: "2rem",
        }}
    />
);

// Component for Project Metadata Fields (Owner, Status, etc.)
interface ProjectMetaFieldsProps {
    selectedStatus: string;
    onStatusSelect: (status: string) => void;
    // TODO: Add props for owner, completion, sign-off if they become dynamic
}
const ProjectMetaFields: React.FC<ProjectMetaFieldsProps> = ({ selectedStatus, onStatusSelect }) => {
    // const selectedBoardConfig = PROJECT_BOARDS.find(b => b.name === selectedStatus) || PROJECT_BOARDS[0];
    return (
        <div className="flex gap-4 ">
            {/* Owner Section */}
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
                {/* Status Section */}
                <div className="flex flex-col gap-1">
                    <Button
                        size={"sm"}
                        variant={"ghost"}
                        className="text-gray-500 font-semibold rounded-md h-6"
                    >
                        Status
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                size={"sm"}
                                variant={"ghost"}
                                className="text-gray-500 font-semibold rounded-md h-6 text-left"
                            >
                                <div className="rounded-lg bg-gray-200 px-2 flex gap-1 justify-center items-center">
                                    <span className="h-2 w-2 rounded-full bg-gray-500"></span> {/* Consider dynamic color based on status */}
                                    {selectedStatus}
                                </div>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            {PROJECT_BOARDS.map((board) => (
                                <DropdownMenuItem key={board.name} onClick={() => onStatusSelect(board.name)} className="cursor-pointer">
                                    <div className={`px-2 flex gap-1 justify-start items-center`}> {/* Removed bg-gray-200 for items */}
                                        <span className="h-2 w-2 rounded-full bg-gray-500"></span> {/* TODO: Use board.color to style the dot */}
                                        {board.name}
                                    </div>
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
            {/* Completion and Sign off Section */}
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
    );
};

// Component for a single Property Item
interface ProjectPropertyItemProps {
    icon: React.ReactElement;
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    inputType?: string;
}
const ProjectPropertyItem: React.FC<ProjectPropertyItemProps> = ({ icon, label, value, onChange, placeholder, inputType = "text" }) => (
    <div className="flex gap-2 items-center w-full justify-between">
        <Button variant={"ghost"} className="text-gray-400 text-sm min-w-[100px] justify-start">
            {React.cloneElement(icon, { size: 14, className: "mr-2" })} {/* Standardize icon size and margin */}
            <h1 className="text-left">{label}</h1>
        </Button>
        <Input
            type={inputType}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder || "Empty"}
            className="border-none w-9/12 shadow-none rounded-md text-xs placeholder:text-sm hover:bg-gray-100 focus-visible:ring-1 focus-visible:ring-gray-300"
        />
    </div>
);

// Component for Project Detail Properties Section
interface ProjectDetailPropertiesProps {
    details: ProjectFormParams;
    onDetailChange: (field: keyof ProjectFormParams, value: string | number) => void;
}
const ProjectDetailProperties: React.FC<ProjectDetailPropertiesProps> = ({ details, onDetailChange }) => (
    <div>
        <h1 className="text-gray-700 font-semibold text-xs">Properties</h1>
        <div className="flex flex-col gap-2">
            <ProjectPropertyItem
                icon={<Calendar />}
                label="Date"
                value={details.date}
                onChange={(val) => onDetailChange('date', val)}
                placeholder="Select a date"
                inputType="date" // Example: use date picker or text
            />
            <ProjectPropertyItem
                icon={<ChevronDownCircle />}
                label="Priority"
                value={details.priority}
                onChange={(val) => onDetailChange('priority', val)}
                placeholder="e.g. High, Medium, Low"
            />
            <ProjectPropertyItem
                icon={<ArrowUpRight />}
                label="Is Blocking"
                value={details.isBlocking}
                onChange={(val) => onDetailChange('isBlocking', val)}
                placeholder="e.g. Yes/No, or task ID"
            />
            <ProjectPropertyItem
                icon={<Clock10 />}
                label="Duration (hours)"
                value={String(details.duration)}
                onChange={(val) => onDetailChange('duration', Number(val) || 0)}
                placeholder="e.g. 8"
                inputType="number"
            />
            <div className="flex gap-2 items-center w-full ">
                <Button variant={"ghost"} className="text-gray-400 text-sm hover:text-gray-400 ">
                    <Plus size={10} className="mr-1" />
                    Add a property
                </Button>
            </div>
        </div>
    </div>
);

// Component for Comments Section
interface ProjectCommentsSectionProps {
    // TODO: Add props for comments list, current user, onAddComment
    commentInput: string;
    onCommentInputChange: (value: string) => void;
    onSendComment: () => void;
    isCommentSendable: boolean;
}
const ProjectCommentsSection: React.FC<ProjectCommentsSectionProps> = ({
    commentInput,
    onCommentInputChange,
    onSendComment,
    isCommentSendable,
}) => (
    <div className="flex flex-col gap-2">
        <h1 className="text-gray-700 font-semibold text-xs">Comments</h1>
        {/* TODO: Add display for existing comments */}
        <div className="flex gap-1 items-center border-b py-3">
            <div>
                <Avatar className="h-6 w-6 shadow-sm border">
                    <AvatarFallback className="text-xs bg-white text-gray-500">
                        U {/* Placeholder for User Avatar */}
                    </AvatarFallback>
                </Avatar>
            </div>
            <Input
                value={commentInput}
                onChange={(e) => onCommentInputChange(e.target.value)}
                className="border-none shadow-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-transparent focus:ring-0 focus:outline-none placeholder:text-gray-400"
                placeholder="Add a comment..."
            />
            <div className="flex items-center">
                <Button size={"icon"} variant={"ghost"} className="text-gray-400 h-6 w-6 hover:text-gray-400">
                    <Paperclip size={16} />
                </Button>
                <Button size={"icon"} variant={"ghost"} className="text-gray-400 h-6 w-6 hover:text-gray-400">
                    <AtSign size={16} />
                </Button>
                <Button
                    disabled={!isCommentSendable}
                    size={"icon"}
                    variant={"ghost"}
                    className="text-gray-400 h-6 w-6 hover:text-gray-400 disabled:opacity-50"
                    onClick={onSendComment}
                >
                    <Send size={16} />
                </Button>
            </div>
        </div>
    </div>
);


interface ProjectSheetProps {
    defaultValues?: {
        projectName?: string;
        projectStatus?: string;
        details?: Partial<ProjectFormParams>;
    };
    onSave?: (data: {
        projectName: string;
        projectStatus: string;
        details: ProjectFormParams;
    }) => void;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}
interface SheetTriggerProps {
    children: React.ReactNode;
}



export function ProjectSheet({
    defaultValues,
    onSave,
    open,
    onOpenChange
}: ProjectSheetProps) {
    const [projectName, setProjectName] = useState(defaultValues?.projectName || "");
    const [projectStatus, setProjectStatus] = useState(defaultValues?.projectStatus || "Backlog");
    const [projectDetails, setProjectDetails] = useState<ProjectFormParams>({
        date: defaultValues?.details?.date || "",
        priority: defaultValues?.details?.priority || "",
        isBlocking: defaultValues?.details?.isBlocking || "",
        duration: defaultValues?.details?.duration || 0,
    });
    const [currentComment, setCurrentComment] = useState("");

    const addTask = useKanbanStore((state) => state.addTask);

    const resetForm = () => {
        setProjectName(defaultValues?.projectName || "");
        setProjectStatus(defaultValues?.projectStatus || "Backlog");
        setProjectDetails({
            date: defaultValues?.details?.date || "",
            priority: defaultValues?.details?.priority || "",
            isBlocking: defaultValues?.details?.isBlocking || "",
            duration: defaultValues?.details?.duration || 0,
        });
        setCurrentComment("");
    };

    const handleOpenChange = async (isOpen: boolean) => {
        if (onOpenChange) {
            onOpenChange(isOpen);
        }

        if (!isOpen && projectName.trim() !== "") {
            const task: ITask = {
                id: Date.now().toString(),
                label: projectName.trim(),
                color: PROJECT_BOARDS.find(b => b.name === projectStatus)?.color || "gray",
                projectName: projectStatus,
                isEdited: false,
                duration: projectDetails.duration,
            };

            if (onSave) {
                onSave({
                    projectName: projectName.trim(),
                    projectStatus,
                    details: projectDetails
                });
            } else {
                await addTask(projectStatus, task);
            }
            resetForm();
        } else if (!isOpen) {
            resetForm();
        }
    };

    const handleDetailChange = (field: keyof ProjectFormParams, value: string | number) => {
        setProjectDetails(prev => ({ ...prev, [field]: value }));
    };

    const handleSendComment = () => {
        if (currentComment.trim()) {
            console.log("Sending comment:", currentComment);
            setCurrentComment("");
        }
    };

    return (
        <Sheet open={open} onOpenChange={handleOpenChange}>

            <SheetContent className="min-w-[700px] p-10 sm:p-20 overflow-y-auto">
                <SheetHeader>
                    <SheetTitle className="text-3xl text-gray-300 font-bold">
                        <ProjectTitleEditor value={projectName} onChange={setProjectName} />
                    </SheetTitle>
                    <ProjectMetaFields selectedStatus={projectStatus} onStatusSelect={setProjectStatus} />
                </SheetHeader>
                <div className="mt-5 flex gap-4 flex-col">
                    <ProjectDetailProperties details={projectDetails} onDetailChange={handleDetailChange} />
                    <ProjectCommentsSection
                        commentInput={currentComment}
                        onCommentInputChange={setCurrentComment}
                        onSendComment={handleSendComment}
                        isCommentSendable={currentComment.trim().length > 0}
                    />
                </div>
            </SheetContent>
        </Sheet>
    );
}

export function ProjectSheet1() {
    const [projectName, setProjectName] = useState("");
    const [projectStatus, setProjectStatus] = useState("Backlog");
    const [projectDetails, setProjectDetails] = useState<ProjectFormParams>({
        date: "",
        priority: "",
        isBlocking: "",
        duration: 0,
    });
    const [currentComment, setCurrentComment] = useState("");

    const addTask = useKanbanStore((state) => state.addTask);

    const resetForm = () => {
        setProjectName("");
        setProjectStatus("Backlog");
        setProjectDetails({
            date: "",
            priority: "",
            isBlocking: "",
            duration: 0,
        });
        setCurrentComment("");
    };

    const handleOpenChange = async (isOpen: boolean) => {
        if (!isOpen && projectName.trim() !== "") {
            const task: ITask = {
                id: Date.now().toString(),
                label: projectName.trim(),
                color: PROJECT_BOARDS.find(b => b.name === projectStatus)?.color || "gray",
                projectName: projectStatus, // This is the board name
                isEdited: false, // New tasks are not in edit mode by default
                duration: projectDetails.duration,
                // TODO: Add other projectDetails (date, priority, isBlocking) to ITask if needed
                // For now, they are not part of the ITask interface directly for storage via addTask
            };
            await addTask(projectStatus, task);
            resetForm();
        } else if (!isOpen) {
            // If sheet is closed without a project name, reset form anyway
            resetForm();
        }
    };

    const handleDetailChange = (field: keyof ProjectFormParams, value: string | number) => {
        setProjectDetails(prev => ({ ...prev, [field]: value }));
    };

    const handleSendComment = () => {
        if (currentComment.trim()) {
            // Logic to add comment
            console.log("Sending comment:", currentComment);
            setCurrentComment("");
        }
    };

    return (
        <Sheet onOpenChange={handleOpenChange}>
            <SheetTrigger asChild>
                <Button className="bg-primary rounded-xl ">Add New Project</Button>
            </SheetTrigger>
            <SheetContent className="min-w-[700px] p-10 sm:p-20 overflow-y-auto"> {/* Added p-10 for smaller screens and overflow-y-auto */}
                <SheetHeader>
                    <SheetTitle className="text-3xl text-gray-300 font-bold">
                        <ProjectTitleEditor value={projectName} onChange={setProjectName} />
                    </SheetTitle>
                    <ProjectMetaFields selectedStatus={projectStatus} onStatusSelect={setProjectStatus} />
                </SheetHeader>
                <div className="mt-5 flex gap-4 flex-col">
                    <ProjectDetailProperties details={projectDetails} onDetailChange={handleDetailChange} />
                    <ProjectCommentsSection
                        commentInput={currentComment}
                        onCommentInputChange={setCurrentComment}
                        onSendComment={handleSendComment}
                        isCommentSendable={currentComment.trim().length > 0}
                    />
                </div>
            </SheetContent>
        </Sheet>
    );
}
