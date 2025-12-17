'use client';

import SpringModal from "./ui/SpringModal";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'destructive';
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'default',
}: ConfirmDialogProps) {
  return (
    <SpringModal isOpen={open} onClose={()=>onOpenChange(false)}>
      <div className="bg-white border-2 border-gray-200 max-w-[440px] rounded-[5px] flex items-center justify-between flex-col gap-4 p-4">
        <div>
          <p className="text-black font-semibold text-center text-[24px]">
            {title}
          </p>
          
          <p className="text-gray-400 font-normal text-[14px] text-center max-w-[400px] break-all whitespace-pre-wrap">
            {description}
          </p>
        </div>
        <div className="flex gap-4 mt-4">
          <button
            onClick={()=>onOpenChange(false)}
            className="w-[190px] h-[50px] rounded-[5px] bg-[#05222C] text-white font-semibold text-[16px]  outline-none text-text"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="w-[190px] h-[50px] rounded-[5px] bg-green-600 font-semibold text-[16px]  outline-none text-white"
          >
            Continue
          </button>
        </div>
      </div>
    </SpringModal>
  );
}
