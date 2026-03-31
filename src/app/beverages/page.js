'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import styles from './beverages.module.css'

export default function Beverages() {
    const router = useRouter()
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch('/api/menu?category=beverages')
            .then(r => r.json())
            .then(d => setItems(d.items || []))
            .finally(() => setLoading(false))
    }, [])

    const handleOrder = (name, price) => {
        sessionStorage.setItem('name', name)
        sessionStorage.setItem('price', price.toString())
        router.push('/order')
    }

    return (
        <div className={styles.page}>
            <div className={styles.pageHeader}>
                <Link href="/" className={styles.backBtn}>← Back</Link>
                <div className={styles.headerCenter}>
                    <h1 className={styles.pageTitle}>🥤 Beverages</h1>
                    {!loading && <span className={styles.itemCount}>{items.length} items</span>}
                </div>
                <div style={{ width: 70 }} />
            </div>

            <div className={styles.grid}>
                {loading && Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className={styles.skeleton} />
                ))}

                {!loading && items.length === 0 && (
                    <div className={styles.empty}>
                        <p>😔 No beverages available right now.</p>
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
                                sizes="(max-width: 640px) 100vw, 260px"
                            />
                        </div>
                        <div className={styles.cardBody}>
                            <h2 className={styles.name}>{item.name}</h2>
                            {item.description && (
                                <p className={styles.desc}>{item.description}</p>
                            )}
                            <div className={styles.footer}>
                                <div className={styles.priceBlock}>
                                    <span className={styles.price}>₹{item.price}</span>
                                    {item.unit && <span className={styles.unit}>{item.unit}</span>}
                                </div>
                                <button
                                    className={styles.orderBtn}
                                    onClick={() => handleOrder(item.name, item.price)}
                                >
                                    Order Now
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
