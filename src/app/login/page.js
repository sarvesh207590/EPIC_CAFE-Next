'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import styles from './login.module.css'

export default function Login() {
    const router = useRouter()
    const [mode, setMode] = useState('user')
    const [formData, setFormData] = useState({ email: '', password: '' })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
        setError('')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        try {
            const res = await fetch(mode === 'admin' ? '/api/admin/login' : '/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            })
            const data = await res.json()
            if (data.success) {
                router.push(mode === 'admin' ? '/admin' : '/')
            } else {
                setError(data.message || 'Login failed. Please try again.')
            }
        } catch {
            setError('Login failed. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const switchMode = (m) => {
        setMode(m)
        setError('')
        setFormData({ email: '', password: '' })
    }

    return (
        <div className={styles.page}>
            <div className={styles.card}>

                {/* Left panel — branding */}
                <div className={`${styles.panel} ${mode === 'admin' ? styles.panelAdmin : styles.panelUser}`}>
                    <div className={styles.panelInner}>
                        <div className={styles.logo}>🍽️</div>
                        <h1 className={styles.brand}>Epic Cafe</h1>
                        <p className={styles.tagline}>
                            {mode === 'admin' ? 'Manage your canteen from one place.' : 'Order delicious food from your college canteen.'}
                        </p>
                        <div className={styles.modeSwitcher}>
                            <button
                                type="button"
                                className={mode === 'user' ? styles.switchActive : styles.switchBtn}
                                onClick={() => switchMode('user')}
                            >
                                👤 User
                            </button>
                            <button
                                type="button"
                                className={mode === 'admin' ? styles.switchActive : styles.switchBtn}
                                onClick={() => switchMode('admin')}
                            >
                                🔐 Admin
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right panel — form */}
                <div className={styles.formPanel}>
                    <div className={styles.formInner}>
                        <h2 className={styles.formTitle}>
                            {mode === 'admin' ? 'Admin Sign In' : 'Welcome back!'}
                        </h2>
                        <p className={styles.formSub}>
                            {mode === 'admin'
                                ? 'Sign in to access the admin dashboard'
                                : 'Sign in to your account to continue'}
                        </p>

                        {error && <div className={styles.error}>{error}</div>}

                        <form onSubmit={handleSubmit} className={styles.form}>
                            <div className={styles.field}>
                                <label htmlFor="email">Email address</label>
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="you@example.com"
                                    required
                                    autoComplete="email"
                                />
                            </div>

                            <div className={styles.field}>
                                <label htmlFor="password">Password</label>
                                <input
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    required
                                    autoComplete="current-password"
                                />
                            </div>

                            <button
                                type="submit"
                                className={`${styles.submitBtn} ${mode === 'admin' ? styles.submitAdmin : styles.submitUser}`}
                                disabled={loading}
                            >
                                {loading ? 'Signing in…' : mode === 'admin' ? 'Sign in as Admin' : 'Sign In'}
                            </button>
                        </form>

                        {mode === 'user' && (
                            <p className={styles.registerLink}>
                                Don&apos;t have an account?{' '}
                                <Link href="/signup">Register here</Link>
                            </p>
                        )}

                        {mode === 'admin' && (
                            <p className={styles.adminNote}>
                                🔒 Restricted to authorised staff only
                            </p>
                        )}
                    </div>
                </div>

            </div>
        </div>
    )
}
