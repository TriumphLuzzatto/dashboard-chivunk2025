'use client';
import * as React from "react";
import { cn } from "@/lib/utils";

export function Table({ className, ...props }: React.ComponentProps<"table">) {
  return (
    <div className="relative w-full overflow-x-auto">
      <table className={cn("w-full caption-bottom text-sm", className)} {...props} />
    </div>
  );
}
export const TableHeader = (props: React.ComponentProps<"thead">) => (
  <thead className="[&_tr]:border-b" {...props} />
);
export const TableBody = (props: React.ComponentProps<"tbody">) => (
  <tbody className="[&_tr:last-child]:border-0" {...props} />
);
export const TableFooter = (props: React.ComponentProps<"tfoot">) => (
  <tfoot className="bg-muted/50 border-t font-medium" {...props} />
);
export const TableRow = (props: React.ComponentProps<"tr">) => (
  <tr className="border-b transition-colors hover:bg-muted/50" {...props} />
);
export const TableHead = (props: React.ComponentProps<"th">) => (
  <th className="h-10 px-2 text-left align-middle font-medium" {...props} />
);
export const TableCell = (props: React.ComponentProps<"td">) => (
  <td className="p-2 align-middle" {...props} />
);
export const TableCaption = (props: React.ComponentProps<"caption">) => (
  <caption className="mt-4 text-sm text-muted-foreground" {...props} />
);