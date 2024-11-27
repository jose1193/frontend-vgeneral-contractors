"use client";

import { create } from "zustand";
import { ClaimAgreementData } from "../../app/types/claim-agreement";

interface ClaimAgreementStore {
  // Estado
  items: ClaimAgreementData[];
  loading: boolean;
  error: string | null;
  searchTerm: string;

  // Acciones básicas
  setItems: (items: ClaimAgreementData[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSearchTerm: (term: string) => void;

  // Acciones CRUD
  addItem: (item: ClaimAgreementData) => void;
  updateItem: (uuid: string, item: ClaimAgreementData) => void;
  deleteItem: (uuid: string) => void;
  restoreItem: (item: ClaimAgreementData) => void;

  // Selectores
  getFilteredItems: () => ClaimAgreementData[];
}

export const useClaimAgreementStore = create<ClaimAgreementStore>(
  (set, get) => ({
    items: [],
    loading: false,
    error: null,
    searchTerm: "",

    setItems: (items) => set({ items }),
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),
    setSearchTerm: (term) => set({ searchTerm: term }),

    addItem: (item) =>
      set((state) => ({
        items: [item, ...state.items].sort(
          (a, b) => a.full_pdf_path?.localeCompare(b.full_pdf_path || "") || 0
        ),
      })),

    updateItem: (uuid, updatedItem) =>
      set((state) => ({
        items: state.items.map((item) =>
          item.uuid === uuid ? updatedItem : item
        ),
      })),

    deleteItem: (uuid) =>
      set((state) => ({
        items: state.items.map((item) =>
          item.uuid === uuid
            ? { ...item, deleted_at: new Date().toISOString() }
            : item
        ),
      })),

    restoreItem: (restoredItem) =>
      set((state) => ({
        items: state.items.map((item) =>
          item.uuid === restoredItem.uuid
            ? { ...restoredItem, deleted_at: undefined }
            : item
        ),
      })),

    getFilteredItems: () => {
      const { items, searchTerm } = get();
      if (!searchTerm) return items;

      return items.filter((item) => {
        const searchFields = [
          item.full_pdf_path,
          item.claim?.claim_internal_id,
          item.claim?.policy_number,
          Array.isArray(item.claim?.customers)
            ? item.claim.customers
                .map((customer) => `${customer.name} ${customer.last_name}`)
                .join(" ")
            : item.claim?.customers,
        ].filter(Boolean);

        return searchFields.some((field) =>
          field?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    },
  })
);

export const selectActiveItems = (state: ClaimAgreementStore) => ({
  items: state.items.filter((item) => !item.deleted_at),
});

export const selectDeletedItems = (state: ClaimAgreementStore) => ({
  items: state.items.filter((item) => item.deleted_at),
});
