"use client";

import { useEffect, useState } from "react";
import {
  User,
  GraduationCap,
  Bell,
  BookOpen,
  ListTodo,
  Monitor,
  Download,
  Trash2,
  RotateCcw,
  Save,
  ShieldCheck,
  ChevronDown,
  Check,
  AlertTriangle,
} from "lucide-react";

type Settings = {
  name: string;
  branch: string;
  semester: string;
  college: string;

  notifications: boolean;
  deadlineAlerts: boolean;
  studyReminders: boolean;

  defaultStudyMinutes: number;
  defaultBreakMinutes: number;

  defaultPriority: "low" | "medium" | "high";
  showCompletedTasks: boolean;

  appearance: "dark" | "system";
};

const SETTINGS_KEY = "atlas-settings";

const defaultSettings: Settings = {
  name: "Student",
  branch: "Electrical & Electronics Engineering",
  semester: "Semester 1",
  college: "Government Engineering College Thrissur",

  notifications: true,
  deadlineAlerts: true,
  studyReminders: true,

  defaultStudyMinutes: 50,
  defaultBreakMinutes: 10,

  defaultPriority: "medium",
  showCompletedTasks: true,

  appearance: "dark",
};

export default function SettingsPage() {
  const [settings, setSettings] =
    useState<Settings>(defaultSettings);

  const [saved, setSaved] = useState(false);
  const [showClearConfirm, setShowClearConfirm] =
    useState(false);

  useEffect(() => {
    const stored =
      localStorage.getItem(SETTINGS_KEY);

    if (stored) {
      try {
        setSettings({
          ...defaultSettings,
          ...JSON.parse(stored),
        });
      } catch {
        setSettings(defaultSettings);
      }
    }
  }, []);

  function updateSetting<K extends keyof Settings>(
    key: K,
    value: Settings[K]
  ) {
    setSettings((current) => ({
      ...current,
      [key]: value,
    }));

    setSaved(false);
  }

  function saveSettings() {
    localStorage.setItem(
      SETTINGS_KEY,
      JSON.stringify(settings)
    );

    /*
      Notify other Atlas components that settings changed.
      Components can listen for this event later.
    */
    window.dispatchEvent(
      new CustomEvent("atlas-settings-changed", {
        detail: settings,
      })
    );

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  }

  function resetSettings() {
    const confirmed = window.confirm(
      "Reset all Atlas settings to their default values?"
    );

    if (!confirmed) return;

    setSettings(defaultSettings);

    localStorage.setItem(
      SETTINGS_KEY,
      JSON.stringify(defaultSettings)
    );

    window.dispatchEvent(
      new CustomEvent("atlas-settings-changed", {
        detail: defaultSettings,
      })
    );
  }

  function clearAtlasData() {
    localStorage.removeItem("atlas-tasks");
    localStorage.removeItem("atlas-focus-sessions");
    localStorage.removeItem("atlas-focus-history");

    setShowClearConfirm(false);

    alert(
      "Atlas productivity data has been cleared."
    );
  }

  function exportData() {
    const data = {
      exportedAt: new Date().toISOString(),
      settings,

      tasks:
        JSON.parse(
          localStorage.getItem("atlas-tasks") ||
            "[]"
        ),

      focusSessions:
        JSON.parse(
          localStorage.getItem(
            "atlas-focus-sessions"
          ) || "[]"
        ),

      focusHistory:
        JSON.parse(
          localStorage.getItem(
            "atlas-focus-history"
          ) || "[]"
        ),
    };

    const blob = new Blob(
      [JSON.stringify(data, null, 2)],
      {
        type: "application/json",
      }
    );

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;
    link.download = `atlas-backup-${new Date()
      .toISOString()
      .slice(0, 10)}.json`;

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  }

  return (
    <main className="mx-auto w-full max-w-6xl pb-16">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-[#111c31] via-[#111827] to-[#0d1424] p-7 sm:p-10">
        <div className="absolute right-[-100px] top-[-100px] h-72 w-72 rounded-full bg-blue-500/10 blur-[100px]" />

        <div className="relative">
          <p className="text-xs uppercase tracking-[0.3em] text-blue-400">
            Atlas • Workspace
          </p>

          <h1 className="mt-3 text-4xl font-black text-white sm:text-5xl">
            Settings
          </h1>

          <p className="mt-4 max-w-2xl text-slate-400">
            Customize your Atlas workspace, study
            preferences, productivity tools, and
            personal information.
          </p>
        </div>
      </section>

      {/* =====================================================
          SAVE BAR
      ===================================================== */}

      <div className="sticky top-4 z-30 mt-6 flex items-center justify-between rounded-2xl border border-slate-800 bg-[#0b101e]/95 p-4 shadow-xl backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
            <ShieldCheck size={18} />
          </div>

          <div>
            <p className="text-sm font-semibold text-white">
              Atlas Settings
            </p>

            <p className="hidden text-xs text-slate-500 sm:block">
              Your preferences are stored locally.
            </p>
          </div>
        </div>

        <button
          onClick={saveSettings}
          className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition ${
            saved
              ? "bg-emerald-600 text-white"
              : "bg-blue-600 text-white hover:bg-blue-500"
          }`}
        >
          {saved ? (
            <>
              <Check size={17} />
              Saved
            </>
          ) : (
            <>
              <Save size={17} />
              Save Changes
            </>
          )}
        </button>
      </div>

      {/* =====================================================
          PROFILE
      ===================================================== */}

      <SettingsSection
        icon={<User size={20} />}
        title="Profile"
        description="Basic information shown throughout Atlas."
      >
        <div className="grid gap-5 md:grid-cols-2">
          <InputField
            label="Your Name"
            value={settings.name}
            onChange={(value) =>
              updateSetting("name", value)
            }
            placeholder="Enter your name"
          />

          <InputField
            label="College"
            value={settings.college}
            onChange={(value) =>
              updateSetting("college", value)
            }
            placeholder="Your college"
          />

          <SelectField
            label="Branch"
            value={settings.branch}
            onChange={(value) =>
              updateSetting("branch", value)
            }
            options={[
              "Electrical & Electronics Engineering",
              "Electronics & Communication Engineering",
              "Computer Science & Engineering",
              "Mechanical Engineering",
              "Civil Engineering",
              "Other",
            ]}
          />

          <SelectField
            label="Current Semester"
            value={settings.semester}
            onChange={(value) =>
              updateSetting("semester", value)
            }
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
          />
        </div>
      </SettingsSection>

      {/* =====================================================
          ACADEMIC
      ===================================================== */}

      <SettingsSection
        icon={<GraduationCap size={20} />}
        title="Academic Preferences"
        description="Tell Atlas how to organize your academic workspace."
      >
        <div className="space-y-4">
          <PreferenceRow
            title="Default course"
            description="Used when Atlas needs to determine your academic context."
          >
            <span className="rounded-xl bg-slate-800 px-4 py-2 text-sm text-slate-300">
              BTech
            </span>
          </PreferenceRow>

          <PreferenceRow
            title="Semester"
            description="Your current semester."
          >
            <SelectSmall
              value={settings.semester}
              onChange={(value) =>
                updateSetting("semester", value)
              }
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
            />
          </PreferenceRow>
        </div>
      </SettingsSection>

      {/* =====================================================
          NOTIFICATIONS
      ===================================================== */}

      <SettingsSection
        icon={<Bell size={20} />}
        title="Notifications"
        description="Control productivity and deadline reminders."
      >
        <div className="space-y-1">
          <ToggleRow
            title="Notifications"
            description="Allow Atlas to show productivity reminders."
            checked={settings.notifications}
            onChange={(value) =>
              updateSetting("notifications", value)
            }
          />

          <ToggleRow
            title="Deadline alerts"
            description="Remind you about upcoming task deadlines."
            checked={settings.deadlineAlerts}
            onChange={(value) =>
              updateSetting(
                "deadlineAlerts",
                value
              )
            }
          />

          <ToggleRow
            title="Study reminders"
            description="Remind you about planned study sessions."
            checked={settings.studyReminders}
            onChange={(value) =>
              updateSetting(
                "studyReminders",
                value
              )
            }
          />
        </div>
      </SettingsSection>

      {/* =====================================================
          FOCUS
      ===================================================== */}

      <SettingsSection
        icon={<BookOpen size={20} />}
        title="Focus Study"
        description="Configure the default settings for your study timer."
      >
        <div className="grid gap-5 md:grid-cols-2">
          <NumberField
            label="Study session"
            description="Default focus duration."
            value={settings.defaultStudyMinutes}
            onChange={(value) =>
              updateSetting(
                "defaultStudyMinutes",
                value
              )
            }
          />

          <NumberField
            label="Break duration"
            description="Default break after a study session."
            value={settings.defaultBreakMinutes}
            onChange={(value) =>
              updateSetting(
                "defaultBreakMinutes",
                value
              )
            }
          />
        </div>
      </SettingsSection>

      {/* =====================================================
          TASKS
      ===================================================== */}

      <SettingsSection
        icon={<ListTodo size={20} />}
        title="Task Preferences"
        description="Customize how Atlas handles your tasks."
      >
        <div className="space-y-1">
          <PreferenceRow
            title="Default priority"
            description="Priority automatically assigned to new tasks."
          >
            <SelectSmall
              value={settings.defaultPriority}
              onChange={(value) =>
                updateSetting(
                  "defaultPriority",
                  value as Settings["defaultPriority"]
                )
              }
              options={[
                "low",
                "medium",
                "high",
              ]}
            />
          </PreferenceRow>

          <ToggleRow
            title="Show completed tasks"
            description="Keep completed tasks visible in your task list."
            checked={settings.showCompletedTasks}
            onChange={(value) =>
              updateSetting(
                "showCompletedTasks",
                value
              )
            }
          />
        </div>
      </SettingsSection>

      {/* =====================================================
          APPEARANCE
      ===================================================== */}

      <SettingsSection
        icon={<Monitor size={20} />}
        title="Appearance"
        description="Choose how Atlas should look."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <AppearanceCard
            active={
              settings.appearance === "dark"
            }
            title="Dark"
            description="Atlas dark workspace"
            onClick={() =>
              updateSetting(
                "appearance",
                "dark"
              )
            }
          >
            <div className="h-20 rounded-xl border border-slate-700 bg-[#070b14] p-3">
              <div className="h-2 w-16 rounded bg-blue-500" />
              <div className="mt-3 h-2 w-24 rounded bg-slate-700" />
              <div className="mt-2 h-2 w-20 rounded bg-slate-800" />
            </div>
          </AppearanceCard>

          <AppearanceCard
            active={
              settings.appearance === "system"
            }
            title="System"
            description="Follow your device preference"
            onClick={() =>
              updateSetting(
                "appearance",
                "system"
              )
            }
          >
            <div className="h-20 rounded-xl border border-slate-700 bg-gradient-to-r from-[#070b14] to-slate-200 p-3">
              <div className="h-2 w-16 rounded bg-blue-500" />
              <div className="mt-3 h-2 w-24 rounded bg-slate-500/60" />
              <div className="mt-2 h-2 w-20 rounded bg-slate-500/40" />
            </div>
          </AppearanceCard>
        </div>
      </SettingsSection>

      {/* =====================================================
          DATA
      ===================================================== */}

      <SettingsSection
        icon={<Download size={20} />}
        title="Data & Privacy"
        description="Manage your Atlas productivity data."
      >
        <div className="space-y-4">
          <ActionRow
            icon={<Download size={18} />}
            title="Export Atlas data"
            description="Download your settings, tasks, and focus data as a backup."
            buttonText="Export"
            onClick={exportData}
          />

          <ActionRow
            icon={<Trash2 size={18} />}
            title="Clear productivity data"
            description="Delete locally stored tasks and focus history."
            buttonText="Clear Data"
            danger
            onClick={() =>
              setShowClearConfirm(true)
            }
          />
        </div>
      </SettingsSection>

      {/* =====================================================
          RESET
      ===================================================== */}

      <section className="mt-8 rounded-3xl border border-amber-500/20 bg-amber-500/5 p-6 sm:p-7">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
              <RotateCcw size={20} />
            </div>

            <div>
              <h3 className="font-bold text-white">
                Reset Settings
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Restore Atlas preferences to their
                default values.
              </p>
            </div>
          </div>

          <button
            onClick={resetSettings}
            className="rounded-xl border border-amber-500/30 px-4 py-2.5 text-sm font-semibold text-amber-400 transition hover:bg-amber-500/10"
          >
            Reset
          </button>
        </div>
      </section>

      {/* =====================================================
          CLEAR DATA CONFIRMATION
      ===================================================== */}

      {showClearConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-[#0b101e] p-7 shadow-2xl">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-400">
              <AlertTriangle size={23} />
            </div>

            <h2 className="mt-5 text-xl font-bold text-white">
              Clear productivity data?
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              This will remove your saved tasks and
              focus-session history from this browser.
              Your profile settings will remain.
            </p>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() =>
                  setShowClearConfirm(false)
                }
                className="flex-1 rounded-xl border border-slate-800 px-4 py-3 font-semibold text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                Cancel
              </button>

              <button
                onClick={clearAtlasData}
                className="flex-1 rounded-xl bg-rose-600 px-4 py-3 font-bold text-white hover:bg-rose-500"
              >
                Clear Data
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

/* =========================================================
   SECTION
========================================================= */

function SettingsSection({
  icon,
  title,
  description,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-6 rounded-3xl border border-slate-800 bg-[#111827] p-6 sm:p-7">
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

      {children}
    </section>
  );
}

/* =========================================================
   INPUT
========================================================= */

function InputField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-300">
        {label}
      </label>

      <input
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-800 bg-[#0b101e] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
      />
    </div>
  );
}

/* =========================================================
   SELECT
========================================================= */

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-300">
        {label}
      </label>

      <div className="relative">
        <select
          value={value}
          onChange={(e) =>
            onChange(e.target.value)
          }
          className="w-full appearance-none rounded-xl border border-slate-800 bg-[#0b101e] px-4 py-3 pr-10 text-sm text-white outline-none transition focus:border-blue-500"
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

        <ChevronDown
          size={16}
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
        />
      </div>
    </div>
  );
}

/* =========================================================
   SMALL SELECT
========================================================= */

function SelectSmall({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <select
      value={value}
      onChange={(e) =>
        onChange(e.target.value)
      }
      className="rounded-xl border border-slate-800 bg-[#0b101e] px-3 py-2 text-sm text-white outline-none focus:border-blue-500"
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
  );
}

/* =========================================================
   NUMBER
========================================================= */

function NumberField({
  label,
  description,
  value,
  onChange,
}: {
  label: string;
  description: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-[#0b101e] p-5">
      <p className="text-sm font-semibold text-white">
        {label}
      </p>

      <p className="mt-1 text-xs text-slate-500">
        {description}
      </p>

      <div className="mt-4 flex items-center gap-3">
        <input
          type="number"
          min={1}
          max={240}
          value={value}
          onChange={(e) =>
            onChange(
              Math.max(
                1,
                Number(e.target.value)
              )
            )
          }
          className="w-28 rounded-xl border border-slate-800 bg-[#111827] px-4 py-2.5 text-white outline-none focus:border-blue-500"
        />

        <span className="text-sm text-slate-500">
          minutes
        </span>
      </div>
    </div>
  );
}

/* =========================================================
   TOGGLE
========================================================= */

function ToggleRow({
  title,
  description,
  checked,
  onChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-5 rounded-2xl p-4 transition hover:bg-slate-900/40">
      <div>
        <p className="text-sm font-semibold text-white">
          {title}
        </p>

        <p className="mt-1 text-xs leading-5 text-slate-500">
          {description}
        </p>
      </div>

      <button
        onClick={() => onChange(!checked)}
        className={`relative h-7 w-12 shrink-0 rounded-full transition ${
          checked
            ? "bg-blue-600"
            : "bg-slate-700"
        }`}
        aria-label={title}
      >
        <span
          className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${
            checked
              ? "left-6"
              : "left-1"
          }`}
        />
      </button>
    </div>
  );
}

