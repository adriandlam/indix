"use client";

import { useDebouncedCallback } from "use-debounce";
import { $getRoot, $getSelection, type EditorState } from "lexical";

import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { CheckListPlugin } from "@lexical/react/LexicalCheckListPlugin";
import { TabIndentationPlugin } from "@lexical/react/LexicalTabIndentationPlugin";
import { AutoLinkPlugin } from "@lexical/react/LexicalAutoLinkPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";

// Import required nodes for the plugins
import { LinkNode, AutoLinkNode } from "@lexical/link";
import { ListNode, ListItemNode } from "@lexical/list";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { CodeNode, CodeHighlightNode } from "@lexical/code";
import { HorizontalRuleNode } from "@lexical/react/LexicalHorizontalRuleNode";
import { TextNode } from "lexical";

// const theme = {
//   // Text formatting - matching your design system
//   text: {
//     bold: "font-semibold",
//     italic: "italic",
//     underline: "underline underline-offset-2",
//     strikethrough: "line-through",
//     code: "bg-muted px-1 py-0.5 rounded font-mono text-sm font-medium",
//   },
//   // Lists - customize checklist behavior
//   list: {
//     listitemChecked: "text-muted-foreground line-through",
//     listitemUnchecked: "",
//   },
//   // Code blocks
//   code: "bg-muted p-4 rounded border font-mono text-sm",
// };

// Auto-link matchers for converting text to links
const MATCHERS = [
  (text: string) => {
    // Create a new regex each time to avoid global flag issues
    const urlRegex =
      /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/i;

    const match = urlRegex.exec(text);
    if (match === null) {
      return null;
    }
    const fullMatch = match[0];
    return {
      index: match.index,
      length: fullMatch.length,
      text: fullMatch,
      url: fullMatch.startsWith("http") ? fullMatch : `https://${fullMatch}`,
      attributes: { rel: "noreferrer", target: "_blank" },
    };
  },
];

// Catch any errors that occur during Lexical updates and log them
// or throw them as needed. If you don't throw them, Lexical will
// try to recover gracefully without losing user data.
function onError(error: Error) {
  console.error(error);
}

const initialConfig = {
  namespace: "indix-editor",
  onError,
  nodes: [
    // Text nodes
    TextNode,
    // Link nodes
    LinkNode,
    AutoLinkNode,
    // List nodes
    ListNode,
    ListItemNode,
    // Rich text nodes
    HeadingNode,
    QuoteNode,
    // Code nodes
    CodeNode,
    CodeHighlightNode,
    // Other nodes
    HorizontalRuleNode,
  ],
};

export default function Editor() {
  return (
    <div className="flex-1 flex flex-col h-full w-full">
      <LexicalEditor />
    </div>
  );
}

function LexicalEditor() {
  const debouncedOnChange = useDebouncedCallback((editorState: EditorState) => {
    // Here you can handle saving content, syncing, etc.
    const serializedState = JSON.stringify(editorState.toJSON());
    console.log("Editor state changed:", serializedState);
  }, 1000);

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="flex-1 relative">
        <RichTextPlugin
          contentEditable={
            <div className="flex-1 w-full h-full overflow-y-auto">
              <ContentEditable
                className="prose prose-neutral dark:prose-invert max-w-none w-full min-h-full pt-18 p-6 focus:outline-none resize-none prose-headings:scroll-m-20 prose-headings:tracking-tight prose-headings:font-medium prose-h1:text-4xl prose-h2:text-3xl prose-h2:border-b prose-h2:pb-2 prose-h3:text-2xl prose-h4:text-xl prose-h5:text-lg prose-h6:text-base prose-p:leading-7 prose-p:my-0 prose-p:text-foreground prose-a:text-primary prose-a:underline prose-a:underline-offset-4 hover:prose-a:no-underline prose-blockquote:border-l-2 prose-blockquote:font-normal prose-blockquote:border-border prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-foreground/75 prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:font-mono prose-code:text-sm prose-code:font-medium prose-pre:bg-muted prose-pre:border prose-pre:border-border prose-pre:p-4 prose-li:marker:text-muted-foreground prose-strong:font-semibold prose-em:italic"
                aria-placeholder={"Enter some text..."}
                placeholder={
                  <div className="absolute top-18 left-6 text-muted-foreground pointer-events-none select-none">
                    Enter some text...
                  </div>
                }
              />
            </div>
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
      </div>
      {/* Core plugins */}
      <HistoryPlugin />
      <AutoFocusPlugin />
      <OnChangePlugin onChange={debouncedOnChange} />

      {/* Text formatting and structure */}
      <LinkPlugin />
      <ListPlugin />
      <CheckListPlugin />
      <TabIndentationPlugin />

      {/* Auto-features */}
      <AutoLinkPlugin matchers={MATCHERS} />
      <MarkdownShortcutPlugin />
    </LexicalComposer>
  );
}
