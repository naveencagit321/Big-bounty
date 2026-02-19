import React, { useState, useEffect } from "react";
import { Task } from "../interfaces/bounty";
import TaskPosting from "./TaskPosting";
import TaskBoard from "./TaskBoard";
import TaskDetail from "./TaskDetail";

interface BountyBoardAppProps {
  walletAddress?: string;
  isConnected: boolean;
}

type ViewType = "board" | "create" | "account";

export default function BountyBoardApp({
  walletAddress,
  isConnected,
}: BountyBoardAppProps) {
  const [view, setView] = useState<ViewType>("board");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Mock initial tasks
  useEffect(() => {
    const mockTasks: Task[] = [
      {
        id: 1,
        title: "Help me move furniture",
        description: "Need help moving a sofa and dresser from my apartment to storage.",
        creator: "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAY5HVY",
        reward: 10_000_000, // 10 ALGO
        status: "open",
        deadline: Math.floor(Date.now() / 1000) + 7 * 86400,
        createdAt: Math.floor(Date.now() / 1000) - 86400,
      },
      {
        id: 2,
        title: "Proofread my essay",
        description: "Need someone to proofread my 2000-word essay on Renaissance art.",
        creator: "BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBY5HVY",
        reward: 5_000_000, // 5 ALGO
        status: "open",
        deadline: Math.floor(Date.now() / 1000) + 3 * 86400,
        createdAt: Math.floor(Date.now() / 1000) - 43200,
      },
      {
        id: 3,
        title: "Design a poster",
        description: "Create a promotional poster for our club event (A3 size, digital).",
        creator: "CCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCCY5HVY",
        reward: 15_000_000, // 15 ALGO
        status: "claimed",
        claimant: "DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDY5HVY",
        deadline: Math.floor(Date.now() / 1000) + 5 * 86400,
        createdAt: Math.floor(Date.now() / 1000) - 172800,
      },
      {
        id: 4,
        title: "Walk my dog",
        description: "Need someone to walk my golden retriever for 30 minutes today.",
        creator: "EEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEY5HVY",
        reward: 3_000_000, // 3 ALGO
        status: "completed",
        claimant: "FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFY5HVY",
        deadline: Math.floor(Date.now() / 1000) + 86400,
        createdAt: Math.floor(Date.now() / 1000) - 3600,
      },
    ];
    setTasks(mockTasks);
  }, []);

  const handleTaskCreated = (newTask: Task) => {
    setTasks((prev) => [newTask, ...prev]);
    setView("board");
  };

  const handleTaskSelect = (task: Task) => {
    setSelectedTask(task);
  };

  const handleCloseDetail = () => {
    setSelectedTask(null);
  };

  const handleClaimTask = async (taskId: number) => {
    // Update task status
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? { ...t, status: "claimed" as const, claimant: walletAddress }
          : t
      )
    );
    setSelectedTask(null);
    console.log("Task claimed:", taskId);
  };

  const handleSubmitProof = async (taskId: number, proofUri: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? { ...t, status: "submitted" as const, submissionUri: proofUri }
          : t
      )
    );
    setSelectedTask(null);
    console.log("Proof submitted for task:", taskId, proofUri);
  };

  const handleApprovePayment = async (taskId: number) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId ? { ...t, status: "completed" as const } : t
      )
    );
    setSelectedTask(null);
    console.log("Payment approved for task:", taskId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-blue-600">⚡ Bounty Board</h1>
          <nav className="flex gap-2">
            <button
              onClick={() => setView("board")}
              className={`btn btn-sm ${
                view === "board" ? "btn-primary" : "btn-ghost"
              }`}
            >
              📋 Tasks
            </button>
            <button
              onClick={() => setView("create")}
              disabled={!isConnected}
              className={`btn btn-sm ${
                view === "create" ? "btn-primary" : "btn-ghost"
              } ${!isConnected ? "btn-disabled" : ""}`}
            >
              ➕ Post Task
            </button>
            <button
              onClick={() => setView("account")}
              disabled={!isConnected}
              className={`btn btn-sm ${
                view === "account" ? "btn-primary" : "btn-ghost"
              } ${!isConnected ? "btn-disabled" : ""}`}
            >
              👤 Account
            </button>
          </nav>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto py-8">
        {!isConnected && (
          <div className="alert alert-warning mx-4 mb-6">
            <span>
              🔗 Connect your wallet to post tasks and claim bounties
            </span>
          </div>
        )}

        {view === "board" && (
          <TaskBoard
            tasks={tasks}
            walletAddress={walletAddress}
            onTaskSelect={handleTaskSelect}
            isLoading={isLoading}
          />
        )}

        {view === "create" && (
          <TaskPosting
            onTaskCreated={handleTaskCreated}
            walletAddress={walletAddress}
          />
        )}

        {view === "account" && (
          <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6">My Account</h2>
            {walletAddress ? (
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded">
                  <p className="text-sm text-gray-600">Connected Wallet</p>
                  <p className="font-mono text-sm break-all">{walletAddress}</p>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 bg-blue-50 rounded">
                    <p className="text-sm text-gray-600">Tasks Created</p>
                    <p className="text-2xl font-bold">
                      {tasks.filter((t) => t.creator === walletAddress).length}
                    </p>
                  </div>
                  <div className="p-4 bg-green-50 rounded">
                    <p className="text-sm text-gray-600">Tasks Claimed</p>
                    <p className="text-2xl font-bold">
                      {tasks.filter((t) => t.claimant === walletAddress).length}
                    </p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded">
                    <p className="text-sm text-gray-600">Completed</p>
                    <p className="text-2xl font-bold">
                      {
                        tasks.filter(
                          (t) =>
                            t.status === "completed" &&
                            t.claimant === walletAddress
                        ).length
                      }
                    </p>
                  </div>
                </div>

                <div className="divider"></div>

                <div>
                  <h3 className="font-semibold mb-3">My Tasks</h3>
                  <div className="space-y-2">
                    {tasks.filter((t) => t.creator === walletAddress).length > 0 ? (
                      tasks
                        .filter((t) => t.creator === walletAddress)
                        .map((task) => (
                          <div
                            key={task.id}
                            className="p-3 bg-gray-50 rounded flex justify-between items-center"
                          >
                            <span className="font-semibold">{task.title}</span>
                            <span className="badge badge-primary capitalize">
                              {task.status}
                            </span>
                          </div>
                        ))
                    ) : (
                      <p className="text-gray-500">No tasks created yet</p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-600">Connect your wallet to view account details</p>
            )}
          </div>
        )}
      </main>

      {/* Task Detail Modal */}
      {selectedTask && (
        <TaskDetail
          task={selectedTask}
          walletAddress={walletAddress}
          onClose={handleCloseDetail}
          onClaim={handleClaimTask}
          onSubmit={handleSubmitProof}
          onApprove={handleApprovePayment}
        />
      )}
    </div>
  );
}
