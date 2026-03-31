'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import styles from './contact.module.css'

export default function Contact() {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' })
    const [submitMessage, setSubmitMessage] = useState('')

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            })
            if (res.ok) {
                setSubmitMessage('Message sent! We will get back to you soon.')
                setFormData({ name: '', email: '', message: '' })
            } else {
                setSubmitMessage('Failed to send. Please try again.')
            }
        } catch {
            setSubmitMessage('Failed to send. Please try again.')
        }
    }

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1>Contact Us</h1>
            </header>

            <main className={styles.main}>

                {/* Info row */}
                <div className={styles.infoGrid}>
                    <div className={styles.infoCard}>
                        <h2>About Epic Cafe</h2>
                        <p>
                            Epic Cafe is a delightful haven for students, offering a diverse menu that caters to various tastes.
                            We believe the best dishes remind you of home. Fast food, slow flavour — our dough rises overnight.
                            More than a canteen, it&apos;s a hub of energy and camaraderie with affordable prices built for students.
                        </p>
                    </div>
                    <div className={styles.infoCard}>
                        <h2>Our Location</h2>
                        <p>Dr. K.M. Vasudevan Pillai Campus</p>
                        <p>Sector-16, New Panvel — 410206</p>
                    </div>
                    <div className={styles.infoCard}>
                        <h2>Contact Info</h2>
                        <p>Email: <a href="mailto:pce@mes.ac.in">pce@mes.ac.in</a></p>
                        <p>Tel: <a href="tel:02227482133">022-27482133</a></p>
                        <p><a href="tel:02227456030">022-27456030</a></p>
                    </div>
                </div>

                {/* Team */}
                <div className={styles.members}>
                    <h2>Our Team</h2>
                    <div className={styles.memberGrid}>
                        {[
                            { img: '/img/sarvesh_image.jpg', name: 'Sarvesh Mokal', phone: '9370061529' },
                            { img: '/img/yash.jpg', name: 'Yash Patil', phone: '9096221703' },
                            { img: '/img/harsh.jpg', name: 'Harsh Peke', phone: '9665476943' },
                            { img: '/img/rutik.png', name: 'Prathamesh Nahar', phone: '7420974888' },
                        ].map(m => (
                            <div key={m.name} className={styles.member}>
                                <Image src={m.img} alt={m.name} width={90} height={90} className={styles.memberImg} />
                                <h3>{m.name}</h3>
                                <p><a href={`tel:${m.phone}`}>{m.phone}</a></p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Form + Map */}
                <div className={styles.queryForm}>
                    <div className={styles.formCard}>
                        <h2>Send us a message</h2>
                        {submitMessage && <div className={styles.message}>{submitMessage}</div>}
                        <form onSubmit={handleSubmit} className={styles.form}>
                            <div className={styles.formGroup}>
                                <label htmlFor="name">Name</label>
                                <input id="name" type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Your name" required />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="email">Email</label>
                                <input id="email" type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="you@example.com" required />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="message">Message</label>
                                <textarea id="message" name="message" value={formData.message} onChange={handleInputChange} placeholder="Write your message..." required />
                            </div>
                            <button type="submit" className={styles.submitButton}>Send Message →</button>
                        </form>
                    </div>

                    <div className={styles.mapCard}>
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d702.3062981791384!2d73.12710321321427!3d18.990536544914747!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7e97bedfaa41f%3A0xdac82d6e789e5261!2sPillai&#39;s%20Canteen!5e0!3m2!1sen!2sin!4v1707889492263!5m2!1sen!2sin"
                            allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                            title="Epic Cafe Location"
                        />
                        <div className={styles.mapInfo}>
                            <h2>📍 Find Us</h2>
                            <p>Dr. K.M. Vasudevan Pillai Campus</p>
                            <p>Sector-16, New Panvel — 410206</p>
                            <p style={{ marginTop: 8 }}>
                                <Link href="/" style={{ color: '#fa4545', fontWeight: 600, textDecoration: 'none', fontSize: 13 }}>← Back to Home</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            <footer className={styles.footer}>
                <p>© {new Date().getFullYear()} Pillai College of Engineering. All rights reserved.</p>
            </footer>
        </div>
    )
}