/* =========================================================
   PREFERENCE ROW
========================================================= */

function PreferenceRow({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl p-4 transition hover:bg-slate-900/40 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm font-semibold text-white">
          {title}
        </p>

        <p className="mt-1 text-xs text-slate-500">
          {description}
        </p>
      </div>

      {children}
    </div>
  );
}

/* =========================================================
   APPEARANCE
========================================================= */

function AppearanceCard({
  active,
  title,
  description,
  children,
  onClick,
}: {
  active: boolean;
  title: string;
  description: string;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-2xl border p-4 text-left transition ${
        active
          ? "border-blue-500 bg-blue-500/5"
          : "border-slate-800 bg-[#0b101e] hover:border-slate-700"
      }`}
    >
      {children}

      <div className="mt-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-bold text-white">
            {title}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            {description}
          </p>
        </div>

        {active && (
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white">
            <Check size={14} />
          </div>
        )}
      </div>
    </button>
  );
}

/* =========================================================
   ACTION ROW
========================================================= */

function ActionRow({
  icon,
  title,
  description,
  buttonText,
  onClick,
  danger = false,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  buttonText: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-slate-800 bg-[#0b101e] p-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex gap-4">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
            danger
              ? "bg-rose-500/10 text-rose-400"
              : "bg-blue-500/10 text-blue-400"
          }`}
        >
          {icon}
        </div>

        <div>
          <p className="text-sm font-semibold text-white">
            {title}
          </p>

          <p className="mt-1 max-w-xl text-xs leading-5 text-slate-500">
            {description}
          </p>
        </div>
      </div>

      <button
        onClick={onClick}
        className={`shrink-0 rounded-xl border px-4 py-2.5 text-sm font-bold transition ${
          danger
            ? "border-rose-500/30 text-rose-400 hover:bg-rose-500/10"
            : "border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
        }`}
      >
        {buttonText}
      </button>
    </div>
  );
}