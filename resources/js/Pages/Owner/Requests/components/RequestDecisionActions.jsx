import React from "react";
import { Eye, XCircle } from "lucide-react";
import { router } from "@inertiajs/react";
import { AppButton } from "../../../../components/shared";

const RequestDecisionActions = ({ rental, onOpenModal }) => {
    const isPaid =
        ["paid", "in_use", "completed", "disputed"].includes(rental?.status) ||
        rental?.payments?.some?.(
            (payment) =>
                (typeof payment.status === "object"
                    ? payment.status?.value
                    : payment.status) === "paid",
        );
    const canCancel =
        ["pending", "confirmed"].includes(rental?.status) && !isPaid;
    const cancelRental = () => {
        if (!confirm("هل أنت متأكد من إلغاء العملية؟")) return;
        router.post(
            `/rentals/${rental.id}/cancel`,
            {
                cancellation_reason: "ألغى المؤجر العملية قبل الدفع",
            },
            { preserveScroll: true },
        );
    };

    if (rental?.status !== "pending") {
        return (
            <div className="flex-center gap-3">
                <AppButton
                    variant="outline"
                    style={{ flex: 1 }}
                    onClick={() => router.visit(`/rentals/${rental.id}`)}
                >
                    <Eye size={16} /> عرض العملية
                </AppButton>
                {canCancel ? (
                    <AppButton
                        variant="danger"
                        style={{ flex: 1 }}
                        onClick={cancelRental}
                    >
                        <XCircle size={16} /> إلغاء
                    </AppButton>
                ) : null}
            </div>
        );
    }

    return (
        <div className="flex-center gap-4">
            <AppButton
                variant="danger"
                style={{ flex: 1 }}
                onClick={() => onOpenModal("reject", rental.id)}
            >
                رفض
            </AppButton>
            <AppButton
                variant="success"
                style={{ flex: 1 }}
                onClick={() => onOpenModal("acceptReview", rental.id)}
            >
                قبول الطلب
            </AppButton>
        </div>
    );
};

export default RequestDecisionActions;
