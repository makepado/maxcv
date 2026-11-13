import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  CVDocument,
  CVSection,
  DesignSettings,
  GoogleUserProfile,
  PersonalDetails,
  SectionItem,
  SectionType,
} from '../types/cv';
import { DEFAULT_DESIGN_SETTINGS, SAMPLE_CVS, SECTION_CATALOG } from '../constants/defaultCv';

interface CVStoreState {
  currentUser: GoogleUserProfile | null;
  googleClientId: string;
  documents: CVDocument[];
  draftDoc: CVDocument | null;
  activeDocId: string;
  activeTab: 'content' | 'customize' | 'fonts' | 'templates' | 'export';
  previewZoom: number;

  // History Undo / Redo
  canUndo: boolean;
  canRedo: boolean;
  undo: () => void;
  redo: () => void;

  // Auth & User Actions
  setCurrentUser: (user: GoogleUserProfile | null) => void;
  setGoogleClientId: (clientId: string) => void;
  setDocuments: (docs: CVDocument[]) => void;

  // Actions
  setActiveTab: (tab: 'content' | 'customize' | 'fonts' | 'templates' | 'export') => void;
  setPreviewZoom: (zoom: number) => void;
  getActiveDocument: () => CVDocument;
  selectDocument: (docId: string) => void;
  createNewDocument: (presetDoc?: CVDocument, nameOverride?: string, saveToLibrary?: boolean) => void;
  commitDraftToLibrary: () => void;
  duplicateDocument: (docId: string) => void;
  deleteDocument: (docId: string) => void;
  renameDocument: (docId: string, name: string) => void;
  importDocumentJson: (doc: CVDocument) => void;

  // Personal details
  updatePersonal: (patch: Partial<PersonalDetails>) => void;

  // Sections
  addSection: (type: SectionType, customTitle?: string) => void;
  updateSection: (sectionId: string, patch: Partial<CVSection>) => void;
  removeSection: (sectionId: string) => void;
  moveSectionOrder: (sectionId: string, direction: 'up' | 'down') => void;
  toggleSectionColumn: (sectionId: string) => void;

  // Section Items
  addSectionItem: (sectionId: string) => void;
  updateSectionItem: (sectionId: string, itemId: string, patch: Partial<SectionItem>) => void;
  removeSectionItem: (sectionId: string, itemId: string) => void;
  duplicateSectionItem: (sectionId: string, itemId: string) => void;
  moveSectionItemOrder: (sectionId: string, itemId: string, direction: 'up' | 'down') => void;

  // Design & Fonts
  updateDesign: (patch: Partial<DesignSettings>) => void;
  resetDesign: () => void;
}


// Document edit history stack for Undo / Redo
const MAX_HISTORY_LENGTH = 30;
let undoStack: CVDocument[] = [];
let redoStack: CVDocument[] = [];

function cloneDoc(doc: CVDocument): CVDocument {
  return JSON.parse(JSON.stringify(doc));
}

function pushUndoSnapshot(currentDoc: CVDocument) {
  undoStack.push(cloneDoc(currentDoc));
  if (undoStack.length > MAX_HISTORY_LENGTH) {
    undoStack.shift();
  }
  // Clear redo stack on new action
  redoStack = [];
}

function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
}

function applyActiveDocUpdate(
  state: CVStoreState,
  updater: (doc: CVDocument) => CVDocument
): Partial<CVStoreState> {
  const common = {
    canUndo: undoStack.length > 0,
    canRedo: redoStack.length > 0,
  };
  if (state.draftDoc && state.draftDoc.id === state.activeDocId) {
    return {
      ...common,
      draftDoc: updater(state.draftDoc),
    };
  }
  return {
    ...common,
    documents: state.documents.map((doc) =>
      doc.id === state.activeDocId ? updater(doc) : doc
    ),
  };
}

