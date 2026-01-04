import { cva, type VariantProps } from "class-variance-authority";
import { clsx } from "clsx";

const header = cva(
  "w-full px-10 pt-10 pb-4 flex flex-col gap-6 flex-shrink-0 z-10 bg-white border-b border-black"
);

const headerContent = cva("flex flex-col gap-2");

const breadcrumbs = cva(
  "flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400"
);

const breadcrumbItem = cva("", {
  variants: {
    active: {
      true: "text-black",
      false: "",
    },
  },
});

const titleStyles = cva(
  "text-5xl font-black tracking-tighter text-black uppercase"
);

const descriptionStyles = cva("text-gray-500 max-w-2xl mt-2");

export interface HeaderProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof header> {
  breadcrumbs?: string[];
  title: string;
  description?: string;
}

export default function Header({
  breadcrumbs: breadcrumbItems,
  title,
  description: desc,
  className,
  ...props
}: HeaderProps) {
  return (
    <header className={clsx(header(), className)} {...props}>
      <div className={headerContent()}>
        {breadcrumbItems && (
          <div className={breadcrumbs()}>
            {breadcrumbItems.map((crumb, index) => (
              <span key={index}>
                {index > 0 && <span className="mx-2">/</span>}
                <span
                  className={breadcrumbItem({
                    active: index === breadcrumbItems.length - 1,
                  })}
                >
                  {crumb}
                </span>
              </span>
            ))}
          </div>
        )}
        <h2 className={titleStyles()}>
          {title.split("\n").map((line, i) => (
            <span key={i}>
              {line}
              {i < title.split("\n").length - 1 && <br />}
            </span>
          ))}
        </h2>
        {desc && <p className={descriptionStyles()}>{desc}</p>}
      </div>
    </header>
  );
}

