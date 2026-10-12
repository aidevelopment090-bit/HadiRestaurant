# HADI Restaurant & Lounge - Modern & Premium Website

A luxurious, responsive restaurant website built for **HADI Restaurant** using semantic HTML5, modern CSS3, and vanilla JavaScript. Designed with a stylish obsidian black, champagne gold, and alabaster white color theme.

---

## 🌟 Key Features

1. **Aesthetic & Brand Identity**:
   - **Color Palette**: Obsidian Black (`#0a0a0c`), Metallic Gold (`#d4af37`), Champagne Glow (`#f8e59d`), and Alabaster White (`#ffffff`).
   - **Typography**: Classic serif headings (`Playfair Display` & `Cormorant Garamond`) paired with modern sans-serif body text (`Plus Jakarta Sans`).
   - **Micro-Interactions**: Glassmorphism navbar with backdrop blur, button shimmer highlights, pulsing WhatsApp widget, and card hover elevations.

2. **Core Sections**:
   - **Modern Navbar**: Sticky glassmorphic header, rotating gold diamond monogram, active scroll spy, mobile hamburger drawer, and live order cart trigger.
   - **Hero Section**: High-impact headline with gold gradient typography, direct reservation CTAs, quick connoisseur stats, and interactive *Royal 24K Gold Tomahawk* showcase card.
   - **About Us**: Heritage story, Chef Hadi Al-Mansoor profile, culinary pillars (woodfire aging, 100% Halal certification, VIP salons), and counter stats.
   - **Menu & Online Ordering**:
     - Category filter tabs: *All Offerings, Mezze & Starters, Royal Mains, Charcoal & Steaks, Chef Signatures, Gold Desserts, Mocktails & Tea*.
     - Detailed item descriptions, dietary badges (Halal, Vegetarian, Seafood), calorie counts, and prices.
     - **"Add to Order" button** on every dish.
   - **Online Food Ordering Cart Drawer**:
     - Slide-out cart drawer with live badge counter.
     - Express Pickup vs. Concierge Delivery selector.
     - Quantity controls (`+`, `-`, and remove).
     - Subtotal, service charge/tax (5%), and total calculator.
     - Special instructions & allergy notes field.
     - **"Order via WhatsApp Direct" button**: Automatically builds and formats a luxury WhatsApp message with all cart items, totals, and notes to send to the restaurant.
     - **"Place Order Instantly" button** with automatic order ID generator.
   - **The Royal Experience**: Highlighting VIP golden salons, tableside fire theater, and ambient live oud & jazz.
   - **Gallery with Lightbox**: Masonry photo grid with category filters and interactive full-screen image Lightbox with keyboard navigation.
   - **Table Reservation & Contact**:
     - Multi-field reservation form (Date picker, dining time, party size, seating area, dietary notes).
     - **WhatsApp Table Reservation**: Generates a pre-formatted VIP reservation message and opens WhatsApp.
     - Contact details, operating hours, and stylized Google Maps direction card.
   - **VIP Connoisseur Club**: Newsletter subscription with instant feedback toast notifications.
   - **Floating WhatsApp Concierge**: Persistent floating button with pulsing ring animation and hover tooltip.

---

## 🚀 How to Run the Website

### Option 1: Direct File Open
Simply double-click [`index.html`](file:///c:/Users/Admin/Desktop/alikhanhassan/index.html) in your file manager to open it in Google Chrome, Microsoft Edge, Firefox, or Safari.

### Option 2: Local HTTP Server (Python)
If you wish to test with a local server, run:
```bash
python -m http.server 8000
```
Then navigate to:
```
http://localhost:8000
```

---

## ⚙️ Customization & WhatsApp Configuration

To customize your restaurant's WhatsApp phone number or tax settings, open [`js/main.js`](file:///c:/Users/Admin/Desktop/alikhanhassan/js/main.js#L9-L15):
```javascript
const CONFIG = {
    restaurantName: 'HADI Restaurant & Lounge',
    whatsappNumber: '12345678900', // Insert your international phone number without '+' or spaces
    currencySymbol: '$',
    taxRate: 0.05, // 5% service/tax
    deliveryFee: 10.00
};
```

---

## 📁 Project Structure

```
alikhanhassan/
├── index.html        # Main semantic HTML5 webpage structure
├── css/
│   └── style.css     # Luxury black & gold styling, responsive layouts & animations
├── js/
│   └── main.js       # Navigation, shopping cart, WhatsApp links, gallery lightbox & form validation
└── README.md         # Project documentation & configuration guide
```
