import { create } from "zustand";
import { CauseOfLossData } from "../../app/types/cause-of-loss";

interface CauseOfLossStore {
  causesOfLoss: CauseOfLossData[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
  setCausesOfLoss: (causes: CauseOfLossData[]) => void;
  addCauseOfLoss: (cause: CauseOfLossData) => void;
  updateCauseOfLoss: (uuid: string, cause: CauseOfLossData) => void;
  deleteCauseOfLoss: (uuid: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSearchTerm: (term: string) => void;
  getFilteredCauses: () => CauseOfLossData[];
}

export const useCauseOfLossStore = create<CauseOfLossStore>((set, get) => ({
  causesOfLoss: [],
  loading: false,
  error: null,
  searchTerm: "",

  setCausesOfLoss: (causes) => set({ causesOfLoss: causes }),

  addCauseOfLoss: (cause) =>
    set((state) => ({
      causesOfLoss: [cause, ...state.causesOfLoss].sort((a, b) =>
        a.cause_loss_name.localeCompare(b.cause_loss_name)
      ),
    })),

  updateCauseOfLoss: (uuid, updatedCause) =>
    set((state) => ({
      causesOfLoss: state.causesOfLoss.map((cause) =>
        cause.uuid === uuid ? updatedCause : cause
      ),
    })),

  deleteCauseOfLoss: (uuid) =>
    set((state) => ({
      causesOfLoss: state.causesOfLoss.filter((cause) => cause.uuid !== uuid),
    })),

  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setSearchTerm: (term) => set({ searchTerm: term }),

  getFilteredCauses: () => {
    const { causesOfLoss, searchTerm } = get();
    return causesOfLoss.filter((cause) =>
      cause.cause_loss_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  },
}));
