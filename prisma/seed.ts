import {PrismaClient,MetalType} from '@prisma/client'
import bcrypt from 'bcryptjs'
const prisma=new PrismaClient()
const base=process.env.NEXT_PUBLIC_GITHUB_ASSETS_BASE||'https://raw.githubusercontent.com/AksharGabani/Niryana-Jewels-assets/main'
const categories=[['Rings','rings'],['Earrings','earrings'],['Pendants','pendants'],['Bracelets','bracelets'],['Necklaces','necklaces'],['Spiritual','spiritual']]
const products=[
 ['Celestial Diamond Ring','celestial-diamond-ring','NJ-RNG-001',24500,'rings','22K','products/rings/celestial-diamond-ring-1.jpg'],
 ['Rose Petal Diamond Ring','rose-petal-diamond-ring','NJ-RNG-002',28900,'rings','18K','products/rings/rose-petal-diamond-ring-1.jpg'],
 ['Signature Diamond Necklace','signature-diamond-necklace','NJ-NCK-001',68000,'necklaces','18K','products/necklaces/emerald-halo-necklace-1.jpg'],
 ['Sculpted Gold Earrings','sculpted-gold-earrings','NJ-EAR-001',32000,'earrings','18K','products/earrings/rose-petal-diamond-earrings-1.jpg'],
 ['Shree Ram Pendant','shree-ram-pendant','NJ-PND-001',18500,'spiritual','925','products/pendants/mahadev-trishul-pendant-1.jpg'],
 ['Eternal Gold Bracelet','eternal-gold-bracelet','NJ-BRC-001',28000,'bracelets','22K','products/bracelets/rudraksha-gold-bracelet-1.jpg']
] as const
async function main(){const ids:Record<string,string>={};for(let i=0;i<categories.length;i++){const[name,slug]=categories[i];const c=await prisma.category.upsert({where:{slug},update:{},create:{name,slug,sortOrder:i+1,image:`${base}/categories/${slug}-category.jpg`}});ids[slug]=c.id}for(const[name,slug,sku,price,category,purity,image]of products)await prisma.product.upsert({where:{slug},update:{},create:{name,slug,sku,price,categoryId:ids[category],description:`A considered Niryana creation, handcrafted in Surat with heart and heritage.`,metalType:purity==='925'?MetalType.SILVER:MetalType.GOLD,metalPurity:purity,stock:8,isFeatured:true,images:{create:{url:`${base}/${image}`,alt:name}}}});await prisma.user.upsert({where:{email:'admin@niryanajewels.com'},update:{},create:{name:'Niryana Admin',email:'admin@niryanajewels.com',password:await bcrypt.hash(process.env.SEED_ADMIN_PASSWORD||'change-me-before-production',12),role:'SUPER_ADMIN',emailVerified:new Date()}});console.log('Niryana seed complete')}
main().catch(e=>{console.error(e);process.exit(1)}).finally(()=>prisma.$disconnect())
