"use client";

import MainLayout from "@/components/layout/MainLayout";
import { Button, Input, Select, Checkbox, Badge, Card, Pagination, NavigationTree, EmptyState } from "@/components/ui";

export default function Home() {
  return (
    <MainLayout
      breadcrumbs={["System", "Components"]}
      title="Component Guide"
      description="A collection of reusable UI elements used across the Content Management System. Designed with high contrast, sharp shadows, and a strict black & white palette."
    >
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 xl:grid-cols-2 gap-10 pb-20">
        {/* Typography & Colors */}
        <section className="flex flex-col gap-6">
          <div className="flex items-center gap-4 border-b border-black pb-2">
            <span className="text-xl font-black font-mono">01.</span>
            <h3 className="text-xl font-bold uppercase tracking-tight">
              Typography & Colors
            </h3>
          </div>
          <div className="bg-white p-8 border border-gray-200 shadow-card flex flex-col gap-8">
            <div className="space-y-4">
              <div className="border-l-4 border-black pl-4">
                <p className="text-4xl font-black tracking-tighter">Inter Display</p>
                <p className="text-sm text-gray-400 font-mono mt-1">
                  Weight: 900 (Black)
                </p>
              </div>
              <div className="border-l-4 border-gray-300 pl-4">
                <p className="text-2xl font-bold">Section Heading</p>
                <p className="text-sm text-gray-400 font-mono mt-1">
                  Weight: 700 (Bold)
                </p>
              </div>
              <div className="border-l-4 border-gray-200 pl-4">
                <p className="text-base text-gray-600 leading-relaxed">
                  The quick brown fox jumps over the lazy dog. This is the standard
                  body text style used for descriptions and general content
                  readability.
                </p>
                <p className="text-sm text-gray-400 font-mono mt-1">
                  Weight: 400 (Regular)
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
              <div className="space-y-2">
                <div className="h-16 bg-black border border-black"></div>
                <div className="text-xs font-mono">
                  <p className="font-bold">Black</p>
                  <p className="text-gray-500">#000000</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-16 bg-white border border-gray-200"></div>
                <div className="text-xs font-mono">
                  <p className="font-bold">White</p>
                  <p className="text-gray-500">#FFFFFF</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-16 bg-gray-100 border border-gray-200"></div>
                <div className="text-xs font-mono">
                  <p className="font-bold">Surface</p>
                  <p className="text-gray-500">#F3F4F6</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-16 bg-gray-400 border border-gray-400"></div>
                <div className="text-xs font-mono">
                  <p className="font-bold">Muted</p>
                  <p className="text-gray-500">#9CA3AF</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Buttons & Actions */}
        <section className="flex flex-col gap-6">
          <div className="flex items-center gap-4 border-b border-black pb-2">
            <span className="text-xl font-black font-mono">02.</span>
            <h3 className="text-xl font-bold uppercase tracking-tight">
              Buttons & Actions
            </h3>
          </div>
          <div className="bg-white p-8 border border-gray-200 shadow-card flex flex-col justify-between gap-8 h-full">
            <div className="flex flex-wrap gap-6 items-start">
              <div className="flex flex-col gap-3">
                <Button icon="add" variant="primary">
                  Primary Action
                </Button>
                <p className="text-xs font-mono text-gray-400">.shadow-sharp-gray</p>
              </div>
              <div className="flex flex-col gap-3">
                <Button icon="upload_file" variant="secondary">
                  Secondary
                </Button>
                <p className="text-xs font-mono text-gray-400">.shadow-sharp</p>
              </div>
            </div>
            <div className="border-t border-gray-100 pt-6">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">
                Pagination Control
              </p>
              <Pagination
                currentPage={1}
                totalPages={10}
                onPageChange={(page) => console.log("Page:", page)}
              />
            </div>
          </div>
        </section>

        {/* Inputs & Forms */}
        <section className="flex flex-col gap-6">
          <div className="flex items-center gap-4 border-b border-black pb-2">
            <span className="text-xl font-black font-mono">03.</span>
            <h3 className="text-xl font-bold uppercase tracking-tight">
              Inputs & Forms
            </h3>
          </div>
          <div className="bg-white p-8 border border-gray-200 shadow-card flex flex-col gap-8">
            <Input
              label="Search Field"
              icon="search"
              placeholder="Type to search..."
            />
            <Select
              label="Dropdown Select"
              options={[
                { value: "1", label: "Option One" },
                { value: "2", label: "Option Two" },
                { value: "3", label: "Option Three" },
              ]}
            />
            <Checkbox label="Custom Checkbox Style" defaultChecked />
          </div>
        </section>

        {/* Cards & Badges */}
        <section className="flex flex-col gap-6 xl:row-span-2">
          <div className="flex items-center gap-4 border-b border-black pb-2">
            <span className="text-xl font-black font-mono">04.</span>
            <h3 className="text-xl font-bold uppercase tracking-tight">
              Cards & Badges
            </h3>
          </div>
          <div className="bg-gray-50 p-8 border border-gray-200 flex flex-col gap-8 h-full">
            <div className="flex flex-wrap gap-2 mb-2">
              <Badge variant="published">Published</Badge>
              <Badge variant="draft">Draft</Badge>
              <Badge variant="scheduled">Scheduled</Badge>
            </div>
            <Card
              title="Content Card Title"
              category="Category #ID"
              badge="published"
              image="https://via.placeholder.com/400x300"
              author={{
                name: "Author Name",
                avatar: "https://via.placeholder.com/24",
              }}
              date="2024-01-01"
              onSelect={() => console.log("Selected")}
              onMore={() => console.log("More")}
            />
            <EmptyState label="Empty State / Add New" />
          </div>
        </section>

        {/* Navigation & Hierarchy */}
        <section className="flex flex-col gap-6">
          <div className="flex items-center gap-4 border-b border-black pb-2">
            <span className="text-xl font-black font-mono">05.</span>
            <h3 className="text-xl font-bold uppercase tracking-tight">
              Navigation & Hierarchy
            </h3>
          </div>
          <div className="bg-white p-8 border border-gray-200 shadow-card flex flex-col justify-between gap-8 h-full">
            <div className="space-y-6">
              <div className="flex flex-col gap-1">
                <h4 className="font-bold text-sm uppercase tracking-wider text-black">
                  Multi-level Tree
                </h4>
                <p className="text-sm text-gray-500">
                  Supports infinite nesting, though 3 levels are recommended.
                  Indentation lines guide the eye through the hierarchy.
                </p>
              </div>
              <div className="bg-surface border border-gray-200 p-6 rounded-lg">
                <NavigationTree
                  items={[
                    {
                      label: "Content Manager",
                      icon: "folder",
                      children: [
                        { label: "Overview", href: "#" },
                        {
                          label: "Publications",
                          children: [
                            { label: "Active Posts", href: "#", badge: 12, active: true },
                            { label: "Drafts", href: "#" },
                          ],
                        },
                        { label: "Analytics", href: "#" },
                      ],
                    },
                    {
                      label: "System Settings",
                      icon: "settings",
                      href: "#",
                    },
                  ]}
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 border-t border-gray-100 pt-4">
              <div className="flex flex-col gap-1">
                <div className="h-1 w-8 bg-black mb-1"></div>
                <span className="text-[10px] uppercase font-bold text-gray-400">
                  Level 1
                </span>
                <span className="text-xs text-black font-medium">Card Style</span>
              </div>
              <div className="flex flex-col gap-1">
                <div className="h-1 w-8 bg-gray-300 mb-1"></div>
                <span className="text-[10px] uppercase font-bold text-gray-400">
                  Lines
                </span>
                <span className="text-xs text-black font-medium">Border Left</span>
              </div>
              <div className="flex flex-col gap-1">
                <div className="h-1 w-8 bg-black mb-1 shadow-sharp-sm"></div>
                <span className="text-[10px] uppercase font-bold text-gray-400">
                  Active
                </span>
                <span className="text-xs text-black font-medium">
                  Inverted + Shadow
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
}
