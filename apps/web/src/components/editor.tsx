"use client";

import { useState, useEffect } from "react";
import { useDebouncedCallback } from "use-debounce";
import { $getRoot, $getSelection, type EditorState } from "lexical";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
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

import LZString from "lz-string";
import { Loader } from "@indix/ui/components/loader";
import { FileCheck, FileCheck2 } from "lucide-react";
import { Input } from "@indix/ui/components/input";
import { toast } from "sonner";

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

interface EditorProps {
  noteId?: string;
}

export default function Editor({ noteId }: EditorProps) {
  return (
    <div className="flex-1 flex flex-col h-full w-full">
      <LexicalEditor noteId={noteId} />
    </div>
  );
}

function LexicalEditor({ noteId }: { noteId?: string }) {
  const [id, setId] = useState<string | null>(noteId || null);
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(!!noteId);

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <EditorContent
        noteId={noteId}
        id={id}
        setId={setId}
        title={title}
        setTitle={setTitle}
        content={content}
        setContent={setContent}
        isSaving={isSaving}
        setIsSaving={setIsSaving}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
      />
    </LexicalComposer>
  );
}

function EditorContent({
  noteId,
  id,
  setId,
  title,
  setTitle,
  content,
  setContent,
  isSaving,
  setIsSaving,
  isLoading,
  setIsLoading,
}: {
  noteId?: string;
  id: string | null;
  setId: (id: string | null) => void;
  title: string;
  setTitle: (title: string) => void;
  content: string;
  setContent: (content: string) => void;
  isSaving: boolean;
  setIsSaving: (saving: boolean) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}) {
  const [editor] = useLexicalComposerContext();

  // Load existing note if noteId is provided
  useEffect(() => {
    if (noteId) {
      const loadNote = async () => {
        try {
          const response = await fetch(`/api/notes/${noteId}`);

          if (!response.ok) {
            throw new Error("Failed to load note");
          }

          const { note } = await response.json();
          setTitle(note.title || "");
          setContent(note.content || "");

          // Set the editor state if content exists
          if (note.content) {
            try {
              const editorState = editor.parseEditorState(note.content);
              editor.setEditorState(editorState);
            } catch (error) {
              console.error("Error parsing editor state:", error);
              // If parsing fails, clear the editor
              editor.update(() => {
                const root = $getRoot();
                root.clear();
              });
            }
          }
        } catch (error) {
          console.error("Error loading note:", error);
          toast.error("Failed to load note");
        } finally {
          setIsLoading(false);
        }
      };
      loadNote();
    }
  }, [noteId, editor, setTitle, setContent, setIsLoading]);

  const debouncedSave = useDebouncedCallback(
    async (currentTitle: string, currentContent: string) => {
      setIsSaving(true);

      try {
        if (id) {
          const response = await fetch(`/api/notes/${id}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              title: currentTitle || undefined,
              content: currentContent,
            }),
          });

          if (!response.ok) {
            throw new Error("Failed to save note");
          }
        } else {
          const response = await fetch("/api/notes", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              title: currentTitle || undefined,
              content: currentContent,
            }),
          });

          if (!response.ok) {
            throw new Error("Failed to save note");
          }

          const data = await response.json();
          if (data.id) {
            setId(data.id);
            window.history.pushState(null, "", `/notes/${data.id}`);
          }
        }
      } catch (error) {
        console.error("Save error:", error);
        toast.error("Failed to save note");
      } finally {
        setIsSaving(false);
      }
    },
    1000
  );

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    debouncedSave(newTitle, content);
  };

  const handleContentChange = (editorState: EditorState) => {
    const serializedState = JSON.stringify(editorState.toJSON());
    setContent(serializedState);
    debouncedSave(title, serializedState);
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader />
          <p className="text-sm text-muted-foreground">Loading note...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="px-6 pt-14">
        <Input
          className="cursor-text focus-visible:ring-0 !bg-background border-0 placeholder:text-3xl !text-3xl h-auto font-medium px-0 text-primary/75 placeholder:text-muted-foreground"
          placeholder="Untitled"
          autoFocus
          value={title}
          onChange={handleTitleChange}
        />
      </div>
      <div className="flex-1 relative">
        <RichTextPlugin
          contentEditable={
            <div className="flex-1 w-full h-full overflow-y-auto">
              <ContentEditable
                className="prose prose-neutral dark:prose-invert max-w-none w-full min-h-full p-6 focus:outline-none resize-none prose-headings:scroll-m-20 prose-headings:tracking-tight prose-headings:font-medium prose-h1:text-4xl prose-h2:text-3xl prose-h2:border-b prose-h2:pb-2 prose-h3:text-2xl prose-h4:text-xl prose-h5:text-lg prose-h6:text-base prose-p:leading-7 prose-p:my-0 prose-p:text-foreground prose-a:text-primary prose-a:underline prose-a:underline-offset-4 hover:prose-a:no-underline prose-blockquote:border-l-2 prose-blockquote:font-normal prose-blockquote:border-border prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-foreground/75 prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:font-mono prose-code:text-sm prose-code:font-medium prose-pre:bg-muted prose-pre:border prose-pre:border-border prose-pre:p-4 prose-li:marker:text-muted-foreground prose-strong:font-semibold prose-em:italic"
                aria-placeholder={"Enter some text..."}
                placeholder={
                  <div className="absolute top-6:left-6 text-muted-foreground pointer-events-none select-none">
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
      {/* <AutoFocusPlugin /> */}
      <OnChangePlugin onChange={handleContentChange} />

      {/* Text formatting and structure */}
      <LinkPlugin />
      <ListPlugin />
      <CheckListPlugin />
      <TabIndentationPlugin />

      {/* Auto-features */}
      <AutoLinkPlugin matchers={MATCHERS} />
      <MarkdownShortcutPlugin />
      <div className="fixed bottom-4 right-4 flex items-center gap-2 border rounded-full px-2.5 py-1 border-primary/15 shadow text-muted-foreground">
        {isSaving ? (
          <>
            <Loader />
            <p className="text-sm">Saving</p>
          </>
        ) : (
          <>
            <FileCheck2 className="w-4 h-4" />
            <p className="text-sm">Saved</p>
          </>
        )}
      </div>
    </>
  );
}
