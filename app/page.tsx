"use client";

import { useEffect, useState, useMemo } from "react";
import { Airdrop } from "@/lib/storage";
import AirdropForm from "@/components/AirdropForm";
import AirdropCard from "@/components/AirdropCard";
import StatsDashboard from "@/components/StatsDashboard";
import FilterBar from "@/components/FilterBar";

export default function HomePage() {
  const [airdrops, setAirdrops] = useState<Airdrop[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAirdrop, setEditingAirdrop] = useState<Airdrop | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    priority: '',
    status: '',
    sortBy: 'name',
    sortOrder: 'asc' as 'asc' | 'desc'
  });

  // Load airdrops from API
  const loadAirdrops = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/airdrops");
      if (!res.ok) throw new Error("Failed to fetch airdrops");
      const data = (await res.json()) as Airdrop[];
      setAirdrops(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAirdrops();
    // Load dark mode preference
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode ?? false);
    if (savedDarkMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Filter, search, and sort airdrops
  const filteredAirdrops = useMemo(() => {
    let filtered = airdrops.filter(airdrop => {
      const matchesSearch = !filters.search ||
        airdrop.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        airdrop.description?.toLowerCase().includes(filters.search.toLowerCase()) ||
        airdrop.tags.some(tag => tag.toLowerCase().includes(filters.search.toLowerCase()));

      const matchesCategory = !filters.category || airdrop.category === filters.category;
      const matchesPriority = !filters.priority || airdrop.priority === filters.priority;

      let matchesStatus = true;
      if (filters.status) {
        if (filters.status === 'completed') {
          matchesStatus = airdrop.checkedIn;
        } else if (filters.status === 'pending') {
          matchesStatus = !airdrop.checkedIn;
        } else if (filters.status === 'overdue') {
          matchesStatus = airdrop.dueDate && new Date(airdrop.dueDate) < new Date() && !airdrop.checkedIn;
        }
      }

      return matchesSearch && matchesCategory && matchesPriority && matchesStatus;
    });

    // Sort the filtered results
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (filters.sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'priority':
          const priorityOrder = { High: 3, Medium: 2, Low: 1 };
          aValue = priorityOrder[a.priority];
          bValue = priorityOrder[b.priority];
          break;
        case 'dueDate':
          aValue = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
          bValue = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
          break;
        case 'progress':
          aValue = a.progress;
          bValue = b.progress;
          break;
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
      }

      if (filters.sortOrder === 'asc') {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      } else {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
      }
    });

    return filtered;
  }, [airdrops, filters]);

  // Add a new airdrop
  const addAirdrop = async (data: {
    name: string;
    url: string;
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
      loadAirdrops();
    } catch (err) {
      console.error(err);
    }
  };

  // Edit airdrop
  const editAirdrop = async (data: {
    name: string;
    url: string;
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
      loadAirdrops();
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
      loadAirdrops();
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
      loadAirdrops();
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
      loadAirdrops();
    } catch (err) {
      console.error(err);
    }
  };

  // Reset all check-ins
  const resetAll = async () => {
    if (!confirm('Are you sure you want to reset all check-ins?')) return;

    try {
      await fetch("/api/reset", { method: "POST" });
      loadAirdrops();
    } catch (err) {
      console.error(err);
    }
  };

  // Export to CSV
  const exportToCSV = () => {
    const headers = ['Name', 'URL', 'Category', 'Priority', 'Due Date', 'Progress', 'Status', 'Tags', 'Description'];
    const csvContent = [
      headers.join(','),
      ...airdrops.map(a => [
        `"${a.name}"`,
        `"${a.url}"`,
        `"${a.category}"`,
        `"${a.priority}"`,
        `"${a.dueDate || ''}"`,
        `"${a.progress}"`,
        `"${a.checkedIn ? 'Completed' : 'Pending'}"`,
        `"${a.tags.join('; ')}"`,
        `"${a.description || ''}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'airdrops.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
    document.documentElement.classList.toggle('dark', newDarkMode);
  };

  const categories = [...new Set(airdrops.map(a => a.category))];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold text-center mb-8 space-theme-text">
            🚀 Cosmic Airdrop Tracker
          </h1>
          <div className="flex gap-2">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              title="Toggle Dark Mode"
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
            <button
              onClick={exportToCSV}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
            >
              📊 Export CSV
            </button>
            <button
              onClick={resetAll}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
            >
              🔄 Reset All
            </button>
            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              ➕ Add Airdrop
            </button>
          </div>
        </div>

        {/* Stats Dashboard */}
        <StatsDashboard airdrops={airdrops} />

        {/* Filter Bar */}
        <FilterBar onFilter={setFilters} categories={categories} />

        {/* Airdrop Grid */}
        {filteredAirdrops.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🚀</div>
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
              {airdrops.length === 0 ? 'No cosmic airdrops yet' : 'No airdrops match your filters'}
            </h3>
            <p className="text-gray-500 dark:text-gray-500">
              {airdrops.length === 0 ? 'Launch your first airdrop mission!' : 'Try adjusting your search or filters.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAirdrops.map((airdrop) => (
              <AirdropCard
                key={airdrop.id}
                airdrop={airdrop}
                onToggleCheckIn={toggleCheckIn}
                onEdit={setEditingAirdrop}
                onDelete={deleteAirdrop}
              />
            ))}
          </div>
        )}

        {/* Add/Edit Form Modal */}
        {(showForm || editingAirdrop) && (
          <AirdropForm
            onSubmit={editingAirdrop ? editAirdrop : addAirdrop}
            onCancel={() => {
              setShowForm(false);
              setEditingAirdrop(null);
            }}
            initialData={editingAirdrop || undefined}
          />
        )}
      </div>
    </div>
  );
}
