'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { compounds, synergyScore, calculateDefenseProfile } from '@/lib/data';
import { stackPresets, type PresetKey } from '@/lib/presets';
import { readStackFromSearch } from '@/lib/stack-url';
import { exportLabsCsv as labsToCsv, type LabEntry } from '@/lib/labs';
import {
  type HallmarkNotesMap,
  type HallmarkPersonalEntry,
  DEFAULT_HALLMARK_ENTRY,
} from '@/lib/hallmark-notes';
import {
  STORAGE_KEYS,
  getPrivacyMode,
  setPrivacyMode as persistPrivacyMode,
  readStorageItem,
  writeStorageItem,
  purgeAllHealthData,
  sanitizeLabEntries,
  hasPrivacyConsent,
  setPrivacyConsent,
  type PrivacyStorageMode,
} from '@/lib/privacy';
import {
  detectNewMilestones,
  type UserMilestone,
} from '@/lib/milestone-engine';
import { validatePlatformImport, type ImportResult } from '@/lib/import-validation';
export interface QuizRecord {
  goal: string;
  concern?: string;
  age?: string;
  experience?: string;
  budget?: string;
  safety?: string[];
  preset: string;
  completedAt: string;
}


export interface Profile {
  age: number;
  stress: number;
  sleep: number;
  exercise: number;
  scanned: boolean;
}

interface PlatformContextValue {
  selected: string[];
  toggle: (id: string) => void;
  setSelected: (ids: string[]) => void;
  applyPreset: (key: PresetKey) => void;
  score: number;
  selectedCompounds: typeof compounds;
  shareUrl: string;
  saveStack: () => void;
  saved: boolean;
  profile: Profile;
  setProfile: (patch: Partial<Profile>) => void;
  defenseProfile: ReturnType<typeof calculateDefenseProfile>;
  labs: LabEntry[];
  addLab: (markerId: string, value: number, date: string) => void;
  importLabs: (rows: { markerId: string; value: number; date: string }[]) => number;
  removeLab: (id: string) => void;
  clearLabs: () => void;
  exportLabsCsv: () => string;
  checklist: string[];
  toggleChecklist: (step: string) => void;
  hallmarkNotes: HallmarkNotesMap;
  setHallmarkNote: (hallmarkId: string, patch: Partial<HallmarkPersonalEntry>) => void;
  exportAll: () => string;
  importAll: (json: string) => ImportResult;
  milestones: UserMilestone[];
  addMilestone: (milestone: UserMilestone) => void;
  privacyMode: PrivacyStorageMode;
  setPrivacyMode: (mode: PrivacyStorageMode) => void;
  purgeAllHealthData: () => void;
  privacyConsent: boolean;
  acceptPrivacyConsent: () => void;
  quizResult: QuizRecord | null;
  setQuizResult: (record: QuizRecord) => void;
}

const PlatformContext = createContext<PlatformContextValue | null>(null);

const DEFAULT_PROFILE: Profile = {
  age: 48,
  stress: 55,
  sleep: 60,
  exercise: 45,
  scanned: false,
};

function readStackFromUrl(): string[] | null {
  if (typeof window === 'undefined') return null;
  return readStackFromSearch(window.location.search);
}

