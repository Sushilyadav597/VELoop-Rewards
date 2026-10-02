import React, { useState, useEffect } from 'react';
import { Target, CheckCircle2, Sparkles, Filter } from 'lucide-react';
import { getTasks, completeTask } from '../services/platformApi';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Navbar from '../components/Navbar';
import TaskCard from '../components/TaskCard';
import LoadingState from '../components/LoadingState';

export const TasksPage = () => {
  const { refreshWallet } = useAuth();
  const toast = useToast();

  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  const fetchTaskList = async () => {
    try {
      const res = await getTasks();
      if (res && res.success) {
        setTasks(res.tasks || []);
      }
    } catch (err) {
      console.warn('Failed to fetch tasks:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTaskList();
  }, []);

  const handleTaskComplete = async (taskId) => {
    try {
      const res = await completeTask(taskId);
      if (res && res.success) {
        toast.reward(res.earnedPoints, res.currency, res.message || 'Task completed successfully!');
        if (res.tasks) {
          setTasks(res.tasks);
        } else {
          setTasks((prev) =>
            prev.map((t) => (t.id === taskId ? { ...t, isCompleted: true, progress: t.target } : t))
          );
        }
        refreshWallet();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to complete task');
    }
  };

  const filteredTasks = tasks.filter((t) => {
    if (filter === 'ALL') return true;
    if (filter === 'COMPLETED') return t.isCompleted;
    if (filter === 'ACTIVE') return !t.isCompleted;
    return t.category.toUpperCase() === filter;
  });

  const completedCount = tasks.filter((t) => t.isCompleted).length;

  if (loading && !tasks.length) {
    return (
      <div>
        <Navbar />
        <LoadingState message="Loading activities and tasks..." fullPage />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'radial-gradient(circle at 50% -10%, #1e1346 0%, #0c0822 45%, #070514 100%)' }}>
      <Navbar />

      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 1.25rem 4rem' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem', marginBottom: '2rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '4px 14px', borderRadius: '999px', background: 'rgba(139, 92, 246, 0.15)', border: '1px solid rgba(139, 92, 246, 0.35)', color: '#C4B5FD', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>
              <Target size={14} /> Earn Extra Points & XP
            </div>
            <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.4rem)', fontWeight: 900, color: '#FFFFFF', margin: 0, letterSpacing: '-0.02em' }}>
              Activities & Partner Tasks
            </h1>
            <p style={{ color: '#94A3B8', fontSize: '0.95rem', margin: '0.35rem 0 0' }}>
              Complete high-value community activities to accelerate your level progression and coin balances.
            </p>
          </div>

          {/* Quick Counter */}
          <div style={{ display: 'flex', gap: '10px', background: 'rgba(20, 14, 46, 0.7)', padding: '10px 18px', borderRadius: '16px', border: '1px solid rgba(139, 92, 246, 0.25)', alignItems: 'center' }}>
            <CheckCircle2 size={20} color="#10B981" />
            <div>
              <div style={{ fontSize: '0.72rem', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 700 }}>COMPLETED</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#FFFFFF' }}>
                {completedCount} <span style={{ fontSize: '0.85rem', color: '#64748B' }}>/ {tasks.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '1.5rem' }}>
          {['ALL', 'ACTIVE', 'COMPLETED'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="btn-press"
              style={{
                padding: '7px 16px',
                borderRadius: '10px',
                border: filter === f ? '1px solid #8B5CF6' : '1px solid rgba(255, 255, 255, 0.08)',
                background: filter === f ? 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)' : 'rgba(255, 255, 255, 0.04)',
                color: filter === f ? '#FFFFFF' : '#94A3B8',
                fontSize: '0.84rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              {f === 'ALL' ? 'All Tasks' : f === 'ACTIVE' ? 'Ready to Earn' : 'Completed'}
            </button>
          ))}
        </div>

        {/* Tasks Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '1.25rem'
          }}
        >
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onComplete={handleTaskComplete}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default TasksPage;
