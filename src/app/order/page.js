'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import styles from './order.module.css'

export default function Order() {
    const router = useRouter()
    const [foodItem, setFoodItem] = useState('')
    const [price, setPrice] = useState(0)
    const [quantity, setQuantity] = useState(1)
    const [name, setName] = useState('')
    const [contact, setContact] = useState('')
    const [status, setStatus] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const item = sessionStorage.getItem('name') || ''
        const p = parseInt(sessionStorage.getItem('price')) || 0
        setFoodItem(item)
        setPrice(p)
    }, [])

    const total = price * quantity

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        if (!status) { setError('Please select who you are (Student / Faculty / Other)'); return }
        if (contact.length !== 10) { setError('Please enter a valid 10-digit contact number'); return }

        setLoading(true)
        try {
            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ foodItem, price, quantity, totalPrice: total, name, contact, status }),
            })

            if (res.ok) {
                const data = await res.json()
                localStorage.setItem('userContact', contact)
                // Store orderId so payment page can link the transaction
                if (typeof window !== 'undefined') {
                    sessionStorage.setItem('orderId', data.orderId)
                }
                router.push('/payment')
            } else {
                setError('Failed to place order. Please try again.')
            }
        } catch {
            setError('Something went wrong. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className={styles.page}>
            <div className={styles.pageHeader}>
                <Link href="/" className={styles.backBtn}>← Back</Link>
                <h1 className={styles.pageTitle}>Place Order</h1>
                <div style={{ width: 70 }} />
            </div>

            <div className={styles.wrapper}>
                {/* Order summary card */}
                <div className={styles.summaryCard}>
                    <div className={styles.summaryTitle}>Order Summary</div>
                    <div className={styles.summaryItem}>
                        <span>Item</span>
                        <span className={styles.summaryValue}>{foodItem || '—'}</span>
                    </div>
                    <div className={styles.summaryItem}>
                        <span>Unit Price</span>
                        <span className={styles.summaryValue}>₹{price}</span>
                    </div>
                    <div className={styles.summaryItem}>
                        <span>Quantity</span>
                        <span className={styles.summaryValue}>{quantity}</span>
                    </div>
                    <div className={`${styles.summaryItem} ${styles.totalRow}`}>
                        <span>Total</span>
                        <span className={styles.totalValue}>₹{total}</span>
                    </div>
                    <div className={styles.payIcons}>
                        <span className={styles.payLabel}>Pay via</span>
                        <div className={styles.payRow}>
                            <Image src="/img/paytm.png" alt="Paytm" width={36} height={36} />
                            <Image src="/img/gpay.png" alt="GPay" width={36} height={36} />
                            <Image src="/img/phone_pay.png" alt="PhonePe" width={36} height={36} />
                        </div>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className={styles.form}>
                    <h2 className={styles.formTitle}>Your Details</h2>

                    {error && <div className={styles.error}>{error}</div>}

                    <div className={styles.field}>
                        <label>Full Name</label>
                        <input type="text" value={name} onChange={e => setName(e.target.value)}
                            placeholder="Enter your name" required />
                    </div>

                    <div className={styles.field}>
                        <label>Contact Number</label>
                        <input type="tel" value={contact} onChange={e => setContact(e.target.value)}
                            placeholder="10-digit mobile number" maxLength={10}
                            pattern="[0-9]{10}" required />
                    </div>

                    <div className={styles.field}>
                        <label>Quantity</label>
                        <input type="number" value={quantity} min={1}
                            onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 1))} required />
                    </div>

                    <div className={styles.field}>
                        <label>I am a</label>
                        <div className={styles.radioGroup}>
                            {['student', 'faculty', 'other'].map(opt => (
                                <label key={opt} className={`${styles.radioLabel} ${status === opt ? styles.radioActive : ''}`}>
                                    <input type="radio" name="status" value={opt}
                                        checked={status === opt} onChange={() => setStatus(opt)} />
                                    {opt.charAt(0).toUpperCase() + opt.slice(1)}
                                </label>
                            ))}
                        </div>
                    </div>

                    <button type="submit" className={styles.submitBtn} disabled={loading || !foodItem}>
                        {loading ? 'Placing Order…' : 'Proceed to Payment →'}
                    </button>
                </form>
            </div>
        </div>
    )
}
