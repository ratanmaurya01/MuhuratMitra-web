

"use client";

import {
    AlertTriangle,
    Trash2,
    Info,
    X,
    Loader2,
} from "lucide-react";

const VARIANTS = {
    danger: {
        icon: Trash2,
        iconBg: "bg-red-50",
        iconColor: "text-red-600",
        button: "bg-red-600 hover:bg-red-700",
    },
    warning: {
        icon: AlertTriangle,
        iconBg: "bg-amber-50",
        iconColor: "text-amber-600",
        button: "bg-[#d6531d] hover:bg-[#bd4818]",
    },
    info: {
        icon: Info,
        iconBg: "bg-blue-50",
        iconColor: "text-blue-600",
        button: "bg-[#d6531d] hover:bg-[#bd4818]",
    },
};

export default function ConfirmModal({
    open,
    onClose,
    onConfirm,
    title = "Are you sure?",
    message = "Do you want to continue with this action?",
    confirmText = "Confirm",
    cancelText = "Cancel",
    variant = "danger",
    loading = false,
}) {
    if (!open) return null;

    const style = VARIANTS[variant] || VARIANTS.danger;
    const Icon = style.icon;

    const handleConfirm = async () => {
        await onConfirm?.();
    };

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4 backdrop-blur-[3px]"
            onMouseDown={(e) => {
                if (e.target === e.currentTarget && !loading) {
                    onClose?.();
                }
            }}
        >
            <div
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="confirm-modal-title"
                aria-describedby="confirm-modal-description"
                className="relative w-full max-w-[420px] animate-in fade-in zoom-in-95 duration-200 rounded-[26px] border border-[#eee4d7] bg-white p-6 shadow-2xl sm:p-7"
            >
                {/* Close Button */}
                <button
                    type="button"
                    onClick={onClose}
                    disabled={loading}
                    aria-label="Close modal"
                    className="absolute right-4 top-4 rounded-full p-2 text-[#927d70] transition hover:bg-[#f8f3ed] hover:text-[#39251d] disabled:opacity-40"
                >
                    <X size={19} />
                </button>

                {/* Icon */}
                <div
                    className={`flex size-14 items-center justify-center rounded-2xl ${style.iconBg}`}
                >
                    <Icon size={26} className={style.iconColor} />
                </div>

                {/* Content */}
                <div className="mt-5">
                    <h2
                        id="confirm-modal-title"
                        className="text-xl font-semibold text-[#39251d]"
                    >
                        {title}
                    </h2>

                    <p
                        id="confirm-modal-description"
                        className="mt-2 text-sm leading-6 text-[#82736b]"
                    >
                        {message}
                    </p>
                </div>

                {/* Actions */}
                <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="rounded-full border border-[#e8ddce] px-6 py-3 text-sm font-semibold text-[#705e53] transition hover:bg-[#faf6f0] disabled:opacity-50"
                    >
                        {cancelText}
                    </button>

                    <button
                        type="button"
                        onClick={handleConfirm}
                        disabled={loading}
                        className={`flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60 ${style.button}`}
                    >
                        {loading && (
                            <Loader2 size={17} className="animate-spin" />
                        )}
                        {loading ? "Please wait..." : confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}











// {/* Cancel Booking */}
// <ConfirmModal
//     open={cancelOpen}
//     onClose={() => setCancelOpen(false)}
//     onConfirm={handleCancelBooking}
//     title="Cancel Booking?"
//     message="Are you sure you want to cancel this booking?"
//     confirmText="Yes, Cancel"
//     variant="warning"
// />

// {/* Delete Address */}
// <ConfirmModal
//     open={deleteOpen}
//     onClose={() => setDeleteOpen(false)}
//     onConfirm={handleDeleteAddress}
//     title="Delete Address?"
//     message="This saved address will be permanently deleted."
//     confirmText="Delete Address"
//     variant="danger"
// />
