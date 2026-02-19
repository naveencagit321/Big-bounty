import React, { useState } from "react";
import { Task, TaskFormData } from "../interfaces/bounty";
import { toMicroAlgos } from "../utils/bountyUtils";

interface TaskPostingProps {
  onTaskCreated: (task: Task) => void;
  walletAddress?: string;
}

export default function TaskPosting({ onTaskCreated, walletAddress }: TaskPostingProps) {
  const [formData, setFormData] = useState<TaskFormData>({
    title: "",
    description: "",
    reward: 5,
    deadlineDays: 7,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "reward" || name === "deadlineDays" ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!walletAddress) {
      setError("Please connect your wallet first");
      return;
    }

    if (!formData.title || !formData.description) {
      setError("Please fill in all required fields");
      return;
    }

    if (formData.reward < 0.1) {
      setError("Minimum reward is 0.1 ALGO");
      return;
    }

    setIsSubmitting(true);

    try {
      // Create deadline (Unix timestamp)
      const deadline = Math.floor(Date.now() / 1000) + formData.deadlineDays * 86400;

      // Create new task object
      const newTask: Task = {
        id: Math.floor(Math.random() * 1000000),
        title: formData.title,
        description: formData.description,
        creator: walletAddress,
        reward: toMicroAlgos(formData.reward),
        status: "open",
        deadline: deadline,
        createdAt: Math.floor(Date.now() / 1000),
      };

      // TODO: Call smart contract to create task
      console.log("Creating task:", newTask);

      // Reset form
      setFormData({
        title: "",
        description: "",
        reward: 5,
        deadlineDays: 7,
      });

      onTaskCreated(newTask);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create task");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Post a New Task</h2>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Task Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., Help me move furniture"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            maxLength={100}
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Provide detailed description of the task..."
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Reward Amount */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Reward Amount (ALGO) *
          </label>
          <input
            type="number"
            name="reward"
            value={formData.reward}
            onChange={handleChange}
            placeholder="5"
            step="0.1"
            min="0.1"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <p className="text-xs text-gray-500 mt-1">Minimum: 0.1 ALGO</p>
        </div>

        {/* Deadline */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Deadline (Days) *
          </label>
          <input
            type="number"
            name="deadlineDays"
            value={formData.deadlineDays}
            onChange={handleChange}
            placeholder="7"
            min="1"
            max="365"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Due in {formData.deadlineDays} day(s)
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || !walletAddress}
          className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
        >
          {isSubmitting ? "Creating Task..." : "Post Task"}
        </button>
      </form>

      {!walletAddress && (
        <p className="mt-4 text-yellow-600 text-sm">
          💡 Connect your wallet to post tasks
        </p>
      )}
    </div>
  );
}
