"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Leaf,
  Clock3,
  Flame,
  CheckCircle2,
  History,
  Sprout,
  Trophy,
} from "lucide-react";

type Session = {
  id: number;
  subject: string;
  duration: number;
  completedAt: string;
};

const PRESETS = [25, 45, 60, 90];

const DAILY_GOALS = [30, 60, 120, 180];

export default function FocusPage() {
  const [selectedMinutes, setSelectedMinutes] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);

  const [running, setRunning] = useState(false);

  const [subject, setSubject] = useState("General Study");

  const [sessions, setSessions] = useState<Session[]>([]);

  const [customMinutes, setCustomMinutes] = useState("");

  const [dailyGoal, setDailyGoal] = useState(120);

  const [completedRecently, setCompletedRecently] = useState(false);

  /* =========================================================
     LOAD SAVED DATA
  ========================================================= */

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
     SAVE SESSIONS
  ========================================================= */

  useEffect(() => {
    localStorage.setItem(
      "atlas-focus-sessions",
      JSON.stringify(sessions)
    );
  }, [sessions]);

  /* =========================================================
     SAVE DAILY GOAL
  ========================================================= */

  useEffect(() => {
    localStorage.setItem(
      "atlas-focus-daily-goal",
      dailyGoal.toString()
    );
  }, [dailyGoal]);

  /* =========================================================
     TIMER
  ========================================================= */

  useEffect(() => {
    if (!running) return;

    if (timeLeft <= 0) {
      completeSession();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((previous) => previous - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [running, timeLeft]);

  /* =========================================================
     TIMER DISPLAY
  ========================================================= */

  const minutes = Math.floor(timeLeft / 60)
    .toString()
    .padStart(2, "0");

  const seconds = (timeLeft % 60)
    .toString()
    .padStart(2, "0");

  /* =========================================================
     TODAY
  ========================================================= */

  const today = new Date().toDateString();

  const todaySessions = useMemo(() => {
    return sessions.filter(
      (session) =>
        new Date(session.completedAt).toDateString() === today
    );
  }, [sessions, today]);

  const todayMinutes = todaySessions.reduce(
    (total, session) => total + session.duration,
    0
  );

  const totalMinutes = sessions.reduce(
    (total, session) => total + session.duration,
    0
  );

  const streak = calculateStreak(sessions);

  /* =========================================================
     DAILY GOAL PROGRESS
  ========================================================= */

  const goalProgress = Math.min(
    100,
    Math.round((todayMinutes / dailyGoal) * 100)
  );

  /* =========================================================
     PLANT GROWTH
  ========================================================= */

  const sessionProgress = Math.min(
    100,
    Math.max(
      0,
      ((selectedMinutes * 60 - timeLeft) /
        (selectedMinutes * 60)) *
        100
    )
  );

  const plantStage = getPlantStage(sessionProgress);

  /* =========================================================
     PRESET
  ========================================================= */

  function selectPreset(value: number) {
    if (running) return;

    setSelectedMinutes(value);
    setTimeLeft(value * 60);
    setCompletedRecently(false);
  }

  /* =========================================================
     CUSTOM TIMER
  ========================================================= */

  function applyCustomTime() {
    const value = Number(customMinutes);

    if (!value || value < 1 || value > 240) {
      alert("Choose a duration between 1 and 240 minutes.");
      return;
    }

    if (running) return;

    setSelectedMinutes(value);
    setTimeLeft(value * 60);
    setCustomMinutes("");
    setCompletedRecently(false);
  }

  /* =========================================================
     RESET
  ========================================================= */

  function resetTimer() {
    setRunning(false);
    setTimeLeft(selectedMinutes * 60);
    setCompletedRecently(false);
  }

  /* =========================================================
     COMPLETE
  ========================================================= */

  function completeSession() {
    setRunning(false);

    const newSession: Session = {
      id: Date.now(),
      subject,
      duration: selectedMinutes,
      completedAt: new Date().toISOString(),
    };

    setSessions((previous) => [
      newSession,
      ...previous,
    ]);

    setTimeLeft(selectedMinutes * 60);
    setCompletedRecently(true);
  }

  /* =========================================================
     START NEW SESSION
  ========================================================= */

  function startAgain() {
    setCompletedRecently(false);
    setTimeLeft(selectedMinutes * 60);
    setRunning(true);
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-[#10251d] via-[#101c24] to-[#0c1020] p-7 sm:p-10">

        <div className="absolute right-[-120px] top-[-120px] h-80 w-80 rounded-full bg-emerald-500/10 blur-[110px]" />

        <div className="relative">

          <p className="text-xs uppercase tracking-[0.35em] text-emerald-400">
            Atlas • Focus Mode
          </p>

          <h1 className="mt-3 text-4xl font-black text-white sm:text-5xl">
            Focus Study
          </h1>

          <p className="mt-4 max-w-2xl text-slate-400">
            Focus deeply. Grow steadily. Every completed
            session adds another leaf to your garden.
          </p>

        </div>

      </section>

      {/* =====================================================
          STATS
      ===================================================== */}

      <section className="mt-8 grid gap-4 sm:grid-cols-3">

        <StatCard
          icon={<Clock3 size={20} />}
          label="Today"
          value={formatMinutes(todayMinutes)}
        />

        <StatCard
          icon={<Flame size={20} />}
          label="Focus Streak"
          value={`${streak} day${streak === 1 ? "" : "s"}`}
        />

        <StatCard
          icon={<CheckCircle2 size={20} />}
          label="Total Sessions"
          value={sessions.length.toString()}
        />

      </section>

      {/* =====================================================
          DAILY GOAL
      ===================================================== */}

      <section className="mt-8 rounded-3xl border border-slate-800 bg-[#111827] p-6 sm:p-7">

        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <div className="flex items-center gap-2">

              <Trophy
                size={19}
                className="text-amber-400"
              />

              <h2 className="font-bold text-white">
                Today's Focus Goal
              </h2>

            </div>

            <p className="mt-1 text-sm text-slate-500">
              {formatMinutes(todayMinutes)} of{" "}
              {formatMinutes(dailyGoal)} completed
            </p>

          </div>

          <div className="flex flex-wrap gap-2">

            {DAILY_GOALS.map((goal) => (

              <button
                key={goal}
                onClick={() => setDailyGoal(goal)}
                className={`rounded-xl border px-3 py-2 text-xs font-semibold transition ${
                  dailyGoal === goal
                    ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                    : "border-slate-800 bg-[#0d1424] text-slate-500 hover:text-white"
                }`}
              >
                {formatMinutes(goal)}
              </button>

            ))}

          </div>

        </div>

        {/* GOAL BAR */}

        <div className="mt-5">

          <div className="h-3 overflow-hidden rounded-full bg-slate-800">

            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-700"
              style={{
                width: `${goalProgress}%`,
              }}
            />

          </div>

          <div className="mt-2 flex justify-between text-xs">

            <span className="text-slate-600">
              {goalProgress >= 100
                ? "Goal completed 🎉"
                : `${goalProgress}% complete`}
            </span>

            <span className="text-slate-500">
              {formatMinutes(dailyGoal)}
            </span>

          </div>

        </div>

      </section>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <section className="mt-8 grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">

        {/* ===================================================
            TIMER
        =================================================== */}

        <div className="rounded-3xl border border-slate-800 bg-[#111827] p-6 sm:p-10">

          {/* PLANT */}

          <div className="flex flex-col items-center text-center">

            <div
              className={`relative flex h-36 w-36 items-center justify-center rounded-full transition-all duration-700 ${
                completedRecently
                  ? "bg-emerald-500/15 shadow-[0_0_60px_rgba(16,185,129,0.18)]"
                  : "bg-emerald-500/5"
              }`}
            >

              <div
                className={`transition-all duration-700 ${
                  running
                    ? "scale-110"
                    : "scale-100"
                }`}
              >

                {plantStage === "seed" && (
                  <div className="text-6xl">
                    🌱
                  </div>
                )}

                {plantStage === "sprout" && (
                  <div className="text-7xl">
                    🌿
                  </div>
                )}

                {plantStage === "plant" && (
                  <div className="text-7xl">
                    🪴
                  </div>
                )}

                {plantStage === "tree" && (
                  <div className="text-8xl">
                    🌳
                  </div>
                )}

                {plantStage === "complete" && (
                  <div className="text-8xl">
                    🌳✨
                  </div>
                )}

              </div>

            </div>

            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.25em] text-emerald-500">
              {completedRecently
                ? "Session Complete"
                : `${Math.round(sessionProgress)}% grown`}
            </p>

            <h2 className="mt-3 text-xl font-bold text-white">
              {completedRecently
                ? "Beautiful work."
                : running
                ? "Stay focused."
                : "Ready when you are."}
            </h2>

            {/* TIMER */}

            <div className="mt-6 text-7xl font-black tracking-tight text-white sm:text-8xl">
              {minutes}:{seconds}
            </div>

            <p className="mt-3 text-sm text-slate-500">
              {subject}
            </p>

          </div>

          {/* PROGRESS */}

          <div className="mt-8">

            <div className="h-2 overflow-hidden rounded-full bg-slate-800">

              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-1000"
                style={{
                  width: `${sessionProgress}%`,
                }}
              />

            </div>

          </div>

          {/* PRESETS */}

          <div className="mt-9">

            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Focus Duration
            </p>

            <div className="grid grid-cols-4 gap-2">

              {PRESETS.map((preset) => (

                <button
                  key={preset}
                  onClick={() =>
                    selectPreset(preset)
                  }
                  disabled={running}
                  className={`rounded-xl border py-3 text-sm font-semibold transition ${
                    selectedMinutes === preset
                      ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                      : "border-slate-800 bg-[#0d1424] text-slate-400 hover:border-slate-600 hover:text-white"
                  } disabled:cursor-not-allowed disabled:opacity-50`}
                >
                  {preset}m
                </button>

              ))}

            </div>

          </div>

          {/* CUSTOM */}

          <div className="mt-5 flex gap-2">

            <input
              type="number"
              min="1"
              max="240"
              value={customMinutes}
              onChange={(e) =>
                setCustomMinutes(e.target.value)
              }
              placeholder="Custom minutes"
              disabled={running}
              className="min-w-0 flex-1 rounded-xl border border-slate-800 bg-[#0d1424] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-emerald-500 disabled:opacity-50"
            />

            <button
              onClick={applyCustomTime}
              disabled={running}
              className="rounded-xl border border-slate-800 bg-[#0d1424] px-4 text-sm font-semibold text-slate-300 transition hover:border-emerald-500 hover:text-white disabled:opacity-50"
            >
              Set
            </button>

          </div>

          {/* SUBJECT */}

          <div className="mt-5">

            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Studying
            </label>

            <input
              value={subject}
              onChange={(e) =>
                setSubject(e.target.value)
              }
              disabled={running}
              placeholder="e.g. Engineering Physics"
              className="mt-2 w-full rounded-xl border border-slate-800 bg-[#0d1424] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-emerald-500 disabled:opacity-50"
            />

          </div>

          {/* CONTROLS */}

          <div className="mt-7 flex gap-3">

            {completedRecently ? (

              <button
                onClick={startAgain}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 py-4 font-bold text-white transition hover:from-emerald-500 hover:to-teal-500"
              >
                <Sprout size={20} />
                Grow Another
              </button>

            ) : (

              <button
                onClick={() =>
                  setRunning((previous) => !previous)
                }
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 py-4 font-bold text-white transition hover:from-emerald-500 hover:to-teal-500"
              >

                {running ? (
                  <>
                    <Pause size={20} />
                    Pause
                  </>
                ) : (
                  <>
                    <Play size={20} />
                    Start Focus
                  </>
                )}

              </button>

            )}

            <button
              onClick={resetTimer}
              className="flex h-14 w-14 items-center justify-center rounded-xl border border-slate-800 bg-[#0d1424] text-slate-400 transition hover:border-slate-600 hover:text-white"
              title="Reset timer"
            >
              <RotateCcw size={19} />
            </button>

          </div>

        </div>

        {/* ===================================================
            HISTORY
        =================================================== */}

        <div className="rounded-3xl border border-slate-800 bg-[#111827] p-6">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10">
              <History
                size={20}
                className="text-blue-400"
              />
            </div>

            <div>

              <h2 className="font-bold text-white">
                Today's Focus
              </h2>

              <p className="text-xs text-slate-500">
                {todaySessions.length} completed session
                {todaySessions.length === 1 ? "" : "s"}
              </p>

            </div>

          </div>

          <div className="mt-6 space-y-3">

            {todaySessions.length === 0 ? (

              <div className="rounded-2xl border border-dashed border-slate-800 p-6 text-center">

                <Leaf
                  size={28}
                  className="mx-auto text-slate-700"
                />

                <p className="mt-3 text-sm text-slate-500">
                  Your first focus session will appear here.
                </p>

              </div>

            ) : (

              todaySessions.map((session) => (

                <div
                  key={session.id}
                  className="rounded-2xl bg-[#0d1424] p-4"
                >

                  <div className="flex items-center justify-between">

                    <div>

                      <p className="font-semibold text-white">
                        {session.subject}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {new Date(
                          session.completedAt
                        ).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>

                    </div>

                    <span className="font-bold text-emerald-400">
                      {session.duration}m
                    </span>

                  </div>

                </div>

              ))

            )}

          </div>

        </div>

      </section>

      {/* =====================================================
          TOTAL
      ===================================================== */}

      <section className="mt-8 rounded-3xl border border-slate-800 bg-[#111827] p-6">

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <p className="text-sm text-slate-500">
              Total recorded focus time
            </p>

            <p className="mt-1 text-3xl font-black text-white">
              {formatMinutes(totalMinutes)}
            </p>

          </div>

          <div className="text-sm text-slate-500">
            Every session counts. 🌱
          </div>

        </div>

      </section>

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

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
          {icon}
        </div>

        <p className="text-sm text-slate-500">
          {label}
        </p>

      </div>

      <p className="mt-3 text-2xl font-black text-white">
        {value}
      </p>

    </div>
  );
}


/* =========================================================
   FORMAT MINUTES
========================================================= */

function formatMinutes(total: number) {
  const hours = Math.floor(total / 60);
  const minutes = total % 60;

  if (hours === 0) {
    return `${minutes} min`;
  }

  return `${hours}h ${minutes}m`;
}


/* =========================================================
   PLANT STAGE
========================================================= */

function getPlantStage(progress: number) {
  if (progress >= 100) {
    return "complete";
  }

  if (progress >= 75) {
    return "tree";
  }

  if (progress >= 50) {
    return "plant";
  }

  if (progress >= 25) {
    return "sprout";
  }

  return "seed";
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