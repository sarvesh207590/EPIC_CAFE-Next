'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import styles from './snacks.module.css'

export default function Snacks() {
    const router = useRouter()
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true)
    const [quantities, setQuantities] = useState({})

    useEffect(() => {
        fetch('/api/menu?category=snacks')
            .then(r => r.json())
            .then(d => setItems(d.items || []))
            .finally(() => setLoading(false))
    }, [])

    const getQty = (id) => quantities[id] || 1
    const changeQty = (id, delta) => setQuantities(q => ({ ...q, [id]: Math.max(1, (q[id] || 1) + delta) }))

    const handleOrder = (name, price, qty) => {
        sessionStorage.setItem('name', name)
        sessionStorage.setItem('price', price.toString())
        sessionStorage.setItem('quantity', qty.toString())
        router.push('/order')
    }

    return (
        <div className={styles.page}>
            {/* Header */}
            <div className={styles.pageHeader}>
                <Link href="/" className={styles.backBtn}>← Back</Link>
                <div className={styles.headerCenter}>
                    <h1 className={styles.pageTitle}>🥪 Snacks</h1>
                    {!loading && <span className={styles.itemCount}>{items.length} items</span>}
                </div>
                <div style={{ width: 70 }} />
            </div>

            {/* Grid */}
            <div className={styles.grid}>
                {loading && Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className={styles.skeleton} />
                ))}

                {!loading && items.length === 0 && (
                    <div className={styles.empty}>
                        <p>😔 No snacks available right now.</p>
                        <p>Check back soon!</p>
                    </div>
                )}

                {!loading && items.map(item => (
                    <div key={item._id} className={styles.card}>
                        <div className={styles.imgWrap}>
                            <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                className={styles.img}
                                sizes="(max-width: 640px) 100vw, 280px"
                            />
                        </div>
                        <div className={styles.cardBody}>
                            <h2 className={styles.name}>{item.name}</h2>
                            {item.description && (
                                <p className={styles.desc}>{item.description}</p>
                            )}
                            <div className={styles.footer}>
                                <div className={styles.priceBlock}>
                                    <span className={styles.price}>₹{item.price * getQty(item._id)}</span>
                                    {item.unit && <span className={styles.unit}>{item.unit}</span>}
                                </div>
                                <div className={styles.qtyRow}>
                                    <button className={styles.qtyBtn} onClick={() => changeQty(item._id, -1)}>−</button>
                                    <span className={styles.qtyNum}>{getQty(item._id)}</span>
                                    <button className={styles.qtyBtn} onClick={() => changeQty(item._id, 1)}>+</button>
                                </div>
                            </div>
                            <button
                                className={styles.orderBtn}
                                onClick={() => handleOrder(item.name, item.price, getQty(item._id))}
                            >
                                Order Now
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
