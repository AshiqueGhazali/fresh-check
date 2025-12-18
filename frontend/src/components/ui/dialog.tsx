// "use client"

// import * as React from "react"
// import * as DialogPrimitive from "@radix-ui/react-dialog"
// import { XIcon } from "lucide-react"

// import { cn } from "@/lib/utils"

// function Dialog({
//   ...props
// }: React.ComponentProps<typeof DialogPrimitive.Root>) {
//   return <DialogPrimitive.Root data-slot="dialog" {...props} />
// }

// function DialogTrigger({
//   ...props
// }: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
//   return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
// }

// function DialogPortal({
//   ...props
// }: React.ComponentProps<typeof DialogPrimitive.Portal>) {
//   return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />
// }

// function DialogClose({
//   ...props
// }: React.ComponentProps<typeof DialogPrimitive.Close>) {
//   return <DialogPrimitive.Close data-slot="dialog-close" {...props} />
// }

// function DialogOverlay({
//   className,
//   ...props
// }: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
//   return (
//     <DialogPrimitive.Overlay
//       data-slot="dialog-overlay"
//       className={cn(
//         "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
//         className
//       )}
//       {...props}
//     />
//   )
// }

// function DialogContent({
//   className,
//   children,
//   showCloseButton = true,
//   ...props
// }: React.ComponentProps<typeof DialogPrimitive.Content> & {
//   showCloseButton?: boolean
// }) {
//   return (
//     <DialogPortal data-slot="dialog-portal">
//       <DialogOverlay />
//       <DialogPrimitive.Content
//         data-slot="dialog-content"
//         className={cn(
//           "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 outline-none sm:max-w-lg",
//           className
//         )}
//         {...props}
//       >
//         {children}
//         {showCloseButton && (
//           <DialogPrimitive.Close
//             data-slot="dialog-close"
//             className="ring-offset-background bg-gray-200 p-1 rounded-sm data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 opacity-70 transition-opacity hover:opacity-100  disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
//           >
//             <XIcon />
//             <span className="sr-only">Close</span>
//           </DialogPrimitive.Close>
//         )}
//       </DialogPrimitive.Content>
//     </DialogPortal>
//   )
// }

// function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
//   return (
//     <div
//       data-slot="dialog-header"
//       className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
//       {...props}
//     />
//   )
// }

// function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
//   return (
//     <div
//       data-slot="dialog-footer"
//       className={cn(
//         "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
//         className
//       )}
//       {...props}
//     />
//   )
// }

// function DialogTitle({
//   className,
//   ...props
// }: React.ComponentProps<typeof DialogPrimitive.Title>) {
//   return (
//     <DialogPrimitive.Title
//       data-slot="dialog-title"
//       className={cn("text-lg leading-none font-semibold", className)}
//       {...props}
//     />
//   )
// }

// function DialogDescription({
//   className,
//   ...props
// }: React.ComponentProps<typeof DialogPrimitive.Description>) {
//   return (
//     <DialogPrimitive.Description
//       data-slot="dialog-description"
//       className={cn("text-muted-foreground text-sm", className)}
//       {...props}
//     />
//   )
// }

// export {
//   Dialog,
//   DialogClose,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogOverlay,
//   DialogPortal,
//   DialogTitle,
//   DialogTrigger,
// }

"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

function Dialog({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />
}

function DialogTrigger({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
}

function DialogPortal({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />
}

function DialogClose({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />
}

function DialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className
      )}
      {...props}
    />
  )
}

function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
  showCloseButton?: boolean
}) {
  return (
    <DialogPortal data-slot="dialog-portal">
      <DialogOverlay />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        className={cn(
          "bg-background fixed z-50 grid w-full gap-4 rounded-lg border p-6 shadow-lg outline-none",
          // Desktop: centered modal with zoom animation
          "sm:top-[50%] sm:left-[50%] sm:max-w-lg sm:translate-x-[-50%] sm:translate-y-[-50%]",
          "sm:data-[state=open]:animate-in sm:data-[state=closed]:animate-out",
          "sm:data-[state=closed]:fade-out-0 sm:data-[state=open]:fade-in-0",
          "sm:data-[state=closed]:zoom-out-95 sm:data-[state=open]:zoom-in-95",
          "sm:duration-200",
          // Mobile: bottom sheet with slide up animation
          "max-sm:bottom-0 max-sm:left-0 max-sm:right-0 max-sm:rounded-t-2xl max-sm:rounded-b-none",
          "max-sm:max-h-[90vh] max-sm:border-b-0",
          "max-sm:data-[state=open]:animate-in max-sm:data-[state=closed]:animate-out",
          "max-sm:data-[state=closed]:slide-out-to-bottom max-sm:data-[state=open]:slide-in-from-bottom",
          "max-sm:duration-300",
          className
        )}
        {...props}
      >
        {/* Mobile: Drag handle indicator */}
        <div className="sm:hidden w-12 h-1.5 bg-gray-300 rounded-full mx-auto -mt-2 mb-2" />
        
        {children}
        
        {showCloseButton && (
          <DialogPrimitive.Close
            data-slot="dialog-close"
            className="ring-offset-background bg-gray-200 p-1 rounded-sm data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 opacity-70 transition-opacity hover:opacity-100 disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
          >
            <X />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  )
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
      {...props}
    />
  )
}

function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    />
  )
}

function DialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn("text-lg leading-none font-semibold", className)}
      {...props}
    />
  )
}

function DialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
}