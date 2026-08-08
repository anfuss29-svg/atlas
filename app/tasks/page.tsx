"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Check,
  Trash2,
  Clock3,
  CalendarDays,
  CircleAlert,
  ListTodo,
  X,
  Search,
  Filter,
  CheckCircle2,
  Timer,
  Target,
  ChevronDown,
  RotateCcw,
  Sparkles,
  Flame,
} from "lucide-react";

type Priority = "high" | "medium" | "low";

type Task = {
  id: number;
  title: string;
  description: string;
  subject: string;
  priority: Priority;
  dueDate: string;
  estimatedMinutes: number;
  completed: boolean;
  createdAt: string;
};

const STORAGE_KEY = "atlas-tasks";

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showForm, setShowForm] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subject, setSubject] = useState("");
  const [priority, setPriority] =
    useState<Priority>("medium");
  const [dueDate, setDueDate] = useState("");
  const [estimatedMinutes, setEstimatedMinutes] =
    useState(30);

  const [search, setSearch] = useState("");
  const [filter, setFilter] =
    useState<"all" | "pending" | "completed" | "overdue">("all");

  const [sortBy, setSortBy] = useState<
    "priority" | "date" | "created"
  >("priority");

  const [showCompleted, setShowCompleted] = useState(true);

  const [completedToday, setCompletedToday] =
    useState(0);

  /* =====================================================
     LOAD
  ===================================================== */

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      try {
        setTasks(JSON.parse(saved));
      } catch {
        setTasks([]);
      }
    }

    const savedToday =
      localStorage.getItem("atlas-tasks-completed-today");

    if (savedToday) {
      try {
        const parsed = JSON.parse(savedToday);

        if (parsed.date === getTodayKey()) {
          setCompletedToday(parsed.count || 0);
        } else {
          localStorage.removeItem(
            "atlas-tasks-completed-today"
          );
        }
      } catch {
        setCompletedToday(0);
      }
    }
  }, []);

  /* =====================================================
     SAVE
  ===================================================== */

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(tasks)
    );
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem(
      "atlas-tasks-completed-today",
      JSON.stringify({
        date: getTodayKey(),
        count: completedToday,
      })
    );
  }, [completedToday]);

  /* =====================================================
     CREATE TASK
  ===================================================== */

  function createTask() {
    if (!title.trim()) {
      alert("Please enter a task title.");
      return;
    }

    const newTask: Task = {
      id: Date.now(),
      title: title.trim(),
      description: description.trim(),
      subject: subject.trim() || "General",
      priority,
      dueDate,
      estimatedMinutes:
        Math.max(1, Number(estimatedMinutes) || 1),
      completed: false,
      createdAt: new Date().toISOString(),
    };

    setTasks((current) => [
      newTask,
      ...current,
    ]);

    resetForm();
  }

  function resetForm() {
    setTitle("");
    setDescription("");
    setSubject("");
    setPriority("medium");
    setDueDate("");
    setEstimatedMinutes(30);
    setShowForm(false);
  }

  /* =====================================================
     COMPLETE
  ===================================================== */

  function toggleTask(id: number) {
    setTasks((current) =>
      current.map((task) => {
        if (task.id !== id) return task;

        const becomingComplete =
          !task.completed;

        if (becomingComplete) {
          setCompletedToday(
            (value) => value + 1
          );
        } else {
          setCompletedToday(
            (value) => Math.max(0, value - 1)
          );
        }

        return {
          ...task,
          completed: becomingComplete,
        };
      })
    );
  }

  /* =====================================================
     DELETE
  ===================================================== */

  function deleteTask(id: number) {
    setTasks((current) =>
      current.filter((task) => task.id !== id)
    );
  }

  /* =====================================================
     CLEAR COMPLETED
  ===================================================== */

  function clearCompleted() {
    if (!tasks.some((task) => task.completed)) {
      return;
    }

    setTasks((current) =>
      current.filter((task) => !task.completed)
    );
  }

  /* =====================================================
     MARK ALL
  ===================================================== */

  function completeAllPending() {
    const pending = tasks.filter(
      (task) => !task.completed
    ).length;

    if (pending === 0) return;

    setTasks((current) =>
      current.map((task) => ({
        ...task,
        completed: true,
      }))
    );

    setCompletedToday(
      (value) => value + pending
    );
  }

  /* =====================================================
     STATS
  ===================================================== */

  const completedTasks = tasks.filter(
    (task) => task.completed
  ).length;

  const pendingTasks = tasks.filter(
    (task) => !task.completed
  ).length;

  const overdueTasks = tasks.filter(
    (task) =>
      !task.completed &&
      task.dueDate &&
      isOverdue(task.dueDate)
  ).length;

  const totalMinutes = tasks
    .filter((task) => !task.completed)
    .reduce(
      (total, task) =>
        total + task.estimatedMinutes,
      0
    );

  const completedMinutes = tasks
    .filter((task) => task.completed)
    .reduce(
      (total, task) =>
        total + task.estimatedMinutes,
      0
    );

  const completionRate =
    tasks.length === 0
      ? 0
      : Math.round(
          (completedTasks / tasks.length) * 100
        );

  /* =====================================================
     FILTER + SEARCH + SORT
  ===================================================== */

  const visibleTasks = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    let result = tasks.filter((task) => {
      const matchesSearch =
        !query ||
        task.title
          .toLowerCase()
          .includes(query) ||
        task.description
          .toLowerCase()
          .includes(query) ||
        task.subject
          .toLowerCase()
          .includes(query);

      if (!matchesSearch) return false;

      if (
        !showCompleted &&
        task.completed
      ) {
        return false;
      }

      if (filter === "pending") {
        return !task.completed;
      }

      if (filter === "completed") {
        return task.completed;
      }

      if (filter === "overdue") {
        return (
          !task.completed &&
          !!task.dueDate &&
          isOverdue(task.dueDate)
        );
      }

      return true;
    });

    const priorityValue = {
      high: 0,
      medium: 1,
      low: 2,
    };

    result.sort((a, b) => {
      if (
        a.completed !== b.completed
      ) {
        return a.completed ? 1 : -1;
      }

      if (sortBy === "priority") {
        return (
          priorityValue[a.priority] -
          priorityValue[b.priority]
        );
      }

      if (sortBy === "date") {
        if (
          a.dueDate &&
          b.dueDate
        ) {
          return (
            new Date(a.dueDate).getTime() -
            new Date(b.dueDate).getTime()
          );
        }

        if (a.dueDate) return -1;
        if (b.dueDate) return 1;

        return 0;
      }

      return (
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
      );
    });

    return result;
  }, [
    tasks,
    search,
    filter,
    sortBy,
    showCompleted,
  ]);

  /* =====================================================
     RETURN
  ===================================================== */

  return (
    <main className="pb-16">

      {/* =================================================
          HERO
      ================================================= */}

      <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-[#111c31] via-[#111827] to-[#0d1424] p-6 sm:p-8 lg:p-10">

        <div className="absolute right-[-120px] top-[-120px] h-80 w-80 rounded-full bg-blue-500/10 blur-[110px]" />

        <div className="absolute bottom-[-150px] left-[-100px] h-72 w-72 rounded-full bg-indigo-500/10 blur-[100px]" />

        <div className="relative">

          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">

            <div>

              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.3em] text-blue-400">
                <Target size={14} />
                Atlas • Productivity
              </div>

              <h1 className="mt-3 text-4xl font-black text-white sm:text-5xl">
                Task Command Center
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
                Plan assignments, track deadlines,
                organize study goals, and turn your
                workload into something manageable.
              </p>

            </div>

            <button
              onClick={() => setShowForm(true)}
              className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-bold text-white shadow-lg shadow-blue-900/20 transition hover:bg-blue-500 hover:-translate-y-0.5"
            >
              <Plus size={19} />
              New Task
            </button>

          </div>

          {/* QUICK PRODUCTIVITY SUMMARY */}

          <div className="mt-8 grid gap-3 sm:grid-cols-3">

            <MiniMetric
              icon={<Flame size={17} />}
              label="Completed today"
              value={completedToday.toString()}
            />

            <MiniMetric
              icon={<Timer size={17} />}
              label="Pending workload"
              value={formatMinutes(
                totalMinutes
              )}
            />

            <MiniMetric
              icon={<CheckCircle2 size={17} />}
              label="Completion"
              value={`${completionRate}%`}
            />

          </div>

        </div>

      </section>

      {/* =================================================
          STAT CARDS
      ================================================= */}

      <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <StatCard
          icon={<ListTodo size={20} />}
          label="Total Tasks"
          value={tasks.length.toString()}
        />

        <StatCard
          icon={<Clock3 size={20} />}
          label="Pending"
          value={pendingTasks.toString()}
        />

        <StatCard
          icon={<Check size={20} />}
          label="Completed"
          value={completedTasks.toString()}
        />

        <StatCard
          icon={<CircleAlert size={20} />}
          label="Overdue"
          value={overdueTasks.toString()}
          danger={overdueTasks > 0}
        />

      </section>

      {/* =================================================
          PROGRESS
      ================================================= */}

      {tasks.length > 0 && (
        <section className="mt-6 rounded-2xl border border-slate-800 bg-[#111827] p-5 sm:p-6">

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <p className="flex items-center gap-2 text-sm font-bold text-white">
                <Sparkles
                  size={16}
                  className="text-blue-400"
                />
                Overall Progress
              </p>

              <p className="mt-1 text-xs text-slate-500">
                {completedTasks} of {tasks.length} tasks completed
                {completedMinutes > 0 &&
                  ` • ${formatMinutes(
                    completedMinutes
                  )} completed`}
              </p>

            </div>

            <span className="text-xl font-black text-blue-400">
              {completionRate}%
            </span>

          </div>

          <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-800">

            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500"
              style={{
                width: `${completionRate}%`,
              }}
            />

          </div>

        </section>
      )}

      {/* =================================================
          TOOLBAR
      ================================================= */}

      <section className="mt-8 rounded-2xl border border-slate-800 bg-[#111827] p-4 sm:p-5">

        <div className="flex flex-col gap-4">

          {/* SEARCH */}

          <div className="relative">

            <Search
              size={18}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
            />

            <input
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search tasks, subjects..."
              className="w-full rounded-xl border border-slate-800 bg-[#0b101e] py-3 pl-11 pr-4 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
            />

          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

            {/* FILTERS */}

            <div className="flex flex-wrap gap-2">

              <FilterButton
                active={filter === "all"}
                onClick={() =>
                  setFilter("all")
                }
              >
                All
              </FilterButton>

              <FilterButton
                active={filter === "pending"}
                onClick={() =>
                  setFilter("pending")
                }
              >
                Pending
              </FilterButton>

              <FilterButton
                active={filter === "completed"}
                onClick={() =>
                  setFilter("completed")
                }
              >
                Completed
              </FilterButton>

              <FilterButton
                active={filter === "overdue"}
                onClick={() =>
                  setFilter("overdue")
                }
              >
                Overdue
              </FilterButton>

            </div>

            {/* SORT */}

            <div className="flex items-center gap-2">

              <span className="text-xs text-slate-600">
                Sort
              </span>

              <div className="relative">

                <select
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(
                      e.target.value as
                        | "priority"
                        | "date"
                        | "created"
                    )
                  }
                  className="appearance-none rounded-lg border border-slate-800 bg-[#0b101e] py-2 pl-3 pr-8 text-xs font-semibold text-slate-300 outline-none focus:border-blue-500"
                >
                  <option value="priority">
                    Priority
                  </option>

                  <option value="date">
                    Due date
                  </option>

                  <option value="created">
                    Recently added
                  </option>
                </select>

                <ChevronDown
                  size={13}
                  className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-slate-500"
                />

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* =================================================
          ACTION BAR
      ================================================= */}

      {tasks.length > 0 && (
        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

          <div className="text-sm text-slate-500">
            Showing{" "}
            <span className="font-semibold text-slate-300">
              {visibleTasks.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-slate-300">
              {tasks.length}
            </span>{" "}
            tasks
          </div>

          <div className="flex flex-wrap gap-2">

            <button
              onClick={() =>
                setShowCompleted(
                  (value) => !value
                )
              }
              className="rounded-lg border border-slate-800 px-3 py-2 text-xs font-semibold text-slate-400 transition hover:bg-slate-800 hover:text-white"
            >
              {showCompleted
                ? "Hide completed"
                : "Show completed"}
            </button>

            {pendingTasks > 0 && (
              <button
                onClick={completeAllPending}
                className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-3 py-2 text-xs font-semibold text-emerald-400 transition hover:bg-emerald-500/10"
              >
                Complete all
              </button>
            )}

            {completedTasks > 0 && (
              <button
                onClick={clearCompleted}
                className="rounded-lg border border-rose-500/20 bg-rose-500/5 px-3 py-2 text-xs font-semibold text-rose-400 transition hover:bg-rose-500/10"
              >
                Clear completed
              </button>
            )}

          </div>

        </div>
      )}

      {/* =================================================
          TASK LIST
      ================================================= */}

      <section className="mt-6">

        {visibleTasks.length === 0 ? (

          <div className="rounded-3xl border border-dashed border-slate-800 bg-[#0d1424] p-10 text-center sm:p-14">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10">

              {tasks.length === 0 ? (
                <ListTodo
                  size={30}
                  className="text-blue-400"
                />
              ) : (
                <Search
                  size={30}
                  className="text-blue-400"
                />
              )}

            </div>

            <h3 className="mt-5 text-xl font-bold text-white">

              {tasks.length === 0
                ? "Nothing on your plate."
                : "No matching tasks."}

            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">

              {tasks.length === 0
                ? "Add your first task and Atlas will keep track of your workload."
                : "Try changing your search or filters to find what you're looking for."}

            </p>

            {tasks.length === 0 ? (
              <button
                onClick={() =>
                  setShowForm(true)
                }
                className="mt-6 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-500"
              >
                Create First Task
              </button>
            ) : (
              <button
                onClick={() => {
                  setSearch("");
                  setFilter("all");
                }}
                className="mt-6 inline-flex items-center gap-2 rounded-xl border border-slate-800 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:bg-slate-800 hover:text-white"
              >
                <RotateCcw size={15} />
                Reset filters
              </button>
            )}

          </div>

        ) : (

          <div className="space-y-3">

            {visibleTasks.map((task) => {

              const overdue =
                !task.completed &&
                !!task.dueDate &&
                isOverdue(task.dueDate);

              return (
                <TaskCard
                  key={task.id}
                  task={task}
                  overdue={overdue}
                  onToggle={() =>
                    toggleTask(task.id)
                  }
                  onDelete={() =>
                    deleteTask(task.id)
                  }
                />
              );
            })}

          </div>

        )}

      </section>

      {/* =================================================
          CREATE MODAL
      ================================================= */}

      {showForm && (

        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onMouseDown={(e) => {
            if (
              e.target === e.currentTarget
            ) {
              resetForm();
            }
          }}
        >

          <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl border border-slate-800 bg-[#0b101e] shadow-2xl">

            {/* HEADER */}

            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-800 bg-[#0b101e] p-5 sm:p-6">

              <div>

                <div className="flex items-center gap-2">

                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10">
                    <Plus
                      size={18}
                      className="text-blue-400"
                    />
                  </div>

                  <h2 className="text-xl font-bold text-white">
                    Create New Task
                  </h2>

                </div>

                <p className="mt-2 text-xs text-slate-500">
                  Add something you need to get done.
                </p>

              </div>

              <button
                onClick={resetForm}
                className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-800 hover:text-white"
                aria-label="Close"
              >
                <X size={20} />
              </button>

            </div>

            {/* BODY */}

            <div className="space-y-5 p-5 sm:p-6">

              {/* TITLE */}

              <FormField label="Task">

                <input
                  value={title}
                  onChange={(e) =>
                    setTitle(e.target.value)
                  }
                  onKeyDown={(e) => {
                    if (
                      e.key === "Enter"
                    ) {
                      createTask();
                    }
                  }}
                  placeholder="e.g. Complete Physics record"
                  className="w-full rounded-xl border border-slate-800 bg-[#111827] px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
                  autoFocus
                />

              </FormField>

              {/* DESCRIPTION */}

              <FormField label="Description">

                <textarea
                  value={description}
                  onChange={(e) =>
                    setDescription(
                      e.target.value
                    )
                  }
                  placeholder="Optional details..."
                  rows={3}
                  className="input resize-none"
                />

              </FormField>

              {/* SUBJECT */}

              <FormField label="Subject">

                <input
                  value={subject}
                  onChange={(e) =>
                    setSubject(
                      e.target.value
                    )
                  }
                  placeholder="e.g. Mathematics"
                  className="w-full rounded-xl border border-slate-800 bg-[#111827] px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
                />

              </FormField>

              {/* PRIORITY + DATE */}

              <div className="grid gap-4 sm:grid-cols-2">

                <FormField label="Priority">

                  <select
                    value={priority}
                    onChange={(e) =>
                      setPriority(
                        e.target.value as Priority
                      )
                    }
                    className="w-full rounded-xl border border-slate-800 bg-[#111827] px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
                  >
                    <option value="high">
                      🔴 High
                    </option>

                    <option value="medium">
                      🟡 Medium
                    </option>

                    <option value="low">
                      🟢 Low
                    </option>
                  </select>

                </FormField>

                <FormField label="Due Date">

                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) =>
                      setDueDate(
                        e.target.value
                      )
                    }
                    className="w-full rounded-xl border border-slate-800 bg-[#111827] px-4 py-3 text-white outline-none placeholder:text-slate-600 focus:border-blue-500"
                  />

                </FormField>

              </div>

              {/* ESTIMATED TIME */}

              <FormField label="Estimated Time">

                <div className="relative">

                  <input
                    type="number"
                    min="1"
                    value={estimatedMinutes}
                    onChange={(e) =>
                      setEstimatedMinutes(
                        Math.max(
                          1,
                          Number(
                            e.target.value
                          ) || 1
                        )
                      )
                    }
                    className="input pr-20"
                  />

                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-600">
                    minutes
                  </span>

                </div>

              </FormField>

              {/* BUTTONS */}

              <div className="flex gap-3 pt-2">

                <button
                  onClick={resetForm}
                  className="flex-1 rounded-xl border border-slate-800 px-4 py-3 font-semibold text-slate-400 transition hover:bg-slate-800 hover:text-white"
                >
                  Cancel
                </button>

                <button
                  onClick={createTask}
                  className="flex-1 rounded-xl bg-blue-600 px-4 py-3 font-bold text-white transition hover:bg-blue-500"
                >
                  Create Task
                </button>

              </div>

            </div>

          </div>

        </div>
      )}

    </main>
  );
}

