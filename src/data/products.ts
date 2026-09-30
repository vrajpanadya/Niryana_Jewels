import { ASSETS } from '@/lib/assets'

export type Product={id:string;slug:string;name:string;category:string;price:number;compareAt?:number;image:string;images:string[];video?:string;metal:string;purity:string;stone?:string;rating:number;reviews:number;stock:number;sizes:string[];badge?:string;description:string}
export const products:Product[]=[
{id:'p1',slug:'celestial-diamond-ring',name:'Celestial Diamond Ring',category:'Rings',price:24500,compareAt:28000,image:ASSETS.images.diamondRing,images:[ASSETS.images.diamondRing,ASSETS.images.goldRing,ASSETS.images.heartRing],video:ASSETS.videos.hero,metal:'Gold',purity:'22K',stone:'Diamond',rating:4.8,reviews:12,stock:5,sizes:['8','10','12','14','16'],badge:'Bestseller',description:'A sculptural gold ring with a luminous diamond composition, meticulously finished by our Surat artisans.'},
{id:'p2',slug:'rose-petal-diamond-ring',name:'Rose Petal Diamond Ring',category:'Rings',price:28900,compareAt:32000,image:ASSETS.images.roseRing,images:[ASSETS.images.roseRing,ASSETS.images.heartRing],metal:'Rose Gold',purity:'18K',stone:'Diamond',rating:4.9,reviews:18,stock:4,sizes:['8','10','12','14'],badge:'New',description:'Romantic rose gold curves and brilliant stones come together in an intimate, modern heirloom.'},
{id:'p3',slug:'signature-diamond-necklace',name:'Signature Diamond Necklace',category:'Necklaces',price:68000,compareAt:75000,image:ASSETS.images.necklace,images:[ASSETS.images.necklace,ASSETS.images.collection],video:ASSETS.videos.gems,metal:'Gold',purity:'18K',stone:'Diamond',rating:5,reviews:9,stock:2,sizes:['16 inches','18 inches'],badge:'Limited',description:'An exquisite necklace designed to frame light, handcrafted for celebrations that become memories.'},
{id:'p4',slug:'sculpted-gold-earrings',name:'Sculpted Gold Earrings',category:'Earrings',price:32000,image:ASSETS.images.earrings,images:[ASSETS.images.earrings,ASSETS.images.detail],metal:'Gold',purity:'18K',stone:'Diamond',rating:4.7,reviews:8,stock:6,sizes:['One size'],description:'Fluid sculptural forms meet fine pavé detailing in a pair made for effortless elegance.'},
{id:'p5',slug:'shree-ram-pendant',name:'Shree Ram Pendant',category:'Spiritual',price:18500,image:ASSETS.images.ramPendant,images:[ASSETS.images.ramPendant,ASSETS.images.detail],video:ASSETS.videos.spiritual,metal:'Silver',purity:'925',rating:4.9,reviews:28,stock:8,sizes:['18 inches','20 inches','22 inches'],badge:'Devotional',description:'A sacred expression of faith, shaped in hallmarked silver with reverence and exceptional detail.'},
{id:'p6',slug:'eternal-gold-bracelet',name:'Eternal Gold Bracelet',category:'Bracelets',price:28000,compareAt:32000,image:ASSETS.images.bracelet,images:[ASSETS.images.bracelet,ASSETS.images.lifestyle],video:ASSETS.videos.bracelets,metal:'Gold',purity:'22K',rating:4.7,reviews:18,stock:7,sizes:['7 inches','7.5 inches','8 inches'],badge:'New',description:'A confident everyday bracelet balancing clean structure with the warmth of polished gold.'},
{id:'p7',slug:'love-sealed-heart-ring',name:'Love Sealed Heart Ring',category:'Rings',price:16500,image:ASSETS.images.heartRing,images:[ASSETS.images.heartRing,ASSETS.images.goldRing],metal:'Gold',purity:'9K',stone:'Diamond',rating:4.8,reviews:21,stock:9,sizes:['8','10','12','14','16'],description:'A graceful heart silhouette with a brilliant centre—an everyday reminder of what matters.'},
{id:'p8',slug:'heritage-stack-ring',name:'Heritage Stack Ring',category:'Rings',price:19500,image:ASSETS.images.goldRing,images:[ASSETS.images.goldRing,ASSETS.images.diamondRing],metal:'Gold',purity:'18K',rating:4.6,reviews:14,stock:11,sizes:['8','10','12','14'],description:'Fine textures and warm gold tones, designed to stack beautifully or shine on its own.'}
]
export const categories=[
{name:'Rings',slug:'rings',image:ASSETS.images.goldRing,count:4},
{name:'Earrings',slug:'earrings',image:ASSETS.images.earrings,count:1},
{name:'Pendants',slug:'spiritual',image:ASSETS.images.ramPendant,count:1},
{name:'Bracelets',slug:'bracelets',image:ASSETS.images.bracelet,count:1},
{name:'Necklaces',slug:'necklaces',image:ASSETS.images.necklace,count:1},
{name:'Spiritual',slug:'spiritual',image:ASSETS.images.detail,count:1}
]
export const formatINR=(n:number)=>new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0}).format(n)
export const getProduct=(slug:string)=>products.find(p=>p.slug===slug)
