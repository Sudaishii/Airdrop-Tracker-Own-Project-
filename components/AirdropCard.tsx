"use client";

import { Airdrop } from "@/lib/storage";

interface AirdropCardProps {
  airdrop: Airdrop;
  onToggleCheckIn: (id: string, checkedIn: boolean) => void;
  onEdit: (airdrop: Airdrop) => void;
  onDelete: (id: string) => void;
}

const priorityColors = {
  High: 'border-red-400 bg-red-50 dark:bg-red-900/20',
  Medium: 'border-orange-400 bg-orange-50 dark:bg-orange-900/20',
  Low: 'border-purple-400 bg-purple-50 dark:bg-purple-900/20'
};

const categoryColors = {
  DeFi: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200',
  NFT: 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200',
  Gaming: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200',
  Infrastructure: 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-200',
  DAO: 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200',
  Social: 'bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-200',
  General: 'bg-slate-100 dark:bg-slate-900/30 text-slate-800 dark:text-slate-200',
  Other: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-200'
};

export default function AirdropCard({
  airdrop,
  onToggleCheckIn,
  onEdit,
  onDelete
}: AirdropCardProps) {
  const isOverdue = airdrop.dueDate && new Date(airdrop.dueDate) < new Date() && !airdrop.checkedIn;
  const daysUntilDue = airdrop.dueDate ? Math.ceil((new Date(airdrop.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : null;

  return (
    <div className={`bg-white dark:bg-gray-800 border-2 rounded-lg p-4 transition-all hover:shadow-lg hover:-translate-y-1 ${priorityColors[airdrop.priority]} ${isOverdue ? 'ring-2 ring-red-400' : ''}`}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
              {airdrop.name}
            </h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${categoryColors[airdrop.category as keyof typeof categoryColors] || categoryColors.General}`}>
              {airdrop.category}
            </span>
          </div>

          <a
            href={airdrop.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:underline text-sm break-all"
          >
            {airdrop.url}
          </a>

          {airdrop.description && (
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
              {airdrop.description}
            </p>
          )}
        </div>

        <div className="flex gap-1 ml-2">
          <button
            onClick={() => onEdit(airdrop)}
            className="p-1 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            title="Edit"
          >
            ✏️
          </button>
          <button
            onClick={() => onDelete(airdrop.id)}
            className="p-1 text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition-colors"
            title="Delete"
          >
            🗑️
          </button>
        </div>
      </div>

      <div className="space-y-3">

        {/* Due Date */}
        {airdrop.dueDate && (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-600 dark:text-gray-400">Due:</span>
            <span className={`font-medium ${isOverdue ? 'text-red-600 dark:text-red-400' : daysUntilDue && daysUntilDue <= 7 ? 'text-orange-600 dark:text-orange-400' : 'text-gray-900 dark:text-white'}`}>
              {new Date(airdrop.dueDate).toLocaleDateString()}
              {daysUntilDue !== null && (
                <span className="ml-1">
                  ({daysUntilDue === 0 ? 'Today' : daysUntilDue > 0 ? `${daysUntilDue} days` : `${Math.abs(daysUntilDue)} days overdue`})
                </span>
              )}
            </span>
          </div>
        )}

        {/* Tags */}
        {airdrop.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {airdrop.tags.map(tag => (
              <span
                key={tag}
                className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Check In Button */}
        <button
          onClick={() => onToggleCheckIn(airdrop.id, airdrop.checkedIn)}
          disabled={airdrop.checkedIn}
          className={`w-full py-2 px-4 rounded-md font-medium transition-all ${
            airdrop.checkedIn
              ? 'bg-green-500 text-white cursor-not-allowed opacity-75'
              : 'bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-200'
          }`}
        >
          {airdrop.checkedIn ? '✅ Checked In' : 'Check In'}
        </button>
      </div>
    </div>
  );
}
