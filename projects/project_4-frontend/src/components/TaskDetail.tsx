import React, { useState } from "react";
import { Task } from "../interfaces/bounty";
import { formatAlgo, getTimeRemaining } from "../utils/bountyUtils";

interface TaskDetailProps {
  task: Task;
  walletAddress?: string;
  onClose: () => void;
  onClaim?: (taskId: number) => void;
  onSubmit?: (taskId: number, proofUri: string) => void;
  onApprove?: (taskId: number) => void;
}

type TabType = "details" | "proof" | "action";

export default function TaskDetail({
  task,
  walletAddress,
  onClose,
  onClaim,
  onSubmit,
  onApprove,
}: TaskDetailProps) {
  const [activeTab, setActiveTab] = useState<TabType>("details");
  const [proofUri, setProofUri] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isCreator = task.creator === walletAddress;
  const isClaimant = task.claimant === walletAddress;
  const canClaim = task.status === "open" && !isCreator;
  const canSubmit = task.status === "claimed" && isClaimant;
  const canApprove = task.status === "submitted" && isCreator;

  const handleClaim = async () => {
    if (!onClaim) return;
    try {
      setError(null);
      await Promise.resolve(onClaim(task.id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to claim task");
    }
  };

  const handleSubmitProof = async () => {
    if (!onSubmit || !proofUri) {
      setError("Please provide a proof URI");
      return;
    }

    setIsSubmitting(true);
    try {
      setError(null);
      await Promise.resolve(onSubmit(task.id, proofUri));
      setProofUri("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit proof");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApprove = async () => {
    if (!onApprove) return;
    try {
      setError(null);
      await Promise.resolve(onApprove(task.id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to approve payment");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gray-50 px-6 py-4 flex justify-between items-start border-b">
          <div className="flex-1">
            <h2 className="text-2xl font-bold">{task.title}</h2>
            <div className="mt-2 flex gap-2 items-center">
              <span className={`badge badge-lg capitalize`}>
                {task.status}
              </span>
              <span className="text-green-600 font-semibold text-lg">
                💰 {formatAlgo(task.reward)} ALGO
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="btn btn-ghost btn-circle btn-sm"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="tabs tabs-lifted px-6 pt-4 border-b">
          <button
            className={`tab ${activeTab === "details" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("details")}
          >
            Details
          </button>
          {(isClaimant || canSubmit) && (
            <button
              className={`tab ${activeTab === "proof" ? "tab-active" : ""}`}
              onClick={() => setActiveTab("proof")}
            >
              Submission
            </button>
          )}
          <button
            className={`tab ${activeTab === "action" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("action")}
          >
            Actions
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          {error && (
            <div className="alert alert-error mb-4">
              <span>{error}</span>
            </div>
          )}

          {/* Details Tab */}
          {activeTab === "details" && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Description</h3>
                <p className="text-gray-600 whitespace-pre-wrap">
                  {task.description}
                </p>
              </div>

              <div className="divider"></div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Creator</p>
                  <p className="font-mono text-sm">
                    {isCreator ? "You" : task.creator}
                  </p>
                </div>
                {task.claimant && (
                  <div>
                    <p className="text-sm text-gray-600">Claimant</p>
                    <p className="font-mono text-sm">
                      {isClaimant ? "You" : task.claimant}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-600">Time Remaining</p>
                  <p className="font-semibold text-orange-600">
                    ⏰ {getTimeRemaining(task.deadline)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <p className="font-semibold capitalize">{task.status}</p>
                </div>
              </div>

              {task.submissionUri && (
                <>
                  <div className="divider"></div>
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Proof of Completion</p>
                    <a
                      href={task.submissionUri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link link-primary"
                    >
                      📎 View Submission
                    </a>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Proof Tab */}
          {activeTab === "proof" && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Submit proof of task completion (IPFS link, Google Drive, or cloud storage URL)
              </p>
              <input
                type="text"
                placeholder="https://example.com/proof or ipfs://Qm..."
                value={proofUri}
                onChange={(e) => setProofUri(e.target.value)}
                className="input input-bordered w-full"
              />
              <button
                onClick={handleSubmitProof}
                disabled={isSubmitting || !proofUri}
                className="btn btn-primary w-full"
              >
                {isSubmitting ? "Submitting..." : "Submit Proof"}
              </button>
            </div>
          )}

          {/* Action Tab */}
          {activeTab === "action" && (
            <div className="space-y-3">
              {canClaim && (
                <button onClick={handleClaim} className="btn btn-success w-full">
                  🎯 Claim This Task
                </button>
              )}

              {canApprove && (
                <button
                  onClick={handleApprove}
                  className="btn btn-primary w-full"
                >
                  ✅ Approve & Release Payment
                </button>
              )}

              {!canClaim && !canApprove && !canSubmit && (
                <div className="alert alert-info">
                  <span>
                    {isCreator
                      ? "You created this task. Waiting for completion."
                      : isClaimant
                        ? "You claimed this task."
                        : "No actions available for this task."}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
