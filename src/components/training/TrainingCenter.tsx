import React, { useState } from 'react';
import { useHR } from '../../context/HRContext';
import { TrainingProgram } from '../../types';
import {
  GraduationCap,
  Plus,
  CheckCircle2,
  Clock,
  UserCheck,
  Award,
  BookOpen,
  X,
  PlayCircle,
  FileCheck,
} from 'lucide-react';

export const TrainingCenter: React.FC = () => {
  const {
    currentUser,
    trainings,
    employees,
    toggleModuleCompletion,
    enrollEmployee,
    createTraining,
  } = useHR();

  const [selectedProgram, setSelectedProgram] = useState<TrainingProgram | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [showCertificateFor, setShowCertificateFor] = useState<TrainingProgram | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'Engineering' | 'Leadership' | 'Security & Compliance' | 'Product & Design' | 'Workplace Culture'>('Security & Compliance');
  const [instructor, setInstructor] = useState('StaffSync Professional Institute');
  const [dueDate, setDueDate] = useState('2026-11-30');
  const [modulesInput, setModulesInput] = useState(
    'Module 1: Principles and Standards (30 min)\nModule 2: Practical Implementation (45 min)\nModule 3: Verification & Assessment (20 min)'
  );

  const canManageTrainings = currentUser.role === 'hr' || currentUser.role === 'manager';

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Please provide a course title.');
      return;
    }

    const lines = modulesInput.split('\n').filter((l) => l.trim().length > 0);
    const parsedModules = lines.map((line, idx) => ({
      id: `mod-${Date.now()}-${idx}`,
      title: line.replace(/\(\d+.*min\)/i, '').trim(),
      durationMinutes: 30,
      completed: false,
      summary: `Comprehensive lesson covering ${line.trim()}`,
    }));

    createTraining({
      title,
      description,
      category,
      instructor,
      dueDate,
      enrolledEmployeeIds: [currentUser.id, 'emp-003', 'emp-004'],
      thumbnailColor: 'bg-slate-800',
      modules: parsedModules,
    });

    setTitle('');
    setDescription('');
    setIsCreateOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Training & Talent Development Academy
          </h2>
          <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
            <span>SOC2, Leadership, Engineering & Design Curricula</span>
            <span aria-hidden="true">·</span>
            <span>Accredited Professional Tracks</span>
          </div>
        </div>

        {canManageTrainings && (
          <button
            onClick={() => setIsCreateOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors whitespace-nowrap shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            Create Training Program
          </button>
        )}
      </div>

      {/* Course Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {trainings.map((prog) => {
          const isEnrolled = prog.enrolledEmployeeIds.includes(currentUser.id);
          const completedCount = prog.modules.filter((m) => m.completed).length;
          const progressPct = Math.round((completedCount / prog.modules.length) * 100);
          const isComplete = progressPct === 100;

          return (
            <div
              key={prog.id}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden flex flex-col justify-between hover:shadow-xs transition-shadow"
            >
              <div>
                {/* Header ribbon */}
                <div className={`p-4 ${prog.thumbnailColor} text-white`}>
                  <div className="flex items-center justify-between text-xs text-white/80">
                    <span className="font-semibold uppercase tracking-wider text-[10px]">
                      {prog.category}
                    </span>
                    <span className="font-mono text-[11px] tabular-nums">Due {prog.dueDate}</span>
                  </div>
                  <h3 className="text-base font-bold text-white mt-2 leading-snug">
                    {prog.title}
                  </h3>
                  <p className="text-xs text-white/80 mt-1">
                    Instructor: {prog.instructor}
                  </p>
                </div>

                <div className="p-5 space-y-4">
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {prog.description}
                  </p>

                  {/* Progress Bar */}
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-medium text-slate-700">Completion Status</span>
                      <span className="font-mono font-bold text-slate-900 tabular-nums">
                        {completedCount}/{prog.modules.length} ({progressPct}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          isComplete ? 'bg-emerald-600' : 'bg-blue-600'
                        }`}
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                  </div>

                  {/* Enrolled participants count */}
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                    <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                    <span>{prog.enrolledEmployeeIds.length} colleagues enrolled</span>
                  </div>
                </div>
              </div>

              {/* Action Strip */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => setSelectedProgram(prog)}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1.5"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  View Syllabus & Modules
                </button>

                {isComplete ? (
                  <button
                    onClick={() => setShowCertificateFor(prog)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-emerald-700 bg-emerald-100/70 hover:bg-emerald-100 rounded transition-colors"
                  >
                    <Award className="w-3.5 h-3.5" />
                    Certificate
                  </button>
                ) : !isEnrolled ? (
                  <button
                    onClick={() => enrollEmployee(prog.id, currentUser.id)}
                    className="px-2.5 py-1 text-xs font-semibold text-slate-800 bg-white border border-slate-200 hover:bg-slate-100 rounded transition-colors"
                  >
                    Enroll Self
                  </button>
                ) : (
                  <span className="text-[11px] font-mono text-slate-500">In Progress</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Program Modules Viewer Modal */}
      {selectedProgram && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={() => setSelectedProgram(null)}
          />

          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative w-full max-w-xl bg-white rounded-xl shadow-xl border border-slate-200 p-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-500">
                    {selectedProgram.category}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    {selectedProgram.title}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedProgram(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-4 space-y-3 max-h-96 overflow-y-auto pr-1 text-xs">
                <p className="text-slate-600 leading-relaxed mb-4">
                  {selectedProgram.description}
                </p>

                <p className="font-semibold text-slate-900 mb-2">Curriculum Modules:</p>

                {selectedProgram.modules.map((mod, i) => (
                  <div
                    key={mod.id}
                    onClick={() => toggleModuleCompletion(selectedProgram.id, mod.id)}
                    className={`p-3.5 rounded-lg border cursor-pointer transition-all flex items-start gap-3 ${
                      mod.completed
                        ? 'border-emerald-200 bg-emerald-50/30'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="mt-0.5">
                      <span
                        className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                          mod.completed
                            ? 'bg-emerald-600 text-white'
                            : 'border-2 border-slate-300 text-transparent'
                        }`}
                      >
                        ✓
                      </span>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className={`font-semibold ${mod.completed ? 'text-slate-500 line-through' : 'text-slate-900'}`}>
                          0{i + 1}. {mod.title}
                        </h4>
                        <span className="font-mono text-slate-400 tabular-nums text-[11px]">
                          {mod.durationMinutes} min
                        </span>
                      </div>
                      <p className="text-slate-500 mt-1 leading-relaxed text-[11px]">
                        {mod.summary}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 mt-4 border-t border-slate-200 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-mono">
                  Click any module to toggle completion
                </span>
                <button
                  onClick={() => setSelectedProgram(null)}
                  className="px-4 py-2 font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors"
                >
                  Close Syllabus
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Completion Certificate Modal */}
      {showCertificateFor && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setShowCertificateFor(null)}
          />

          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border-4 border-slate-900 p-8 text-center">
              <button
                onClick={() => setShowCertificateFor(null)}
                className="absolute right-4 top-4 p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 mb-4">
                <Award className="w-6 h-6" />
              </div>

              <span className="text-xs font-mono uppercase tracking-widest text-slate-500 font-semibold">
                Apex Dynamics · StaffSync Academy
              </span>

              <h2 className="text-2xl font-serif font-bold text-slate-900 mt-2">
                Certificate of Completion
              </h2>

              <p className="text-xs text-slate-500 mt-3">This credential certifies that</p>

              <p className="text-lg font-bold text-blue-700 my-2 underline decoration-blue-300">
                {currentUser.name}
              </p>

              <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                has successfully completed all modules and practical assessments for
                <br />
                <strong className="text-slate-900">{showCertificateFor.title}</strong>
              </p>

              <div className="mt-6 pt-6 border-t border-slate-200 flex items-center justify-around text-xs text-slate-500 font-mono">
                <div>
                  <p className="font-bold text-slate-900">Dr. Evelyn Reed</p>
                  <p className="text-[10px]">VP of People & Culture</p>
                </div>
                <div>
                  <p className="font-bold text-slate-900">Oct 27, 2026</p>
                  <p className="text-[10px]">Issue Date</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Training Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={() => setIsCreateOpen(false)}
          />

          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative w-full max-w-lg bg-white rounded-xl shadow-xl border border-slate-200 p-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <h3 className="text-base font-bold text-slate-900">
                  New Professional Development Track
                </h3>
                <button
                  onClick={() => setIsCreateOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreate} className="mt-4 space-y-4 text-xs">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Course Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Scalable System Design & Kubernetes Orchestration"
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
                      <option value="Engineering">Engineering</option>
                      <option value="Leadership">Leadership</option>
                      <option value="Security & Compliance">Security & Compliance</option>
                      <option value="Product & Design">Product & Design</option>
                      <option value="Workplace Culture">Workplace Culture</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Completion Deadline</label>
                    <input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Instructor / Provider</label>
                  <input
                    type="text"
                    value={instructor}
                    onChange={(e) => setInstructor(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Summary Description</label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">
                    Modules Curriculum (one lesson per line)
                  </label>
                  <textarea
                    rows={3}
                    value={modulesInput}
                    onChange={(e) => setModulesInput(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsCreateOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs"
                  >
                    Publish Course
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
