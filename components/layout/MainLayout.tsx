import { cva, type VariantProps } from "class-variance-authority";
import { clsx } from "clsx";
import Sidebar from "./Sidebar";
import Header from "./Header";

const mainLayout = cva(
  "bg-white text-slate-900 font-display h-screen overflow-hidden flex selection:bg-black selection:text-white"
);

const mainContent = cva(
  "flex-1 flex flex-col h-full overflow-hidden bg-white relative"
);

const contentArea = cva(
  "flex-1 overflow-y-auto px-10 py-12 bg-surface grid-bg"
);

export interface MainLayoutProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof mainLayout> {
  children: React.ReactNode;
  breadcrumbs?: string[];
  title: string;
  description?: string;
}

export default function MainLayout({
  children,
  breadcrumbs,
  title,
  description,
  className,
  ...props
}: MainLayoutProps) {
  return (
    <div className={clsx(mainLayout(), className)} {...props}>
      <Sidebar />
      <main className={mainContent()}>
        <Header breadcrumbs={breadcrumbs} title={title} description={description} />
        <div className={contentArea()}>
          {children}
        </div>
      </main>
    </div>
  );
}