export function PlatformProvider({ children }: { children: ReactNode }) {
  // First-run visitors start with a clean slate — no pre-built stack, no fake
  // synergy score or hallmark coverage. State is populated only from a shared
  // URL or the visitor's own saved data during hydration below.
  const [selected, setSelectedState] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [profile, setProfileState] = useState<Profile>(DEFAULT_PROFILE);
  const [labs, setLabs] = useState<LabEntry[]>([]);
  const [checklist, setChecklist] = useState<string[]>([]);
  const [hallmarkNotes, setHallmarkNotesState] = useState<HallmarkNotesMap>({});
  const [milestones, setMilestones] = useState<UserMilestone[]>([]);
  const [privacyMode, setPrivacyModeState] = useState<PrivacyStorageMode>('local');
  const [privacyConsent, setPrivacyConsentState] = useState(false);
  const [prevLabsCount, setPrevLabsCount] = useState(0);
  const [quizResult, setQuizResultState] = useState<QuizRecord | null>(null);

  // One-time hydration from URL + client-only storage after mount; neither is available
  // during SSR, so the initial client render must match the server before these apply.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const fromUrl = readStackFromUrl();
    const mode = getPrivacyMode();
    setPrivacyModeState(mode);

    const stackRaw = readStorageItem<string[]>(STORAGE_KEYS.stack, [], mode);
    const profileRaw = readStorageItem<Profile | null>(STORAGE_KEYS.profile, null, mode);
    const labsRaw = readStorageItem<LabEntry[]>(STORAGE_KEYS.labs, [], mode);
    const checklistRaw = readStorageItem<string[]>(STORAGE_KEYS.checklist, [], mode);
    const notesRaw = readStorageItem<HallmarkNotesMap>(STORAGE_KEYS.hallmarkNotes, {}, mode);
    const milestonesRaw = readStorageItem<UserMilestone[]>(STORAGE_KEYS.milestones, [], mode);

    if (fromUrl) setSelectedState(fromUrl);
    else if (stackRaw.length) {
      setSelectedState(stackRaw.filter((id) => compounds.some((c) => c.id === id)));
    }
    if (profileRaw) setProfileState({ ...DEFAULT_PROFILE, ...profileRaw });
    setLabs(sanitizeLabEntries(labsRaw));
    if (checklistRaw.length) setChecklist(checklistRaw);
    if (Object.keys(notesRaw).length) setHallmarkNotesState(notesRaw);
    if (milestonesRaw.length) setMilestones(milestonesRaw);
    setPrevLabsCount(sanitizeLabEntries(labsRaw).length);
    setPrivacyConsentState(hasPrivacyConsent());
    const quizRaw = readStorageItem<QuizRecord | null>(STORAGE_KEYS.quizResult, null, mode);
    if (quizRaw) setQuizResultState(quizRaw);
    setHydrated(true);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  const persistMilestones = useCallback(
    (next: UserMilestone[]) => {
      setMilestones(next);
      writeStorageItem(STORAGE_KEYS.milestones, next, privacyMode);
    },
    [privacyMode],
  );

  const addMilestone = useCallback(
    (milestone: UserMilestone) => {
      setMilestones((prev) => {
        if (prev.some((m) => m.kind === milestone.kind)) return prev;
        const next = [...prev, milestone];
        writeStorageItem(STORAGE_KEYS.milestones, next, privacyMode);
        return next;
      });
    },
    [privacyMode],
  );

  const runMilestoneDetection = useCallback(
    (stack: string[], prof: Profile, labList: LabEntry[], labsBefore: number) => {
      if (!hydrated) return;
      setMilestones((prev) => {
        const earned = detectNewMilestones({
          selected: stack,
          profile: prof,
          labs: labList,
          prevLabsCount: labsBefore,
          existing: prev,
        });
        if (earned.length === 0) return prev;
        const kinds = new Set(prev.map((m) => m.kind));
        const fresh = earned.filter((m) => !kinds.has(m.kind));
        if (fresh.length === 0) return prev;
        const next = [...prev, ...fresh];
        writeStorageItem(STORAGE_KEYS.milestones, next, privacyMode);
        return next;
      });
    },
    [hydrated, privacyMode],
  );

  const syncUrl = useCallback((ids: string[]) => {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    url.searchParams.set('stack', ids.join(','));
    window.history.replaceState({}, '', url.toString());
  }, []);

  const persistLabs = useCallback(
    (next: LabEntry[]) => {
      setLabs(next);
      writeStorageItem(STORAGE_KEYS.labs, next, privacyMode);
    },
    [privacyMode],
  );

  const setSelected = useCallback(
    (ids: string[]) => {
      setSelectedState(ids);
      if (hydrated) {
        syncUrl(ids);
        writeStorageItem(STORAGE_KEYS.stack, ids, privacyMode);
        queueMicrotask(() => runMilestoneDetection(ids, profile, labs, prevLabsCount));
      }
    },
    [hydrated, syncUrl, privacyMode, profile, labs, prevLabsCount, runMilestoneDetection],
  );

  const toggle = useCallback(
    (id: string) => {
      setSelected(selected.includes(id) ? selected.filter((x) => x !== id) : [...selected, id]);
    },
    [selected, setSelected],
  );

  const applyPreset = useCallback(
    (key: PresetKey) => setSelected([...stackPresets[key].ids]),
    [setSelected],
  );

  const saveStack = useCallback(() => {
    writeStorageItem(STORAGE_KEYS.stack, selected, privacyMode);
    syncUrl(selected);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }, [selected, syncUrl, privacyMode]);

  const setProfile = useCallback(
    (patch: Partial<Profile>) => {
      setProfileState((prev) => {
        const next = { ...prev, ...patch };
        writeStorageItem(STORAGE_KEYS.profile, next, privacyMode);
        if (patch.scanned) {
          queueMicrotask(() => runMilestoneDetection(selected, next, labs, prevLabsCount));
        }
        return next;
      });
    },
    [privacyMode, selected, labs, prevLabsCount, runMilestoneDetection],
  );

  const addLab = useCallback(
    (markerId: string, value: number, date: string) => {
      const before = labs.length;
      const next = [...labs, { id: crypto.randomUUID(), markerId, value, date }];
      persistLabs(next);
      setPrevLabsCount(before);
      runMilestoneDetection(selected, profile, next, before);
    },
    [labs, persistLabs, selected, profile, runMilestoneDetection],
  );

  const importLabs = useCallback(
    (rows: { markerId: string; value: number; date: string }[]) => {
      const before = labs.length;
      const newEntries = rows.map((r) => ({
        id: crypto.randomUUID(),
        markerId: r.markerId,
        value: r.value,
        date: r.date,
      }));
      const next = [...labs, ...newEntries];
      persistLabs(next);
      setPrevLabsCount(before);
      runMilestoneDetection(selected, profile, next, before);
      return newEntries.length;
    },
    [labs, persistLabs, selected, profile, runMilestoneDetection],
  );

  const removeLab = useCallback(
    (id: string) => persistLabs(labs.filter((e) => e.id !== id)),
    [labs, persistLabs],
  );

  const clearLabs = useCallback(() => persistLabs([]), [persistLabs]);

  const exportLabsCsv = useCallback(() => labsToCsv(labs), [labs]);

  const setHallmarkNote = useCallback((hallmarkId: string, patch: Partial<HallmarkPersonalEntry>) => {
    setHallmarkNotesState((prev) => {
      const next = {
        ...prev,
        [hallmarkId]: {
          ...DEFAULT_HALLMARK_ENTRY,
          ...prev[hallmarkId],
          ...patch,
          updatedAt: new Date().toISOString(),
        },
      };
      writeStorageItem(STORAGE_KEYS.hallmarkNotes, next, privacyMode);
      return next;
    });
  }, [privacyMode]);

  const toggleChecklist = useCallback(
    (step: string) => {
      setChecklist((prev) => {
        const next = prev.includes(step) ? prev.filter((s) => s !== step) : [...prev, step];
        writeStorageItem(STORAGE_KEYS.checklist, next, privacyMode);
        return next;
      });
    },
    [privacyMode],
  );

  const exportAll = useCallback(
    () =>
      JSON.stringify(
        {
          stack: selected,
          profile,
          labs,
          checklist,
          hallmarkNotes,
          milestones,
          exportedAt: new Date().toISOString(),
        },
        null,
        2,
      ),
    [selected, profile, labs, checklist, hallmarkNotes, milestones],
  );

  const importAll = useCallback(
    (json: string): ImportResult => {
      let parsed: unknown;
      try {
        parsed = JSON.parse(json);
      } catch {
        return { ok: false, errors: ['Invalid JSON'] };
      }

      const result = validatePlatformImport(parsed);
      if (!result.ok) return result;

      const { data, warnings } = result;

      if (data.stack) setSelected(data.stack);
      if (data.profile) {
        const next = { ...DEFAULT_PROFILE, ...data.profile };
        setProfileState(next);
        writeStorageItem(STORAGE_KEYS.profile, next, privacyMode);
      }
      if (data.labs) persistLabs(data.labs);
      if (data.checklist) {
        setChecklist(data.checklist);
        writeStorageItem(STORAGE_KEYS.checklist, data.checklist, privacyMode);
      }
      if (data.hallmarkNotes) {
        setHallmarkNotesState(data.hallmarkNotes);
        writeStorageItem(STORAGE_KEYS.hallmarkNotes, data.hallmarkNotes, privacyMode);
      }
      if (data.milestones) persistMilestones(data.milestones);

      return { ok: true, data, warnings };
    },
    [setSelected, persistLabs, persistMilestones, privacyMode],
  );

  const setPrivacyMode = useCallback((mode: PrivacyStorageMode) => {
    persistPrivacyMode(mode);
    setPrivacyModeState(mode);
  }, []);

  const handlePurgeAll = useCallback(() => {
    purgeAllHealthData();
    setSelectedState([]);
    setProfileState(DEFAULT_PROFILE);
    setLabs([]);
    setChecklist([]);
    setHallmarkNotesState({});
    setMilestones([]);
    setPrevLabsCount(0);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.delete('stack');
      window.history.replaceState({}, '', url.toString());
    }
  }, []);

  const acceptPrivacyConsent = useCallback(() => {
    setPrivacyConsent(true);
    setPrivacyConsentState(true);
  }, []);

  const setQuizResult = useCallback(
    (record: QuizRecord) => {
      setQuizResultState(record);
      writeStorageItem(STORAGE_KEYS.quizResult, record, privacyMode);
    },
    [privacyMode],
  );

  const defenseProfile = useMemo(
    () => calculateDefenseProfile(profile.age, profile.stress, profile.sleep, profile.exercise),
    [profile],
  );

  const selectedCompounds = useMemo(
    () => compounds.filter((c) => selected.includes(c.id)),
    [selected],
  );

  const shareUrl = useMemo(() => {
    if (typeof window === 'undefined') return `https://tnic.help/?stack=${selected.join(',')}`;
    const url = new URL(window.location.href);
    url.searchParams.set('stack', selected.join(','));
    return url.toString();
  }, [selected]);

  const value: PlatformContextValue = {
    selected,
    toggle,
    setSelected,
    applyPreset,
    score: synergyScore(selected),
    selectedCompounds,
    shareUrl,
    saveStack,
    saved,
    profile,
    setProfile,
    defenseProfile,
    labs,
    addLab,
    importLabs,
    removeLab,
    clearLabs,
    exportLabsCsv,
    checklist,
    toggleChecklist,
    hallmarkNotes,
    setHallmarkNote,
    exportAll,
    importAll,
    milestones,
    addMilestone,
    privacyMode,
    setPrivacyMode,
    purgeAllHealthData: handlePurgeAll,
    privacyConsent,
    acceptPrivacyConsent,
    quizResult,
    setQuizResult,
  };

  return <PlatformContext.Provider value={value}>{children}</PlatformContext.Provider>;
}

export function usePlatform() {
  const ctx = useContext(PlatformContext);
  if (!ctx) throw new Error('usePlatform must be used within PlatformProvider');
  return ctx;
}

export function useStack() {
  const p = usePlatform();
  return {
    selected: p.selected,
    toggle: p.toggle,
    setSelected: p.setSelected,
    score: p.score,
    selectedCompounds: p.selectedCompounds,
    shareUrl: p.shareUrl,
    saveStack: p.saveStack,
    saved: p.saved,
    applyPreset: p.applyPreset,
  };
}