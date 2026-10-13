"use client";

import { useEffect, useState } from "react";

export interface Project {
  id: string;
  name: string;
  slug: string;
  ownership: "owned" | "shared";
}

type ProjectDialog = "create" | "rename" | "delete" | null;

const initialProjects: Project[] = [
  { id: "project-1", name: "Commerce Platform", slug: "commerce-platform", ownership: "owned" },
  { id: "project-2", name: "Analytics Pipeline", slug: "analytics-pipeline", ownership: "shared" },
];

export function createSlug(name: string) {
  return name
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function useProjectDialogs() {
  const [projects, setProjects] = useState(initialProjects);
  const [dialog, setDialog] = useState<ProjectDialog>(null);
  const [name, setName] = useState("");
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    function handleOpenCreate() {
      setName("");
      setActiveProjectId(null);
      setDialog("create");
    }
    window.addEventListener("open-create-project", handleOpenCreate);
    return () => window.removeEventListener("open-create-project", handleOpenCreate);
  }, []);

  const activeProject = projects.find(({ id }) => id === activeProjectId) ?? null;

  function openCreate() {
    setName("");
    setActiveProjectId(null);
    setDialog("create");
  }

  function openRename(project: Project) {
    setName(project.name);
    setActiveProjectId(project.id);
    setDialog("rename");
  }

  function openDelete(project: Project) {
    setActiveProjectId(project.id);
    setDialog("delete");
  }

  function closeDialog() {
    if (isLoading) return;
    setDialog(null);
  }

  function submit() {
    const normalizedName = name.trim();
    if (!normalizedName || isLoading) return;
    setIsLoading(true);
    if (dialog === "create") {
      setProjects((current) => [
        ...current,
        { id: crypto.randomUUID(), name: normalizedName, slug: createSlug(normalizedName), ownership: "owned" },
      ]);
    } else if (dialog === "rename" && activeProjectId) {
      setProjects((current) => current.map((project) =>
        project.id === activeProjectId
          ? { ...project, name: normalizedName, slug: createSlug(normalizedName) }
          : project,
      ));
    }
    setIsLoading(false);
    setDialog(null);
  }

  function confirmDelete() {
    if (!activeProjectId || isLoading) return;
    setIsLoading(true);
    setProjects((current) => current.filter(({ id }) => id !== activeProjectId));
    setIsLoading(false);
    setDialog(null);
  }

  return {
    projects,
    dialog,
    name,
    setName,
    slug: createSlug(name),
    activeProject,
    isLoading,
    openCreate,
    openRename,
    openDelete,
    closeDialog,
    submit,
    confirmDelete,
  };
}
