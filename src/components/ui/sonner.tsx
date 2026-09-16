"use client";

import { Toaster as SonnerToaster, type ToasterProps } from "sonner";

export function Toaster(props: ToasterProps) {
  return (
    <SonnerToaster
      position="top-right"
      gap={8}
      toastOptions={{
        classNames: {
          toast:
            "!bg-background !text-foreground !border !border-border !rounded-none !shadow-md !py-3 !px-4",
          title: "!text-sm !font-normal",
          icon: "!text-primary",
        },
      }}
      {...props}
    />
  );
}
