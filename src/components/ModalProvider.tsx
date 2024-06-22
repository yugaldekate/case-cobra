"use client";

import { useModal } from "@/lib/use-modal";
import { useEffect, useState } from "react";
import LoginModal from "./LoginModal";

export const ModalProvider = () => {
    const [isMounted, setIsMounted] = useState(false);

    const {isOpen, onClose} = useModal();

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    return (
        <>
            <LoginModal isOpen={isOpen} setIsOpen={onClose}/>
        </>
    )
}