"use client";

import { Airdrop } from "@/lib/storage";

interface StatsDashboardProps {
  airdrops: Airdrop[];
}

export default function StatsDashboard({ airdrops }: StatsDashboardProps) {
  const total = airdrops.length;
  const checkedIn = airdrops.filter(a => a.checkedIn).length;
  const completionRate = total > 0 ? Math.round((checkedIn / total) * 100) : 0;

  const overdue = airdrops.filter(a => a.dueDate && new Date(a.dueDate) < new Date() && !a.checkedIn).length;
  const dueSoon = airdrops.filter(a => {
    if (!a.dueDate || a.checkedIn) return false;
    const daysUntilDue = Math.ceil((new Date(a.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilDue >= 0 && daysUntilDue <= 7;
  }).length;

  const categoryStats = airdrops.reduce((acc, airdrop) => {
    acc[airdrop.category] = (acc[airdrop.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const priorityStats = airdrops.reduce((acc, airdrop) => {
    acc[airdrop.priority] = (acc[airdrop.priority] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const averageProgress = total > 0 ? Math.round(airdrops.reduce((sum, a) => sum + a.progress, 0) / total) : 0;

  return (
    <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg p-6 mb-6 shadow-xl">
      <h2 className="text-2xl font-bold mb-4">🚀 Cosmic Dashboard</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center">
          <div className="text-3xl font-bold">{total}</div>
          <div className="text-sm opacity-90">Total Airdrops</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold">{checkedIn}</div>
          <div className="text-sm opacity-90">Completed</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold">{completionRate}%</div>
          <div className="text-sm opacity-90">Completion Rate</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold">{averageProgress}%</div>
          <div className="text-sm opacity-90">Avg Progress</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Alerts */}
        <div>
          <h3 className="text-lg font-semibold mb-3">⚠️ Alerts</h3>
          <div className="space-y-2">
            {overdue > 0 && (
              <div className="bg-red-500 bg-opacity-20 border border-red-400 rounded p-2">
                <span className="font-medium">{overdue}</span> airdrops overdue
              </div>
            )}
            {dueSoon > 0 && (
              <div className="bg-orange-500 bg-opacity-20 border border-orange-400 rounded p-2">
                <span className="font-medium">{dueSoon}</span> due within 7 days
              </div>
            )}
            {overdue === 0 && dueSoon === 0 && (
              <div className="bg-green-500 bg-opacity-20 border border-green-400 rounded p-2">
                All airdrops are on track! 🎉
              </div>
            )}
          </div>
        </div>

        {/* Category Breakdown */}
        <div>
          <h3 className="text-lg font-semibold mb-3">📂 Categories</h3>
          <div className="space-y-2">
            {Object.entries(categoryStats).map(([category, count]) => (
              <div key={category} className="flex justify-between">
                <span>{category}</span>
                <span className="font-medium">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Priority Breakdown */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-3">🎯 Priority Levels</h3>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span>High: {priorityStats.High || 0}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-500 rounded"></div>
            <span>Medium: {priorityStats.Medium || 0}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span>Low: {priorityStats.Low || 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
