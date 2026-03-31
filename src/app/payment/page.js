'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import styles from './payment.module.css'

export default function Payment() {
    const router = useRouter()
    const [transactionId, setTransactionId] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [orderId, setOrderId] = useState('')
    const [amount, setAmount] = useState(0)

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setOrderId(sessionStorage.getItem('orderId') || '')
            setAmount(parseInt(sessionStorage.getItem('price') || '0'))
        }
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        if (transactionId.length !== 12) {
            setError('Transaction ID must be exactly 12 digits.')
            return
        }

        setLoading(true)
        try {
            const res = await fetch('/api/transactions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ transactionId, orderId, amount }),
            })

            if (res.ok) {
                router.push('/receipt')
            } else {
                setError('Payment verification failed. Please check your Transaction ID.')
            }
        } catch {
            setError('Something went wrong. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className={styles.page}>
            <div className={styles.card}>
                {/* Left — QR */}
                <div className={styles.qrPanel}>
                    <div className={styles.qrTitle}>Scan & Pay</div>
                    <p className={styles.qrSub}>Use any UPI app to complete payment</p>
                    <div className={styles.qrWrap}>
                        <Image src="/img/QR_code.jpg" alt="QR Code" width={220} height={220} className={styles.qrImg} />
                    </div>
                    <div className={styles.upiApps}>
                        <Image src="/img/gpay.png" alt="GPay" width={36} height={36} />
                        <Image src="/img/paytm.png" alt="Paytm" width={36} height={36} />
                        <Image src="/img/phone_pay.png" alt="PhonePe" width={36} height={36} />
                    </div>
                </div>

                {/* Right — form */}
                <div className={styles.formPanel}>
                    <div className={styles.formInner}>
                        <div className={styles.stepBadge}>Step 2 of 3</div>
                        <h2 className={styles.formTitle}>Confirm Payment</h2>
                        <p className={styles.formSub}>
                            After paying, enter the 12-digit Transaction ID from your UPI app.
                        </p>

                        {error && <div className={styles.error}>{error}</div>}

                        <form onSubmit={handleSubmit} className={styles.form}>
                            <div className={styles.field}>
                                <label htmlFor="txn">Transaction ID</label>
                                <input
                                    id="txn"
                                    type="text"
                                    inputMode="numeric"
                                    value={transactionId}
                                    onChange={e => setTransactionId(e.target.value.replace(/\D/g, '').slice(0, 12))}
                                    placeholder="123456789012"
                                    maxLength={12}
                                    required
                                />
                                <span className={styles.charCount}>{transactionId.length}/12</span>
                            </div>

                            <button type="submit" className={styles.submitBtn} disabled={loading || transactionId.length !== 12}>
                                {loading ? 'Verifying…' : 'Verify & Get Receipt →'}
                            </button>
                        </form>

                        <p className={styles.note}>
                            🔒 Your payment is secured. Receipt will be generated after verification.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
