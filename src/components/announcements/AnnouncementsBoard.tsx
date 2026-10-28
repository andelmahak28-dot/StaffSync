import React, { useState } from 'react';
import { useHR } from '../../context/HRContext';
import { Priority } from '../../types';
import {
  Megaphone,
  Plus,
  Pin,
  CheckCircle,
  Eye,
  Filter,
  X,
  Bell,
  Calendar,
} from 'lucide-react';

interface AnnouncementsBoardProps {
  isCreateModalOpenInitially?: boolean;
  onCloseCreateModal?: () => void;
}

export const AnnouncementsBoard: React.FC<AnnouncementsBoardProps> = ({
  isCreateModalOpenInitially = false,
  onCloseCreateModal,
}) => {
  const {
    currentUser,
    announcements,
    createAnnouncement,
    markAnnouncementAsRead,
  } = useHR();

  const [categoryFilter, setCategoryFilter] = useState('All');
  const [isCreateOpen, setIsCreateOpen] = useState(isCreateModalOpenInitially);

  // Form state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<'Company News' | 'Policy Update' | 'Event' | 'Health & Safety' | 'Executive Message'>('Company News');
  const [priority, setPriority] = useState<Priority>('medium');
  const [targetDepartment, setTargetDepartment] = useState('All');
  const [isPinned, setIsPinned] = useState(false);

  const categories = ['All', 'Company News', 'Policy Update', 'Health & Safety', 'Event', 'Executive Message'];

  const filteredAnnouncements = announcements.filter((ann) => {
    if (categoryFilter === 'All') return true;
    return ann.category === categoryFilter;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert('Please fill out the title and content.');
      return;
    }

    createAnnouncement({
      title,
      content,
      category,
      priority,
      targetDepartment,
      isPinned,
    });

    setTitle('');
    setContent('');
    setIsCreateOpen(false);
    if (onCloseCreateModal) onCloseCreateModal();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Internal Communications & Bulletins
          </h2>
          <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
            <span>Organizational Announcements & Official Notices</span>
            <span aria-hidden="true">·</span>
            <span>All Staff Broadcast Network</span>
          </div>
        </div>

        {currentUser.role === 'hr' && (
          <button
            onClick={() => setIsCreateOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors whitespace-nowrap shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            Publish Announcement
          </button>
        )}
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {categories.map((cat) => {
          const isActive = categoryFilter === cat;
          const count = cat === 'All' ? announcements.length : announcements.filter((a) => a.category === cat).length;

          return (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                isActive
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <span>{cat}</span>
              <span className={`font-mono text-[10px] ${isActive ? 'text-slate-300' : 'text-slate-400'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Announcements List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredAnnouncements.length === 0 ? (
          <div className="col-span-2 py-16 text-center bg-white rounded-xl border border-slate-200">
            <p className="text-xs font-medium text-slate-600">No announcements found</p>
            <p className="text-xs text-slate-400 mt-1">
              There are no announcements matching your category filter.
            </p>
          </div>
        ) : (
          filteredAnnouncements.map((ann) => {
            const isRead = ann.readBy.includes(currentUser.id);

            return (
              <div
                key={ann.id}
                className={`bg-white rounded-xl border p-5 flex flex-col justify-between transition-shadow hover:shadow-xs ${
                  ann.isPinned ? 'border-amber-300/80' : 'border-slate-200'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-700">{ann.category}</span>
                      {ann.isPinned && (
                        <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded">
                          <Pin className="w-2.5 h-2.5 fill-current" />
                          PINNED
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-xs font-mono text-slate-400 tabular-nums">
                      <span>{ann.createdAt}</span>
                    </div>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 mt-3 leading-snug">
                    {ann.title}
                  </h3>

                  <p className="text-xs text-slate-600 mt-2 leading-relaxed whitespace-pre-line">
                    {ann.content}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <img
                      src={ann.authorAvatar}
                      alt={ann.authorName}
                      referrerPolicy="no-referrer"
                      className="w-6 h-6 rounded-full object-cover border border-slate-200"
                    />
                    <div>
                      <span className="font-semibold text-slate-800 block leading-tight">
                        {ann.authorName}
                      </span>
                      <span className="text-[10px] text-slate-400">{ann.authorRole}</span>
                    </div>
                  </div>

                  {!isRead ? (
                    <button
                      onClick={() => markAnnouncementAsRead(ann.id)}
                      className="px-2.5 py-1 text-[11px] font-semibold text-blue-600 hover:bg-blue-50 rounded transition-colors"
                    >
                      Mark read
                    </button>
                  ) : (
                    <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3 text-emerald-600" />
                      Read
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Publish Announcement Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={() => {
              setIsCreateOpen(false);
              if (onCloseCreateModal) onCloseCreateModal();
            }}
          />

          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative w-full max-w-lg bg-white rounded-xl shadow-xl border border-slate-200 p-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <h3 className="text-base font-bold text-slate-900">Publish Company Announcement</h3>
                <button
                  onClick={() => {
                    setIsCreateOpen(false);
                    if (onCloseCreateModal) onCloseCreateModal();
                  }}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreate} className="mt-4 space-y-4 text-xs">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Headline Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Q4 Company Goals & Winter Holiday Schedule"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as any)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="Company News">Company News</option>
                      <option value="Policy Update">Policy Update</option>
                      <option value="Health & Safety">Health & Safety</option>
                      <option value="Event">Event</option>
                      <option value="Executive Message">Executive Message</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Target Department</label>
                    <select
                      value={targetDepartment}
                      onChange={(e) => setTargetDepartment(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="All">All Departments</option>
                      <option value="Engineering">Engineering Only</option>
                      <option value="Product & Design">Product & Design</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Operations">Operations</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Announcement Body *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Write the full briefing message for employees..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="pinned"
                    checked={isPinned}
                    onChange={(e) => setIsPinned(e.target.checked)}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="pinned" className="text-slate-700 font-medium cursor-pointer">
                    Pin to top of employee dashboards
                  </label>
                </div>

                <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsCreateOpen(false);
                      if (onCloseCreateModal) onCloseCreateModal();
                    }}
                    className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs"
                  >
                    Broadcast Announcement
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
