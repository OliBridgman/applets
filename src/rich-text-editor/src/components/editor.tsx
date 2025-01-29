import React from "react";
import { useSyncExternalStore } from "react";

import {
  EditorContent as EditorContentComponent,
  useEditor,
} from "@tiptap/react";
import { editorStore, EditorContent } from "../store";
import StarterKit from "@tiptap/starter-kit";

export function EditorComponent() {
  const content = useSyncExternalStore<EditorContent>(
    editorStore.subscribe,
    editorStore.getContent
  );

  const editor = useEditor({
    extensions: [StarterKit],
    content: content,
    editable: true,
    onCreate: ({ editor }) => {
      editorStore.setEditor(editor);
    },
    onUpdate: ({ editor }) => {
      editorStore.handleEditorUpdate(editor.getHTML());
    },
  });

  if (!editor) return null;

  return <EditorContentComponent editor={editor} />;
}
