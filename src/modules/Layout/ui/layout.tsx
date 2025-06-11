"use client";
import { useState } from "react";
import styles from "./layout.module.scss";

const Layout = ({ children }: { children: React.ReactNode }) => {
    const [isOpen, setIsOpen] = useState(false);
    
    return (
        <div>
            <div className={styles.navbar}>
                <div className={`flex flex-col gap-1 fixed top-[29px] z-10 ${isOpen ? "right-[20px]" : "left-[20px]"}`} onClick={() => setIsOpen(!isOpen)}>
                    <div className={`h-[2.25px] bg-black w-5 transition-all duration-300 ${isOpen ? "rotate-45 translate-y-[6px] w-6" : ""}`}></div>
                    {!isOpen && <div className={`h-[2.25px] bg-black w-5 ${isOpen ? "-rotate-45" : ""}`}></div>}
                    <div className={`h-[2.25px] bg-black w-5 transition-all duration-300 ${isOpen ? "-rotate-45 w-6" : ""}`}></div>
                </div>
                {!isOpen && <div className={styles.navbar__title}>BESIDER</div>}
            </div>
            <div className={`${styles.overlay} ${isOpen ? styles.active : ''}`} onClick={() => setIsOpen(false)}>
                <ul>
                    <li>SCIENCE</li>
                    <li>GENERAL</li>
                    <li>ENTERTAINMENT</li>
                    <li>TECHNOLOGY</li>
                    <li>BUSINESS</li>
                    <li>HEALTH</li>
                    <li>SPORTS</li>
                </ul>
            </div>
            <div className={`pt-[72px] ${styles.container}`}>
                {children}
            </div>
        </div>
    )
}

export default Layout;