/* =========================================================
   STAT CARD
========================================================= */

function StatCard({
  icon,
  label,
  value,
  danger = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  danger?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-[#111827] p-5 transition hover:border-slate-700">

      <div className="flex items-center gap-3">

        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${
            danger
              ? "bg-rose-500/10 text-rose-400"
              : "bg-blue-500/10 text-blue-400"
          }`}
        >
          {icon}
        </div>

        <p className="text-sm text-slate-500">
          {label}
        </p>

      </div>

      <p
        className={`mt-4 text-2xl font-black ${
          danger
            ? "text-rose-400"
            : "text-white"
        }`}
      >
        {value}
      </p>

    </div>
  );
}

/* =========================================================
   MINI METRIC
========================================================= */

function MiniMetric({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/5 bg-black/10 px-4 py-3">

      <div className="text-blue-400">
        {icon}
      </div>

      <div className="min-w-0">

        <p className="text-[11px] text-slate-500">
          {label}
        </p>

        <p className="mt-0.5 text-sm font-bold text-slate-200">
          {value}
        </p>

      </div>

    </div>
  );
}

/* =========================================================
   FILTER BUTTON
========================================================= */

function FilterButton({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
        active
          ? "bg-blue-600 text-white"
          : "border border-slate-800 text-slate-500 hover:bg-slate-800 hover:text-slate-300"
      }`}
    >
      {children}
    </button>
  );
}

