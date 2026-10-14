"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export interface Project {
  id: string;
  name: string;
  slug: string;
  ownership: "owned" | "shared";
}

type ProjectDialog = "create" | "rename" | "delete" | null;

export function createSlug(name: string) {
  return name
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function makeSuffix() {
  return crypto.randomUUID().replace(/-/g, "").slice(0, 8);
}

export function useProjectActions(initialProjects: Project[]) {
  const router = useRouter();
  const pathname = usePathname();
  const [dialog, setDialog] = useState<ProjectDialog>(null);
  const [name, setName] = useState("");
  const [targetProject, setTargetProject] = useState<Project | null>(null);
  const [suffix, setSuffix] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const slug = useMemo(() => createSlug(name), [name]);
  const roomId = slug ? `${slug}-${suffix}` : "";

  useEffect(() => {
    function handleOpenCreate() {
      setName("");
      setSuffix(makeSuffix());
      setTargetProject(null);
      setError(null);
      setDialog("create");
    }
    window.addEventListener("open-create-project", handleOpenCreate);
    return () => window.removeEventListener("open-create-project", handleOpenCreate);
  }, []);

  function openCreate() {
    setName("");
    setSuffix(makeSuffix());
    setTargetProject(null);
    setError(null);
    setDialog("create");
  }

  function openRename(project: Project) {
    setName(project.name);
    setTargetProject(project);
    setError(null);
    setDialog("rename");
  }

  function openDelete(project: Project) {
    setTargetProject(project);
    setError(null);
    setDialog("delete");
  }

  function openProject(project: Project) {
    router.push(`/editor/${project.id}`);
  }

  function closeDialog() {
    if (!isLoading) setDialog(null);
  }

  async function submit() {
    const normalizedName = name.trim();
    if (!normalizedName || isLoading) return;
    setIsLoading(true);
    setError(null);
    try {
      if (dialog === "create") {
        if (!roomId) throw new Error("Enter a project name that includes letters or numbers.");
        const response = await fetch("/api/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: roomId, name: normalizedName }),
        });
        const payload = (await response.json()) as { project?: { id: string }; error?: string };
        if (!response.ok || !payload.project) throw new Error(payload.error ?? "Could not create project.");
        router.push(`/editor/${payload.project.id}`);
      } else if (dialog === "rename" && targetProject) {
        const response = await fetch(`/api/projects/${encodeURIComponent(targetProject.id)}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: normalizedName }),
        });
        const payload = (await response.json()) as { error?: string };
        if (!response.ok) throw new Error(payload.error ?? "Could not rename project.");
        setDialog(null);
        router.refresh();
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  }

  async function confirmDelete() {
    if (!targetProject || isLoading) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/projects/${encodeURIComponent(targetProject.id)}`, { method: "DELETE" });
      if (!response.ok) {
        const payload = (await response.json()) as { error?: string };
        throw new Error(payload.error ?? "Could not delete project.");
      }
      setDialog(null);
      if (pathname === `/editor/${targetProject.id}`) router.push("/editor");
      else router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  }

  return {
    projects: initialProjects,
    dialog,
    name,
    setName,
    slug,
    roomId,
    activeProject: targetProject,
    isLoading,
    error,
    openCreate,
    openRename,
    openDelete,
    openProject,
    closeDialog,
    submit,
    confirmDelete,
  };
}