export const useCVStore = create<CVStoreState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      googleClientId: '',
      documents: SAMPLE_CVS,
      draftDoc: null,
      activeDocId: SAMPLE_CVS[0].id,
      activeTab: 'content',
      previewZoom: 0.92,
      canUndo: false,
      canRedo: false,

      undo: () => {
        if (undoStack.length === 0) return;
        const currentActive = get().getActiveDocument();
        const previousDoc = undoStack.pop();
        if (!previousDoc) return;
        redoStack.push(cloneDoc(currentActive));
        set((state) => {
          const isDraftTarget = state.draftDoc && state.draftDoc.id === previousDoc.id;
          return {
            ...(isDraftTarget
              ? { draftDoc: previousDoc }
              : {
                  documents: state.documents.map((d) =>
                    d.id === previousDoc.id ? previousDoc : d
                  ),
                }),
            canUndo: undoStack.length > 0,
            canRedo: redoStack.length > 0,
          };
        });
      },

      redo: () => {
        if (redoStack.length === 0) return;
        const currentActive = get().getActiveDocument();
        const nextDoc = redoStack.pop();
        if (!nextDoc) return;
        undoStack.push(cloneDoc(currentActive));
        set((state) => {
          const isDraftTarget = state.draftDoc && state.draftDoc.id === nextDoc.id;
          return {
            ...(isDraftTarget
              ? { draftDoc: nextDoc }
              : {
                  documents: state.documents.map((d) => (d.id === nextDoc.id ? nextDoc : d)),
                }),
            canUndo: undoStack.length > 0,
            canRedo: redoStack.length > 0,
          };
        });
      },

      setCurrentUser: (user) => set({ currentUser: user }),
      setGoogleClientId: (clientId) => set({ googleClientId: clientId }),
      setDocuments: (docs) =>
        set({
          documents: docs.length > 0 ? docs : SAMPLE_CVS,
          draftDoc: null,
          activeDocId: docs.length > 0 ? docs[0].id : SAMPLE_CVS[0].id,
        }),

      setActiveTab: (tab) => set({ activeTab: tab }),
      setPreviewZoom: (zoom) => set({ previewZoom: Math.max(0.45, Math.min(1.5, zoom)) }),

      getActiveDocument: () => {
        const { documents, draftDoc, activeDocId } = get();
        if (draftDoc && draftDoc.id === activeDocId) return draftDoc;
        return documents.find((d) => d.id === activeDocId) || documents[0];
      },

      selectDocument: (docId) => {
        const { draftDoc, activeDocId } = get();
        if (draftDoc && draftDoc.id === docId && activeDocId === docId) {
          return;
        }
        undoStack = [];
        redoStack = [];
        set({ activeDocId: docId, draftDoc: null, canUndo: false, canRedo: false });
      },

      createNewDocument: (presetDoc, nameOverride, saveToLibrary = false) => {
        const newId = generateId('cv');
        const baseDoc: CVDocument = presetDoc
          ? JSON.parse(JSON.stringify(presetDoc))
          : {
              id: newId,
              name: '새 이력서',
              updatedAt: new Date().toISOString(),
              language: 'ko',
              personal: {
                fullName: '홍길동',
                jobTitle: 'Software Engineer',
                email: 'hello@example.com',
                phone: '010-0000-0000',
                location: '',
                birthDate: '',
                nationality: '',
                militaryOrVisa: '',
                photoUrl: '',
                showPhoto: false,
                photoShape: 'rounded',
                photoSize: 88,
                photoGrayscale: false,
                links: [],
                customFields: [],
              },
              sections: [
                {
                  id: generateId('sec'),
                  type: 'profile',
                  title: '핵심 요약',
                  visible: true,
                  column: 'main',
                  items: [
                    {
                      id: generateId('item'),
                      visible: true,
                      title: '헤드라인',
                      subtitle: '',
                      startDate: '',
                      endDate: '',
                      isCurrent: false,
                      location: '',
                      url: '',
                      urlLabel: '',
                      description: '• 핵심 강점과 경력 요약을 작성하세요.',
                      tags: [],
                      level: 5,
                      levelText: '',
                    },
                  ],
                },
                {
                  id: generateId('sec'),
                  type: 'experience',
                  title: '경력사항',
                  visible: true,
                  column: 'main',
                  items: [
                    {
                      id: generateId('item'),
                      visible: true,
                      title: '회사명',
                      subtitle: '직책',
                      startDate: '2024.01',
                      endDate: '',
                      isCurrent: true,
                      location: '서울',
                      url: '',
                      urlLabel: '',
                      description: '• 주요 담당 업무 및 성과를 작성하세요.',
                      tags: ['핵심역량1', '핵심역량2'],
                      level: 5,
                      levelText: '',
                    },
                  ],
                },
                {
                  id: generateId('sec'),
                  type: 'education',
                  title: '학력사항',
                  visible: true,
                  column: 'sidebar',
                  items: [
                    {
                      id: generateId('item'),
                      visible: true,
                      title: '대학교명',
                      subtitle: '전공 및 학위',
                      startDate: '2018.03',
                      endDate: '2022.02',
                      isCurrent: false,
                      location: '서울',
                      url: '',
                      urlLabel: '',
                      description: '',
                      tags: [],
                      level: 5,
                      levelText: '',
                    },
                  ],
                },
                {
                  id: generateId('sec'),
                  type: 'skills',
                  title: '보유 기술',
                  visible: true,
                  column: 'sidebar',
                  items: [
                    {
                      id: generateId('item'),
                      visible: true,
                      title: '직무 스킬',
                      subtitle: '',
                      startDate: '',
                      endDate: '',
                      isCurrent: false,
                      location: '',
                      url: '',
                      urlLabel: '',
                      description: '',
                      tags: ['React', 'TypeScript', 'Figma', 'SQL'],
                      level: 4,
                      levelText: 'Advanced',
                    },
                  ],
                },
              ],
              design: { ...DEFAULT_DESIGN_SETTINGS },
            };

        baseDoc.id = newId;
        baseDoc.updatedAt = new Date().toISOString();
        if (!baseDoc.docType) baseDoc.docType = 'resume';
        if (nameOverride) {
          baseDoc.name = nameOverride;
        } else if (presetDoc) {
          baseDoc.name = `${presetDoc.name} (사본)`;
        }

        undoStack = [];
        redoStack = [];

        if (saveToLibrary) {
          set((state) => ({
            canUndo: false,
            canRedo: false,
            documents: [baseDoc, ...state.documents],
            draftDoc: null,
            activeDocId: newId,
          }));
        } else {
          set({
            canUndo: false,
            canRedo: false,
            draftDoc: baseDoc,
            activeDocId: newId,
          });
        }
      },

      commitDraftToLibrary: () => {
        set((state) => {
          if (!state.draftDoc || state.draftDoc.id !== state.activeDocId) return state;
          const exists = state.documents.some((d) => d.id === state.draftDoc!.id);
          return {
            documents: exists
              ? state.documents.map((d) => (d.id === state.draftDoc!.id ? state.draftDoc! : d))
              : [state.draftDoc, ...state.documents],
            draftDoc: null,
          };
        });
      },

      duplicateDocument: (docId) => {
        const target = get().documents.find((d) => d.id === docId);
        if (!target) return;
        get().createNewDocument(target, undefined, true);
      },

      deleteDocument: (docId) => {
        set((state) => {
          if (state.documents.length <= 1) return state;
          const remaining = state.documents.filter((d) => d.id !== docId);
          const nextActive =
            state.activeDocId === docId ? remaining[0].id : state.activeDocId;
          return {
            documents: remaining,
            activeDocId: nextActive,
          };
        });
      },

      renameDocument: (docId, name) => {
        set((state) => {
          const common = {
            canUndo: undoStack.length > 0,
            canRedo: redoStack.length > 0,
          };
          if (state.draftDoc && state.draftDoc.id === docId) {
            return {
              ...common,
              draftDoc: { ...state.draftDoc, name, updatedAt: new Date().toISOString() },
            };
          }
          return {
            ...common,
            documents: state.documents.map((doc) =>
              doc.id === docId ? { ...doc, name, updatedAt: new Date().toISOString() } : doc
            ),
          };
        });
      },

      importDocumentJson: (importedDoc) => {
        const newId = generateId('cv-import');
        const sanitized: CVDocument = {
          ...importedDoc,
          id: newId,
          name: importedDoc.name || '가져온 이력서',
          updatedAt: new Date().toISOString(),
          design: {
            ...DEFAULT_DESIGN_SETTINGS,
            ...(importedDoc.design || {}),
          },
        };
        set((state) => ({
          canUndo: undoStack.length > 0,
          canRedo: redoStack.length > 0,
          documents: [sanitized, ...state.documents],
          activeDocId: newId,
        }));
      },

      updatePersonal: (patch) => {
        const active = get().getActiveDocument();
        if (active) pushUndoSnapshot(active);
        set((state) =>
          applyActiveDocUpdate(state, (doc) => ({
            ...doc,
            updatedAt: new Date().toISOString(),
            personal: { ...doc.personal, ...patch },
          }))
        );
      },

      addSection: (type, customTitle) => {
        const active = get().getActiveDocument();
        if (active) pushUndoSnapshot(active);
        const meta = SECTION_CATALOG.find((s) => s.type === type) || SECTION_CATALOG[0];
        const newSection: CVSection = {
          id: generateId('sec'),
          type,
          title: customTitle || meta.labelKo,
          visible: true,
          column: meta.defaultColumn,
          items: [
            {
              id: generateId('item'),
              visible: true,
              title: '',
              subtitle: '',
              startDate: '',
              endDate: '',
              isCurrent: false,
              location: '',
              url: '',
              urlLabel: '',
              description: '',
              tags: [],
              level: 4,
              levelText: '',
            },
          ],
        };

        set((state) =>
          applyActiveDocUpdate(state, (doc) => ({
            ...doc,
            updatedAt: new Date().toISOString(),
            sections: [...doc.sections, newSection],
          }))
        );
      },

      updateSection: (sectionId, patch) => {
        const active = get().getActiveDocument();
        if (active) pushUndoSnapshot(active);
        set((state) =>
          applyActiveDocUpdate(state, (doc) => ({
            ...doc,
            updatedAt: new Date().toISOString(),
            sections: doc.sections.map((sec) =>
              sec.id === sectionId ? { ...sec, ...patch } : sec
            ),
          }))
        );
      },

      removeSection: (sectionId) => {
        const active = get().getActiveDocument();
        if (active) pushUndoSnapshot(active);
        set((state) =>
          applyActiveDocUpdate(state, (doc) => ({
            ...doc,
            updatedAt: new Date().toISOString(),
            sections: doc.sections.filter((sec) => sec.id !== sectionId),
          }))
        );
      },

      moveSectionOrder: (sectionId, direction) => {
        const active = get().getActiveDocument();
        if (active) pushUndoSnapshot(active);
        set((state) =>
          applyActiveDocUpdate(state, (doc) => {
            const idx = doc.sections.findIndex((s) => s.id === sectionId);
            if (idx === -1) return doc;
            const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
            if (targetIdx < 0 || targetIdx >= doc.sections.length) return doc;
            const nextSections = [...doc.sections];
            const [moved] = nextSections.splice(idx, 1);
            nextSections.splice(targetIdx, 0, moved);
            return {
              ...doc,
              updatedAt: new Date().toISOString(),
              sections: nextSections,
            };
          })
        );
      },

      toggleSectionColumn: (sectionId) => {
        const active = get().getActiveDocument();
        if (active) pushUndoSnapshot(active);
        set((state) =>
          applyActiveDocUpdate(state, (doc) => ({
            ...doc,
            updatedAt: new Date().toISOString(),
            sections: doc.sections.map((sec) =>
              sec.id === sectionId
                ? { ...sec, column: sec.column === 'main' ? 'sidebar' : 'main' }
                : sec
            ),
          }))
        );
      },

      addSectionItem: (sectionId) => {
        const active = get().getActiveDocument();
        if (active) pushUndoSnapshot(active);
        const newItem: SectionItem = {
          id: generateId('item'),
          visible: true,
          title: '',
          subtitle: '',
          startDate: '',
          endDate: '',
          isCurrent: false,
          location: '',
          url: '',
          urlLabel: '',
          description: '',
          tags: [],
          level: 4,
          levelText: '',
        };
        set((state) =>
          applyActiveDocUpdate(state, (doc) => ({
            ...doc,
            updatedAt: new Date().toISOString(),
            sections: doc.sections.map((sec) =>
              sec.id === sectionId
                ? { ...sec, items: [...sec.items, newItem] }
                : sec
            ),
          }))
        );
      },

      updateSectionItem: (sectionId, itemId, patch) => {
        const active = get().getActiveDocument();
        if (active) pushUndoSnapshot(active);
        set((state) =>
          applyActiveDocUpdate(state, (doc) => ({
            ...doc,
            updatedAt: new Date().toISOString(),
            sections: doc.sections.map((sec) =>
              sec.id === sectionId
                ? {
                    ...sec,
                    items: sec.items.map((item) =>
                      item.id === itemId ? { ...item, ...patch } : item
                    ),
                  }
                : sec
            ),
          }))
        );
      },

      removeSectionItem: (sectionId, itemId) => {
        const active = get().getActiveDocument();
        if (active) pushUndoSnapshot(active);
        set((state) =>
          applyActiveDocUpdate(state, (doc) => ({
            ...doc,
            updatedAt: new Date().toISOString(),
            sections: doc.sections.map((sec) =>
              sec.id === sectionId
                ? { ...sec, items: sec.items.filter((i) => i.id !== itemId) }
                : sec
            ),
          }))
        );
      },

      duplicateSectionItem: (sectionId, itemId) => {
        const active = get().getActiveDocument();
        if (active) pushUndoSnapshot(active);
        set((state) =>
          applyActiveDocUpdate(state, (doc) => ({
            ...doc,
            updatedAt: new Date().toISOString(),
            sections: doc.sections.map((sec) => {
              if (sec.id !== sectionId) return sec;
              const idx = sec.items.findIndex((i) => i.id === itemId);
              if (idx === -1) return sec;
              const copy: SectionItem = {
                ...JSON.parse(JSON.stringify(sec.items[idx])),
                id: generateId('item'),
              };
              const nextItems = [...sec.items];
              nextItems.splice(idx + 1, 0, copy);
              return { ...sec, items: nextItems };
            }),
          }))
        );
      },

      moveSectionItemOrder: (sectionId, itemId, direction) => {
        const active = get().getActiveDocument();
        if (active) pushUndoSnapshot(active);
        set((state) =>
          applyActiveDocUpdate(state, (doc) => ({
            ...doc,
            updatedAt: new Date().toISOString(),
            sections: doc.sections.map((sec) => {
              if (sec.id !== sectionId) return sec;
              const idx = sec.items.findIndex((i) => i.id === itemId);
              if (idx === -1) return sec;
              const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
              if (targetIdx < 0 || targetIdx >= sec.items.length) return sec;
              const nextItems = [...sec.items];
              const [moved] = nextItems.splice(idx, 1);
              nextItems.splice(targetIdx, 0, moved);
              return { ...sec, items: nextItems };
            }),
          }))
        );
      },

      updateDesign: (patch) => {
        const active = get().getActiveDocument();
        if (active) pushUndoSnapshot(active);
        set((state) =>
          applyActiveDocUpdate(state, (doc) => ({
            ...doc,
            updatedAt: new Date().toISOString(),
            design: { ...doc.design, ...patch },
          }))
        );
      },

      resetDesign: () => {
        const active = get().getActiveDocument();
        if (active) pushUndoSnapshot(active);
        set((state) =>
          applyActiveDocUpdate(state, (doc) => ({
            ...doc,
            updatedAt: new Date().toISOString(),
            design: { ...DEFAULT_DESIGN_SETTINGS },
          }))
        );
      },
    }),
    {
      name: 'maxcv-storage-v1',
      version: 6,
      migrate: (persistedState: any, version: number) => {
        if (version < 6 && persistedState && Array.isArray(persistedState.documents)) {
          persistedState.documents = persistedState.documents.map((doc: any) => {
            if (doc.id === 'sample-tech-lead') {
              return {
                ...doc,
                personal: {
                  ...doc.personal,
                  jobTitle: 'Software Engineer',
                  location: '',
                  birthDate: '',
                  nationality: '',
                  militaryOrVisa: '',
                  links: SAMPLE_CVS[0].personal.links,
                },
                sections: SAMPLE_CVS[0].sections,
              };
            }
            return doc;
          });
        }
        return persistedState;
      },
    }
  )
);
