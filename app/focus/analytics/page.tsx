"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  BarChart3,
  Clock3,
  Flame,
  Target,
  Trophy,
  BookOpen,
  CalendarDays,
} from "lucide-react";
import Link from "next/link";

type Session = {
  id: number;
  subject: string;
  duration: number;
  completedAt: string;
};

export default function FocusAnalyticsPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [dailyGoal, setDailyGoal] = useState(120);

  useEffect(() => {
    const savedSessions =
      localStorage.getItem("atlas-focus-sessions");

    const savedGoal =
      localStorage.getItem("atlas-focus-daily-goal");

    if (savedSessions) {
      try {
        setSessions(JSON.parse(savedSessions));
      } catch {
        setSessions([]);
      }
    }

    if (savedGoal) {
      const goal = Number(savedGoal);

      if (goal > 0) {
        setDailyGoal(goal);
      }
    }
  }, []);

  /* =========================================================
     BASIC STATS
  ========================================================= */

  const totalMinutes = sessions.reduce(
    (total, session) => total + session.duration,
    0
  );

  const longestSession =
    sessions.length > 0
      ? Math.max(
          ...sessions.map((session) => session.duration)
        )
      : 0;

  const averageSession =
    sessions.length > 0
      ? Math.round(totalMinutes / sessions.length)
      : 0;

  const streak = calculateStreak(sessions);

  /* =========================================================
     LAST 7 DAYS
  ========================================================= */

  const lastSevenDays = useMemo(() => {
    const result = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date();

      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate() - i);

      const dateString = date.toDateString();

      const minutes = sessions
        .filter(
          (session) =>
            new Date(
              session.completedAt
            ).toDateString() === dateString
        )
        .reduce(
          (total, session) =>
            total + session.duration,
          0
        );

      result.push({
        date,
        label: date.toLocaleDateString([], {
          weekday: "short",
        }),
        minutes,
      });
    }

    return result;
  }, [sessions]);

  const maxDayMinutes = Math.max(
    ...lastSevenDays.map((day) => day.minutes),
    1
  );

  /* =========================================================
     TODAY
  ========================================================= */

  const today = new Date().toDateString();

  const todayMinutes = sessions
    .filter(
      (session) =>
        new Date(session.completedAt).toDateString() ===
        today
    )
    .reduce(
      (total, session) =>
        total + session.duration,
      0
    );

  const goalPercent = Math.min(
    100,
    Math.round((todayMinutes / dailyGoal) * 100)
  );

  /* =========================================================
     SUBJECT BREAKDOWN
  ========================================================= */

  const subjects = useMemo(() => {
    const map: Record<string, number> = {};

    sessions.forEach((session) => {
      map[session.subject] =
        (map[session.subject] || 0) +
        session.duration;
    });

    return Object.entries(map)
      .map(([subject, minutes]) => ({
        subject,
        minutes,
      }))
      .sort((a, b) => b.minutes - a.minutes);
  }, [sessions]);

  const maxSubjectMinutes = Math.max(
    ...subjects.map((subject) => subject.minutes),
    1
  );

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-[#111c31] via-[#111827] to-[#0d1424] p-7 sm:p-10">

        <div className="absolute right-[-100px] top-[-100px] h-72 w-72 rounded-full bg-blue-500/10 blur-[100px]" />

        <div className="relative">

          <Link
            href="/focus"
            className="inline-flex items-center gap-2 text-sm text-slate-500 transition hover:text-white"
          >
            <ArrowLeft size={16} />
            Back to Focus Study
          </Link>

          <div className="mt-6 flex items-center gap-3">

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10">
              <BarChart3
                size={24}
                className="text-blue-400"
              />
            </div>

            <div>

              <p className="text-xs uppercase tracking-[0.3em] text-blue-400">
                Atlas • Focus
              </p>

              <h1 className="mt-1 text-4xl font-black text-white sm:text-5xl">
                Study Analytics
              </h1>

            </div>

          </div>

          <p className="mt-4 max-w-2xl text-slate-400">
            See where your time goes, track your consistency,
            and turn small sessions into something measurable.
          </p>

        </div>

      </section>

      {/* =====================================================
          OVERVIEW STATS
      ===================================================== */}

      <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <StatCard
          icon={<Clock3 size={20} />}
          label="Total Study Time"
          value={formatMinutes(totalMinutes)}
        />

        <StatCard
          icon={<Flame size={20} />}
          label="Current Streak"
          value={`${streak} day${streak === 1 ? "" : "s"}`}
        />

        <StatCard
          icon={<Trophy size={20} />}
          label="Longest Session"
          value={formatMinutes(longestSession)}
        />

        <StatCard
          icon={<Target size={20} />}
          label="Average Session"
          value={formatMinutes(averageSession)}
        />

      </section>

      {/* =====================================================
          7 DAY CHART
      ===================================================== */}

      <section className="mt-8 rounded-3xl border border-slate-800 bg-[#111827] p-6 sm:p-8">

        <div className="flex items-center justify-between">

          <div>

            <h2 className="text-xl font-bold text-white">
              Last 7 Days
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Your daily focus activity
            </p>

          </div>

          <CalendarDays
            size={22}
            className="text-slate-600"
          />

        </div>

        <div className="mt-8 flex h-64 items-end justify-between gap-2 sm:gap-5">

          {lastSevenDays.map((day) => {

            const height =
              day.minutes === 0
                ? 3
                : Math.max(
                    8,
                    (day.minutes / maxDayMinutes) * 100
                  );

            const isToday =
              day.date.toDateString() === today;

            return (
              <div
                key={day.date.toISOString()}
                className="flex h-full flex-1 flex-col items-center justify-end"
              >

                <span className="mb-2 text-xs font-semibold text-slate-500">
                  {day.minutes > 0
                    ? `${day.minutes}m`
                    : ""}
                </span>

                <div className="flex h-full w-full items-end">

                  <div
                    className={`w-full rounded-t-xl transition-all ${
                      isToday
                        ? "bg-gradient-to-t from-emerald-600 to-emerald-400"
                        : "bg-gradient-to-t from-blue-700/70 to-blue-400/70"
                    }`}
                    style={{
                      height: `${height}%`,
                    }}
                  />

                </div>

                <span
                  className={`mt-3 text-xs font-medium ${
                    isToday
                      ? "text-emerald-400"
                      : "text-slate-500"
                  }`}
                >
                  {day.label}
                </span>

              </div>
            );
          })}

        </div>

      </section>

      {/* =====================================================
          TODAY GOAL + SUBJECTS
      ===================================================== */}

      <section className="mt-8 grid gap-8 lg:grid-cols-2">

        {/* TODAY GOAL */}

        <div className="rounded-3xl border border-slate-800 bg-[#111827] p-6 sm:p-8">

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10">
              <Target
                size={21}
                className="text-emerald-400"
              />
            </div>

            <div>

              <h2 className="font-bold text-white">
                Today's Goal
              </h2>

              <p className="text-xs text-slate-500">
                {formatMinutes(todayMinutes)} /{" "}
                {formatMinutes(dailyGoal)}
              </p>

            </div>

          </div>

          <div className="mt-8 text-center">

            <div className="text-6xl font-black text-white">
              {goalPercent}%
            </div>

            <p className="mt-2 text-sm text-slate-500">
              daily target completed
            </p>

          </div>

          <div className="mt-8 h-4 overflow-hidden rounded-full bg-slate-800">

            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all"
              style={{
                width: `${goalPercent}%`,
              }}
            />

          </div>

          <p className="mt-4 text-center text-sm text-slate-500">

            {goalPercent >= 100
              ? "Goal achieved. Excellent work. 🌱"
              : `${formatMinutes(
                  Math.max(
                    0,
                    dailyGoal - todayMinutes
                  )
                )} remaining today`}

          </p>

        </div>

        {/* SUBJECTS */}

        <div className="rounded-3xl border border-slate-800 bg-[#111827] p-6 sm:p-8">

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/10">
              <BookOpen
                size={21}
                className="text-violet-400"
              />
            </div>

            <div>

              <h2 className="font-bold text-white">
                Time by Subject
              </h2>

              <p className="text-xs text-slate-500">
                Where your focus went
              </p>

            </div>

          </div>

          <div className="mt-7 space-y-5">

            {subjects.length === 0 ? (

              <div className="rounded-2xl border border-dashed border-slate-800 p-8 text-center">

                <BookOpen
                  size={28}
                  className="mx-auto text-slate-700"
                />

                <p className="mt-3 text-sm text-slate-500">
                  Complete a focus session to see subject
                  statistics.
                </p>

              </div>

            ) : (

              subjects.slice(0, 6).map((item) => {

                const percentage = Math.round(
                  (item.minutes /
                    maxSubjectMinutes) *
                    100
                );

                return (
                  <div key={item.subject}>

                    <div className="flex items-center justify-between">

                      <span className="max-w-[65%] truncate text-sm font-semibold text-slate-300">
                        {item.subject}
                      </span>

                      <span className="text-xs font-bold text-slate-500">
                        {formatMinutes(item.minutes)}
                      </span>

                    </div>

                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-800">

                      <div
                        className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500"
                        style={{
                          width: `${percentage}%`,
                        }}
                      />

                    </div>

                  </div>
                );
              })

            )}

          </div>

        </div>

      </section>

      {/* =====================================================
          EMPTY STATE
      ===================================================== */}

      {sessions.length === 0 && (

        <section className="mt-8 rounded-3xl border border-dashed border-slate-800 bg-[#0d1424] p-8 text-center">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10">

            <BarChart3
              size={26}
              className="text-emerald-400"
            />

          </div>

          <h2 className="mt-5 text-xl font-bold text-white">
            Your analytics are waiting.
          </h2>

          <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
            Complete your first focus session and Atlas
            will start building your study history.
          </p>

          <Link
            href="/focus"
            className="mt-6 inline-flex items-center rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-500"
          >
            Start Studying
          </Link>

        </section>

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
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-[#111827] p-5">

      <div className="flex items-center gap-3">

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
          {icon}
        </div>

        <p className="text-sm text-slate-500">
          {label}
        </p>

      </div>

      <p className="mt-4 text-2xl font-black text-white">
        {value}
      </p>

    </div>
  );
}


/* =========================================================
   FORMAT MINUTES
========================================================= */

function formatMinutes(total: number) {
  if (total === 0) {
    return "0 min";
  }

  const hours = Math.floor(total / 60);
  const minutes = total % 60;

  if (hours === 0) {
    return `${minutes} min`;
  }

  if (minutes === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${minutes}m`;
}


/* =========================================================
   STREAK
========================================================= */

function calculateStreak(sessions: Session[]) {
  if (sessions.length === 0) {
    return 0;
  }

  const days = new Set(
    sessions.map((session) =>
      new Date(session.completedAt).toDateString()
    )
  );

  let streak = 0;
  const current = new Date();

  while (days.has(current.toDateString())) {
    streak++;

    current.setDate(
      current.getDate() - 1
    );
  }

  return streak;
}