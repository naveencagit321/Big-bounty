import React, { useState, useEffect } from "react";
import { Task } from "../interfaces/bounty";
import { formatAlgo, getTimeRemaining } from "../utils/bountyUtils";

interface TaskBoardProps {
  tasks: Task[];
  walletAddress?: string;
  onTaskSelect: (task: Task) => void;
  isLoading?: boolean;
}

type FilterStatus = "all" | "open" | "claimed" | "completed";

export default function TaskBoard({
  tasks,
  walletAddress,
  onTaskSelect,
  isLoading = false,
}: TaskBoardProps) {
  const [filter, setFilter] = useState<FilterStatus>("all");
  const [sortBy, setSortBy] = useState<"reward" | "deadline">("reward");
  const [filteredTasks, setFilteredTasks] = useState<Task[]>(tasks);

  useEffect(() => {
    let result = tasks;

    // Apply status filter
    if (filter !== "all") {
      result = result.filter((task) => task.status === filter);
    }

    // Apply sort
    result.sort((a, b) => {
      if (sortBy === "reward") {
        return b.reward - a.reward;
      } else {
        return a.deadline - b.deadline;
      }
    });

    setFilteredTasks(result);
  }, [tasks, filter, sortBy]);

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "open":
        return "badge-success";
      case "claimed":
        return "badge-warning";
      case "submitted":
        return "badge-info";
      case "completed":
        return "badge-primary";
      case "disputed":
        return "badge-error";
      default:
        return "badge-neutral";
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">Available Tasks</h2>

      {/* Filters & Sorting */}
      <div className="mb-6 flex flex-wrap gap-4 items-center">
        <div>
          <label className="text-sm font-semibold mr-2">Filter by:</label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as FilterStatus)}
            className="select select-bordered select-sm"
          >
            <option value="all">All Tasks</option>
            <option value="open">Open</option>
            <option value="claimed">Claimed</option>
            <option value="completed">Completed</option>
            <option value="disputed">Disputed</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-semibold mr-2">Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "reward" | "deadline")}
            className="select select-bordered select-sm"
          >
            <option value="reward">Highest Reward</option>
            <option value="deadline">Nearest Deadline</option>
          </select>
        </div>

        <div className="flex-1 text-right text-gray-600">
          {filteredTasks.length} task{filteredTasks.length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* Tasks Grid */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="alert alert-info">
          <span>No tasks found. Check back later or create one!</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              className="card bg-base-100 shadow-md hover:shadow-lg transition cursor-pointer"
              onClick={() => onTaskSelect(task)}
            >
              <div className="card-body">
                {/* Header */}
                <div className="flex justify-between items-start mb-2">
                  <h3 className="card-title text-lg line-clamp-2">
                    {task.title}
                  </h3>
                  <div
                    className={`badge ${getStatusBadgeColor(task.status)} capitalize`}
                  >
                    {task.status}
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                  {task.description}
                </p>

                {/* Creator & Claimant */}
                <div className="text-xs text-gray-500 space-y-1 mb-3">
                  <p>
                    <strong>Creator:</strong>{" "}
                    {task.creator === walletAddress
                      ? "You"
                      : task.creator.slice(0, 8) + "..."}
                  </p>
                  {task.claimant && (
                    <p>
                      <strong>Claimant:</strong>{" "}
                      {task.claimant === walletAddress
                        ? "You"
                        : task.claimant.slice(0, 8) + "..."}
                    </p>
                  )}
                </div>

                {/* Reward & Deadline */}
                <div className="divider my-2"></div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-semibold text-green-600">
                      💰 {formatAlgo(task.reward)} ALGO
                    </p>
                    <p className="text-xs text-gray-500">
                      ⏰ {getTimeRemaining(task.deadline)}
                    </p>
                  </div>

                  <button
                    className={`btn btn-sm ${
                      task.status === "open" ? "btn-primary" : "btn-disabled"
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (task.status === "open") {
                        onTaskSelect(task);
                      }
                    }}
                  >
                    {task.status === "open" ? "Claim Task" : "View"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
