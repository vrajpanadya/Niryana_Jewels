'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
export type CartItem={id:string;productId:string;slug:string;name:string;image:string;price:number;size?:string;quantity:number;maxStock:number}
type CartStore={items:CartItem[];isOpen:boolean;addItem:(item:Omit<CartItem,'id'>)=>void;removeItem:(id:string)=>void;updateQuantity:(id:string,q:number)=>void;clearCart:()=>void;openCart:()=>void;closeCart:()=>void}
export const useCartStore=create<CartStore>()(persist((set)=>({items:[],isOpen:false,addItem:(next)=>set(s=>{const existing=s.items.find(i=>i.productId===next.productId&&i.size===next.size);return {isOpen:true,items:existing?s.items.map(i=>i.id===existing.id?{...i,quantity:Math.min(i.quantity+next.quantity,i.maxStock)}:i):[...s.items,{...next,id:`${next.productId}-${next.size||'default'}-${Date.now()}`}]}}),removeItem:(id)=>set(s=>({items:s.items.filter(i=>i.id!==id)})),updateQuantity:(id,q)=>set(s=>({items:s.items.map(i=>i.id===id?{...i,quantity:Math.max(1,Math.min(q,i.maxStock))}:i)})),clearCart:()=>set({items:[],isOpen:false}),openCart:()=>set({isOpen:true}),closeCart:()=>set({isOpen:false})}),{name:'niryana-cart'}))
