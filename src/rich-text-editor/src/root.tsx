import React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { EditorOptions } from "@tiptap/core";

import { EditorComponent } from "./components/editor";

export function initialise(options: Partial<EditorOptions>) {
  createRoot(document.getElementById("editor")!).render(
    <StrictMode>
      <EditorComponent />
    </StrictMode>
  );
}
