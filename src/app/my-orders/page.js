'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import styles from './my-orders.module.css'

export default function MyOrders() {
    const router = useRouter()
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [contactNumber, setContactNumber] = useState('')
    const [isSearching, setIsSearching] = useState(false)
    const [queueInfo, setQueueInfo] = useState(null)

    useEffect(() => {
        // Try to get contact number from localStorage
        const savedContact = localStorage.getItem('userContact')
        if (savedContact) {
            setContactNumber(savedContact)
            fetchOrders(savedContact)
        } else {
            setLoading(false)
        }

        // Fetch queue information
        fetchQueueInfo()
    }, [])

    const fetchOrders = async (contact) => {
        if (!contact || contact.length !== 10) {
            alert('Please enter a valid 10-digit contact number')
            return
        }

        setIsSearching(true)
        try {
            const response = await fetch(`/api/user/orders?contact=${contact}`)
            if (response.ok) {
                const data = await response.json()
                setOrders(data.orders)
                localStorage.setItem('userContact', contact)
            } else {
                setOrders([])
                alert('No orders found for this contact number')
            }
        } catch (error) {
            console.error('Failed to fetch orders:', error)
            alert('Failed to fetch orders')
        } finally {
            setIsSearching(false)
            setLoading(false)
        }
    }

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
            pending: '#f39c12',
            confirmed: '#3498db',
            preparing: '#e67e22',
            ready: '#27ae60',
            completed: '#2ecc71',
            cancelled: '#e74c3c'
        }
        return colors[status] || '#95a5a6'
    }

    const getStatusMessage = (status) => {
        const messages = {
            pending: 'Your order has been received and is being reviewed.',
            confirmed: 'Your order has been confirmed and will be prepared soon.',
            preparing: 'Your order is being prepared. Please wait...',
            ready: 'Your order is ready for pickup! Please collect it from the counter.',
            completed: 'Order completed. Thank you for visiting Epic Cafe!',
            cancelled: 'This order has been cancelled.'
        }
        return messages[status] || 'Status unknown'
    }

    const formatTime = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    if (loading) {
        return <div className={styles.loading}>Loading your orders...</div>
    }

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1>My Orders</h1>
                <Link href="/" className={styles.homeButton}>
                    Back to Home
                </Link>
            </header>

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
                    <button
                        type="submit"
                        className={styles.searchButton}
                        disabled={isSearching}
                    >
                        {isSearching ? 'Searching...' : 'View My Orders'}
                    </button>
                </form>
            </div>

            {orders.length > 0 && (
                <div className={styles.ordersSection}>
                    <h2>Your Orders ({orders.length})</h2>

                    {queueInfo && (
                        <div className={styles.queueInfo}>
                            <h3>🍽️ Kitchen Status</h3>
                            <div className={styles.queueStats}>
                                <div className={styles.queueStat}>
                                    <span className={styles.queueNumber}>{queueInfo.totalInQueue}</span>
                                    <span className={styles.queueLabel}>Orders in Queue</span>
                                </div>
                                <div className={styles.queueStat}>
                                    <span className={styles.queueNumber}>{queueInfo.estimatedWaitTime}min</span>
                                    <span className={styles.queueLabel}>Est. Wait Time</span>
                                </div>
                                <div className={styles.queueStat}>
                                    <span className={styles.queueNumber}>{queueInfo.preparingOrders}</span>
                                    <span className={styles.queueLabel}>Being Prepared</span>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className={styles.ordersGrid}>
                        {orders.map((order) => (
                            <div key={order._id} className={styles.orderCard}>
                                <div className={styles.orderHeader}>
                                    <h3>Order #{order._id.slice(-6)}</h3>
                                    <div
                                        className={styles.statusBadge}
                                        style={{ backgroundColor: getStatusColor(order.orderStatus) }}
                                    >
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
                                    <p>{getStatusMessage(order.orderStatus)}</p>
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
                    <p>No orders were found for the contact number {contactNumber}.</p>
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