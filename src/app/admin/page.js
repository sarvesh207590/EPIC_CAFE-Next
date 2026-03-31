'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import styles from './admin.module.css'

const STATUS_FLOW = {
    pending: { next: 'confirmed', label: '✓ Confirm', color: '#3498db' },
    confirmed: { next: 'preparing', label: '👨‍🍳 Start Prep', color: '#e67e22' },
    preparing: { next: 'ready', label: '🔔 Mark Ready', color: '#27ae60' },
    ready: { next: 'completed', label: '✅ Complete', color: '#2ecc71' },
    completed: { next: null, label: 'Done', color: '#95a5a6' },
    cancelled: { next: null, label: 'Cancelled', color: '#e74c3c' },
}
const STATUS_COLUMNS = ['pending', 'confirmed', 'preparing', 'ready']
const CATEGORIES = ['snacks', 'beverages', 'meal']
const BLANK = { name: '', category: 'snacks', image: '', description: '', price: '', unit: '', available: true }

function timeAgo(d) {
    const diff = Math.floor((Date.now() - new Date(d)) / 60000)
    if (diff < 1) return 'Just now'
    if (diff < 60) return `${diff}m ago`
    return `${Math.floor(diff / 60)}h ago`
}
function overdue(d, s) {
    const diff = Math.floor((Date.now() - new Date(d)) / 60000)
    return (s === 'ready' && diff > 15) || (s === 'preparing' && diff > 30) || (s === 'pending' && diff > 10)
}

