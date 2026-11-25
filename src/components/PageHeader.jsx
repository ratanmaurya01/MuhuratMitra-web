"use client"


export function PageHeader({ eyebrow, title, description, action }) {
    return (
        <div className="mb-7 flex flex-col gap-4 border-b border-border/70 pb-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-primary">{eyebrow}</p>
                <h1 className="font-display text-3xl font-semibold leading-tight text-foreground sm:text-4xl">{title}</h1>
                <p className="mt-2 text-sm leading-6 text-muted-foreground sm:text-base">{description}</p>
            </div>
            {action ? <div className="shrink-0">{action}</div> : null}
        </div>
    );
}