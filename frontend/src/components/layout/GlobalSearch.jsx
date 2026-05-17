import { useState, useEffect, useRef } from 'react';
import { Search, X, Users, Target, FileText, Shield } from 'lucide-react';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const GlobalSearch = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ goals: [], users: [], audit: [] });
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) inputRef.current.focus();
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults({ goals: [], users: [], audit: [] });
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        // Simulated local search — in production this hits /api/v1/search?q=
        const q = query.toLowerCase();
        
        const mockGoals = [
          { id: '1', title: 'Increase Q4 Revenue by 15%', status: 'APPROVED', department: 'Sales' },
          { id: '2', title: 'Launch Cloud Migration Initiative', status: 'DRAFT', department: 'Engineering' },
          { id: '3', title: 'Reduce Customer Churn to 5%', status: 'SUBMITTED', department: 'Customer Success' },
          { id: '4', title: 'Implement AI-Powered Analytics', status: 'APPROVED', department: 'Engineering' },
          { id: '5', title: 'Hire 10 Senior Engineers', status: 'DRAFT', department: 'HR' },
        ].filter(g => g.title.toLowerCase().includes(q) || g.department.toLowerCase().includes(q));

        const mockUsers = [
          { id: '1', name: 'John Doe', role: 'EMPLOYEE', department: 'Sales' },
          { id: '2', name: 'Sarah Smith', role: 'MANAGER', department: 'Engineering' },
          { id: '3', name: 'Admin User', role: 'ADMIN', department: 'Operations' },
        ].filter(u => u.name.toLowerCase().includes(q) || u.department.toLowerCase().includes(q));

        const mockAudit = [
          { id: '1', action: 'APPROVED', target: 'Q4 Revenue Target', user: 'Sarah Smith', time: '2 hours ago' },
          { id: '2', action: 'INLINE_EDIT', target: 'Cloud Migration', user: 'Admin', time: '1 day ago' },
        ].filter(a => a.target.toLowerCase().includes(q) || a.action.toLowerCase().includes(q));

        setResults({ goals: mockGoals, users: mockUsers, audit: mockAudit });
      } catch (err) {
        console.error('Search failed:', err);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const totalResults = results.goals.length + results.users.length + results.audit.length;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] bg-gray-900/50 backdrop-blur-sm" onClick={() => setIsOpen(false)}>
      <div className="bg-white dark:bg-[#0b1326] dark:bg-white dark:bg-[#0b1326] rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-gray-200 dark:border-[#464554] dark:border-gray-200 dark:border-[#464554]" onClick={e => e.stopPropagation()}>
        {/* Search Input */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-200 dark:border-[#464554] dark:border-gray-200 dark:border-[#464554]">
          <Search className="w-5 h-5 text-gray-500 dark:text-[#c7c4d7]" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search goals, users, audit logs..."
            className="flex-1 bg-transparent text-gray-900 dark:text-[#dae2fd] dark:text-white placeholder-gray-400 text-lg outline-none"
          />
          <kbd className="hidden sm:block text-xs font-mono text-gray-500 dark:text-[#c7c4d7] bg-gray-50 dark:bg-[#171f33] dark:bg-gray-50 dark:bg-[#171f33] px-2 py-1 rounded">ESC</kbd>
          <button onClick={() => setIsOpen(false)} className="text-gray-500 dark:text-[#c7c4d7] hover:text-gray-500 dark:text-[#c7c4d7]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto">
          {isLoading && (
            <div className="px-5 py-8 text-center text-gray-500 dark:text-[#c7c4d7]">Searching...</div>
          )}

          {!isLoading && query && totalResults === 0 && (
            <div className="px-5 py-8 text-center text-gray-500 dark:text-[#c7c4d7]">No results found for "{query}"</div>
          )}

          {!isLoading && results.goals.length > 0 && (
            <div className="px-3 py-2">
              <div className="px-3 py-2 text-xs font-bold text-gray-500 dark:text-[#c7c4d7] uppercase tracking-wider">Goals</div>
              {results.goals.map(g => (
                <button key={g.id} className="w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-indigo-600 dark:bg-[#c0c1ff]/10 dark:hover:bg-gray-700 text-left transition-colors">
                  <Target className="w-4 h-4 text-indigo-500" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 dark:text-[#dae2fd] dark:text-white truncate">{g.title}</div>
                    <div className="text-xs text-gray-500 dark:text-[#c7c4d7]">{g.department} · {g.status}</div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {!isLoading && results.users.length > 0 && (
            <div className="px-3 py-2 border-t border-gray-200 dark:border-[#464554] dark:border-gray-200 dark:border-[#464554]">
              <div className="px-3 py-2 text-xs font-bold text-gray-500 dark:text-[#c7c4d7] uppercase tracking-wider">Users</div>
              {results.users.map(u => (
                <button key={u.id} className="w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-indigo-600 dark:bg-[#c0c1ff]/10 dark:hover:bg-gray-700 text-left transition-colors">
                  <Users className="w-4 h-4 text-emerald-500" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 dark:text-[#dae2fd] dark:text-white truncate">{u.name}</div>
                    <div className="text-xs text-gray-500 dark:text-[#c7c4d7]">{u.role} · {u.department}</div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {!isLoading && results.audit.length > 0 && (
            <div className="px-3 py-2 border-t border-gray-200 dark:border-[#464554] dark:border-gray-200 dark:border-[#464554]">
              <div className="px-3 py-2 text-xs font-bold text-gray-500 dark:text-[#c7c4d7] uppercase tracking-wider">Audit Logs</div>
              {results.audit.map(a => (
                <button key={a.id} className="w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-indigo-600 dark:bg-[#c0c1ff]/10 dark:hover:bg-gray-700 text-left transition-colors">
                  <Shield className="w-4 h-4 text-amber-500" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 dark:text-[#dae2fd] dark:text-white truncate">{a.action} — {a.target}</div>
                    <div className="text-xs text-gray-500 dark:text-[#c7c4d7]">by {a.user} · {a.time}</div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {!query && (
            <div className="px-5 py-8 text-center text-gray-500 dark:text-[#c7c4d7] text-sm">
              <p>Start typing to search across goals, users, and audit logs.</p>
              <p className="mt-2 text-xs text-gray-500 dark:text-[#c7c4d7]">Pro tip: Use <kbd className="bg-gray-50 dark:bg-[#171f33] dark:bg-gray-50 dark:bg-[#171f33] px-1.5 py-0.5 rounded font-mono">Ctrl+K</kbd> to open search from anywhere.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