export default function AdminDashboard() {
    const router = useRouter()
    const [auth, setAuth] = useState(false)
    const [loginData, setLoginData] = useState({ email: '', password: '' })
    const [loginError, setLoginError] = useState('')
    const [loading, setLoading] = useState(true)
    const [view, setView] = useState('kanban')
    const [toast, setToast] = useState(null)

    // orders
    const [orders, setOrders] = useState([])
    const [updating, setUpdating] = useState(null)

    // menu
    const [menuItems, setMenuItems] = useState([])
    const [menuCat, setMenuCat] = useState('snacks')
    const [menuLoading, setMenuLoading] = useState(false)
    const [showForm, setShowForm] = useState(false)
    const [editItem, setEditItem] = useState(null)
    const [form, setForm] = useState(BLANK)
    const [saving, setSaving] = useState(false)
    const [seeding, setSeeding] = useState(false)
    const [imgPreview, setImgPreview] = useState('')
    const [uploading, setUploading] = useState(false)
    const [dragOver, setDragOver] = useState(false)

    const toast$ = (msg, type = 'success') => {
        setToast({ msg, type })
        setTimeout(() => setToast(null), 3000)
    }

    // auth check
    useEffect(() => {
        fetch('/api/admin/auth').then(r => {
            if (r.ok) { setAuth(true); fetchOrders() }
            else setLoading(false)
        }).catch(() => setLoading(false))
    }, [])

    const handleLogin = async (e) => {
        e.preventDefault(); setLoginError('')
        const r = await fetch('/api/admin/login', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(loginData)
        })
        if (r.ok) { setAuth(true); fetchOrders() }
        else setLoginError('Invalid credentials. Try admin@epiccafe.com / admin123')
    }

    // orders
    const fetchOrders = useCallback(async () => {
        try {
            const r = await fetch('/api/admin/orders')
            if (r.ok) { const d = await r.json(); setOrders(d.orders || []) }
        } catch (e) { console.error(e) }
        finally { setLoading(false) }
    }, [])

    useEffect(() => {
        if (!auth) return
        const id = setInterval(fetchOrders, 30000)
        return () => clearInterval(id)
    }, [auth, fetchOrders])

    const advance = async (orderId, status) => {
        setUpdating(orderId)

        // Optimistic update — move card immediately in UI
        setOrders(prev => prev.map(o =>
            o._id === orderId ? { ...o, orderStatus: status } : o
        ))

        const r = await fetch('/api/admin/orders', {
            method: 'PUT', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderId, status })
        })

        if (r.ok) {
            toast$(`Moved to ${status}`)
        } else {
            // Revert on failure
            await fetchOrders()
            toast$('Update failed', 'error')
        }
        setUpdating(null)
    }

    const cancelOrder = async (id) => {
        if (!confirm('Cancel this order?')) return
        await advance(id, 'cancelled')
    }

    // menu
    const fetchMenu = useCallback(async (cat) => {
        setMenuLoading(true)
        const r = await fetch(`/api/menu?category=${cat}`)
        const d = await r.json()
        setMenuItems(d.items || [])
        setMenuLoading(false)
    }, [])

    useEffect(() => { if (view === 'menu') fetchMenu(menuCat) }, [view, menuCat, fetchMenu])

    const openAdd = () => { setEditItem(null); setForm({ ...BLANK, category: menuCat }); setImgPreview(''); setShowForm(true) }
    const openEdit = (item) => { setEditItem(item); setForm({ ...item }); setImgPreview(item.image || ''); setShowForm(true) }

    const handleImageFile = async (file) => {
        if (!file) return
        const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
        if (!allowed.includes(file.type)) { toast$('Only JPG, PNG, WEBP allowed', 'error'); return }
        if (file.size > 2 * 1024 * 1024) { toast$('Max file size is 2MB', 'error'); return }

        // Show local preview immediately
        setImgPreview(URL.createObjectURL(file))
        setUploading(true)

        const fd = new FormData()
        fd.append('file', file)
        const r = await fetch('/api/upload', { method: 'POST', body: fd })
        const d = await r.json()

        if (d.success) {
            setForm(prev => ({ ...prev, image: d.path }))
            setImgPreview(d.path)
            toast$('Image uploaded')
        } else {
            toast$(d.message || 'Upload failed', 'error')
            setImgPreview(form.image || '')
        }
        setUploading(false)
    }

    const handleDrop = (e) => {
        e.preventDefault(); setDragOver(false)
        const file = e.dataTransfer.files[0]
        if (file) handleImageFile(file)
    }

    const saveItem = async (e) => {
        e.preventDefault(); setSaving(true)
        const method = editItem ? 'PUT' : 'POST'
        const body = editItem ? { ...form, _id: editItem._id } : form
        const r = await fetch('/api/menu', {
            method, headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        })
        if (r.ok) { toast$(editItem ? 'Item updated' : 'Item added'); setShowForm(false); fetchMenu(menuCat) }
        else { const d = await r.json(); toast$(d.message || 'Save failed', 'error') }
        setSaving(false)
    }

    const deleteItem = async (id) => {
        if (!confirm('Delete this item?')) return
        const r = await fetch(`/api/menu?id=${id}`, { method: 'DELETE' })
        if (r.ok) { toast$('Deleted'); fetchMenu(menuCat) }
        else toast$('Delete failed', 'error')
    }

    const toggleAvail = async (item) => {
        await fetch('/api/menu', {
            method: 'PUT', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ _id: item._id, available: !item.available })
        })
        fetchMenu(menuCat)
    }

    const seedMenu = async () => {
        setSeeding(true)
        const r = await fetch('/api/menu/seed', { method: 'POST' })
        const d = await r.json()
        toast$(d.message || (d.success ? 'Seeded!' : 'Already seeded'), d.success ? 'success' : 'error')
        if (d.success) fetchMenu(menuCat)
        setSeeding(false)
    }

    const activeOrders = orders.filter(o => STATUS_COLUMNS.includes(o.orderStatus))
    const historyOrders = orders.filter(o => ['completed', 'cancelled'].includes(o.orderStatus))
    const stats = {
        pending: orders.filter(o => o.orderStatus === 'pending').length,
        preparing: orders.filter(o => o.orderStatus === 'preparing').length,
        ready: orders.filter(o => o.orderStatus === 'ready').length,
        completed: orders.filter(o => o.orderStatus === 'completed').length,
    }

    // login screen
    if (!auth) return (
        <div className={styles.loginPage}>
            <div className={styles.loginCard}>
                <div className={styles.loginLogo}>🍽️</div>
                <h2>Epic Cafe Admin</h2>
                <form onSubmit={handleLogin}>
                    <input type="email" placeholder="Email" value={loginData.email}
                        onChange={e => setLoginData({ ...loginData, email: e.target.value })} required />
                    <input type="password" placeholder="Password" value={loginData.password}
                        onChange={e => setLoginData({ ...loginData, password: e.target.value })} required />
                    {loginError && <p className={styles.loginError}>{loginError}</p>}
                    <button type="submit">Sign In</button>
                </form>
            </div>
        </div>
    )

    if (loading) return <div className={styles.fullLoader}>Loading…</div>

    return (
        <div className={styles.dashboard}>
            {toast && <div className={`${styles.toast} ${styles[toast.type]}`}>{toast.msg}</div>}

            <header className={styles.topbar}>
                <div className={styles.topbarLeft}>
                    <span className={styles.logo}>🍽️</span>
                    <span className={styles.brand}>Epic Cafe</span>
                    <span className={styles.role}>Admin</span>
                </div>
                <div className={styles.topbarRight}>
                    {[['kanban', 'Live Orders'], ['history', 'History'], ['menu', '🍴 Menu']].map(([v, l]) => (
                        <button key={v} className={view === v ? styles.tabActive : styles.tab} onClick={() => setView(v)}>{l}</button>
                    ))}
                    <button className={styles.refreshBtn} onClick={fetchOrders}>↻</button>
                    <button className={styles.homeBtn} onClick={() => router.push('/')}>← Home</button>
                </div>
            </header>

            <div className={styles.statBar}>
                <div className={`${styles.pill} ${styles.pillPending}`}><span>{stats.pending}</span> Pending</div>
                <div className={`${styles.pill} ${styles.pillPreparing}`}><span>{stats.preparing}</span> Preparing</div>
                <div className={`${styles.pill} ${styles.pillReady}`}><span>{stats.ready}</span> Ready</div>
                <div className={`${styles.pill} ${styles.pillDone}`}><span>{stats.completed}</span> Completed</div>
            </div>

            {/* KANBAN */}
            {view === 'kanban' && (
                activeOrders.length === 0
                    ? <div className={styles.empty}><p>🎉 No active orders right now.</p></div>
                    : <div className={styles.kanban}>
                        {STATUS_COLUMNS.map(col => {
                            const cols = activeOrders.filter(o => o.orderStatus === col)
                            return (
                                <div key={col} className={styles.column}>
                                    <div className={`${styles.colHeader} ${styles['col_' + col]}`}>
                                        <span className={styles.colTitle}>{col.toUpperCase()}</span>
                                        <span className={styles.colCount}>{cols.length}</span>
                                    </div>
                                    <div className={styles.colBody}>
                                        {cols.length === 0 && <p className={styles.colEmpty}>No orders</p>}
                                        {cols.map(o => {
                                            const od = overdue(o.createdAt, o.orderStatus)
                                            const flow = STATUS_FLOW[o.orderStatus]
                                            const busy = updating === o._id
                                            return (
                                                <div key={o._id} className={`${styles.card} ${od ? styles.cardOverdue : ''}`}>
                                                    {od && <div className={styles.overdueTag}>⚠ Overdue</div>}
                                                    <div className={styles.cardTop}>
                                                        <span className={styles.orderId}>#{o._id.slice(-5)}</span>
                                                        <span className={styles.timeTag}>{timeAgo(o.createdAt)}</span>
                                                    </div>
                                                    <div className={styles.itemName}>{o.foodItem}</div>
                                                    <div className={styles.cardMeta}>
                                                        <span>👤 {o.customerName}</span>
                                                        <span>📞 {o.contact}</span>
                                                        <span>🔢 Qty: {o.quantity}</span>
                                                        <span>💰 ₹{o.totalPrice}</span>
                                                        <span>🎓 {o.status}</span>
                                                        {o.transactionId
                                                            ? <span className={styles.txnId}>🧾 UTR: <b>{o.transactionId}</b></span>
                                                            : <span className={styles.txnMissing}>⚠ Payment not confirmed</span>
                                                        }
                                                    </div>
                                                    <div className={styles.cardActions}>
                                                        {flow.next && (
                                                            <button className={styles.advanceBtn} style={{ background: flow.color }}
                                                                onClick={() => advance(o._id, flow.next)} disabled={busy}>
                                                                {busy ? '…' : flow.label}
                                                            </button>
                                                        )}
                                                        <button className={styles.cancelBtn} onClick={() => cancelOrder(o._id)} disabled={busy}>✕</button>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
            )}

            {/* HISTORY */}
            {view === 'history' && (
                <div className={styles.historyWrap}>
                    <h3 className={styles.historyTitle}>Order History ({historyOrders.length})</h3>
                    {historyOrders.length === 0
                        ? <p className={styles.empty}>No completed or cancelled orders yet.</p>
                        : <table className={styles.table}>
                            <thead><tr>
                                <th>ID</th><th>Item</th><th>Customer</th><th>Contact</th>
                                <th>Qty</th><th>Total</th><th>Status</th><th>Time</th>
                            </tr></thead>
                            <tbody>
                                {historyOrders.map(o => (
                                    <tr key={o._id} className={o.orderStatus === 'cancelled' ? styles.rowCancelled : ''}>
                                        <td>#{o._id.slice(-5)}</td><td>{o.foodItem}</td>
                                        <td>{o.customerName}</td><td>{o.contact}</td>
                                        <td>{o.quantity}</td><td>₹{o.totalPrice}</td>
                                        <td><span className={`${styles.badge} ${styles['badge_' + o.orderStatus]}`}>{o.orderStatus}</span></td>
                                        <td>{new Date(o.createdAt).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    }
                </div>
            )}

            {/* MENU MANAGEMENT */}
            {view === 'menu' && (
                <div className={styles.menuMgmt}>
                    <div className={styles.menuToolbar}>
                        <div className={styles.catTabs}>
                            {CATEGORIES.map(c => (
                                <button key={c} className={menuCat === c ? styles.catActive : styles.catTab}
                                    onClick={() => setMenuCat(c)}>
                                    {c.charAt(0).toUpperCase() + c.slice(1)}
                                </button>
                            ))}
                        </div>
                        <div className={styles.menuActions}>
                            <button className={styles.seedBtn} onClick={seedMenu} disabled={seeding}>
                                {seeding ? 'Seeding…' : '⬇ Seed Default Data'}
                            </button>
                            <button className={styles.addBtn} onClick={openAdd}>+ Add Item</button>
                        </div>
                    </div>

                    {menuLoading
                        ? <p className={styles.empty}>Loading…</p>
                        : <div className={styles.menuGrid}>
                            {menuItems.length === 0 && (
                                <p className={styles.emptyMenu}>No items yet. Click "Seed Default Data" to load existing items, or add manually.</p>
                            )}
                            {menuItems.map(item => (
                                <div key={item._id} className={`${styles.menuCard} ${!item.available ? styles.menuCardOff : ''}`}>
                                    <div className={styles.menuImgWrap}>
                                        <Image src={item.image} alt={item.name} width={260} height={160}
                                            className={styles.menuImg} unoptimized
                                            onError={e => { e.currentTarget.style.display = 'none' }} />
                                        <span className={`${styles.availBadge} ${item.available ? styles.availOn : styles.availOff}`}>
                                            {item.available ? 'Available' : 'Hidden'}
                                        </span>
                                    </div>
                                    <div className={styles.menuCardBody}>
                                        <div className={styles.menuCardName}>{item.name}</div>
                                        <div className={styles.menuCardPrice}>
                                            ₹{item.price}{item.unit && <span> · {item.unit}</span>}
                                        </div>
                                        {item.description && <p className={styles.menuCardDesc}>{item.description}</p>}
                                    </div>
                                    <div className={styles.menuCardActions}>
                                        <button className={styles.editBtn} onClick={() => openEdit(item)}>✏ Edit</button>
                                        <button className={styles.toggleBtn} onClick={() => toggleAvail(item)}>
                                            {item.available ? '🙈 Hide' : '👁 Show'}
                                        </button>
                                        <button className={styles.delBtn} onClick={() => deleteItem(item._id)}>🗑</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    }

                    {/* Modal */}
                    {showForm && (
                        <div className={styles.modalOverlay} onClick={() => setShowForm(false)}>
                            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                                <h3>{editItem ? 'Edit Item' : 'Add New Item'}</h3>
                                <form onSubmit={saveItem} className={styles.itemForm}>
                                    <div className={styles.formRow}>
                                        <label>Name *</label>
                                        <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                                    </div>
                                    <div className={styles.formRow}>
                                        <label>Category *</label>
                                        <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                                            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </div>
                                    <div className={styles.formRow}>
                                        <label>Image *</label>
                                        {/* Upload zone */}
                                        <div
                                            className={`${styles.uploadZone} ${dragOver ? styles.uploadZoneDrag : ''}`}
                                            onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                                            onDragLeave={() => setDragOver(false)}
                                            onDrop={handleDrop}
                                            onClick={() => document.getElementById('imgFileInput').click()}
                                        >
                                            {imgPreview ? (
                                                <div className={styles.previewWrap}>
                                                    <img src={imgPreview} alt="preview" className={styles.previewImg} />
                                                    {uploading && <div className={styles.uploadingOverlay}>Uploading…</div>}
                                                </div>
                                            ) : (
                                                <div className={styles.uploadPlaceholder}>
                                                    <span className={styles.uploadIcon}>📷</span>
                                                    <span>{uploading ? 'Uploading…' : 'Click or drag & drop image'}</span>
                                                    <small>JPG, PNG, WEBP · max 2MB</small>
                                                </div>
                                            )}
                                        </div>
                                        <input
                                            id="imgFileInput"
                                            type="file"
                                            accept="image/jpeg,image/png,image/webp"
                                            style={{ display: 'none' }}
                                            onChange={e => handleImageFile(e.target.files[0])}
                                        />
                                        {imgPreview && !uploading && (
                                            <button type="button" className={styles.changeImgBtn}
                                                onClick={() => document.getElementById('imgFileInput').click()}>
                                                ↺ Change image
                                            </button>
                                        )}
                                    </div>
                                    <div className={styles.formRow}>
                                        <label>Price (₹) *</label>
                                        <input type="number" min="0" value={form.price}
                                            onChange={e => setForm({ ...form, price: e.target.value })} required />
                                    </div>
                                    <div className={styles.formRow}>
                                        <label>Unit <small>(e.g. for one plate)</small></label>
                                        <input value={form.unit} onChange={e => setForm({ ...form, unit: e.target.value })}
                                            placeholder="for one plate" />
                                    </div>
                                    <div className={styles.formRow}>
                                        <label>Description</label>
                                        <textarea rows={3} value={form.description}
                                            onChange={e => setForm({ ...form, description: e.target.value })} />
                                    </div>
                                    <div className={styles.formRow}>
                                        <label className={styles.checkLabel}>
                                            <input type="checkbox" checked={form.available}
                                                onChange={e => setForm({ ...form, available: e.target.checked })} />
                                            Available on menu
                                        </label>
                                    </div>
                                    <div className={styles.formBtns}>
                                        <button type="button" className={styles.cancelFormBtn} onClick={() => setShowForm(false)}>Cancel</button>
                                        <button type="submit" className={styles.saveBtn} disabled={saving || uploading || !form.image}>
                                            {saving ? 'Saving…' : editItem ? 'Save Changes' : 'Add Item'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
