import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface QuickTime {
    id: string;
    label: string;
    time: string;
}

interface BookingStore {
    quickTimes: QuickTime[];
    activeQuickTimeId: string | null;

    addQuickTime: (qt: Omit<QuickTime, 'id'>) => void;
    removeQuickTime: (id: string) => void;
    updateQuickTime: (id: string, qt: Partial<QuickTime>) => void;
    setActiveQuickTime: (id: string | null) => void;
}

export const useBookingStore = create<BookingStore>()(
    persist(
        (set) => ({
            quickTimes: [],
            activeQuickTimeId: null,

            addQuickTime: (qt) => set((state) => ({
                quickTimes: [...state.quickTimes, { ...qt, id: crypto.randomUUID() }]
            })),

            removeQuickTime: (id) => set((state) => ({
                quickTimes: state.quickTimes.filter((t) => t.id !== id),
                activeQuickTimeId: state.activeQuickTimeId === id ? null : state.activeQuickTimeId
            })),

            updateQuickTime: (id, qt) => set((state) => ({
                quickTimes: state.quickTimes.map((t) => t.id === id ? { ...t, ...qt } : t)
            })),

            setActiveQuickTime: (id) => set({ activeQuickTimeId: id }),
        }),
        {
            name: 'booking-store',
        }
    )
);
