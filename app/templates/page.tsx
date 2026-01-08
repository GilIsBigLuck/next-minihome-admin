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
  templatesApi,
  type Template,
  type CreateTemplateRequest,
  type UpdateTemplateRequest,
} from "@/lib/api/templates";

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

interface TemplateFormData {
  category: string;
  title: string;
  desc: string;
  imgUrl: string;
  projectUrl: string;
  badge: string;
}

const initialFormData: TemplateFormData = {
  category: "",
  title: "",
  desc: "",
  imgUrl: "",
  projectUrl: "",
  badge: "",
};

export default function TemplatesPage() {
  const queryClient = useQueryClient();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    null
  );
  const [formData, setFormData] = useState<TemplateFormData>(initialFormData);
  const [search, setSearch] = useState("");

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["templates"],
    queryFn: () => templatesApi.getList(),
    retry: 1,
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateTemplateRequest) => templatesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates"] });
      setIsCreateModalOpen(false);
      setFormData(initialFormData);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateTemplateRequest }) =>
      templatesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates"] });
      setIsEditModalOpen(false);
      setSelectedTemplate(null);
      setFormData(initialFormData);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => templatesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templates"] });
      setIsDeleteDialogOpen(false);
      setSelectedTemplate(null);
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

  const handleEdit = (template: Template) => {
    setSelectedTemplate(template);
    setFormData({
      category: template.category,
      title: template.title,
      desc: template.desc || "",
      imgUrl: template.imgUrl || "",
      projectUrl: template.projectUrl || "",
      badge: template.badge?.join(", ") || "",
    });
    setIsEditModalOpen(true);
  };

  const handleUpdate = () => {
    if (!selectedTemplate) return;
    const badge = formData.badge
      .split(",")
      .map((b) => b.trim())
      .filter((b) => b);
    updateMutation.mutate({
      id: selectedTemplate.id,
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

  const handleDelete = (template: Template) => {
    setSelectedTemplate(template);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedTemplate) {
      deleteMutation.mutate(selectedTemplate.id);
    }
  };

  const filteredTemplates = data?.templates.filter(
    (template) =>
      template.title.toLowerCase().includes(search.toLowerCase()) ||
      template.category.toLowerCase().includes(search.toLowerCase()) ||
      template.desc?.toLowerCase().includes(search.toLowerCase())
  );

  if (error) {
    return (
      <MainLayout
        breadcrumbs={["Content", "Templates"]}
        title="Templates"
        description="Manage your portfolio templates"
      >
        <div className="max-w-7xl mx-auto">
          <div className="bg-white border-2 border-red-500 p-8 text-center">
            <p className="text-red-500 font-bold">
              {error instanceof Error
                ? error.message
                : "Failed to load templates"}
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
      breadcrumbs={["Content", "Templates"]}
      title="Templates"
      description="Manage your portfolio templates"
    >
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Actions */}
        <div className="flex items-center justify-between gap-4">
          <Input
            icon="search"
            placeholder="Search templates..."
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
            Add Template
          </Button>
        </div>

        {/* Templates Table */}
        <div className={table()}>
          {isLoading ? (
            <div className="p-12 text-center">
              <span className="material-symbols-outlined animate-spin text-4xl text-gray-400">
                refresh
              </span>
              <p className="text-gray-500 mt-4">Loading templates...</p>
            </div>
          ) : filteredTemplates && filteredTemplates.length > 0 ? (
            <>
              <table className="w-full">
                <thead className={tableHeader()}>
                  <tr>
                    <th
                      className={clsx(tableCell(), "text-left font-bold text-black")}
                    >
                      Template
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
                  {filteredTemplates.map((template) => (
                    <tr key={template.id} className={tableRow()}>
                      <td className={tableCell()}>
                        <div className="flex items-center gap-3">
                          {template.imgUrl ? (
                            <img
                              src={template.imgUrl}
                              alt={template.title}
                              className="w-12 h-12 object-cover border border-gray-200"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gray-100 flex items-center justify-center border border-gray-200">
                              <span className="material-symbols-outlined text-gray-400">
                                web
                              </span>
                            </div>
                          )}
                          <div>
                            <div className="font-bold text-black">
                              {template.title}
                            </div>
                            {template.desc && (
                              <div className="text-xs text-gray-500 truncate max-w-xs">
                                {template.desc}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className={tableCell()}>
                        <Badge variant="draft">{template.category}</Badge>
                      </td>
                      <td className={tableCell()}>
                        <div className="flex flex-wrap gap-1">
                          {template.badge?.map((b, i) => (
                            <Badge key={i} variant="scheduled">
                              {b}
                            </Badge>
                          ))}
                        </div>
                      </td>
                      <td className={tableCell()}>
                        <span className="text-gray-500 text-xs font-mono">
                          {new Date(template.createdAt).toLocaleDateString()}
                        </span>
                      </td>
                      <td className={clsx(tableCell(), "text-right")}>
                        <div className="flex items-center justify-end gap-2">
                          {template.projectUrl && (
                            <a
                              href={template.projectUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 hover:bg-gray-100 rounded transition-colors"
                              title="View Template"
                            >
                              <span className="material-symbols-outlined text-gray-400 hover:text-black">
                                open_in_new
                              </span>
                            </a>
                          )}
                          <button
                            className="p-2 hover:bg-gray-100 rounded transition-colors"
                            title="Edit"
                            onClick={() => handleEdit(template)}
                          >
                            <span className="material-symbols-outlined text-gray-400 hover:text-black">
                              edit
                            </span>
                          </button>
                          <button
                            className="p-2 hover:bg-red-50 rounded transition-colors"
                            title="Delete"
                            onClick={() => handleDelete(template)}
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
                    {filteredTemplates.length}
                  </span>{" "}
                  of <span className="font-bold text-black">{data?.count}</span>{" "}
                  templates
                </p>
              </div>
            </>
          ) : (
            <div className="p-12 text-center">
              <span className="material-symbols-outlined text-4xl text-gray-400">
                web_asset_off
              </span>
              <p className="text-gray-500 mt-4">No templates found</p>
              <Button
                variant="primary"
                className="mt-4"
                onClick={() => {
                  setFormData(initialFormData);
                  setIsCreateModalOpen(true);
                }}
              >
                Add Your First Template
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Create Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Add New Template"
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
              {createMutation.isPending ? "Creating..." : "Create Template"}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className={formGroup()}>
              <label className={formLabel()}>Category *</label>
              <Input
                placeholder="e.g., portfolio, blog, landing"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
              />
            </div>
            <div className={formGroup()}>
              <label className={formLabel()}>Title *</label>
              <Input
                placeholder="Template title"
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
              placeholder="Template description"
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
              <label className={formLabel()}>Demo URL</label>
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
              placeholder="HTML, CSS, JavaScript"
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
                : "Failed to create template"}
            </p>
          )}
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedTemplate(null);
          setFormData(initialFormData);
        }}
        title="Edit Template"
        size="lg"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => {
                setIsEditModalOpen(false);
                setSelectedTemplate(null);
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
                placeholder="e.g., portfolio, blog, landing"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
              />
            </div>
            <div className={formGroup()}>
              <label className={formLabel()}>Title *</label>
              <Input
                placeholder="Template title"
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
              placeholder="Template description"
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
              <label className={formLabel()}>Demo URL</label>
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
              placeholder="HTML, CSS, JavaScript"
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
                : "Failed to update template"}
            </p>
          )}
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setSelectedTemplate(null);
        }}
        onConfirm={confirmDelete}
        title="Delete Template"
        message={`Are you sure you want to delete "${selectedTemplate?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        isLoading={deleteMutation.isPending}
      />
    </MainLayout>
  );
}
