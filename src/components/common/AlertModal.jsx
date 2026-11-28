
"use client";

import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

const TYPES = {
    success: {
        icon: CheckCircle2,
        iconClass: "bg-green-50 text-green-600",
        buttonClass: "bg-green-600 hover:bg-green-700",
    },
    error: {
        icon: AlertCircle,
        iconClass: "bg-red-50 text-red-600",
        buttonClass: "bg-red-600 hover:bg-red-700",
    },
    info: {
        icon: Info,
        iconClass: "bg-blue-50 text-blue-600",
        buttonClass: "bg-[#d6531d] hover:bg-[#bd4818]",
    },
};

export default function AlertModal({
    open,
    onClose,
    title = "Notification",
    message = "",
    type = "success",
    buttonText = "Okay",
}) {
    if (!open) return null;

    const config = TYPES[type] || TYPES.info;
    const Icon = config.icon;

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/40 p-4 backdrop-blur-[3px]">
            <div
                role="alertdialog"
                aria-modal="true"
                className="w-full max-w-[400px] rounded-[26px] border border-[#eee4d7] bg-white p-6 shadow-2xl"
            >
                <div className={`flex size-14 items-center justify-center rounded-2xl ${config.iconClass}`}>
                    <Icon size={27} />
                </div>

                <div className="mt-5">
                    <h2 className="text-xl font-semibold text-[#39251d]">
                        {title}
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-[#82736b]">
                        {message}
                    </p>
                </div>

                <button
                    onClick={onClose}
                    className={`mt-7 w-full rounded-full px-5 py-3 text-sm font-semibold text-white ${config.buttonClass}`}
                >
                    {buttonText}
                </button>
            </div>
        </div>
    );
}
