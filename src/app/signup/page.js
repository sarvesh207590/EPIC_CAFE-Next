'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import styles from './signup.module.css'

export default function Signup() {
    const router = useRouter()
    const [formData, setFormData] = useState({ username: '', email: '', password: '' })
    const [message, setMessage] = useState({ text: '', success: false })
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setMessage({ text: '', success: false })
        try {
            const res = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            })
            const data = await res.json()
            if (data.success) {
                setMessage({ text: 'Account created! Redirecting to login…', success: true })
                setTimeout(() => router.push('/login'), 1800)
            } else {
                setMessage({ text: data.message || 'Signup failed.', success: false })
            }
        } catch {
            setMessage({ text: 'Something went wrong. Please try again.', success: false })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className={styles.page}>
            <div className={styles.card}>
                {/* Left panel */}
                <div className={styles.panel}>
                    <div className={styles.panelInner}>
                        <div className={styles.logo}>🍽️</div>
                        <h1 className={styles.brand}>Epic Cafe</h1>
                        <p className={styles.tagline}>Join us and order delicious food from your college canteen.</p>
                        <p className={styles.loginPrompt}>
                            Already have an account?{' '}
                            <Link href="/login" className={styles.loginLink}>Sign in</Link>
                        </p>
                    </div>
                </div>

                {/* Right form panel */}
                <div className={styles.formPanel}>
                    <div className={styles.formInner}>
                        <h2 className={styles.formTitle}>Create Account</h2>
                        <p className={styles.formSub}>Sign up to start ordering</p>

                        {message.text && (
                            <div className={message.success ? styles.success : styles.error}>
                                {message.text}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className={styles.form}>
                            <div className={styles.field}>
                                <label htmlFor="username">Username</label>
                                <input id="username" type="text" name="username"
                                    value={formData.username} onChange={handleChange}
                                    placeholder="Your name" required />
                            </div>
                            <div className={styles.field}>
                                <label htmlFor="email">Email address</label>
                                <input id="email" type="email" name="email"
                                    value={formData.email} onChange={handleChange}
                                    placeholder="you@example.com" required />
                            </div>
                            <div className={styles.field}>
                                <label htmlFor="password">Password</label>
                                <input id="password" type="password" name="password"
                                    value={formData.password} onChange={handleChange}
                                    placeholder="Min. 6 characters" required minLength={6} />
                            </div>
                            <button type="submit" className={styles.submitBtn} disabled={loading}>
                                {loading ? 'Creating account…' : 'Create Account'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
