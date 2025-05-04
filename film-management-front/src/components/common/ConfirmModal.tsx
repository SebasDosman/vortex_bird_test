import React from "react";
import { Button, Modal } from "./";


interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    isLoading?: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({ isOpen, onClose, onConfirm, title, message, confirmText = "Confirm", cancelText = "Cancel", isLoading = false }) => {
    return (
        <Modal isOpen={ isOpen } onClose={ onClose } title={ title } size="sm">
            <div className="py-4">
                <p className="text-gray-700">{ message }</p>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
                <Button variant="secondary" onClick={ onClose } disabled={ isLoading }>
                    { cancelText }
                </Button>
                <Button variant="primary" onClick={ onConfirm } disabled={ isLoading }>
                    { isLoading ? "Loading..." : confirmText }
                </Button>
            </div>
        </Modal>
    );
};