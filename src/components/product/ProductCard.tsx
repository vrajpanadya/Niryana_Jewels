'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRef, useState } from 'react'
import { Heart, ShoppingBag } from 'lucide-react'
import { Product, formatINR } from '@/data/products'
import { useWishlistStore } from '@/store/wishlistStore'
import { useCartStore } from '@/store/cartStore'

export default function ProductCard({ product }: { product: Product }) {
  const wishlistIds = useWishlistStore((state) => state.ids)
  const toggleWishlist = useWishlistStore((state) => state.toggle)
  const addToCart = useCartStore((state) => state.addItem)
  const [activeImage, setActiveImage] = useState(0)
  const trackRef = useRef<HTMLDivElement>(null)
  const liked = wishlistIds.includes(product.id)
  const images = product.images.length ? product.images : [product.image]

  function updateActiveImage() {
    const track = trackRef.current
    if (!track || !track.clientWidth) return

    setActiveImage(
      Math.max(0, Math.min(images.length - 1, Math.round(track.scrollLeft / track.clientWidth))),
    )
  }

  function showImage(index: number) {
    const track = trackRef.current
    if (!track) return

    track.scrollTo({ left: index * track.clientWidth, behavior: 'smooth' })
    setActiveImage(index)
  }

  return (
    <article className="group">
      <div className="image-zoom relative aspect-[4/5] overflow-hidden bg-[#f1eee8]">
        <div
          ref={trackRef}
          onScroll={updateActiveImage}
          role="group"
          aria-label={`${product.name} product images`}
          className="hide-scrollbar flex h-full snap-x snap-mandatory overflow-x-auto overscroll-x-contain md:block md:overflow-hidden"
        >
          {images.map((src, index) => (
            <Link
              key={`${src}-${index}`}
              href={`/product/${product.slug}`}
              className={`relative block h-full w-full shrink-0 snap-center ${index > 0 ? 'md:hidden' : ''}`}
            >
              <Image
                src={src}
                alt={`${product.name} view ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 767px) 50vw, 25vw"
              />
            </Link>
          ))}
        </div>

        {product.badge && (
          <span className="pointer-events-none absolute left-3 top-3 z-10 bg-white/90 px-3 py-1.5 text-[9px] uppercase tracking-[.16em]">
            {product.badge}
          </span>
        )}
        <button
          onClick={() => toggleWishlist(product.id)}
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90"
          aria-label={liked ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
        >
          <Heart size={16} fill={liked ? '#173b2c' : 'none'} className={liked ? 'text-forest' : 'text-black/60'} />
        </button>

        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5 md:hidden">
            {images.map((src, index) => (
              <button
                key={`dot-${src}-${index}`}
                type="button"
                onClick={() => showImage(index)}
                aria-label={`Show image ${index + 1} of ${images.length}`}
                aria-current={activeImage === index}
                className={`h-1.5 rounded-full transition-all ${activeImage === index ? 'w-5 bg-forest' : 'w-1.5 bg-black/25'}`}
              />
            ))}
          </div>
        )}

        <button
          onClick={() =>
            addToCart({
              productId: product.id,
              slug: product.slug,
              name: product.name,
              image: product.image,
              price: product.price,
              size: product.sizes[0],
              quantity: 1,
              maxStock: product.stock,
            })
          }
          className="absolute bottom-3 left-3 right-3 z-10 flex translate-y-3 items-center justify-center gap-2 bg-white py-3 text-[10px] uppercase tracking-[.16em] opacity-0 shadow-soft transition-all group-hover:translate-y-0 group-hover:opacity-100"
        >
          <ShoppingBag size={14} /> Add to bag
        </button>
      </div>

      <div className="pt-4 text-center">
        <p className="text-[9px] uppercase tracking-[.18em] text-gold">
          {product.purity} {product.metal}
        </p>
        <Link href={`/product/${product.slug}`}>
          <h3 className="mt-1 font-serif text-lg group-hover:text-gold">{product.name}</h3>
        </Link>
        <p className="mt-1 text-sm">
          {formatINR(product.price)}{' '}
          {product.compareAt && <del className="ml-1 text-xs text-black/35">{formatINR(product.compareAt)}</del>}
        </p>
      </div>
    </article>
  )
}
