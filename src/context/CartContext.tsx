"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { Product } from "@/constants/products";

export type CartItem = Product & { quantity: number };

interface CartContextType {
    cart: CartItem[];
    addToCart: (product: Product, qty?: number) => void;
    removeFromCart: (id: string) => void;
    updateQty: (id: string, delta: number) => void;
    clearCart: () => void;
    cartCount: number;
    cartTotal: number;
}

const CartContext = createContext<CartContextType>({
    cart: [],
    addToCart: () => {},
    removeFromCart: () => {},
    updateQty: () => {},
    clearCart: () => {},
    cartCount: 0,
    cartTotal: 0,
});

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [hydrated, setHydrated] = useState(false);

    // Load from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem("nirvaar_cart");
            if (stored) setCart(JSON.parse(stored));
        } catch {}
        setHydrated(true);
    }, []);

    // Save to localStorage on change
    useEffect(() => {
        if (!hydrated) return;
        localStorage.setItem("nirvaar_cart", JSON.stringify(cart));
    }, [cart, hydrated]);

    const addToCart = useCallback((product: Product, qty: number = 1) => {
        setCart(prev => {
            const existing = prev.find(i => i.id === product.id);
            if (existing) {
                return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + qty } : i);
            }
            return [...prev, { ...product, quantity: qty }];
        });
    }, []);

    const removeFromCart = useCallback((id: string) => {
        setCart(prev => prev.filter(i => i.id !== id));
    }, []);

    const updateQty = useCallback((id: string, delta: number) => {
        setCart(prev =>
            prev
                .map(i => i.id === id ? { ...i, quantity: Math.max(0, i.quantity + delta) } : i)
                .filter(i => i.quantity > 0)
        );
    }, []);

    const clearCart = useCallback(() => setCart([]), []);

    const cartCount = cart.reduce((s, i) => s + i.quantity, 0);
    const cartTotal = cart.reduce((s, i) => {
        const price = i.discount ? Math.round(i.price * (1 - i.discount / 100)) : i.price;
        return s + price * i.quantity;
    }, 0);

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQty, clearCart, cartCount, cartTotal }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    return useContext(CartContext);
}
