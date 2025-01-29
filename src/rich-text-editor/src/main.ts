import { applets } from "@web-applets/sdk";
import { Editor } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";

let editor: Editor | null;

const context = applets.getContext();

/**
 *  @TODO
 *
 * 1. If the user submits json, we need to convert it via the schema
 * 2. If the user submits markdown, we need to convert it via... ??
 */
context.setActionHandler("write", ({ text }) => {
  context.data = { text };
});

context.ondata = () => {
  if (!editor) {
    throw new Error("No editor found");
  }

  if (context?.data?.text) {
    editor.commands.setContent(context.data.text);
  }
};

context.onload = () => {
  const editorElement = document.querySelector("#editor");
  if (!editorElement) {
    throw new Error("No element found for editor");
  }
  loadEditor(editorElement);
};

function loadEditor(element: Element) {
  editor = new Editor({
    element: element,
    extensions: [StarterKit],
    content: "",
    editable: true,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      context.setData(html);
    },
  });
}
