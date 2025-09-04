import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { getDashboard } from '../services/api';

const COLORS = ['#4f46e5', '#22c55e', '#f97316', '#e11d48'];

function Progress() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const summary = await getDashboard();
      setData(summary);
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="mb-4 font-semibold text-gray-800 dark:text-gray-100">Mood Trend</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={data.moodTrend}>
              <XAxis dataKey="date" hide />
              <YAxis hide domain={[0, 10]} />
              <Tooltip />
              <Line type="monotone" dataKey="score" stroke="#4f46e5" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="mb-4 font-semibold text-gray-800 dark:text-gray-100">Task Completion</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={data.taskDist} dataKey="value" nameKey="name" outerRadius={80} label>
                {data.taskDist.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
          <p className="text-3xl font-bold text-primary">{data.points}</p>
          <p className="text-sm">Points</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
          <p className="text-3xl font-bold text-primary">{data.streak}</p>
          <p className="text-sm">Streak</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
          <p className="text-3xl font-bold text-primary">{data.badges.length}</p>
          <p className="text-sm">Badges</p>
        </div>
      </div>
    </motion.div>
  );
}

export default Progress;