/* =========================================================
   FORM FIELD
========================================================= */

function FormField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>

      <label className="mb-2 block text-sm font-semibold text-slate-300">
        {label}
      </label>

      {children}

    </div>
  );
}

/* =========================================================
   TASK CARD
========================================================= */

function TaskCard({
  task,
  overdue,
  onToggle,
  onDelete,
}: {
  task: Task;
  overdue: boolean;
  onToggle: () => void;
  onDelete: () => void;
}) {
  const priorityStyles = {
    high: "border-rose-500/30 bg-rose-500/10 text-rose-400",
    medium:
      "border-amber-500/30 bg-amber-500/10 text-amber-400",
    low: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
  };

  return (
    <div
      className={`group rounded-2xl border bg-[#111827] p-4 transition sm:p-5 ${
        task.completed
          ? "border-slate-800 opacity-60"
          : overdue
          ? "border-rose-500/30"
          : "border-slate-800 hover:border-slate-700"
      }`}
    >

      <div className="flex items-start gap-3 sm:gap-4">

        {/* CHECK */}

        <button
          onClick={onToggle}
          className={`mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition ${
            task.completed
              ? "border-emerald-500 bg-emerald-500 text-white"
              : "border-slate-600 hover:border-blue-500"
          }`}
          aria-label={
            task.completed
              ? "Mark task incomplete"
              : "Complete task"
          }
        >
          {task.completed && (
            <Check size={14} />
          )}
        </button>

        {/* CONTENT */}

        <div className="min-w-0 flex-1">

          <div className="flex flex-wrap items-center gap-2">

            <h3
              className={`break-words text-base font-bold ${
                task.completed
                  ? "text-slate-500 line-through"
                  : "text-white"
              }`}
            >
              {task.title}
            </h3>

            <span
              className={`rounded-full border px-2 py-1 text-[10px] font-bold uppercase ${priorityStyles[task.priority]}`}
            >
              {task.priority}
            </span>

          </div>

          {task.description && (
            <p className="mt-2 text-sm leading-6 text-slate-500">
              {task.description}
            </p>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-2.5 text-xs">

            <span className="rounded-lg bg-slate-800 px-2.5 py-1.5 text-slate-400">
              📚 {task.subject}
            </span>

            <span className="flex items-center gap-1.5 text-slate-500">
              <Clock3 size={13} />
              {task.estimatedMinutes} min
            </span>

            {task.dueDate && (
              <span
                className={`flex items-center gap-1.5 ${
                  overdue
                    ? "font-semibold text-rose-400"
                    : "text-slate-500"
                }`}
              >
                <CalendarDays size={13} />

                {overdue
                  ? "Overdue"
                  : formatDate(
                      task.dueDate
                    )}
              </span>
            )}

          </div>

        </div>

        {/* DELETE */}

        <button
          onClick={onDelete}
          className="shrink-0 rounded-lg p-2 text-slate-700 transition hover:bg-rose-500/10 hover:text-rose-400 sm:opacity-0 sm:group-hover:opacity-100"
          aria-label="Delete task"
        >
          <Trash2 size={17} />
        </button>

      </div>

    </div>
  );
}

/* =========================================================
   HELPERS
========================================================= */

function getTodayKey() {
  const now = new Date();

  return [
    now.getFullYear(),
    String(
      now.getMonth() + 1
    ).padStart(2, "0"),
    String(
      now.getDate()
    ).padStart(2, "0"),
  ].join("-");
}

function isOverdue(date: string) {
  return (
    new Date(
      `${date}T23:59:59`
    ).getTime() < Date.now()
  );
}

function formatDate(date: string) {
  return new Date(
    `${date}T00:00:00`
  ).toLocaleDateString([], {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatMinutes(minutes: number) {
  if (minutes < 60) {
    return `${minutes} min`;
  }

  const hours = Math.floor(
    minutes / 60
  );

  const remaining =
    minutes % 60;

  if (remaining === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${remaining}m`;
}