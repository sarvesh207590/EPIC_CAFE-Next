import './globals.css'

export const metadata = {
    title: 'Epic Cafe - College Canteen',
    description: 'Order delicious food from Epic Cafe - Your college canteen',
}

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    )
}