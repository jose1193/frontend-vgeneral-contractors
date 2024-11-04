import { create } from "zustand";
import { TypeDamageData } from "../../app/types/type-damage";

interface TypeDamageStore {
  typeDamages: TypeDamageData[];
  loading: boolean;
  error: string | null;
  setTypeDamages: (damages: TypeDamageData[]) => void;
  addTypeDamage: (damage: TypeDamageData) => void;
  updateTypeDamage: (uuid: string, damage: TypeDamageData) => void;
  deleteTypeDamage: (uuid: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useTypeDamageStore = create<TypeDamageStore>((set) => ({
  typeDamages: [],
  loading: false,
  error: null,

  setTypeDamages: (damages) => set({ typeDamages: damages }),

  addTypeDamage: (damage) =>
    set((state) => ({
      typeDamages: [damage, ...state.typeDamages].sort((a, b) =>
        a.type_damage_name.localeCompare(b.type_damage_name)
      ),
    })),

  updateTypeDamage: (uuid, updatedDamage) =>
    set((state) => ({
      typeDamages: state.typeDamages.map((damage) =>
        damage.uuid === uuid ? updatedDamage : damage
      ),
    })),

  deleteTypeDamage: (uuid) =>
    set((state) => ({
      typeDamages: state.typeDamages.filter((damage) => damage.uuid !== uuid),
    })),

  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));
