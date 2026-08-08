"use client";

import { useEffect, useMemo, useState } from "react";
import {
  User,
  GraduationCap,
  Building2,
  Mail,
  MapPin,
  CalendarDays,
  Edit3,
  Save,
  X,
  Check,
  BookOpen,
  Clock3,
  ListTodo,
  Target,
  Flame,
  Award,
  BarChart3,
  Activity,
  ShieldCheck,
  Camera,
  Zap,
  TrendingUp,
} from "lucide-react";

/* =========================================================
   TYPES
========================================================= */

type Profile = {
  name: string;
  email: string;
  branch: string;
  semester: string;
  college: string;
  location: string;
  bio: string;
  joined: string;
};

type Task = {
  id: number;
  title: string;
  completed: boolean;
  estimatedMinutes: number;
  dueDate?: string;
  subject?: string;
};

type FocusSession = {
  id?: number;
  duration?: number;
  minutes?: number;
  completed?: boolean;
  date?: string;
  createdAt?: string;
};

const PROFILE_KEY = "atlas-profile";
const SETTINGS_KEY = "atlas-settings";

/* =========================================================
   DEFAULT PROFILE
========================================================= */

const defaultProfile: Profile = {
  name: "Student",
  email: "",
  branch: "Electrical & Electronics Engineering",
  semester: "Semester 1",
  college: "Government Engineering College Thrissur",
  location: "",
  bio: "BTech Electrical & Electronics Engineering student.",
  joined: new Date().toISOString(),
};

/* =========================================================
   MAIN PAGE
========================================================= */

