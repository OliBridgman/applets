import { Editor } from "@tiptap/react";

export type EditorContent = string;
type EditorInstance = Editor;
type StoreSubscriber = () => void;

// store.ts
class EditorStore {
  private content: EditorContent = "";
  private editor: EditorInstance | null = null;
  private listeners = new Set<StoreSubscriber>();
  private isApplyingExternalUpdate = false;
  private isHandlingEditorUpdate = false;
  private updateTimeout: ReturnType<typeof setTimeout> | null = null;
  private readonly DEBOUNCE_MS = 150;

  constructor(initialContent: EditorContent = "") {
    this.content = initialContent;
  }

  setEditor(editor: EditorInstance | null) {
    if (this.editor && editor !== this.editor) {
      this.editor = null;
    }

    this.editor = editor;

    if (editor && this.content) {
      this.applyContentToEditor(this.content);
    }
  }

  setData(newContent: EditorContent) {
    if (this.isHandlingEditorUpdate) return;
    if (this.content === newContent) return;

    // Clear any pending updates
    if (this.updateTimeout) {
      clearTimeout(this.updateTimeout);
    }

    this.content = newContent;

    // Debounce the editor update
    this.updateTimeout = setTimeout(() => {
      this.applyContentToEditor(newContent);
      this.notify();
    }, this.DEBOUNCE_MS);
  }

  // Called from the Editor component's onUpdate
  handleEditorUpdate(newContent: EditorContent) {
    if (this.isApplyingExternalUpdate) return;
    if (this.content === newContent) return;

    this.content = newContent;
    this.notify();
  }

  // For useSyncExternalStore
  subscribe = (listener: StoreSubscriber) => {
    this.listeners.add(listener);

    return () => {
      this.listeners.delete(listener);
    };
  };

  // For useSyncExternalStore
  getContent = () => {
    return this.content;
  };

  private applyContentToEditor(content: EditorContent) {
    if (!this.editor) return;

    try {
      this.isApplyingExternalUpdate = true;
      this.editor.commands.setContent(content);
    } catch (error) {
      console.error("Failed to update editor content:", error);
    } finally {
      this.isApplyingExternalUpdate = false;
    }
  }

  private notify() {
    this.listeners.forEach((listener) => listener());
  }

  destroy() {
    this.listeners.clear();
    if (this.updateTimeout) {
      clearTimeout(this.updateTimeout);
    }
    this.editor = null;
  }
}

export const editorStore = new EditorStore();
