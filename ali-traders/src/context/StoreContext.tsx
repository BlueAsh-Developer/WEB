"use client";
import { createContext, useContext, useReducer, useEffect, useCallback, ReactNode } from "react";
import { useSession } from "next-auth/react";
import { insforge } from "@/lib/insforge";
import { Product } from "@/lib/data";

type CartItem = Product & { quantity: number };
type State = { cart: CartItem[]; wishlist: number[] };
type Action =
  | { type: "ADD_TO_CART"; product: Product }
  | { type: "REMOVE_FROM_CART"; id: number }
  | { type: "UPDATE_QTY"; id: number; qty: number }
  | { type: "CLEAR_CART" }
  | { type: "TOGGLE_WISHLIST"; id: number }
  | { type: "SET_STATE"; state: State };

const initialState: State = { cart: [], wishlist: [] };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_STATE": return action.state;
    case "ADD_TO_CART": {
      const ex = state.cart.find((i) => i.id === action.product.id);
      return { ...state, cart: ex ? state.cart.map((i) => i.id === action.product.id ? { ...i, quantity: i.quantity + 1 } : i) : [...state.cart, { ...action.product, quantity: 1 }] };
    }
    case "REMOVE_FROM_CART": return { ...state, cart: state.cart.filter((i) => i.id !== action.id) };
    case "UPDATE_QTY": return { ...state, cart: state.cart.map((i) => i.id === action.id ? { ...i, quantity: action.qty } : i) };
    case "CLEAR_CART": return { ...state, cart: [] };
    case "TOGGLE_WISHLIST": return { ...state, wishlist: state.wishlist.includes(action.id) ? state.wishlist.filter((id) => id !== action.id) : [...state.wishlist, action.id] };
    default: return state;
  }
}

const StoreContext = createContext<{
  state: State; dispatch: React.Dispatch<Action>; cartCount: number; cartTotal: number;
} | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const { data: session } = useSession();
  const userId = session?.user?.email ?? null;

  const [state, dispatch] = useReducer(reducer, initialState, (init) => {
    if (typeof window === "undefined") return init;
    try { const s = localStorage.getItem("at-store"); return s ? JSON.parse(s) : init; } catch { return init; }
  });

  // Load from DB when user logs in
  useEffect(() => {
    if (!userId) return;
    (async () => {
      const [{ data: cartRows }, { data: wishRows }] = await Promise.all([
        insforge.database.from("carts").select("product_id, quantity, product:products(*)").eq("user_id", userId),
        insforge.database.from("wishlists").select("product_id").eq("user_id", userId),
      ]);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const cart: CartItem[] = (cartRows ?? []).map((r: any) => r.product ? { ...r.product, id: r.product.id, inStock: r.product.in_stock, originalPrice: r.product.original_price, images: r.product.images ?? [], specs: r.product.specs ?? [], badge: r.product.badge ?? "", quantity: r.quantity } : null).filter(Boolean);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const wishlist: number[] = (wishRows ?? []).map((r: any) => r.product_id);

      dispatch({ type: "SET_STATE", state: { cart, wishlist } });
    })();
  }, [userId]);

  // Save to localStorage when not logged in
  useEffect(() => {
    if (!userId) localStorage.setItem("at-store", JSON.stringify(state));
  }, [state, userId]);

  // Sync cart item to DB
  const syncCart = useCallback(async (productId: number, quantity: number) => {
    if (!userId) return;
    if (quantity <= 0) {
      await insforge.database.from("carts").delete().eq("user_id", userId).eq("product_id", productId);
    } else {
      await insforge.database.from("carts").insert([{ user_id: userId, product_id: productId, quantity }])
        // upsert via update on conflict
        .select();
      // If insert fails due to unique constraint, update instead
      await insforge.database.from("carts").update({ quantity, updated_at: new Date().toISOString() }).eq("user_id", userId).eq("product_id", productId);
    }
  }, [userId]);

  // Sync wishlist toggle to DB
  const syncWishlist = useCallback(async (productId: number, add: boolean) => {
    if (!userId) return;
    if (add) {
      await insforge.database.from("wishlists").insert([{ user_id: userId, product_id: productId }]).select();
    } else {
      await insforge.database.from("wishlists").delete().eq("user_id", userId).eq("product_id", productId);
    }
  }, [userId]);

  // Wrap dispatch to also sync to DB
  const wrappedDispatch = useCallback((action: Action) => {
    dispatch(action);
    if (action.type === "ADD_TO_CART") {
      const existing = state.cart.find((i) => i.id === action.product.id);
      syncCart(action.product.id, (existing?.quantity ?? 0) + 1);
    } else if (action.type === "REMOVE_FROM_CART") {
      syncCart(action.id, 0);
    } else if (action.type === "UPDATE_QTY") {
      syncCart(action.id, action.qty);
    } else if (action.type === "CLEAR_CART") {
      if (userId) insforge.database.from("carts").delete().eq("user_id", userId);
    } else if (action.type === "TOGGLE_WISHLIST") {
      const adding = !state.wishlist.includes(action.id);
      syncWishlist(action.id, adding);
    }
  }, [state, syncCart, syncWishlist, userId]);

  const cartCount = state.cart.reduce((s, i) => s + i.quantity, 0);
  const cartTotal = state.cart.reduce((s, i) => s + i.price * i.quantity, 0);

  return (
    <StoreContext.Provider value={{ state, dispatch: wrappedDispatch, cartCount, cartTotal }}>
      {children}
    </StoreContext.Provider>
  );
}

export const useStore = () => {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be inside StoreProvider");
  return ctx;
};
