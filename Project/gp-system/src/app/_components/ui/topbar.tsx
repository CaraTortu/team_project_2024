"use client";
import React from "react";
import Link from "next/link";

const TopBar: React.FC = () => {
    return (
        <header className="App-header">
            <Link href="/login" className="login-button">
                Login/Register
            </Link>
        </header>
    );
};

export { TopBar };