export default function ProfilePage() {
  const [profile, setProfile] =
    useState<Profile>(defaultProfile);

  const [tasks, setTasks] = useState<Task[]>([]);

  const [focusSessions, setFocusSessions] =
    useState<FocusSession[]>([]);

  const [editing, setEditing] = useState(false);

  const [draft, setDraft] =
    useState<Profile>(defaultProfile);

  const [saved, setSaved] = useState(false);

  /* =======================================================
     LOAD PROFILE + SETTINGS + PRODUCTIVITY DATA
  ======================================================= */

  useEffect(() => {
    try {
      const savedProfile =
        localStorage.getItem(PROFILE_KEY);

      const savedSettings =
        localStorage.getItem(SETTINGS_KEY);

      const savedTasks =
        localStorage.getItem("atlas-tasks");

      const savedFocus =
        localStorage.getItem(
          "atlas-focus-sessions"
        );

      let loadedProfile: Profile = {
        ...defaultProfile,
      };

      /*
        Profile has priority.

        If profile has never been created,
        pull academic information from Settings.
      */

      if (savedProfile) {
        loadedProfile = {
          ...defaultProfile,
          ...JSON.parse(savedProfile),
        };
      } else if (savedSettings) {
        const settings =
          JSON.parse(savedSettings);

        loadedProfile = {
          ...defaultProfile,
          name:
            settings.name ||
            defaultProfile.name,
          branch:
            settings.branch ||
            defaultProfile.branch,
          semester:
            settings.semester ||
            defaultProfile.semester,
          college:
            settings.college ||
            defaultProfile.college,
        };
      }

      setProfile(loadedProfile);
      setDraft(loadedProfile);

      if (savedTasks) {
        setTasks(JSON.parse(savedTasks));
      }

      if (savedFocus) {
        setFocusSessions(
          JSON.parse(savedFocus)
        );
      }
    } catch {
      setProfile(defaultProfile);
      setDraft(defaultProfile);
    }
  }, []);

  /* =======================================================
     LISTEN FOR SETTINGS CHANGES
  ======================================================= */

  useEffect(() => {
    function handleSettingsChange(
      event: Event
    ) {
      const customEvent =
        event as CustomEvent;

      const settings =
        customEvent.detail;

      if (!settings) return;

      setProfile((current) => ({
        ...current,
        name:
          settings.name ??
          current.name,
        branch:
          settings.branch ??
          current.branch,
        semester:
          settings.semester ??
          current.semester,
        college:
          settings.college ??
          current.college,
      }));
    }

    window.addEventListener(
      "atlas-settings-changed",
      handleSettingsChange
    );

    return () => {
      window.removeEventListener(
        "atlas-settings-changed",
        handleSettingsChange
      );
    };
  }, []);

  /* =======================================================
     SAVE PROFILE
  ======================================================= */

  function saveProfile() {
    localStorage.setItem(
      PROFILE_KEY,
      JSON.stringify(draft)
    );

    /*
      Keep Settings synchronized too.
    */

    const existingSettings =
      localStorage.getItem(
        SETTINGS_KEY
      );

    let settings = {};

    try {
      settings = existingSettings
        ? JSON.parse(existingSettings)
        : {};
    } catch {
      settings = {};
    }

    const updatedSettings = {
      ...settings,
      name: draft.name,
      branch: draft.branch,
      semester: draft.semester,
      college: draft.college,
    };

    localStorage.setItem(
      SETTINGS_KEY,
      JSON.stringify(updatedSettings)
    );

    window.dispatchEvent(
      new CustomEvent(
        "atlas-profile-changed",
        {
          detail: draft,
        }
      )
    );

    window.dispatchEvent(
      new CustomEvent(
        "atlas-settings-changed",
        {
          detail: updatedSettings,
        }
      )
    );

    setProfile(draft);
    setEditing(false);
    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  }

  function cancelEdit() {
    setDraft(profile);
    setEditing(false);
  }

  function updateDraft<K extends keyof Profile>(
    key: K,
    value: Profile[K]
  ) {
    setDraft((current) => ({
      ...current,
      [key]: value,
    }));
  }

  /* =======================================================
     PRODUCTIVITY STATS
  ======================================================= */

  const totalTasks = tasks.length;

  const completedTasks =
    tasks.filter(
      (task) => task.completed
    ).length;

  const pendingTasks =
    tasks.filter(
      (task) => !task.completed
    ).length;

  const completionRate =
    totalTasks === 0
      ? 0
      : Math.round(
          (completedTasks /
            totalTasks) *
            100
        );

  const totalFocusMinutes =
    focusSessions.reduce(
      (total, session) =>
        total +
        Number(
          session.minutes ??
            session.duration ??
            0
        ),
      0
    );

  const focusHours =
    Math.floor(
      totalFocusMinutes / 60
    );

  const remainingFocusMinutes =
    totalFocusMinutes % 60;

  const totalStudyTime =
    focusHours > 0
      ? `${focusHours}h ${remainingFocusMinutes}m`
      : `${remainingFocusMinutes}m`;

  /* =======================================================
     SUBJECT BREAKDOWN
  ======================================================= */

  const subjectStats = useMemo(() => {
    const map: Record<
      string,
      {
        total: number;
        completed: number;
      }
    > = {};

    tasks.forEach((task) => {
      const subject =
        task.subject?.trim() ||
        "General";

      if (!map[subject]) {
        map[subject] = {
          total: 0,
          completed: 0,
        };
      }

      map[subject].total += 1;

      if (task.completed) {
        map[subject].completed += 1;
      }
    });

    return Object.entries(map)
      .sort(
        (a, b) =>
          b[1].total -
          a[1].total
      )
      .slice(0, 5);
  }, [tasks]);

  /* =======================================================
     JOIN DATE
  ======================================================= */

  const joinedDate =
    profile.joined
      ? new Date(
          profile.joined
        ).toLocaleDateString(
          [],
          {
            month: "long",
            year: "numeric",
          }
        )
      : "Recently";

  /* =======================================================
     RETURN
  ======================================================= */

  return (
    <main className="mx-auto w-full max-w-6xl pb-16">
      {/* =================================================
          HERO PROFILE
      ================================================= */}

      <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-[#111c31] via-[#111827] to-[#0d1424] p-7 sm:p-10">
        <div className="absolute right-[-120px] top-[-120px] h-80 w-80 rounded-full bg-blue-500/10 blur-[110px]" />

        <div className="relative">
          <div className="flex flex-col gap-7 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-5">
              {/* AVATAR */}

              <div className="relative">
                <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-600 text-4xl font-black text-white shadow-2xl sm:h-28 sm:w-28 sm:text-5xl">
                  {getInitials(
                    profile.name
                  )}
                </div>

                <div className="absolute -bottom-2 -right-2 flex h-9 w-9 items-center justify-center rounded-full border-4 border-[#111827] bg-emerald-500 text-white">
                  <Check size={16} />
                </div>
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-blue-400">
                  Atlas • Profile
                </p>

                <h1 className="mt-2 text-3xl font-black text-white sm:text-4xl">
                  {profile.name}
                </h1>

                <p className="mt-2 text-sm text-slate-400 sm:text-base">
                  {profile.branch}
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-400">
                    {profile.semester}
                  </span>

                  <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
                    Active Student
                  </span>
                </div>
              </div>
            </div>

            {/* EDIT BUTTON */}

            {!editing ? (
              <button
                onClick={() =>
                  setEditing(true)
                }
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-[#0b101e] px-5 py-3 text-sm font-bold text-slate-300 transition hover:border-blue-500 hover:text-white"
              >
                <Edit3 size={17} />
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={cancelEdit}
                  className="flex items-center gap-2 rounded-xl border border-slate-700 px-4 py-3 text-sm font-semibold text-slate-400 hover:bg-slate-800 hover:text-white"
                >
                  <X size={17} />
                  Cancel
                </button>

                <button
                  onClick={saveProfile}
                  className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white hover:bg-blue-500"
                >
                  <Save size={17} />
                  Save
                </button>
              </div>
            )}
          </div>

          {profile.bio && (
            <p className="relative mt-7 max-w-3xl text-sm leading-6 text-slate-400">
              {profile.bio}
            </p>
          )}
        </div>
      </section>

      {/* =================================================
          QUICK STATS
      ================================================= */}

      <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <ProfileStat
          icon={
            <ListTodo size={20} />
          }
          label="Tasks Completed"
          value={completedTasks.toString()}
          extra={`${completionRate}% completion`}
        />

        <ProfileStat
          icon={
            <Clock3 size={20} />
          }
          label="Focus Time"
          value={totalStudyTime}
          extra="Total recorded"
        />

        <ProfileStat
          icon={
            <Target size={20} />
          }
          label="Tasks Pending"
          value={pendingTasks.toString()}
          extra="Still to conquer"
        />

        <ProfileStat
          icon={
            <TrendingUp size={20} />
          }
          label="Productivity"
          value={`${completionRate}%`}
          extra="Task completion"
        />
      </section>

      {/* =================================================
          EDIT PROFILE
      ================================================= */}

      {editing && (
        <section className="mt-6 rounded-3xl border border-blue-500/20 bg-[#111827] p-6 shadow-xl sm:p-7">
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
              <User size={20} />
            </div>

            <div>
              <h2 className="text-xl font-bold text-white">
                Edit Profile
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Keep your Atlas identity and
                academic information up to date.
              </p>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <ProfileInput
              label="Name"
              value={draft.name}
              placeholder="Your name"
              onChange={(value) =>
                updateDraft(
                  "name",
                  value
                )
              }
            />

            <ProfileInput
              label="Email"
              value={draft.email}
              placeholder="your@email.com"
              type="email"
              onChange={(value) =>
                updateDraft(
                  "email",
                  value
                )
              }
            />

            <ProfileInput
              label="College"
              value={draft.college}
              placeholder="Your college"
              onChange={(value) =>
                updateDraft(
                  "college",
                  value
                )
              }
            />

            <ProfileInput
              label="Location"
              value={draft.location}
              placeholder="City, Kerala"
              onChange={(value) =>
                updateDraft(
                  "location",
                  value
                )
              }
            />

            <ProfileSelect
              label="Branch"
              value={draft.branch}
              options={[
                "Electrical & Electronics Engineering",
                "Electronics & Communication Engineering",
                "Computer Science & Engineering",
                "Mechanical Engineering",
                "Civil Engineering",
                "Other",
              ]}
              onChange={(value) =>
                updateDraft(
                  "branch",
                  value
                )
              }
            />

            <ProfileSelect
              label="Semester"
              value={draft.semester}
              options={[
                "Semester 1",
                "Semester 2",
                "Semester 3",
                "Semester 4",
                "Semester 5",
                "Semester 6",
                "Semester 7",
                "Semester 8",
              ]}
              onChange={(value) =>
                updateDraft(
                  "semester",
                  value
                )
              }
            />

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-slate-300">
                Bio
              </label>

              <textarea
                value={draft.bio}
                onChange={(e) =>
                  updateDraft(
                    "bio",
                    e.target.value
                  )
                }
                rows={3}
                placeholder="Tell Atlas a little about yourself..."
                className="w-full resize-none rounded-xl border border-slate-800 bg-[#0b101e] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={saveProfile}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-500"
            >
              <Save size={17} />
              Save Profile
            </button>
          </div>
        </section>
      )}

      {/* =================================================
          PERSONAL INFORMATION
      ================================================= */}

      <section className="mt-6 rounded-3xl border border-slate-800 bg-[#111827] p-6 sm:p-7">
        <SectionHeader
          icon={<User size={20} />}
          title="Personal Information"
          description="Your Atlas identity."
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <InfoCard
            icon={<User size={17} />}
            label="Name"
            value={profile.name}
          />

          <InfoCard
            icon={<Mail size={17} />}
            label="Email"
            value={
              profile.email ||
              "Not added"
            }
          />

          <InfoCard
            icon={
              <MapPin size={17} />
            }
            label="Location"
            value={
              profile.location ||
              "Not added"
            }
          />

          <InfoCard
            icon={
              <CalendarDays size={17} />
            }
            label="Joined Atlas"
            value={joinedDate}
          />
        </div>
      </section>

      {/* =================================================
          ACADEMIC INFORMATION
      ================================================= */}

      <section className="mt-6 rounded-3xl border border-slate-800 bg-[#111827] p-6 sm:p-7">
        <SectionHeader
          icon={
            <GraduationCap size={20} />
          }
          title="Academic Information"
          description="Your engineering context inside Atlas."
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <InfoCard
            icon={
              <GraduationCap size={17} />
            }
            label="Program"
            value="BTech"
          />

          <InfoCard
            icon={
              <BookOpen size={17} />
            }
            label="Branch"
            value={profile.branch}
          />

          <InfoCard
            icon={
              <Building2 size={17} />
            }
            label="College"
            value={profile.college}
          />

          <InfoCard
            icon={
              <BarChart3 size={17} />
            }
            label="Current Semester"
            value={profile.semester}
          />
        </div>
      </section>

      {/* =================================================
          PRODUCTIVITY OVERVIEW
      ================================================= */}

      <section className="mt-6 rounded-3xl border border-slate-800 bg-[#111827] p-6 sm:p-7">
        <SectionHeader
          icon={
            <Activity size={20} />
          }
          title="Productivity Overview"
          description="Your Atlas activity at a glance."
        />

        <div className="grid gap-5 md:grid-cols-2">
          {/* TASK PROGRESS */}

          <div className="rounded-2xl border border-slate-800 bg-[#0b101e] p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-white">
                  Task Progress
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  {completedTasks} of{" "}
                  {totalTasks} completed
                </p>
              </div>

              <span className="text-2xl font-black text-blue-400">
                {completionRate}%
              </span>
            </div>

            <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all"
                style={{
                  width: `${completionRate}%`,
                }}
              />
            </div>
          </div>

          {/* FOCUS */}

          <div className="rounded-2xl border border-slate-800 bg-[#0b101e] p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                <Clock3 size={19} />
              </div>

              <div>
                <p className="text-sm font-bold text-white">
                  Focus Time
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Recorded study sessions
                </p>
              </div>
            </div>

            <p className="mt-5 text-3xl font-black text-white">
              {totalStudyTime}
            </p>
          </div>
        </div>
      </section>

      {/* =================================================
          SUBJECT ACTIVITY
      ================================================= */}

      <section className="mt-6 rounded-3xl border border-slate-800 bg-[#111827] p-6 sm:p-7">
        <SectionHeader
          icon={
            <BookOpen size={20} />
          }
          title="Academic Activity"
          description="Subjects appearing in your task workload."
        />

        {subjectStats.length === 0 ? (
          <EmptyState
            icon={
              <BookOpen size={24} />
            }
            title="No subject activity yet"
            description="Create tasks with subjects and Atlas will build your academic activity here."
          />
        ) : (
          <div className="space-y-4">
            {subjectStats.map(
              ([subject, stats]) => {
                const percentage =
                  stats.total === 0
                    ? 0
                    : Math.round(
                        (stats.completed /
                          stats.total) *
                          100
                      );

                return (
                  <div
                    key={subject}
                    className="rounded-2xl border border-slate-800 bg-[#0b101e] p-4"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-white">
                          {subject}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {stats.completed}{" "}
                          completed •{" "}
                          {stats.total} total
                        </p>
                      </div>

                      <span className="shrink-0 text-sm font-bold text-blue-400">
                        {percentage}%
                      </span>
                    </div>

                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800">
                      <div
                        className="h-full rounded-full bg-blue-500 transition-all"
                        style={{
                          width: `${percentage}%`,
                        }}
                      />
                    </div>
                  </div>
                );
              }
            )}
          </div>
        )}
      </section>

      {/* =================================================
          ATLAS IDENTITY
      ================================================= */}

      <section className="relative mt-6 overflow-hidden rounded-3xl border border-blue-500/20 bg-gradient-to-br from-blue-500/10 via-indigo-500/5 to-transparent p-6 sm:p-7">
        <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-blue-500/10 blur-[80px]" />

        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg">
              <Zap size={22} />
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-blue-400">
                Atlas Identity
              </p>

              <h3 className="mt-1 text-lg font-bold text-white">
                Your engineering workspace.
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Built around your academic journey,
                one semester at a time.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-emerald-400">
            <ShieldCheck size={15} />
            Local profile
          </div>
        </div>
      </section>

      {/* =================================================
          FOOTER
      ================================================= */}

      <div className="mt-8 text-center">
        <p className="text-xs text-slate-600">
          Atlas Engineering Workspace
        </p>

        <p className="mt-1 text-[11px] text-slate-700">
          Your data stays in this browser for now.
        </p>
      </div>

      {/* SAVED TOAST */}

      {saved && (
        <div className="fixed bottom-6 right-6 z-[100] flex items-center gap-3 rounded-2xl border border-emerald-500/20 bg-[#0b101e] px-5 py-3 shadow-2xl">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
            <Check size={17} />
          </div>

          <div>
            <p className="text-sm font-bold text-white">
              Profile saved
            </p>

            <p className="text-xs text-slate-500">
              Atlas has been updated.
            </p>
          </div>
        </div>
      )}
    </main>
  );
}

/* =========================================================
   PROFILE STAT
========================================================= */

function ProfileStat({
  icon,
  label,
  value,
  extra,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  extra: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-[#111827] p-5">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
          {icon}
        </div>

        <p className="text-xs font-semibold text-slate-500">
          {label}
        </p>
      </div>

      <p className="mt-4 text-2xl font-black text-white">
        {value}
      </p>

      <p className="mt-1 text-xs text-slate-600">
        {extra}
      </p>
    </div>
  );
}

/* =========================================================
   SECTION HEADER
========================================================= */

function SectionHeader({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-6 flex items-start gap-4">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
        {icon}
      </div>

      <div>
        <h2 className="text-xl font-bold text-white">
          {title}
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          {description}
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   INFO CARD
========================================================= */

function InfoCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-slate-800 bg-[#0b101e] p-4">
      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-800 text-slate-400">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
          {label}
        </p>

        <p className="mt-1 break-words text-sm font-semibold text-slate-300">
          {value}
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   INPUT
========================================================= */

function ProfileInput({
  label,
  value,
  placeholder,
  type = "text",
  onChange,
}: {
  label: string;
  value: string;
  placeholder: string;
  type?: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-300">
        {label}
      </label>

      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="w-full rounded-xl border border-slate-800 bg-[#0b101e] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
      />
    </div>
  );
}

/* =========================================================
   SELECT
========================================================= */

function ProfileSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-300">
        {label}
      </label>

      <select
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="w-full rounded-xl border border-slate-800 bg-[#0b101e] px-4 py-3 text-sm text-white outline-none focus:border-blue-500"
      >
        {options.map((option) => (
          <option
            key={option}
            value={option}
          >
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

/* =========================================================
   EMPTY STATE
========================================================= */

function EmptyState({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-800 bg-[#0b101e] p-8 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
        {icon}
      </div>

      <h3 className="mt-4 text-sm font-bold text-white">
        {title}
      </h3>

      <p className="mx-auto mt-2 max-w-md text-xs leading-5 text-slate-600">
        {description}
      </p>
    </div>
  );
}

/* =========================================================
   INITIALS
========================================================= */

function getInitials(name: string) {
  const cleanName =
    name.trim();

  if (!cleanName) return "S";

  const parts =
    cleanName.split(/\s+/);

  if (parts.length === 1) {
    return parts[0]
      .slice(0, 2)
      .toUpperCase();
  }

  return (
    parts[0][0] +
    parts[parts.length - 1][0]
  ).toUpperCase();
}