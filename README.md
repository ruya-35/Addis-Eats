# Addis Eats - Habesha Eatery (Day 23 Redesign)

A modern, responsive Ethiopian culinary web application featuring authentic menu exploration, interactive details popups, cart management with dynamic guest bill-splitting, table reservation management with live profile synchronization, and full Light/Dark mode support.

## Key Features & Redesign Highlights

1. **Clean, Modern Typographic Hero (Zero Background Images)**:
   - Modern, clutter-free hero layout focused on crisp typography (`Plus Jakarta Sans` and `Noto Sans Ethiopic`).
   - Quick action buttons to explore the menu and book tables.
   - Live metrics summary strip (100% Traditional, Handcrafted Dishes, Instant Guest Split Calculator).

2. **Master Menu Section (Unified Master Card)**:
   - All dishes organized in a single consolidated master card with clean row layouts rather than disconnected individual cards.
   - **Real-time Search**: Search by food name, Amharic name, ingredients, tags, or description with instant clear.
   - **Category Filters**: Filter tabs for All, Traditional Stews, Tibs & Grills, Vegetarian & Fasting, Breakfast Specials, and Drinks & Coffee.
   - **Dietary & Quick Chips**: Popular, Vegan / Fasting, and Spicy filters.
   - **Sorting**: Sort by Featured, Price (Low to High), Price (High to Low), or Alphabetical (A-Z).
   - **Dynamic JSON Data**: Loaded from `data.json` with embedded instant fallback.

3. **Food Details Popup (Modal)**:
   - Clicking any dish opens a detailed modal with:
     - Amharic & English dish titles
     - Complete fresh ingredients list with pill badges
     - Spiciness rating, dietary tags, and preparation time
     - Portion quantity selector (`-` / `+`)
     - Direct "Add to Cart" button with animated badge feedback and toast notifications.

4. **Order Cart with Dynamic Guest Split Calculator**:
   - Slide-over / centered order drawer.
   - Item list with quantity steppers (`+`, `-`) and quick delete.
   - **Guest Calculator Stepper**: Increment or decrement dining party size (1–30 guests).
   - **Live Bill Calculation**:
     - Items subtotal
     - Transparent hospitality & service fee (5%)
     - Total bill
     - **Price per Guest** calculated dynamically in real-time (`Total ÷ Guests`).
   - "Book Table with This Order" button pre-populates table reservation guest count.

5. **Table Reservation & Booking Confirmation**:
   - Popup reservation modal collecting:
     - Full Name
     - Phone Number (Ethiopian format `09...` / `+251...`)
     - Number of Guests
     - Table Area Preference (Traditional Mesob, Garden Terrace, Central Hall, VIP Lounge)
     - Arriving Date & Time
     - Special Requests / Dietary Notes
   - On submission, generates a unique Booking Reference Code (`#AE-YYYY-XXXX`) and presents a **Success Confirmation screen**.
   - Automatically saves reservations to `localStorage`.

6. **Guest Profile & Booked Data View**:
   - Access via the Profile icon in the header.
   - Displays guest member details.
   - **Active Booked Reservations List**: Shows real-time table bookings with table area, date & arriving time, party size, phone number, and status (`Confirmed`).
   - Allows cancelling / managing existing reservations.

7. **Theme Switcher (Dark & Light Mode)**:
   - Toggle button in the header with smooth transition.
   - Full CSS variable system supporting high-contrast, accessible dark and light palettes.
   - Persists user theme preference in `localStorage`.

8. **Clean, Modern Footer**:
   - About Addis Eats summary, Operating Hours, Contact Information, Address on Bole Road, and copyright notice.

## File Structure

- [index.html](file:///home/ethel/Documents/IBT/module2-assignment-amanueldesalegn2116/Day_23/index.html) - Semantic HTML5 application structure
- [style.css](file:///home/ethel/Documents/IBT/module2-assignment-amanueldesalegn2116/Day_23/style.css) - Modern CSS design system with light/dark variables and micro-animations
- [app.js](file:///home/ethel/Documents/IBT/module2-assignment-amanueldesalegn2116/Day_23/app.js) - Modular application logic, search/filters, cart, split-calculator, modals, and profile bookings
- [data.json](file:///home/ethel/Documents/IBT/module2-assignment-amanueldesalegn2116/Day_23/data.json) - Structured Ethiopian culinary dataset
