import { create } from "zustand";
import { ServiceRequestData } from "../../app/types/service-request";

interface RequiredServiceStore {
  services: ServiceRequestData[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
  setServices: (services: ServiceRequestData[]) => void;
  addService: (service: ServiceRequestData) => void;
  updateService: (uuid: string, service: ServiceRequestData) => void;
  deleteService: (uuid: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSearchTerm: (term: string) => void;
  getFilteredServices: () => ServiceRequestData[];
}

export const useRequiredServiceStore = create<RequiredServiceStore>(
  (set, get) => ({
    services: [],
    loading: false,
    error: null,
    searchTerm: "",

    setServices: (services) => set({ services }),

    addService: (service) =>
      set((state) => ({
        services: [service, ...state.services].sort((a, b) =>
          a.requested_service.localeCompare(b.requested_service)
        ),
      })),

    updateService: (uuid, updatedService) =>
      set((state) => ({
        services: state.services.map((service) =>
          service.uuid === uuid ? updatedService : service
        ),
      })),

    deleteService: (uuid) =>
      set((state) => ({
        services: state.services.filter((service) => service.uuid !== uuid),
      })),

    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),
    setSearchTerm: (term) => set({ searchTerm: term }),

    getFilteredServices: () => {
      const { services, searchTerm } = get();
      return services.filter((service) =>
        service.requested_service
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    },
  })
);
