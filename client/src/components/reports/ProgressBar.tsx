import React, { useState } from "react";

import Container from "../common/container";
import { Report, SelectedTaskType } from "@/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import TaskModalContent from "./TaskModalContent";

type ProgressBarType = {
  foundReport: Report | undefined;
};

export default function ProgressBar({ foundReport }: ProgressBarType) {
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<
    SelectedTaskType | undefined
  >();

  // Helper function to check if the status is "Completed"
  function isStatusCompleted(status: string): boolean {
    return status === "Completed";
  }

  // Helper function to check if the status is "In Progress"
  function isStatusInProgress(status: string): boolean {
    return status === "In Progress";
  }

  // Helper function to translate the status
  function translateStatus(status: string) {
    switch (status) {
      case "Completed":
        return "تکمیل‌شده";
      case "In Progress":
        return "در حال اجرا";
      case "Not Started":
        return "شروع نشده";
      default:
        return "نامشخص";
    }
  }

  // Check if any report found
  if (!foundReport) {
    return (
      <Container>
        <div className="container mx-auto p-6">
          <h2 className="text-3xl sm:text-2xl font-bold text-gray-800 mb-2">
            خط زمانی پیشرفت
          </h2>
          <p> خط زمانی پیشرفت پیدا نشد</p>
        </div>
      </Container>
    );
  }

  // Close the task modal
  const handleCloseTaskModal = () => {
    setIsTaskDialogOpen(false);
  };

  return (
    <div className="container">
      <h2 className="text-3xl sm:text-xl font-semibold text-gray-800 mb-2">
        خط زمانی پیشرفت
      </h2>
      <div className="flex  gap-12 mb-12">
        <p>{`عنوان ایده : ${foundReport.ideaTitle}`}</p>
        <p>{`شناسه گزارش  : ${foundReport.id}`}</p>
      </div>
      <div className="flex items-center justify-between relative">
        {foundReport.stages.map((stage, index) => (
          <React.Fragment key={index}>
            {/* Node Title */}
            <div className="text-center w-1/4">
              <h3 className="text-lg mb-2">{stage.stageTitle}</h3>
              <div
                className={`h-4 w-4 rounded-full mx-auto ${
                  isStatusCompleted(stage.stageStatus)
                    ? "bg-green-500"
                    : isStatusInProgress(stage.stageStatus)
                    ? "bg-yellow-500"
                    : "bg-gray-300"
                }`}
              ></div>
            </div>
            {/* Connecting Line */}
            {index < foundReport.stages.length - 1 && (
              <div className="absolute top-10 w-full h-1 -z-10">
                <div
                  className="h-1 bg-gray-300"
                  style={{
                    width: `${
                      ((index + 1) / (foundReport.stages.length - 1)) * 100
                    }%`,
                  }}
                ></div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
      {/* Cards */}
      <div className="flex justify-between mt-3 gap-3">
        {foundReport.stages.map((stage, index) => (
          <div
            key={index}
            className="w-1/4 p-2 pb-4 border rounded-lg shadow-lg bg-white"
          >
            <h4
              className={`text-center ${
                isStatusCompleted(stage.stageStatus)
                  ? "text-green-500"
                  : isStatusInProgress(stage.stageStatus)
                  ? "text-yellow-500"
                  : "text-gray-400"
              }`}
            >
              {translateStatus(stage.stageStatus)}
            </h4>
            <ul className="mt-2 text-sm text-gray-600">
              {stage.tasks.map((task, i) => (
                <li key={i}>
                  <button
                    onClick={() => {
                      setSelectedTask(task);
                      setIsTaskDialogOpen(true);
                    }}
                    className={`flex gap-2 w-full mb-2 text-right transition-colors duration-200 ${
                      task.taskStatus === "Completed"
                        ? "text-green-600 hover:text-green-800"
                        : task.taskStatus === "In Progress"
                        ? "text-yellow-600 hover:text-yellow-800"
                        : "text-gray-600 hover:text-gray-800"
                    } hover:underline hover:cursor-pointer`}
                  >
                    <span
                      className={`h-4 w-4 flex-shrink-0 rounded-full border ${
                        task.taskStatus === "Completed"
                          ? "bg-green-500 border-green-500"
                          : task.taskStatus === "In Progress"
                          ? "bg-yellow-500 border-yellow-500"
                          : "border-gray-300"
                      } flex items-center justify-center`}
                    >
                      {task.taskStatus === "Completed" && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3 w-3 text-white"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586l-3.293-3.293a1 1 0 10-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </span>
                    {task.taskTitle}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      {/* Task Modal */}
      <Dialog open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen}>
        <DialogContent className="w-[50%] max-w-[60%] mx-auto max-h-[calc(100vh-2rem)] overflow-y-auto rtl-scroll">
          <DialogHeader>
            <DialogTitle className="text-center">
              {selectedTask?.taskTitle}
            </DialogTitle>
          </DialogHeader>
          <TaskModalContent
            task={selectedTask}
            foundReport={foundReport}
            closeTaskModal={handleCloseTaskModal}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
