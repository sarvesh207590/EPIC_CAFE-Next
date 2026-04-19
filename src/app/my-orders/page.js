'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import styles from './my-orders.module.css'

const STATUS_MESSAGES = {
    pending: '⏳ Your order has been received and is being reviewed.',
    confirmed: '✅ Your order has been confirmed and will be prepared soon.',
    preparing: '👨‍🍳 Your order is being prepared. Please wait...',
    ready: '🔔 Your order is READY for pickup! Please collect it from the counter.',
    completed: '🎉 Order completed. Thank you for visiting Epic Cafe!',
    cancelled: '❌ This order has been cancelled.'
}

const STATUS_LABELS = {
    pending: 'Order Received',
    confirmed: 'Order Confirmed',
    preparing: 'Being Prepared',
    ready: 'Ready for Pickup!',
    completed: 'Completed',
    cancelled: 'Cancelled'
}

export default function MyOrders() {
    const router = useRouter()
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [contactNumber, setContactNumber] = useState('')
    const [isSearching, setIsSearching] = useState(false)
    const [queueInfo, setQueueInfo] = useState(null)
    const [notifPermission, setNotifPermission] = useState('default')
    const prevStatusRef = useRef({})

    // Request notification permission on mount
    useEffect(() => {
        if ('Notification' in window) {
            setNotifPermission(Notification.permission)
        }
        const savedContact = localStorage.getItem('userContact')
        if (savedContact) {
            setContactNumber(savedContact)
            fetchOrders(savedContact)
        } else {
            setLoading(false)
        }
        fetchQueueInfo()
    }, [])

    const requestNotifPermission = async () => {
        if (!('Notification' in window)) return
        const perm = await Notification.requestPermission()
        setNotifPermission(perm)
    }

    const sendNotification = useCallback((order, newStatus) => {
        if (notifPermission !== 'granted') return
        const title = `Epic Cafe — ${STATUS_LABELS[newStatus] || newStatus}`
        const body = `${order.foodItem} (Order #${order._id.slice(-5)})\n${STATUS_MESSAGES[newStatus] || ''}`
        new Notification(title, { body, icon: '/img/epiccafe.jpg' })
    }, [notifPermission])

    const fetchOrders = useCallback(async (contact, silent = false) => {
        if (!contact || contact.length !== 10) {
            if (!silent) alert('Please enter a valid 10-digit contact number')
            return
        }
        if (!silent) setIsSearching(true)
        try {
            const response = await fetch(`/api/user/orders?contact=${contact}`)
            if (response.ok) {
                const data = await response.json()
                const newOrders = data.orders || []

                // Check for status changes and notify
                newOrders.forEach(order => {
                    const prev = prevStatusRef.current[order._id]
                    if (prev && prev !== order.orderStatus) {
                        sendNotification(order, order.orderStatus)
                    }
                    prevStatusRef.current[order._id] = order.orderStatus
                })

                setOrders(newOrders)
                localStorage.setItem('userContact', contact)
            } else {
                if (!silent) { setOrders([]); alert('No orders found for this contact number') }
            }
        } catch (error) {
            console.error('Failed to fetch orders:', error)
        } finally {
            if (!silent) { setIsSearching(false); setLoading(false) }
            else setLoading(false)
        }
    }, [sendNotification])

    // Poll every 15 seconds for status updates
    useEffect(() => {
        if (!contactNumber || contactNumber.length !== 10) return
        const id = setInterval(() => fetchOrders(contactNumber, true), 15000)
        return () => clearInterval(id)
    }, [contactNumber, fetchOrders])

    const fetchQueueInfo = async () => {
        try {
            const response = await fetch('/api/admin/estimate')
            if (response.ok) {
                const data = await response.json()
                setQueueInfo(data.queueStats)
            }
        } catch (error) {
            console.error('Failed to fetch queue info:', error)
        }
    }

    const handleSearch = (e) => {
        e.preventDefault()
        fetchOrders(contactNumber)
    }

    const getStatusColor = (status) => {
        const colors = {
            pending: '#f59e0b', confirmed: '#3b82f6',
            preparing: '#f97316', ready: '#10b981',
            completed: '#6366f1', cancelled: '#ef4444'
        }
        return colors[status] || '#95a5a6'
    }

    const formatTime = (dateString) => {
        return new Date(dateString).toLocaleString('en-IN', {
            year: 'numeric', month: 'short', day: 'numeric',
            hour: '2-digit', minute: '2-digit'
        })
    }

    if (loading) return <div className={styles.loading}>Loading your orders...</div>

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1>My Orders</h1>
                <Link href="/" className={styles.homeButton}>Back to Home</Link>
            </header>

            {/* Notification permission banner */}
            {'Notification' in window && notifPermission === 'default' && (
                <div className={styles.notifBanner}>
                    <span>🔔 Enable notifications to get alerted when your order status changes!</span>
                    <button className={styles.notifBtn} onClick={requestNotifPermission}>Enable</button>
                </div>
            )}
            {notifPermission === 'granted' && (
                <div className={styles.notifGranted}>
                    ✅ Notifications enabled — you'll be alerted when your order status changes.
                </div>
            )}

            <div className={styles.searchSection}>
                <form onSubmit={handleSearch} className={styles.searchForm}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="contact">Enter your contact number to view orders:</label>
                        <input
                            type="tel"
                            id="contact"
                            value={contactNumber}
                            onChange={(e) => setContactNumber(e.target.value)}
                            placeholder="Enter 10-digit mobile number"
                            pattern="[0-9]{10}"
                            maxLength="10"
                            required
                        />
                    </div>
                    <button type="submit" className={styles.searchButton} disabled={isSearching}>
                        {isSearching ? 'Searching...' : 'View My Orders'}
                    </button>
                </form>
            </div>

            {orders.length > 0 && (
                <div className={styles.ordersSection}>
                    <h2>Your Orders ({orders.length}) <span className={styles.liveTag}>● Live</span></h2>

                    {queueInfo && (
                        <div className={styles.queueInfo}>
                            <h3>🍽️ Kitchen Status</h3>
                            <div className={styles.queueStats}>
                                <div className={styles.queueStat}>
                                    <span className={styles.queueNumber}>{queueInfo.totalInQueue}</span>
                                    <span className={styles.queueLabel}>In Queue</span>
                                </div>
                                <div className={styles.queueStat}>
                                    <span className={styles.queueNumber}>{queueInfo.estimatedWaitTime}min</span>
                                    <span className={styles.queueLabel}>Est. Wait</span>
                                </div>
                                <div className={styles.queueStat}>
                                    <span className={styles.queueNumber}>{queueInfo.preparingOrders}</span>
                                    <span className={styles.queueLabel}>Preparing</span>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className={styles.ordersGrid}>
                        {orders.map((order) => (
                            <div key={order._id} className={styles.orderCard}>
                                <div className={styles.orderHeader}>
                                    <h3>Order #{order._id.slice(-6)}</h3>
                                    <div className={styles.statusBadge}
                                        style={{ backgroundColor: getStatusColor(order.orderStatus) }}>
                                        {order.orderStatus.toUpperCase()}
                                    </div>
                                </div>

                                <div className={styles.orderInfo}>
                                    <div className={styles.itemDetails}>
                                        <h4>{order.foodItem}</h4>
                                        <p>Quantity: {order.quantity}</p>
                                        <p>Total: ₹{order.totalPrice}</p>
                                    </div>
                                    <div className={styles.orderMeta}>
                                        <p><strong>Ordered:</strong> {formatTime(order.createdAt)}</p>
                                        <p><strong>Customer:</strong> {order.customerName}</p>
                                        <p><strong>Type:</strong> {order.status}</p>
                                    </div>
                                </div>

                                <div className={styles.statusMessage}>
                                    <p>{STATUS_MESSAGES[order.orderStatus]}</p>
                                </div>

                                {order.orderStatus === 'ready' && (
                                    <div className={styles.readyAlert}>
                                        🔔 Your order is ready for pickup!
                                    </div>
                                )}
                                {order.orderStatus === 'completed' && (
                                    <div className={styles.completedMessage}>
                                        ✅ Thank you for your order! We hope you enjoyed your meal.
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {orders.length === 0 && contactNumber && !isSearching && (
                <div className={styles.noOrders}>
                    <h3>No orders found</h3>
                    <p>No orders were found for {contactNumber}.</p>
                    <p>Make sure you entered the correct number used while placing the order.</p>
                </div>
            )}

            {!contactNumber && (
                <div className={styles.welcomeMessage}>
                    <h3>Track Your Orders</h3>
                    <p>Enter your contact number above to view the status of your orders.</p>
                    <p>You can track your order from placement to completion!</p>
                </div>
            )}
        </div>
    )
}