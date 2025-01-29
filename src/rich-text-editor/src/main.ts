import { applets } from "@web-applets/sdk";
import { initialise } from "./root";
import { editorStore } from "./store";

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
  if (context?.data?.text) {
    editorStore.setData(context?.data?.text);
  }
};

context.onload = () => {
  initialise({});
};

editorStore.subscribe(() => {
  console.log("subscription?");
  const content = editorStore.getContent();
  context.setData(content);
});
