// stores/zoneStore.ts
import { create } from "zustand";
import { ZoneData } from "../../app/types/zone";

// Definimos la interfaz del store
interface ZoneStore {
  // Estado base
  zones: ZoneData[]; // Lista de zonas
  loading: boolean; // Estado de carga
  error: string | null; // Manejo de errores
  searchTerm: string; // Término de búsqueda

  // Acciones básicas para actualizar el estado
  setZones: (zones: ZoneData[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSearchTerm: (term: string) => void;

  // Acciones CRUD
  addZone: (zone: ZoneData) => void;
  updateZone: (uuid: string, zone: ZoneData) => void;
  deleteZone: (uuid: string) => void;
  restoreZone: (zone: ZoneData) => void;

  // Selectores
  getFilteredZones: () => ZoneData[];
}

// Creamos el store
export const useZoneStore = create<ZoneStore>((set, get) => ({
  // Estado inicial
  zones: [],
  loading: false,
  error: null,
  searchTerm: "",

  // Implementación de setters básicos
  setZones: (zones) => set({ zones }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setSearchTerm: (term) => set({ searchTerm: term }),

  // Implementación de operaciones CRUD
  addZone: (zone) =>
    set((state) => ({
      zones: [zone, ...state.zones].sort((a, b) =>
        a.zone_name.localeCompare(b.zone_name)
      ), // Ordenar por nombre
    })),

  updateZone: (uuid, updatedZone) =>
    set((state) => ({
      zones: state.zones.map((zone) =>
        zone.uuid === uuid ? updatedZone : zone
      ),
    })),

  deleteZone: (uuid) =>
    set((state) => ({
      zones: state.zones.map((zone) =>
        zone.uuid === uuid
          ? { ...zone, deleted_at: new Date().toISOString() }
          : zone
      ),
    })),

  restoreZone: (restoredZone) =>
    set((state) => ({
      zones: state.zones.map((zone) =>
        zone.uuid === restoredZone.uuid
          ? { ...restoredZone, deleted_at: null }
          : zone
      ),
    })),

  // Implementación del filtrado
  getFilteredZones: () => {
    const { zones, searchTerm } = get();
    if (!searchTerm) return zones;

    return zones.filter((zone) => {
      const searchFields = [zone.zone_name, zone.code, zone.description].filter(
        Boolean
      ); // Elimina valores null/undefined

      return searchFields.some((field) =>
        field?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  },
}));

// Selectores útiles para filtrar zonas
export const selectActiveZones = (state: ZoneStore) =>
  state.zones.filter((zone) => !zone.deleted_at);

export const selectDeletedZones = (state: ZoneStore) =>
  state.zones.filter((zone) => zone.deleted_at);

// Hook personalizado para acceder a zonas filtradas
export const useFilteredZones = () => {
  const zones = useZoneStore((state) => state.getFilteredZones());
  const loading = useZoneStore((state) => state.loading);
  const error = useZoneStore((state) => state.error);

  return { zones, loading, error };
};
