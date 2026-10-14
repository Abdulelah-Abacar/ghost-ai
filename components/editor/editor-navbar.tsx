"use client";

import { Bot, PanelLeftClose, PanelLeftOpen, Share2 } from "lucide-react";
import { UserButton } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";

interface EditorNavbarProps {
  isSidebarOpen: boolean;
  onSidebarToggle: () => void;
  projectName?: string;
  isAiSidebarOpen?: boolean;
  onAiSidebarToggle?: () => void;
  onShare?: () => void;
}

export function EditorNavbar({
  isSidebarOpen,
  onSidebarToggle,
  projectName,
  isAiSidebarOpen = false,
  onAiSidebarToggle,
  onShare,
}: EditorNavbarProps) {
  const SidebarIcon = isSidebarOpen ? PanelLeftClose : PanelLeftOpen;

  return (
    <header className="flex h-14 shrink-0 items-center border-b border-surface-border bg-surface">
      <div className="flex flex-1 items-center px-3">
        <Button
          aria-label={isSidebarOpen ? "Close projects sidebar" : "Open projects sidebar"}
          onClick={onSidebarToggle}
          size="icon"
          variant="ghost"
        >
          <SidebarIcon className="h-5 w-5" />
        </Button>
      </div>

      <div className="flex min-w-0 flex-1 items-center justify-center">
        {projectName && (
          <span className="max-w-full truncate px-3 text-sm font-medium text-copy-primary">
            {projectName}
          </span>
        )}
      </div>

      <div className="flex flex-1 items-center justify-end gap-1 px-3">
        {projectName && (
          <>
            <Button aria-label="Share project" onClick={onShare} variant="ghost">
              <Share2 className="h-4 w-4" />
              <span>Share</span>
            </Button>
            <Button
              aria-label={isAiSidebarOpen ? "Close AI sidebar" : "Open AI sidebar"}
              aria-pressed={isAiSidebarOpen}
              onClick={onAiSidebarToggle}
              size="icon"
              variant={isAiSidebarOpen ? "secondary" : "ghost"}
            >
              <Bot className="h-5 w-5" />
            </Button>
          </>
        )}
        <UserButton />
      </div>
    </header>
  );
}
