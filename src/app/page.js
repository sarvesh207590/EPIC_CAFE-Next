'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import styles from './home.module.css'

export default function Home() {
    const router = useRouter()
    const [user, setUser] = useState(null)
    const [menuOpen, setMenuOpen] = useState(false)

    useEffect(() => {
        fetch('/api/auth/me')
            .then(r => r.ok ? r.json() : null)
            .then(d => { if (d?.success) setUser(d.user) })
            .catch(() => { })
    }, [])

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' })
        setUser(null)
        router.refresh()
    }

    const guardedNav = (path) => {
        if (!user) { router.push('/login'); return }
        router.push(path)
    }

    return (
        <div className={styles.page}>

            {/* NAV */}
            <header className={styles.nav}>
                <Link href="/" className={styles.navBrand}>🍽️ Epic Cafe</Link>
                <nav className={styles.navLinks}>
                    <Link href="/" className={styles.navLink}>Home</Link>
                    <Link href="#about" className={styles.navLink}>About</Link>
                    <Link href="/contact" className={styles.navLink}>Contact</Link>
                    <button className={styles.navLinkBtn} onClick={() => guardedNav('/my-orders')}>My Orders</button>
                </nav>
                <div className={styles.navRight}>
                    {user ? (
                        <>
                            <span className={styles.greeting}>👋 {user.username}</span>
                            <button className={styles.logoutBtn} onClick={handleLogout}>Logout</button>
                        </>
                    ) : (
                        <Link href="/login" className={styles.loginBtn}>Sign In</Link>
                    )}
                    <button className={styles.hamburger} onClick={() => setMenuOpen(o => !o)} aria-label="menu">
                        <span /><span /><span />
                    </button>
                </div>
                {menuOpen && (
                    <div className={styles.drawer} onClick={() => setMenuOpen(false)}>
                        <Link href="/" className={styles.drawerLink}>Home</Link>
                        <Link href="#about" className={styles.drawerLink}>About</Link>
                        <Link href="/contact" className={styles.drawerLink}>Contact</Link>
                        <button className={styles.drawerLink} onClick={() => guardedNav('/my-orders')}>My Orders</button>
                        {user
                            ? <button className={styles.drawerLink} onClick={handleLogout}>Logout ({user.username})</button>
                            : <Link href="/login" className={styles.drawerLink}>Sign In</Link>
                        }
                    </div>
                )}
            </header>

            {/* HERO */}
            <section className={styles.hero}>
                <div className={styles.heroBg}>
                    <Image src="/img/epiccafe.jpg" alt="Epic Cafe" fill className={styles.heroBgImg} priority sizes="100vw" />
                    <div className={styles.heroBgOverlay} />
                </div>
                <div className={styles.heroContent}>
                    <span className={styles.heroBadge}>🎓 College Canteen</span>
                    <h1 className={styles.heroTitle}>
                        Fresh Food,<br />
                        <span className={styles.heroTitleAccent}>Fast Service</span>
                    </h1>
                    <p className={styles.heroSub}>
                        Order snacks, meals &amp; beverages from Epic Cafe — your campus canteen.
                        Pay online, skip the queue.
                    </p>
                    <div className={styles.heroBtns}>
                        <button className={styles.heroCtaPrimary} onClick={() => guardedNav('/snacks')}>
                            Order Now →
                        </button>
                        <Link href="#menu" className={styles.heroCtaSecondary}>View Menu</Link>
                    </div>
                    {!user && (
                        <p className={styles.heroNote}>
                            <Link href="/login">Sign in</Link> or <Link href="/signup">create an account</Link> to place an order
                        </p>
                    )}
                </div>
                {/* Scroll cue */}
                <Link href="#menu" className={styles.heroScroll}>
                    <span>Scroll</span>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9" />
                    </svg>
                </Link>
            </section>

            {/* MENU CATEGORIES */}
            <section className={styles.menuSection} id="menu">
                <div className={styles.sectionInner}>
                    <span className={styles.sectionLabel}>What we serve</span>
                    <h2 className={styles.sectionTitle}>Our Menu</h2>
                    <div className={styles.categoryGrid}>
                        {[
                            { href: '/snacks', img: '/img/snacks.jpg', label: 'Snacks', emoji: '🥪', desc: 'Samosa, Vadapav, Dosa & more', accent: '#16a34a', bg: '#f0fdf4' },
                            { href: '/beverages', img: '/img/beverages.jpg', label: 'Beverages', emoji: '🥤', desc: 'Tea, Coffee, Fresh Juices', accent: '#2563eb', bg: '#eff6ff' },
                            { href: '/meal', img: '/img/lunch.jpg', label: 'Meals', emoji: '🍱', desc: 'Thali, Biryani, Dal Chaval', accent: '#ea580c', bg: '#fff7ed' },
                        ].map(cat => (
                            <button
                                key={cat.label}
                                className={styles.catCard}
                                onClick={() => guardedNav(cat.href)}
                            >
                                {/* Plain img tag — always works */}
                                <img
                                    src={cat.img}
                                    alt={cat.label}
                                    className={styles.catImg}
                                />
                                <div className={styles.catBody} style={{ background: cat.bg }}>
                                    <div className={styles.catTop}>
                                        <span className={styles.catEmoji}>{cat.emoji}</span>
                                        <h3 className={styles.catLabel}>{cat.label}</h3>
                                    </div>
                                    <p className={styles.catDesc}>{cat.desc}</p>
                                    <span className={styles.catArrow} style={{ background: cat.accent }}>Browse →</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* HOW IT WORKS */}
            <section className={styles.howSection}>
                <div className={styles.sectionInner}>
                    <span className={styles.sectionLabel}>Simple process</span>
                    <h2 className={styles.sectionTitle}>How it works</h2>
                    <div className={styles.steps}>
                        {[
                            { n: '01', icon: '🔐', title: 'Sign In', desc: 'Create an account or log in to get started.' },
                            { n: '02', icon: '🍽️', title: 'Pick your food', desc: 'Browse the menu and choose what you want.' },
                            { n: '03', icon: '📱', title: 'Pay via UPI', desc: 'Scan the QR code and pay instantly.' },
                            { n: '04', icon: '🔔', title: 'Collect order', desc: 'Get notified when your order is ready.' },
                        ].map(s => (
                            <div key={s.n} className={styles.step}>
                                <div className={styles.stepNum}>{s.n}</div>
                                <div className={styles.stepIcon}>{s.icon}</div>
                                <h4 className={styles.stepTitle}>{s.title}</h4>
                                <p className={styles.stepDesc}>{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ABOUT */}
            <section className={styles.aboutSection} id="about">
                <div className={styles.aboutInner}>
                    <div className={styles.aboutText}>
                        <span className={styles.sectionLabel}>Our story</span>
                        <h2 className={styles.sectionTitle}>About Epic Cafe</h2>
                        <p className={styles.aboutPara}>
                            At Epic Cafe, we believe the best dishes are the ones that remind you of home.
                            We&apos;ve been serving the Pillai College campus for over 10 years — fast food,
                            slow flavour. Our dough rises overnight. That&apos;s why every bite tastes like heaven.
                        </p>
                        <p className={styles.aboutPara}>
                            More than a canteen — it&apos;s a hub of energy and camaraderie, with affordable
                            prices built for students.
                        </p>
                        <div className={styles.aboutStats}>
                            <div className={styles.stat}><span>10+</span><p>Years serving</p></div>
                            <div className={styles.stat}><span>500+</span><p>Daily orders</p></div>
                            <div className={styles.stat}><span>20+</span><p>Menu items</p></div>
                        </div>
                    </div>
                    <div className={styles.mapWrap}>
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d702.3062981791384!2d73.12710321321427!3d18.990536544914747!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7e97bedfaa41f%3A0xdac82d6e789e5261!2sPillai&#39;s%20Canteen!5e0!3m2!1sen!2sin!4v1707889492263!5m2!1sen!2sin"
                            width="100%" height="320" style={{ border: 0, display: 'block' }}
                            allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                        />
                        <p className={styles.mapAddr}>📍 Sector-16, New Panvel — 410206</p>
                    </div>
                </div>
            </section>

            {/* REVIEWS */}
            <section className={styles.reviewSection}>
                <div className={styles.sectionInner}>
                    <span className={styles.sectionLabel}>Testimonials</span>
                    <h2 className={styles.sectionTitle}>What students say</h2>
                    <div className={styles.reviewGrid}>
                        {[
                            { img: '/img/customer1.jpg', name: 'Gayatri Kadam', stars: 5, text: 'Great place to eat and chill with friends. Affordable prices are a bonus for students on a budget.' },
                            { img: '/img/customer2.jpg', name: 'Aniket Pillai', stars: 5, text: 'Epic Cafe offers a diverse menu that caters to various tastes. Perfect setting for socializing.' },
                            { img: '/img/customer3.jpg', name: 'Sanika Mahajan', stars: 5, text: "More than just a place to eat — it's a hub of energy. Cozy seating and prompt service." },
                        ].map(r => (
                            <div key={r.name} className={styles.reviewCard}>
                                <div className={styles.reviewStars}>{'★'.repeat(r.stars)}</div>
                                <p className={styles.reviewText}>&quot;{r.text}&quot;</p>
                                <div className={styles.reviewer}>
                                    <Image src={r.img} alt={r.name} width={44} height={44} className={styles.reviewerImg} />
                                    <span className={styles.reviewerName}>{r.name}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className={styles.footer}>
                <div className={styles.footerInner}>
                    <span className={styles.footerBrand}>🍽️ Epic Cafe</span>
                    <span className={styles.footerCopy}>© {new Date().getFullYear()} Pillai College of Engineering. All rights reserved.</span>
                    <div className={styles.footerLinks}>
                        <Link href="/contact">Contact</Link>
                        <Link href="/login">Login</Link>
                    </div>
                </div>
            </footer>
        </div>
    )
}
