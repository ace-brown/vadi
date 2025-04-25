import { useContext, useState } from "react";
import { Toaster, toast } from "sonner";

import { SelectedTaskType, Report } from "@/types";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { AuthContext } from "@/context/auth-context";
import { useHttpClient } from "@/hooks/http-hook";
import LoadingSpinner from "../common/LoadingSpinner";

type TaskModalContentProps = {
  task: SelectedTaskType | undefined;
  foundReport: Report;
  closeTaskModal: () => void;
};

export default function TaskModalContent({
  task,
  foundReport,
  closeTaskModal,
}: TaskModalContentProps) {
  const { isLoading, error, sendRequest } = useHttpClient();
  const [selectedStatus, setSelectedStatus] = useState(
    task?.taskStatus || "Not Started"
  );
  const [description, setDescription] = useState(task?.description || ""); // Add state for description
  const auth = useContext(AuthContext);

  // Update report handler
  async function handleUpdateTask() {
    if (!task || !foundReport) {
      toast.error("Task or report not found");
      return;
    }

    // Find the stage and task in the foundReport to update the taskStatus and description
    const updatedReport = { ...foundReport }; // Create a copy of the foundReport
    const stageIndex = updatedReport.stages.findIndex((stage) =>
      stage.tasks.some((t) => t.taskTitle === task?.taskTitle)
    );
    if (stageIndex !== -1) {
      const taskIndex = updatedReport.stages[stageIndex].tasks.findIndex(
        (t) => t.taskTitle === task?.taskTitle
      );
      if (taskIndex !== -1) {
        updatedReport.stages[stageIndex].tasks[taskIndex].taskStatus =
          selectedStatus;
        updatedReport.stages[stageIndex].tasks[taskIndex].description =
          description;
      }
    }

    try {
      await sendRequest(
        `${process.env.NEXT_PUBLIC_API_URL}/reports/${foundReport.id}`,
        "PATCH",
        JSON.stringify(updatedReport),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        },
        "گزارش‌ با موفقیت به‌روزرسانی شد"
      );
      closeTaskModal();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {}
  }

  return (
    <div>
      {isLoading && <LoadingSpinner asOverlay />}
      <Toaster position="top-center" richColors />
      <div className="flex flex-col space-y-2">
        <Label htmlFor="measures" className="font-medium">
          توضیحات وظیفه
        </Label>
        <Textarea
          id="measures"
          className="resize-none"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className="flex gap-4 mt-4">
        <RadioGroup
          defaultValue={selectedStatus}
          onValueChange={setSelectedStatus}
          className="flex"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Completed" id="completed" />
            <Label htmlFor="completed">وظیفه تکمیل‌شده است</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="In Progress" id="in-progress" />
            <Label htmlFor="in-progress">وظیفه در حال اجراست</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Not Started" id="not-started" />
            <Label htmlFor="not-started">وظیفه شروع نشده است</Label>
          </div>
        </RadioGroup>
      </div>
      <button
        onClick={handleUpdateTask}
        disabled={isLoading}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
      >
        بروزرسانی وظیفه
      </button>
      {error && <p className="text-center text-red-500 mb-8">{error}</p>}
    </div>
  );
}
