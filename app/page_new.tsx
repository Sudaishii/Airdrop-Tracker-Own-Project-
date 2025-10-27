"use client";

import { useEffect, useState } from "react";
import AirdropForm_new from "@/components/AirdropForm_new";
import AirdropCard_new from "@/components/AirdropCard_new";
import StatsDashboard_new from "@/components/StatsDashboard_new";
import FilterBar_new from "@/components/FilterBar_new";

import { Airdrop } from "@/lib/storage";

export default function HomePage() {
  const [airdrops, setAirdrops] = useState<Airdrop[]>([]);
  const [filteredAirdrops, setFilteredAirdrops] = useState<Airdrop[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingAirdrop, setEditingAirdrop] = useState<Airdrop | null>(null);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    priority: '',
    status: ''
  });

  // Load airdrops from API
  const load = async () => {
    try {
      const res = await fetch("/api/airdrops");
      if (!res.ok) throw new Error("Failed to fetch airdrops");
      const data = (await res.json()) as Airdrop[];
      setAirdrops(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // Filter airdrops based on current filters
  useEffect(() => {
    let filtered = [...airdrops];

    if (filters.search) {
      filtered = filtered.filter(a =>
        a.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        a.description?.toLowerCase().includes(filters.search.toLowerCase()) ||
        a.tags.some(tag => tag.toLowerCase().includes(filters.search.toLowerCase()))
      );
    }

    if (filters.category) {
      filtered = filtered.filter(a => a.category === filters.category);
    }

    if (filters.priority) {
      filtered = filtered.filter(a => a.priority === filters.priority);
    }

    if (filters.status) {
      switch (filters.status) {
        case 'pending':
          filtered = filtered.filter(a => !a.checkedIn);
          break;
        case 'completed':
          filtered = filtered.filter(a => a.checkedIn);
          break;
        case 'overdue':
          filtered = filtered.filter(a => a.dueDate && new Date(a.dueDate) < new Date() && !a.checkedIn);
          break;
      }
    }

    setFilteredAirdrops(filtered);
  }, [airdrops, filters]);

  // Add a new airdrop
  const addAirdrop = async (data: {
    name: string;
    url?: string;
    category: string;
    priority: 'High' | 'Medium' | 'Low';
    dueDate?: string;
    progress: number;
    description?: string;
    tags: string[];
  }) => {
    try {
      await fetch("/api/airdrops", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      setShowForm(false);
      load();
    } catch (err) {
      console.error(err);
    }
  };

  // Update an existing airdrop
  const updateAirdrop = async (data: {
    name: string;
    url?: string;
    category: string;
    priority: 'High' | 'Medium' | 'Low';
    dueDate?: string;
    progress: number;
    description?: string;
    tags: string[];
  }) => {
    if (!editingAirdrop) return;

    try {
      await fetch("/api/airdrops", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingAirdrop.id, ...data }),
      });
      setEditingAirdrop(null);
      load();
    } catch (err) {
      console.error(err);
    }
  };

  // Toggle check-in status
  const toggleCheckIn = async (id: string, checkedIn: boolean) => {
    try {
      await fetch("/api/airdrops", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, checkedIn: !checkedIn }),
      });
      load();
    } catch (err) {
      console.error(err);
    }
  };

  // Update progress
  const updateProgress = async (id: string, progress: number) => {
    try {
      await fetch("/api/airdrops", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, progress }),
      });
      load();
    } catch (err) {
      console.error(err);
    }
  };

  // Delete airdrop
  const deleteAirdrop = async (id: string) => {
    if (!confirm('Are you sure you want to delete this airdrop?')) return;

    try {
      await fetch("/api/airdrops", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      load();
    } catch (err) {
      console.error(err);
    }
  };

  // Reset all check-ins
  const resetAll = async () => {
    if (!confirm('Are you sure you want to reset all check-ins?')) return;

    try {
      await fetch("/api/reset", { method: "POST" });
      load();
    } catch (err) {
      console.error(err);
    }
  };

  // Export to CSV
  const exportToCSV = () => {
    const csv = [
      ['Name', 'Category', 'Priority', 'Due Date', 'Progress', 'Status', 'Tags', 'Description'].join(','),
      ...airdrops.map(a => [
        `"${a.name}"`,
        a.category,
        a.priority,
        a.dueDate || '',
        a.progress,
        a.checkedIn ? 'Completed' : 'Pending',
        `"${a.tags.join(', ')}"`,
        `"${a.description || ''}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'airdrops.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const categories = [...new Set(airdrops.map(a => a.category))];

  return (
    <main className="min-h-screen">
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold cosmic-text">
            Cosmos Airdrop Tracker
          </h1>
          <div className="flex gap-3">
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              Add Airdrop
            </button>
            <button
              onClick={resetAll}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              Reset All
            </button>
            <button
              onClick={exportToCSV}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              Export CSV
            </button>
          </div>
        </div>

        {/* Stats Dashboard */}
        <StatsDashboard_new airdrops={airdrops} />

        {/* Filter Bar */}
        <FilterBar_new
          onFilter={setFilters}
          categories={categories}
        />

        {/* Airdrop List */}
        {filteredAirdrops.length === 0 && airdrops.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-2xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
              No airdrops yet
            </h3>
            <p className="text-gray-500 dark:text-gray-500">
              Add your first airdrop to get started with tracking!
            </p>
          </div>
        )}

        {filteredAirdrops.length === 0 && airdrops.length > 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
              No airdrops match your filters
            </h3>
            <p className="text-gray-500 dark:text-gray-500">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAirdrops.map((airdrop) => (
            <AirdropCard_new
              key={airdrop.id}
              airdrop={airdrop}
              onToggleCheckIn={toggleCheckIn}
              onEdit={setEditingAirdrop}
              onDelete={deleteAirdrop}
              onUpdateProgress={updateProgress}
            />
          ))}
        </div>

        {/* Add/Edit Form Modal */}
        {showForm && (
          <AirdropForm_new
            onSubmit={addAirdrop}
            onCancel={() => setShowForm(false)}
          />
        )}

        {editingAirdrop && (
          <AirdropForm_new
            onSubmit={updateAirdrop}
            onCancel={() => setEditingAirdrop(null)}
            initialData={editingAirdrop}
          />
        )}
      </div>
    </main>
  );
}
