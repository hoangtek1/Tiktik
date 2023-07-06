import create from 'zustand';
import { persist } from 'zustand/middleware';

const mutedStore = (set: any) => ({
    isMuted: false,
    
    muted: () => set({ isMuted: true }),
    unMuted: () => set({ isMuted:false }),
});

const useMutedStore = create(
    persist(mutedStore, {
        name: 'mute'
    })
)

export default useMutedStore;