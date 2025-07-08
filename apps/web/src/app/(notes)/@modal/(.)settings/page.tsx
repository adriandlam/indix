"use client";

import { motion, AnimatePresence } from "framer-motion";

import { Switch } from "@indix/ui/components/switch";
import { Button } from "@indix/ui/components/button";
import {
  Keyboard,
  Lock,
  MousePointer2,
  Palette,
  PlugZap,
  Sparkles,
  User,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@indix/ui/lib/utils";
import { useHotkeys } from "react-hotkeys-hook";

export default function SettingsModal() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  useHotkeys("esc", () => handleClose(), { preventDefault: true });

  const handleClose = () => {
    setIsVisible(false);
    // Delay the router navigation to allow exit animation to complete
    setTimeout(() => {
      router.back();
    }, 300); // Adjust timing to match your animation duration
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 0.25,
            ease: [0.16, 1, 0.3, 1],
          }}
          onClick={handleClose}
          className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center"
        >
          <motion.div
            key="modal"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{
              duration: 0.25,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="relative"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 0.25,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="rounded-lg border w-[70vw] h-[80vh] flex flex-col"
            >
              {/* Content */}
              <div className="flex flex-1 min-h-0 rounded-lg relative">
                <div className="absolute top-2 right-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-7 h-7 text-muted-foreground"
                    onClick={handleClose}
                  >
                    <X />
                  </Button>
                </div>
                <div className="flex flex-col gap-6 w-1/4 pl-4 py-5 pr-1 border-r overflow-y-auto bg-secondary rounded-l-lg">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-medium text-muted-foreground">
                      Account
                    </span>
                    <div className="-ml-3 flex flex-col gap-0.5">
                      <Button
                        size="sm"
                        variant="ghost"
                        className={cn(
                          "justify-start text-muted-foreground [&_svg]:text-muted-foreground",
                          activeTab === "profile" && "bg-accent text-primary"
                        )}
                        onClick={() => setActiveTab("profile")}
                      >
                        <User />
                        Profile
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className={cn(
                          "justify-start text-muted-foreground [&_svg]:text-muted-foreground",
                          activeTab === "security" && "bg-accent text-primary"
                        )}
                        onClick={() => setActiveTab("security")}
                      >
                        <Lock />
                        Security
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className={cn(
                          "justify-start text-muted-foreground [&_svg]:text-muted-foreground",
                          activeTab === "integrations" &&
                            "bg-accent text-primary"
                        )}
                        onClick={() => setActiveTab("integrations")}
                      >
                        <PlugZap /> Integrations
                      </Button>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-medium text-muted-foreground">
                      Editor
                    </span>
                    <div className="-ml-3 flex flex-col gap-0.5">
                      <Button
                        size="sm"
                        variant="ghost"
                        className={cn(
                          "justify-start text-muted-foreground [&_svg]:text-muted-foreground",
                          activeTab === "appearance" && "bg-accent text-primary"
                        )}
                        onClick={() => setActiveTab("appearance")}
                      >
                        <Palette /> Appearance
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className={cn(
                          "justify-start text-muted-foreground [&_svg]:text-muted-foreground",
                          activeTab === "behavior" && "bg-accent text-primary"
                        )}
                        onClick={() => setActiveTab("behavior")}
                      >
                        <MousePointer2 /> Behavior
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className={cn(
                          "justify-start text-muted-foreground [&_svg]:text-muted-foreground",
                          activeTab === "intelligence" &&
                            "bg-accent text-primary"
                        )}
                        onClick={() => setActiveTab("intelligence")}
                      >
                        <Sparkles /> Intelligence
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className={cn(
                          "justify-start text-muted-foreground [&_svg]:text-muted-foreground",
                          activeTab === "shortcuts" && "bg-accent text-primary"
                        )}
                        onClick={() => setActiveTab("shortcuts")}
                        disabled
                      >
                        <Keyboard />
                        Shortcuts
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="w-3/4 px-10 pb-10 pt-9 overflow-y-auto bg-background">
                  {activeTab === "profile" && (
                    <div className="space-y-6">
                      <h2 className="text-2xl font-medium tracking-tight">
                        Profile
                      </h2>
                      <div className="flex flex-col gap-1">
                        <div className="text-sm text-muted-foreground">
                          account
                        </div>
                        <div className="text-sm text-muted-foreground">
                          email
                        </div>
                        <div className="text-sm text-muted-foreground">
                          avatar
                        </div>
                      </div>
                    </div>
                  )}
                  {activeTab === "security" && (
                    <div className="space-y-6">
                      <h2 className="text-2xl font-medium tracking-tight">
                        Security
                      </h2>
                      <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <div className="text-sm font-medium">Password</div>
                            <div className="text-xs text-muted-foreground">
                              Update your password
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            Update password
                          </Button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <div className="text-sm font-medium">
                              Two-factor authentication
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Protect your account with two-factor
                              authentication
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            Enable 2FA
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                  {activeTab === "integrations" && (
                    <div className="space-y-6">
                      <h2 className="text-2xl font-medium tracking-tight">
                        Integrations
                      </h2>
                      <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <div className="text-sm font-medium">GitHub</div>
                            <div className="text-xs text-muted-foreground">
                              Sync your notes with a GitHub repository
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            Connect
                          </Button>
                        </div>
                        {/* <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <div className="text-sm font-medium">Google</div>
                            <div className="text-xs text-muted-foreground">
                              Connect your Google account
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            Connect
                          </Button>
                        </div> */}
                      </div>
                    </div>
                  )}
                  {activeTab === "appearance" && (
                    <div className="space-y-6">
                      <h2 className="text-2xl font-medium tracking-tight">
                        Appearance
                      </h2>
                      <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <div className="text-sm font-medium">Font size</div>
                            <div className="text-xs text-muted-foreground">
                              Change the font size of your notes
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            add slider here
                          </Button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <div className="text-sm font-medium">
                              Line height
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Change the line height of your notes
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            add slider here
                          </Button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <div className="text-sm font-medium">Theme</div>
                            <div className="text-xs text-muted-foreground">
                              Change the theme of your notes
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            select theme here
                          </Button>
                        </div>
                      </div>
                      <div className="bg-secondary border p-4 rounded-md text-sm">
                        maybe add preview down here?
                      </div>
                    </div>
                  )}
                  {activeTab === "behavior" && (
                    <div className="space-y-6">
                      <h2 className="text-2xl font-medium tracking-tight">
                        Behavior
                      </h2>
                      <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <div className="text-sm font-medium">
                              Autosave (on enable slide in autosave interval
                              select hting)
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Automatically save your notes
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            select thign here
                          </Button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <div className="text-sm font-medium">Word Wrap</div>
                            <div className="text-xs text-muted-foreground">
                              Wrap long lines of text
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            select thign here
                          </Button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <div className="text-sm font-medium">
                              Spell Check
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Check your notes for spelling errors
                            </div>
                          </div>
                          <Switch />
                        </div>
                      </div>
                    </div>
                  )}
                  {activeTab === "shortcuts" && <div>keyboard shortcuts</div>}
                  {activeTab === "intelligence" && (
                    <div className="space-y-6">
                      <h2 className="text-2xl font-medium tracking-tight">
                        Intelligence
                      </h2>
                      <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <div className="text-sm font-medium">
                              Suggestions
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Enable or disable suggestions in your notes
                            </div>
                          </div>
                          <Switch />
                        </div>
                      </div>
                    </div>
                  )}
                  {/* {activeTab === "data-control" && (
                    <div>
                      what gets processed, what gets sent to AI, what gets
                      stored
                    </div>
                  )}
                  {activeTab === "storage-location" && (
                    <div>local only vs cloud sync</div>
                  )} */}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
