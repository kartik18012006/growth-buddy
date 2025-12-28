'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { Moon, Plus } from 'lucide-react';
import { format, subDays } from 'date-fns';

interface SleepRecord {
  _id: string;
  date: string;
  hoursSlept: number;
  qualityRating?: number;
  notes?: string;
  goalHours?: number;
}

export default function SleepPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [records, setRecords] = useState<SleepRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState(format(subDays(new Date(), 1), 'yyyy-MM-dd'));
  const [formData, setFormData] = useState({
    hoursSlept: 8,
    qualityRating: 4,
    notes: '',
    goalHours: 8,
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetchSleepRecords();
    }
  }, [session]);

  const fetchSleepRecords = async () => {
    try {
      const response = await fetch('/api/sleep?days=30');
      if (response.ok) {
        const data = await response.json();
        setRecords(data);
      }
    } catch (error) {
      console.error('Error fetching sleep records:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (formData.hoursSlept <= 0) return;

    try {
      const response = await fetch('/api/sleep', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          date: selectedDate,
        }),
      });

      if (response.ok) {
        const newRecord = await response.json();
        setRecords([newRecord, ...records.filter(r => r.date !== selectedDate)]);
        setShowAddForm(false);
        setFormData({ hoursSlept: 8, qualityRating: 4, notes: '', goalHours: 8 });
      }
    } catch (error) {
      console.error('Error saving sleep record:', error);
    }
  };

  const calculateAverage = () => {
    if (records.length === 0) return 0;
    const total = records.reduce((sum, r) => sum + r.hoursSlept, 0);
    return (total / records.length).toFixed(1);
  };

  // Render page immediately - don't block on loading

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Sleep Tracking</h1>
            <p className="text-gray-600 mt-2">Monitor your sleep patterns and quality</p>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span>Log Sleep</span>
          </button>
        </div>

        {showAddForm && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Log Sleep</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  max={format(new Date(), 'yyyy-MM-dd')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hours Slept: {formData.hoursSlept}h
                </label>
                <input
                  type="range"
                  min="0"
                  max="16"
                  step="0.5"
                  value={formData.hoursSlept}
                  onChange={(e) => setFormData({ ...formData, hoursSlept: parseFloat(e.target.value) })}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0h</span>
                  <span>8h</span>
                  <span>16h</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sleep Quality
                </label>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => setFormData({ ...formData, qualityRating: rating })}
                      className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center transition-colors ${
                        formData.qualityRating === rating
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-gray-300 text-gray-400 hover:border-gray-400'
                      }`}
                    >
                      {rating} ⭐
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (optional)
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  rows={3}
                  placeholder="How did you sleep?"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setFormData({ hoursSlept: 8, qualityRating: 4, notes: '', goalHours: 8 });
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Average Sleep</p>
                <p className="text-3xl font-bold text-gray-900">
                  {calculateAverage()}h
                </p>
              </div>
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <Moon className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Records</p>
                <p className="text-3xl font-bold text-gray-900">{records.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Last 7 Days Avg</p>
                <p className="text-3xl font-bold text-gray-900">
                  {records.slice(0, 7).length > 0
                    ? (records.slice(0, 7).reduce((sum, r) => sum + r.hoursSlept, 0) /
                        records.slice(0, 7).length).toFixed(1)
                    : '0'}h
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Records */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Sleep Records</h2>
          {records.length === 0 ? (
            <div className="text-center py-12">
              <Moon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No sleep records yet</p>
              <p className="text-gray-400">Start tracking your sleep to see your patterns!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {records.slice(0, 30).map((record) => (
                <div
                  key={record._id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <Moon className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {format(new Date(record.date), 'EEEE, MMMM d, yyyy')}
                      </p>
                      {record.notes && (
                        <p className="text-sm text-gray-600 mt-1">{record.notes}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">{record.hoursSlept}h</p>
                    {record.qualityRating && (
                      <p className="text-sm text-gray-600">
                        {record.qualityRating}/5 ⭐
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}



