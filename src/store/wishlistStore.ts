'use client'
import {create} from 'zustand';import{persist}from'zustand/middleware';import{toast}from'./toastStore';import{products}from'@/data/products'
type W={ids:string[];toggle:(id:string)=>void;has:(id:string)=>boolean}
export const useWishlistStore=create<W>()(persist((set,get)=>({ids:[],toggle:id=>{const had=get().ids.includes(id);const name=products.find(p=>p.id===id)?.name;set(s=>({ids:had?s.ids.filter(x=>x!==id):[...s.ids,id]}));if(had)toast.info('Removed from wishlist',name);else toast.success('Saved to wishlist',name,{href:{label:'View wishlist',url:'/wishlist'}})},has:id=>get().ids.includes(id)}),{name:'niryana-wishlist'}))
