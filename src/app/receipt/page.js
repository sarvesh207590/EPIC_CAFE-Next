'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import styles from './receipt.module.css'

export default function Receipt() {
    const [order, setOrder] = useState(null)
    const [txn, setTxn] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        Promise.all([
            fetch('/api/orders').then(r => r.json()),
            fetch('/api/transactions').then(r => r.json()),
        ]).then(([o, t]) => {
            if (o.success) setOrder(o.order)
            if (t.success) setTxn(t.transaction)
        }).catch(console.error)
            .finally(() => setLoading(false))
    }, [])

    if (loading) return <div className={styles.page}><div className={styles.loading}>Loading receipt…</div></div>
    if (!order || !txn) return <div className={styles.page}><div className={styles.errorState}>Receipt not found. Please contact the counter.</div></div>

    return (
        <div className={styles.page}>
            <div className={styles.receipt}>
                <div className={styles.receiptInner}>
                    <div className={styles.receiptHeader}>
                        <div className={styles.shopName}>🍽️ EPIC CAFE</div>
                        <div className={styles.shopSub}>College Canteen · New Panvel</div>
                    </div>

                    <div className={styles.row}>
                        <span className={styles.rowLabel}>Receipt No</span>
                        <span className={styles.rowValue}>#{order._id.slice(-8).toUpperCase()}</span>
                    </div>
                    <div className={styles.row}>
                        <span className={styles.rowLabel}>Date & Time</span>
                        <span className={styles.rowValue}>
                            {new Date(order.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                        </span>
                    </div>

                    <hr className={styles.divider} />

                    <div className={styles.row}>
                        <span className={styles.rowLabel}>Customer</span>
                        <span className={styles.rowValue}>{order.customerName}</span>
                    </div>
                    <div className={styles.row}>
                        <span className={styles.rowLabel}>Mobile</span>
                        <span className={styles.rowValue}>{order.contact}</span>
                    </div>
                    <div className={styles.row}>
                        <span className={styles.rowLabel}>Type</span>
                        <span className={styles.rowValue}>{order.status}</span>
                    </div>

                    <hr className={styles.divider} />

                    <div className={styles.row}>
                        <span className={styles.rowLabel}>Item</span>
                        <span className={styles.rowValue}>{order.foodItem}</span>
                    </div>
                    <div className={styles.row}>
                        <span className={styles.rowLabel}>Unit Price</span>
                        <span className={styles.rowValue}>₹{order.price}</span>
                    </div>
                    <div className={styles.row}>
                        <span className={styles.rowLabel}>Quantity</span>
                        <span className={styles.rowValue}>{order.quantity}</span>
                    </div>

                    <hr className={styles.divider} />

                    <div className={styles.totalRow}>
                        <span className={styles.totalLabel}>Total Paid</span>
                        <span className={styles.totalValue}>₹{order.totalPrice}</span>
                    </div>

                    <div className={styles.row}>
                        <span className={styles.rowLabel}>Transaction ID</span>
                        <span className={styles.rowValue}>{txn.transactionId}</span>
                    </div>
                    <div className={styles.row}>
                        <span className={styles.rowLabel}>Payment Status</span>
                        <span className={styles.rowValue}>
                            <span className={styles.statusBadge}>Paid ✓</span>
                        </span>
                    </div>

                    <div className={styles.thankYou}>
                        <strong>Thank you for visiting!</strong>
                        <p>Collect your order from the counter in ~15 minutes.</p>
                        <p>Track your order in My Orders section.</p>
                    </div>
                </div>

                <div className={styles.actions}>
                    <button className={styles.printBtn} onClick={() => window.print()}>🖨 Print</button>
                    <Link href="/" className={styles.homeBtn}>🏠 Home</Link>
                </div>
            </div>
        </div>
    )
}
