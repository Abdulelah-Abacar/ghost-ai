"use client";

import { useEffect, useState } from "react";
import { Check, Copy, LoaderCircle, Mail, Trash2, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface Collaborator {
  email: string;
  name: string | null;
  imageUrl: string | null;
}

interface ShareDialogProps {
  projectId: string;
  projectName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

async function readError(response: Response) {
  const body: unknown = await response.json().catch(() => null);
  return typeof body === "object" &&
    body !== null &&
    "error" in body &&
    typeof body.error === "string"
    ? body.error
    : "Something went wrong. Please try again.";
}

function PersonAvatar({ person }: { person: Collaborator }) {
  if (person.imageUrl) {
    return (
      <img
        alt=""
        className="h-9 w-9 rounded-full object-cover"
        src={person.imageUrl}
      />
    );
  }

  return (
    <div
      aria-hidden="true"
      className="flex h-9 w-9 items-center justify-center rounded-full bg-subtle text-sm font-medium text-copy-secondary"
    >
      {(person.name ?? person.email).slice(0, 1).toUpperCase()}
    </div>
  );
}

export function ShareDialog({
  projectId,
  projectName,
  open,
  onOpenChange,
}: ShareDialogProps) {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [owner, setOwner] = useState<Collaborator | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isInviting, setIsInviting] = useState(false);
  const [removingEmail, setRemovingEmail] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!open) return;
    const controller = new AbortController();
    setIsLoading(true);
    setError(null);
    fetch(`/api/projects/${encodeURIComponent(projectId)}/collaborators`, {
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) throw new Error(await readError(response));
        return response.json() as Promise<{
          collaborators: Collaborator[];
          owner: Collaborator;
          isOwner: boolean;
        }>;
      })
      .then((data) => {
        setCollaborators(data.collaborators);
        setOwner(data.owner);
        setIsOwner(data.isOwner);
      })
      .catch((cause: unknown) => {
        if (cause instanceof Error && cause.name !== "AbortError")
          setError(cause.message);
      })
      .finally(() => setIsLoading(false));
    return () => controller.abort();
  }, [open, projectId]);

  async function invite(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsInviting(true);
    setError(null);
    try {
      const response = await fetch(
        `/api/projects/${encodeURIComponent(projectId)}/collaborators`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        },
      );
      if (!response.ok) throw new Error(await readError(response));
      const data = (await response.json()) as { collaborators: Collaborator[] };
      setCollaborators(data.collaborators);
      setEmail("");
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Unable to invite collaborator.",
      );
    } finally {
      setIsInviting(false);
    }
  }

  async function remove(emailToRemove: string) {
    setRemovingEmail(emailToRemove);
    setError(null);
    try {
      const response = await fetch(
        `/api/projects/${encodeURIComponent(projectId)}/collaborators/${encodeURIComponent(emailToRemove)}`,
        { method: "DELETE" },
      );
      if (!response.ok) throw new Error(await readError(response));
      setCollaborators((items) =>
        items.filter(
          (item) => item.email.toLowerCase() !== emailToRemove.toLowerCase(),
        ),
      );
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Unable to remove collaborator.",
      );
    } finally {
      setRemovingEmail(null);
    }
  }

  async function copyProjectLink() {
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}/editor/${encodeURIComponent(projectId)}`,
      );
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setError("Unable to copy the project link.");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[min(720px,calc(100dvh-2rem))] max-w-lg min-w-fit! gap-10! overflow-y-auto rounded-3xl border border-surface-border bg-surface p-!5 text-copy-primary shadow-2xl">
        <DialogHeader className="flex-row items-start gap-4 border-b border-surface-border px-7 py-6 pr-14">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-accent-dim text-brand">
            <Users className="h-5 w-5" />
          </div>
          <div className="min-w-0 space-y-1.5">
            <DialogTitle className="text-lg font-semibold">
              Share {projectName}
            </DialogTitle>
            <DialogDescription className="text-sm leading-relaxed text-copy-muted">
              Invite people to collaborate on this project.
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="space-y-6 px-7 py-6">
          {isOwner && (
            <form
              className="space-y-3 rounded-2xl border border-surface-border bg-base p-4"
              onSubmit={invite}
            >
              <div className="space-y-1">
                <label
                  className="text-sm font-medium text-copy-primary"
                  htmlFor="collaborator-email"
                >
                  Invite by email
                </label>
                <p className="text-xs leading-relaxed text-copy-muted">
                  They’ll get access as soon as you invite them.
                </p>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="relative min-w-0 flex-1">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-copy-muted" />
                  <Input
                    autoComplete="email"
                    className="h-10 border-surface-border bg-elevated pl-9 text-copy-primary placeholder:text-copy-muted"
                    id="collaborator-email"
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="name@example.com"
                    type="email"
                    value={email}
                    required
                  />
                </div>
                <Button
                  className="h-10 w-full bg-brand px-5 text-base font-medium text-primary-foreground hover:opacity-90 sm:w-auto"
                  disabled={isInviting || !email.trim()}
                  type="submit"
                >
                  {isInviting ? (
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                  ) : (
                    "Invite"
                  )}
                </Button>
              </div>
            </form>
          )}

          <div className="space-y-3 rounded-2xl border border-surface-border bg-base p-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-copy-primary">
                Project link
              </p>
              <p className="text-xs text-copy-muted">
                Share this link with people who already have access.
              </p>
            </div>
            <Button
              className="h-10 w-full justify-between border-surface-border bg-elevated px-3 text-copy-secondary hover:bg-subtle"
              onClick={copyProjectLink}
              type="button"
              variant="outline"
            >
              <span className="truncate text-xs text-copy-muted">
                {typeof window === "undefined"
                  ? ""
                  : `${window.location.host}/editor/${projectId}`}
              </span>
              <span className="ml-3 flex shrink-0 items-center gap-2 text-sm font-medium text-copy-primary">
                {copied ? (
                  <>
                    <Check className="h-4 w-4 text-state-success" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy link
                  </>
                )}
              </span>
            </Button>
          </div>

          <section aria-label="Project members" className="space-y-3.5">
            <div className="flex items-center justify-between gap-3">
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-copy-primary">
                  People with access
                </h3>
                <p className="text-xs text-copy-muted">
                  Only invited people can open this project.
                </p>
              </div>
              <span className="shrink-0 rounded-full border border-surface-border bg-elevated px-2.5 py-1 text-xs font-medium text-copy-secondary">
                {collaborators.length + (owner ? 1 : 0)}
              </span>
            </div>
            {isLoading ? (
              <div className="flex justify-center rounded-2xl border border-surface-border bg-base py-8 text-copy-muted">
                <LoaderCircle
                  aria-label="Loading people with access"
                  className="h-5 w-5 animate-spin"
                />
              </div>
            ) : (
              <div className="space-y-2">
                {owner && <PersonRow person={owner} subtitle="Owner" />}
                {collaborators.map((person) => (
                  <PersonRow
                    key={person.email}
                    person={person}
                    subtitle={person.name ? person.email : "Collaborator"}
                    action={
                      isOwner ? (
                        <Button
                          aria-label={`Remove ${person.email}`}
                          className="text-copy-muted hover:text-state-error"
                          disabled={removingEmail === person.email}
                          onClick={() => remove(person.email)}
                          size="icon"
                          variant="ghost"
                        >
                          {removingEmail === person.email ? (
                            <LoaderCircle className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      ) : (
                        <span className="pr-2 text-xs text-copy-muted">
                          Collaborator
                        </span>
                      )
                    }
                  />
                ))}
                {!owner && collaborators.length === 0 && !error && (
                  <p className="rounded-2xl border border-dashed border-surface-border bg-base px-4 py-8 text-center text-sm text-copy-muted">
                    No collaborators yet. Invite someone to get started.
                  </p>
                )}
              </div>
            )}
          </section>

          {error && (
            <p role="alert" className="text-sm text-state-error">
              {error}
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function PersonRow({
  person,
  subtitle,
  action,
}: {
  person: Collaborator;
  subtitle: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-surface-border bg-base px-3 py-3">
      <PersonAvatar person={person} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-copy-primary">
          {person.name ?? person.email}
        </p>
        <p className="truncate text-xs text-copy-muted">{subtitle}</p>
      </div>
      {action}
    </div>
  );
}
