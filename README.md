# Lola's Cafe — Premium Full-Featured Web Platform

Lola's Cafe is a premium lifestyle food, beverage, and community gathering platform custom-crafted for Lola's Cafe (operating in Delta State & Lagos State, Nigeria). This web application houses a beautifully polished customer menu interface, a live interactive Barista Kitchen Queue, and a comprehensive Owner Admin Panel.

---

## 🌟 Key Product Features

### 1. Customer Ordering & Space Reservation
*   **Location-Specific Hubs**: Customers can seamlessly switch between **Delta State (Abraka Hub)** and **Lagos Hub**.
    *   **Delta State Hub**: Offers the full courtyard experience, including Dine-In, Store Pickup, and Local Home Delivery.
    *   **Lagos Hub**: Delivery-only kitchen hub catering directly to prime Lagos regions (Lekki, Ikoyi, Victoria Island, Ikeja GRA, Surulere, and Yaba).
*   **Curated Menu & Modifiers**: A gorgeous visual list of gourmet products (Burgers, Pizzas, Hand-Pulled Corndogs, Wings, and Boba drinks) with customizable modifier add-ons.
*   **Instant WhatsApp Checkout Dispatch**: Completes transactions without high credit card fees. It formats orders into high-contrast WhatsApp text templates sent straight to the appropriate branch dispatcher.
*   **Courtyard Reservations**: Seamless booking engine with specific seating arrangements, timeslots, and special request options.
*   **Community Events Gallery**: RSVP engine for signature gatherings like paint-and-sip, courtyard acoustic jams, and book clubs.

### 2. Barista & Staff Kitchen Queue
*   **Live Order Dashboard**: Optimized for kitchen tablet devices, allowing chefs and baristas to monitor active order states.
*   **Pipelines**: Advance orders step-by-step through operational phases (`Pending` ➔ `Preparing` ➔ `Ready for Handover` ➔ `Completed`).
*   **Instant Audio Notification**: Baristas are alerted with chime tones upon new order arrivals.

### 3. Owner Analytics & Back-Office Suite
*   **Business Intelligence Dashboard**: High-contrast analytics charts monitoring Total Revenue, Peak Hour workloads, Category Distribution, and Customer Lifetime Value (LTV).
*   **Active Order & Booking Auditing**: Comprehensive tool to modify order states, manage seating schedules, and confirm table allocations.
*   **Menu & Catalog Editor**: Dynamically modify price points, add new culinary categories, customize details, or toggle item availability.
*   **Events Creator**: Effortlessly schedule and display new weekend events.
*   **Guest CRM Tracker**: Profiles customers automatically based on phone/email signatures, tracking order counts, spending histories, and favorites.
*   **Security Console**: Full control to update the administrative and kitchen passwords.

---

## 🔑 Authentication & Default Credentials

To maintain secure separation of concerns, administrative portals are guarded by login gateways. 

| Role | Username | Default Password | Configured Email |
| :--- | :--- | :--- | :--- |
| **Owner / Manager Admin** | `admin` | `boss2026` | `lola@lolascafe.ng` |
| **Staff / Barista Queue** | `staff` | `lola2026` | — |

*Note: All passwords and registration credentials can be updated dynamically inside the **Security Console** tab within the Owner Dashboard.*

---


Once the deployment completes, Netlify gives you a generic site URL (e.g. `lolas-cafe.netlify.app`). You can customize this domain or link it to a professional domain registry like `order.lolascafe.ng` in Netlify's **Domain Management** settings.

---

## 🛠️ Technology Stack
*   **Language**: TypeScript
*   **Framework**: React 18+ (Vite)
*   **Styling**: Tailwind CSS
*   **Animations**: Motion (`motion/react`)
*   **Icons**: Lucide React
*   **State Management**: Reactive LocalStorage wrappers with custom cross-tab events.
