import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import MenuItem from '@/models/MenuItem'
import jwt from 'jsonwebtoken'

const SEED_DATA = [
    // Snacks
    { name: 'Samosa', category: 'snacks', image: '/img/samosa.jpg', description: 'A deep fried pastry with a spiced filling usually with potatoes, spices and herbs', price: 20, unit: 'for one piece' },
    { name: 'Vadapav', category: 'snacks', image: '/img/vadapav.jpg', description: 'Spicy mashed potatoes deep-fried in chickpea batter and pav.', price: 15, unit: 'for one piece' },
    { name: 'Idli', category: 'snacks', image: '/img/idli.jpg', description: 'Soft steamed savory cake made from fermented rice', price: 35, unit: 'for three pieces' },
    { name: 'Dhokla', category: 'snacks', image: '/img/dhokla.jpeg', description: 'Savoury cake made out of bengal gram flour and is steamed to get fluffy.', price: 30, unit: 'for four pieces' },
    { name: 'Poha', category: 'snacks', image: '/img/poha.jpg', description: 'Flattened rice that is steam cooked with onions, spices and herbs', price: 30, unit: 'for one plate' },
    { name: 'Upma', category: 'snacks', image: '/img/Upama.jpg', description: 'A flavorful dish made with semolina flour, lentils, nuts, vegetables, herbs and spices.', price: 20, unit: 'for one plate' },
    { name: 'Misal Pav', category: 'snacks', image: '/img/misal_pav.jpg', description: 'Popular Maharashtrian street food of usal topped with onions, farsan and served with pav and lemon', price: 40, unit: 'for one plate' },
    { name: 'Dosa', category: 'snacks', image: '/img/dosa.jpg', description: 'South Indian fermented crepe made from rice batter and black lentils', price: 50, unit: 'for one plate' },
    // Beverages
    { name: 'Tea', category: 'beverages', image: '/img/tea.jpg', description: '', price: 10, unit: 'per cup' },
    { name: 'Coffee', category: 'beverages', image: '/img/cofee.jpg', description: '', price: 10, unit: 'per cup' },
    { name: 'Falooda', category: 'beverages', image: '/img/falooda.jpg', description: '', price: 50, unit: 'per glass' },
    { name: 'Mango Juice', category: 'beverages', image: '/img/mango_juice.jpg', description: '', price: 40, unit: 'per glass' },
    { name: 'Watermelon Juice', category: 'beverages', image: '/img/watermelon_juice.jpg', description: '', price: 30, unit: 'per glass' },
    { name: 'Pineapple Juice', category: 'beverages', image: '/img/pinapple_juice.jpg', description: '', price: 40, unit: 'per glass' },
    { name: 'Orange Juice', category: 'beverages', image: '/img/orange_juice.jpg', description: '', price: 40, unit: 'per glass' },
    { name: 'Chocolate Milkshake', category: 'beverages', image: '/img/chocolate.jpg', description: '', price: 50, unit: 'per glass' },
    // Meals
    { name: 'Chicken Biryani', category: 'meal', image: '/img/biryani.jpg', description: 'Chicken Biryani is a savory chicken and rice dish that includes layers of chicken, rice, and aromatics that are steamed together.', price: 150, unit: 'for one plate' },
    { name: 'Veg Biryani', category: 'meal', image: '/img/veg_biryani.jpg', description: 'Vegetable Biryani is an aromatic rice dish made with basmati rice, mix veggies, herbs & biryani spices.', price: 130, unit: 'for one plate' },
    { name: 'Maharashtrian Thali', category: 'meal', image: '/img/maharastrian_thali.jpg', description: 'Maharashtrian thali includes masale bhat, sol kadhi, bhakari, batata bhaji, varan, gulab jamun, papad, loncha, mirchi, koshimbir.', price: 150, unit: 'for one plate' },
    { name: 'South Indian Thali', category: 'meal', image: '/img/south_indian.jpg', description: 'South Indian Thali includes chapati/paratha, plain rice, bisi bele bath, sambhar, a veg stew dish, fresh curd and papadum.', price: 150, unit: 'for one plate' },
    { name: 'Dal Chaval', category: 'meal', image: '/img/dal_chaval.jpg', description: 'Dal is a basic lentil curry made with cooked lentils in a curry or soup-like consistency, served with basmati rice.', price: 80, unit: 'for one plate' },
    { name: 'Maharashtrian Chicken Thali', category: 'meal', image: '/img/maharastrian_chickenthali.jpg', description: 'Maharashtrian chicken thali includes tambda pandhara rassa, solkadhi, basmati rice, 2 chapatis, chicken sukka, egg curry, onion, papad.', price: 250, unit: 'for one plate' },
]

export async function POST(request) {
    try {
        const token = request.cookies.get('admin-token')?.value
        if (!token) return NextResponse.json({ success: false }, { status: 401 })
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-here')
        if (decoded.role !== 'admin') return NextResponse.json({ success: false }, { status: 401 })

        await connectDB()
        const existing = await MenuItem.countDocuments()
        if (existing > 0) return NextResponse.json({ success: false, message: 'Menu already seeded' })

        await MenuItem.insertMany(SEED_DATA)
        return NextResponse.json({ success: true, message: `Seeded ${SEED_DATA.length} items` })
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 })
    }
}
