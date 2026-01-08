"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { cva } from "class-variance-authority";
import { clsx } from "clsx";
import MainLayout from "@/components/layout/MainLayout";
import {
  Input,
  Button,
  Badge,
  Modal,
  ConfirmDialog,
} from "@/components/ui";
import {
  projectsApi,
  type Project,
  type CreateProjectRequest,
  type UpdateProjectRequest,
} from "@/lib/api/projects";

const table = cva("w-full bg-white border border-gray-200 shadow-card");

const tableHeader = cva("bg-gray-50 border-b border-gray-200");

const tableRow = cva(
  "border-b border-gray-100 hover:bg-gray-50 transition-colors"
);

const tableCell = cva("px-6 py-4 text-sm");

const formGroup = cva("space-y-2");

const formLabel = cva(
  "block text-xs font-bold uppercase tracking-widest text-gray-400"
);

interface ProjectFormData {
  category: string;
  title: string;
  desc: string;
  imgUrl: string;
  projectUrl: string;
  badge: string;
}

const initialFormData: ProjectFormData = {
  category: "",
  title: "",
  desc: "",
  imgUrl: "",
  projectUrl: "",
  badge: "",
};

export default function ProjectsPage() {
  const queryClient = useQueryClient();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState<ProjectFormData>(initialFormData);
  const [search, setSearch] = useState("");

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["projects"],
    queryFn: () => projectsApi.getList(),
    retry: 1,
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateProjectRequest) => projectsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      setIsCreateModalOpen(false);
      setFormData(initialFormData);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateProjectRequest }) =>
      projectsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      setIsEditModalOpen(false);
      setSelectedProject(null);
      setFormData(initialFormData);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => projectsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      setIsDeleteDialogOpen(false);
      setSelectedProject(null);
    },
  });

  const handleCreate = () => {
    const badge = formData.badge
      .split(",")
      .map((b) => b.trim())
      .filter((b) => b);
    createMutation.mutate({
      category: formData.category,
      title: formData.title,
      desc: formData.desc || undefined,
      imgUrl: formData.imgUrl || undefined,
      projectUrl: formData.projectUrl || undefined,
      badge: badge.length > 0 ? badge : undefined,
    });
  };

  const handleEdit = (project: Project) => {
    setSelectedProject(project);
    setFormData({
      category: project.category,
      title: project.title,
      desc: project.desc || "",
      imgUrl: project.imgUrl || "",
      projectUrl: project.projectUrl || "",
      badge: project.badge?.join(", ") || "",
    });
    setIsEditModalOpen(true);
  };

  const handleUpdate = () => {
    if (!selectedProject) return;
    const badge = formData.badge
      .split(",")
      .map((b) => b.trim())
      .filter((b) => b);
    updateMutation.mutate({
      id: selectedProject.id,
      data: {
        category: formData.category,
        title: formData.title,
        desc: formData.desc || undefined,
        imgUrl: formData.imgUrl || undefined,
        projectUrl: formData.projectUrl || undefined,
        badge: badge.length > 0 ? badge : undefined,
      },
    });
  };

  const handleDelete = (project: Project) => {
    setSelectedProject(project);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedProject) {
      deleteMutation.mutate(selectedProject.id);
    }
  };

  const filteredProjects = data?.projects.filter(
    (project) =>
      project.title.toLowerCase().includes(search.toLowerCase()) ||
      project.category.toLowerCase().includes(search.toLowerCase()) ||
      project.desc?.toLowerCase().includes(search.toLowerCase())
  );

  if (error) {
    return (
      <MainLayout
        breadcrumbs={["Content", "Projects"]}
        title="Projects"
        description="Manage your portfolio projects"
      >
        <div className="max-w-7xl mx-auto">
          <div className="bg-white border-2 border-red-500 p-8 text-center">
            <p className="text-red-500 font-bold">
              {error instanceof Error ? error.message : "Failed to load projects"}
            </p>
            <Button variant="primary" className="mt-4" onClick={() => refetch()}>
              Retry
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout
      breadcrumbs={["Content", "Projects"]}
      title="Projects"
      description="Manage your portfolio projects"
    >
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Actions */}
        <div className="flex items-center justify-between gap-4">
          <Input
            icon="search"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-md"
          />
          <Button
            variant="primary"
            icon="add"
            onClick={() => {
              setFormData(initialFormData);
              setIsCreateModalOpen(true);
            }}
          >
            Add Project
          </Button>
        </div>

        {/* Projects Table */}
        <div className={table()}>
          {isLoading ? (
            <div className="p-12 text-center">
              <span className="material-symbols-outlined animate-spin text-4xl text-gray-400">
                refresh
              </span>
              <p className="text-gray-500 mt-4">Loading projects...</p>
            </div>
          ) : filteredProjects && filteredProjects.length > 0 ? (
            <>
              <table className="w-full">
                <thead className={tableHeader()}>
                  <tr>
                    <th
                      className={clsx(tableCell(), "text-left font-bold text-black")}
                    >
                      Project
                    </th>
                    <th
                      className={clsx(tableCell(), "text-left font-bold text-black")}
                    >
                      Category
                    </th>
                    <th
                      className={clsx(tableCell(), "text-left font-bold text-black")}
                    >
                      Badges
                    </th>
                    <th
                      className={clsx(tableCell(), "text-left font-bold text-black")}
                    >
                      Created
                    </th>
                    <th
                      className={clsx(tableCell(), "text-right font-bold text-black")}
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProjects.map((project) => (
                    <tr key={project.id} className={tableRow()}>
                      <td className={tableCell()}>
                        <div className="flex items-center gap-3">
                          {project.imgUrl ? (
                            <img
                              src={project.imgUrl}
                              alt={project.title}
                              className="w-12 h-12 object-cover border border-gray-200"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gray-100 flex items-center justify-center border border-gray-200">
                              <span className="material-symbols-outlined text-gray-400">
                                image
                              </span>
                            </div>
                          )}
                          <div>
                            <div className="font-bold text-black">
                              {project.title}
                            </div>
                            {project.desc && (
                              <div className="text-xs text-gray-500 truncate max-w-xs">
                                {project.desc}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className={tableCell()}>
                        <Badge variant="draft">{project.category}</Badge>
                      </td>
                      <td className={tableCell()}>
                        <div className="flex flex-wrap gap-1">
                          {project.badge?.map((b, i) => (
                            <Badge key={i} variant="scheduled">
                              {b}
                            </Badge>
                          ))}
                        </div>
                      </td>
                      <td className={tableCell()}>
                        <span className="text-gray-500 text-xs font-mono">
                          {new Date(project.createdAt).toLocaleDateString()}
                        </span>
                      </td>
                      <td className={clsx(tableCell(), "text-right")}>
                        <div className="flex items-center justify-end gap-2">
                          {project.projectUrl && (
                            <a
                              href={project.projectUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 hover:bg-gray-100 rounded transition-colors"
                              title="View Project"
                            >
                              <span className="material-symbols-outlined text-gray-400 hover:text-black">
                                open_in_new
                              </span>
                            </a>
                          )}
                          <button
                            className="p-2 hover:bg-gray-100 rounded transition-colors"
                            title="Edit"
                            onClick={() => handleEdit(project)}
                          >
                            <span className="material-symbols-outlined text-gray-400 hover:text-black">
                              edit
                            </span>
                          </button>
                          <button
                            className="p-2 hover:bg-red-50 rounded transition-colors"
                            title="Delete"
                            onClick={() => handleDelete(project)}
                          >
                            <span className="material-symbols-outlined text-gray-400 hover:text-red-500">
                              delete
                            </span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                <p className="text-sm text-gray-600 font-medium">
                  Showing{" "}
                  <span className="font-bold text-black">
                    {filteredProjects.length}
                  </span>{" "}
                  of <span className="font-bold text-black">{data?.count}</span>{" "}
                  projects
                </p>
              </div>
            </>
          ) : (
            <div className="p-12 text-center">
              <span className="material-symbols-outlined text-4xl text-gray-400">
                folder_off
              </span>
              <p className="text-gray-500 mt-4">No projects found</p>
              <Button
                variant="primary"
                className="mt-4"
                onClick={() => {
                  setFormData(initialFormData);
                  setIsCreateModalOpen(true);
                }}
              >
                Add Your First Project
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Create Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Add New Project"
        size="lg"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setIsCreateModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleCreate}
              disabled={
                createMutation.isPending || !formData.category || !formData.title
              }
            >
              {createMutation.isPending ? "Creating..." : "Create Project"}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className={formGroup()}>
              <label className={formLabel()}>Category *</label>
              <Input
                placeholder="e.g., web, mobile, design"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
              />
            </div>
            <div className={formGroup()}>
              <label className={formLabel()}>Title *</label>
              <Input
                placeholder="Project title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            </div>
          </div>
          <div className={formGroup()}>
            <label className={formLabel()}>Description</label>
            <textarea
              className="w-full bg-white border border-gray-200 text-black py-2.5 px-4 text-sm font-medium focus:outline-none focus:border-black resize-none"
              placeholder="Project description"
              rows={3}
              value={formData.desc}
              onChange={(e) =>
                setFormData({ ...formData, desc: e.target.value })
              }
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className={formGroup()}>
              <label className={formLabel()}>Image URL</label>
              <Input
                placeholder="https://..."
                value={formData.imgUrl}
                onChange={(e) =>
                  setFormData({ ...formData, imgUrl: e.target.value })
                }
              />
            </div>
            <div className={formGroup()}>
              <label className={formLabel()}>Project URL</label>
              <Input
                placeholder="https://..."
                value={formData.projectUrl}
                onChange={(e) =>
                  setFormData({ ...formData, projectUrl: e.target.value })
                }
              />
            </div>
          </div>
          <div className={formGroup()}>
            <label className={formLabel()}>Badges (comma separated)</label>
            <Input
              placeholder="React, TypeScript, Node.js"
              value={formData.badge}
              onChange={(e) =>
                setFormData({ ...formData, badge: e.target.value })
              }
            />
          </div>
          {createMutation.isError && (
            <p className="text-red-500 text-sm">
              {createMutation.error instanceof Error
                ? createMutation.error.message
                : "Failed to create project"}
            </p>
          )}
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedProject(null);
          setFormData(initialFormData);
        }}
        title="Edit Project"
        size="lg"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => {
                setIsEditModalOpen(false);
                setSelectedProject(null);
                setFormData(initialFormData);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleUpdate}
              disabled={
                updateMutation.isPending || !formData.category || !formData.title
              }
            >
              {updateMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className={formGroup()}>
              <label className={formLabel()}>Category *</label>
              <Input
                placeholder="e.g., web, mobile, design"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
              />
            </div>
            <div className={formGroup()}>
              <label className={formLabel()}>Title *</label>
              <Input
                placeholder="Project title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            </div>
          </div>
          <div className={formGroup()}>
            <label className={formLabel()}>Description</label>
            <textarea
              className="w-full bg-white border border-gray-200 text-black py-2.5 px-4 text-sm font-medium focus:outline-none focus:border-black resize-none"
              placeholder="Project description"
              rows={3}
              value={formData.desc}
              onChange={(e) =>
                setFormData({ ...formData, desc: e.target.value })
              }
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className={formGroup()}>
              <label className={formLabel()}>Image URL</label>
              <Input
                placeholder="https://..."
                value={formData.imgUrl}
                onChange={(e) =>
                  setFormData({ ...formData, imgUrl: e.target.value })
                }
              />
            </div>
            <div className={formGroup()}>
              <label className={formLabel()}>Project URL</label>
              <Input
                placeholder="https://..."
                value={formData.projectUrl}
                onChange={(e) =>
                  setFormData({ ...formData, projectUrl: e.target.value })
                }
              />
            </div>
          </div>
          <div className={formGroup()}>
            <label className={formLabel()}>Badges (comma separated)</label>
            <Input
              placeholder="React, TypeScript, Node.js"
              value={formData.badge}
              onChange={(e) =>
                setFormData({ ...formData, badge: e.target.value })
              }
            />
          </div>
          {updateMutation.isError && (
            <p className="text-red-500 text-sm">
              {updateMutation.error instanceof Error
                ? updateMutation.error.message
                : "Failed to update project"}
            </p>
          )}
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setSelectedProject(null);
        }}
        onConfirm={confirmDelete}
        title="Delete Project"
        message={`Are you sure you want to delete "${selectedProject?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        isLoading={deleteMutation.isPending}
      />
    </MainLayout>
  );
}
