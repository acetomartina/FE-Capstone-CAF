import { cva } from "class-variance-authority";

export const buttonVariants = cva(
  [
    "inline-flex",
    "items-center",
    "justify-center",
    "gap-2",
    "font-semibold",
    "transition-all",
    "duration-200",
    "focus-visible:outline-none",
    "focus-visible:ring-4",
    "disabled:pointer-events-none",
    "disabled:opacity-60",
  ],
  {
    variants: {
      variant: {
        primary: [
          "bg-caf-green-500",
          "text-white",
          "shadow-caf-sm",
          "hover:bg-caf-green-600",
          "hover:-translate-y-0.5",
          "focus-visible:ring-caf-green-200",
        ],

        secondary: [
          "border",
          "border-caf-green-300",
          "bg-white",
          "text-caf-green-700",
          "hover:border-caf-green-500",
          "hover:bg-caf-green-50",
          "focus-visible:ring-caf-green-100",
        ],

        accent: [
          "bg-caf-fuchsia-500",
          "text-white",
          "shadow-caf-sm",
          "hover:bg-caf-fuchsia-600",
          "hover:-translate-y-0.5",
          "focus-visible:ring-caf-fuchsia-200",
        ],

        dark: [
          "bg-caf-blue-900",
          "text-white",
          "shadow-caf-sm",
          "hover:bg-caf-blue-800",
          "hover:-translate-y-0.5",
          "focus-visible:ring-caf-blue-200",
        ],

        ghost: [
          "bg-transparent",
          "text-caf-ink",
          "hover:bg-caf-green-50",
          "hover:text-caf-green-700",
          "focus-visible:ring-caf-green-100",
        ],
      },

      size: {
        sm: "min-h-9 rounded-caf-sm px-3 text-sm",
        md: "min-h-11 rounded-caf-md px-5 text-sm",
        lg: "min-h-13 rounded-caf-md px-6 text-base",
        xl: "min-h-14 rounded-caf-lg px-8 text-base",
        icon: "size-11 rounded-full p-0",
      },

      fullWidth: {
        true: "w-full",
        false: "",
      },
    },

    defaultVariants: {
      variant: "primary",
      size: "md",
      fullWidth: false,
    },
  },
);