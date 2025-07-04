"use client";

import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@indix/ui/components/menubar";
import { useHotkeys } from "react-hotkeys-hook";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@indix/ui/components/button";
import { Sidebar } from "lucide-react";
import { Separator } from "@indix/ui/components/separator";

export default function NotesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isFullScreen, setIsFullScreen] = useState(false);

  // File menu actions
  const newNote = () => {
    toast.success("New note created");
    // TODO: Implement new note creation
  };

  const saveNote = () => {
    toast.success("Note saved");
    // TODO: Implement note saving
  };

  const openNote = () => {
    toast.info("Opening note...");
    // TODO: Implement note opening
  };

  const deleteNote = () => {
    toast.error("Note deleted");
    // TODO: Implement note deletion
  };

  const exportNote = () => {
    toast.info("Exporting note...");
    // TODO: Implement note export
  };

  // Edit menu actions
  const undo = () => {
    document.execCommand("undo");
    toast.info("Undo");
  };

  const redo = () => {
    document.execCommand("redo");
    toast.info("Redo");
  };

  const find = () => {
    toast.info("Find opened");
    // TODO: Implement find functionality
  };

  const replace = () => {
    toast.info("Replace opened");
    // TODO: Implement replace functionality
  };

  const selectAll = () => {
    document.execCommand("selectAll");
    toast.info("All selected");
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullScreen(true);
      toast.info("Entered full screen");
    } else {
      document.exitFullscreen();
      setIsFullScreen(false);
      toast.info("Exited full screen");
    }
  };

  const zoomIn = () => {
    toast.info("Zoomed in");
    // TODO: Implement zoom functionality
  };

  const zoomOut = () => {
    toast.info("Zoomed out");
    // TODO: Implement zoom functionality
  };

  // Tools menu actions
  const showSettings = () => {
    // TODO: Implement settings
  };

  const showWordCount = () => {
    toast.info("Word count: 0 words");
    // TODO: Implement word count
  };

  const showAIInsights = () => {
    toast.info("AI insights loading...");
    // TODO: Implement AI insights
  };

  const exportToPDF = () => {
    toast.info("Exporting to PDF...");
    // TODO: Implement PDF export
  };

  // File menu keybinds
  useHotkeys("cmd+n", newNote, { preventDefault: true });
  useHotkeys("cmd+s", saveNote, { preventDefault: true });
  useHotkeys("cmd+o", openNote, { preventDefault: true });
  useHotkeys("cmd+backspace", deleteNote, { preventDefault: true });

  // Edit menu keybinds
  useHotkeys("cmd+z", undo, { preventDefault: true });
  useHotkeys("cmd+shift+z", redo, { preventDefault: true });
  useHotkeys("cmd+f", find, { preventDefault: true });
  useHotkeys("cmd+alt+f", replace, { preventDefault: true });
  useHotkeys("cmd+a", selectAll, { preventDefault: true });

  // View menu keybinds
  useHotkeys("cmd+ctrl+f", toggleFullScreen, { preventDefault: true });
  useHotkeys("cmd+plus", zoomIn, { preventDefault: true });
  useHotkeys("cmd+minus", zoomOut, { preventDefault: true });

  // Tools menu keybinds
  useHotkeys("cmd+comma", showSettings, { preventDefault: true });
  useHotkeys("cmd+alt+c", showWordCount, { preventDefault: true });
  useHotkeys("cmd+alt+i", showAIInsights, { preventDefault: true });

  return (
    <div>
      <nav>
        <Menubar className="rounded-none border-0 border-b space-x-0.5">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 hover:bg-muted rounded-sm"
          >
            <Sidebar />
          </Button>
          <Separator orientation="vertical" className="max-h-5" />
          <MenubarMenu>
            <MenubarTrigger>File</MenubarTrigger>
            <MenubarContent>
              <MenubarItem onClick={newNote}>
                New Note <MenubarShortcut>⌘N</MenubarShortcut>
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem onClick={saveNote}>
                Save Note <MenubarShortcut>⌘S</MenubarShortcut>
              </MenubarItem>
              <MenubarItem onClick={openNote}>
                Open Note <MenubarShortcut>⌘O</MenubarShortcut>
              </MenubarItem>
              <MenubarSeparator />
              <MenubarSub>
                <MenubarSubTrigger>Export</MenubarSubTrigger>
                <MenubarSubContent>
                  <MenubarItem onClick={exportNote}>
                    Export as Markdown
                  </MenubarItem>
                  <MenubarItem onClick={exportToPDF}>Export as PDF</MenubarItem>
                  <MenubarItem onClick={exportNote}>Export as HTML</MenubarItem>
                </MenubarSubContent>
              </MenubarSub>
              <MenubarItem onClick={exportNote}>Import Note</MenubarItem>
              <MenubarSeparator />
              <MenubarItem onClick={deleteNote}>
                Delete Note <MenubarShortcut>⌘⌫</MenubarShortcut>
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger>Edit</MenubarTrigger>
            <MenubarContent>
              <MenubarItem onClick={undo}>
                Undo <MenubarShortcut>⌘Z</MenubarShortcut>
              </MenubarItem>
              <MenubarItem onClick={redo}>
                Redo <MenubarShortcut>⇧⌘Z</MenubarShortcut>
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem onClick={() => document.execCommand("cut")}>
                Cut <MenubarShortcut>⌘X</MenubarShortcut>
              </MenubarItem>
              <MenubarItem onClick={() => document.execCommand("copy")}>
                Copy <MenubarShortcut>⌘C</MenubarShortcut>
              </MenubarItem>
              <MenubarItem onClick={() => document.execCommand("paste")}>
                Paste <MenubarShortcut>⌘V</MenubarShortcut>
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem onClick={find}>
                Find <MenubarShortcut>⌘F</MenubarShortcut>
              </MenubarItem>
              <MenubarItem onClick={replace}>
                Replace <MenubarShortcut>⌘⌥F</MenubarShortcut>
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem onClick={selectAll}>
                Select All <MenubarShortcut>⌘A</MenubarShortcut>
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger>View</MenubarTrigger>
            <MenubarContent>
              <MenubarCheckboxItem
                checked={isFullScreen}
                onClick={toggleFullScreen}
              >
                Full Screen <MenubarShortcut>⌘⌃F</MenubarShortcut>
              </MenubarCheckboxItem>
              <MenubarSeparator />
              <MenubarItem onClick={zoomIn}>
                Zoom In <MenubarShortcut>⌘+</MenubarShortcut>
              </MenubarItem>
              <MenubarItem onClick={zoomOut}>
                Zoom Out <MenubarShortcut>⌘-</MenubarShortcut>
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem>
                Focus Mode <MenubarShortcut>⌘⌥F</MenubarShortcut>
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger>Tools</MenubarTrigger>
            <MenubarContent>
              <MenubarItem onClick={showAIInsights}>
                AI Insights <MenubarShortcut>⌘⌥I</MenubarShortcut>
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem onClick={showWordCount}>
                Word Count <MenubarShortcut>⌘⌥C</MenubarShortcut>
              </MenubarItem>
              <MenubarItem>Spell Check</MenubarItem>
              <MenubarSeparator />
              <MenubarItem onClick={exportToPDF}>Export to PDF</MenubarItem>
              <MenubarSeparator />
              <MenubarItem onClick={showSettings}>
                Settings <MenubarShortcut>⌘,</MenubarShortcut>
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </nav>
      {children}
    </div>
  );
}
