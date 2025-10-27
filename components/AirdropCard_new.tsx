"use client";

import { Airdrop } from "@/lib/storage";

interface AirdropCardProps {
  airdrop: Airdrop;
  onToggleCheckIn: (id: string, checkedIn: boolean) => void;
  onEdit: (airdrop: Airdrop) => void;
  onDelete: (id: string) => void;
  onUpdateProgress: (id: string, progress: number) => void;
}

const priorityColors = {
  High: 'border-pink-400 bg-pink-50 dark:bg-pink-900/20',
  Medium: 'border-purple-400 bg-purple-50 dark:bg-purple-900/20',
  Low: 'border-indigo-400 bg-indigo-50 dark:bg-indigo-900/20'
};

const categoryColors = {
  DeFi: 'bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-200',
  NFT: 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200',
  Gaming: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-200',
  Infrastructure: 'bg-rose-100 dark:bg-rose-900/30 text-rose-800 dark:text-rose-200',
  DAO: 'bg-fuchsia-100 dark:bg-fuchsia-900/30 text-fuchsia-800 dark:text-fuchsia-200',
  Social: 'bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-200',
  General: 'bg-slate-100 dark:bg-slate-900/30 text-slate-800 dark:text-slate-200',
  Other: 'bg-violet-100 dark:bg-violet-900/30 text-violet-800 dark:text-violet-200'
};

export default function AirdropCard({
  airdrop,
  onToggleCheckIn,
  onEdit,
  onDelete,
  onUpdateProgress
}: AirdropCardProps) {
  const isOverdue = airdrop.dueDate && new Date(airdrop.dueDate) < new Date() && !airdrop.checkedIn;
  const daysUntilDue = airdrop.dueDate ? Math.ceil((new Date(airdrop.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : null;

  return (
    <div className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-5 transition-all card-hover shadow-sm ${isOverdue ? 'ring-2 ring-red-400' : ''}`}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-bold text-lg text-gray-900 dark:text-white">
              {airdrop.name}
            </h3>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${categoryColors[airdrop.category as keyof typeof categoryColors] || categoryColors.General} shadow-sm`}>
              {airdrop.category}
            </span>
          </div>

          {airdrop.url && (
            <a
              href={airdrop.url.startsWith('http') ? airdrop.url : `https://${airdrop.url}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-600 dark:text-pink-400 hover:text-pink-800 dark:hover:text-pink-300 hover:underline text-sm break-all transition-colors"
            >
              🌸 {airdrop.url}
            </a>
          )}

          {airdrop.description && (
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-2 leading-relaxed">
              {airdrop.description}
            </p>
          )}
        </div>

        <div className="flex gap-1 ml-2">
          <button
            onClick={() => onEdit(airdrop)}
            className="p-2 text-gray-500 hover:text-pink-600 dark:hover:text-pink-400 transition-all duration-200 hover:scale-110 rounded-full hover:bg-pink-100 dark:hover:bg-pink-900/20"
            title="Edit"
          >
            ✏️
          </button>
          <button
            onClick={() => onDelete(airdrop.id)}
            className="p-2 text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200 hover:scale-110 rounded-full hover:bg-red-100 dark:hover:bg-red-900/20"
            title="Delete"
          >
            🗑️
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {/* Progress Bar */}
        <div>
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
            <span className="font-medium">🌱 Progress</span>
            <span className="font-bold text-pink-600 dark:text-pink-400">{airdrop.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden shadow-inner">
            <div
              className="bg-gradient-to-r from-pink-400 to-purple-500 h-3 rounded-full transition-all duration-500 ease-out shadow-sm"
              style={{ width: `${airdrop.progress}%` }}
            ></div>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={airdrop.progress}
            onChange={(e) => onUpdateProgress(airdrop.id, parseInt(e.target.value))}
            className="w-full mt-2 accent-pink-500"
          />
        </div>

        {/* Due Date */}
        {airdrop.dueDate && (
          <div className="flex items-center gap-2 text-sm bg-pink-50 dark:bg-pink-900/20 rounded-lg p-2">
            <span className="text-gray-600 dark:text-gray-400 font-medium">📅 Due:</span>
            <span className={`font-semibold ${isOverdue ? 'text-red-600 dark:text-red-400' : daysUntilDue && daysUntilDue <= 7 ? 'text-orange-600 dark:text-orange-400' : 'text-pink-700 dark:text-pink-300'}`}>
              {new Date(airdrop.dueDate).toLocaleDateString()}
              {daysUntilDue !== null && (
                <span className="ml-2 text-xs">
                  ({daysUntilDue === 0 ? '🌸 Today' : daysUntilDue > 0 ? `in ${daysUntilDue} days` : `⚠️ ${Math.abs(daysUntilDue)} days overdue`})
                </span>
              )}
            </span>
          </div>
        )}

        {/* Tags */}
        {airdrop.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {airdrop.tags.map(tag => (
              <span
                key={tag}
                className="px-3 py-1 bg-gradient-to-r from-pink-100 to-purple-100 dark:from-pink-900/40 dark:to-purple-900/40 text-pink-800 dark:text-pink-200 rounded-full text-xs font-medium shadow-sm border border-pink-200 dark:border-pink-700"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Check In Button */}
        <button
          onClick={() => onToggleCheckIn(airdrop.id, airdrop.checkedIn)}
          className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 ${
            airdrop.checkedIn
              ? 'bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white'
              : 'bg-gradient-to-r from-pink-400 to-purple-500 hover:from-pink-500 hover:to-purple-600 text-white'
          }`}
        >
          {airdrop.checkedIn ? '✅ Completed!' : '🌸 Check In'}
        </button>
      </div>
    </div>
  );
}
