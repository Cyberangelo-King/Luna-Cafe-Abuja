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

## 🚀 How to Export, Push to GitHub, & Host Live on Netlify

### Step 1: Exporting the Project from Google AI Studio
1. Locate the **Settings Icon** in the top-right corner of your AI Studio developer workspace.
2. Select **Export** from the menu.
3. Choose either:
   *   **Export to GitHub** (Logs you into GitHub and creates a brand new repository instantly).
   *   **Download ZIP** (Saves the clean React project folder directly to your computer).

### Step 2: Push code to GitHub manually (Optional)
If you downloaded the project as a `.zip` file and want to initialize it manually inside Git:
```bash
# Extract the folder and open it in your terminal
cd lolas-cafe-app

# Initialize a new Git repository
git init

# Stage all files
git add .

# Commit changes
git commit -m "feat: initial launch of Lola's Cafe Web Platform"

# Rename default branch to main and link to your remote GitHub repo
git branch -M main
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/lolas-cafe.git

# Push changes
git push -u origin main
```

### Step 3: Hosting live on Netlify (Completely Free)
Netlify makes deploying Vite + React static single-page apps exceptionally simple:

1. Log in to [Netlify Console](https://www.netlify.com/).
2. Select **Add new site** ➔ **Import from an existing project**.
3. Choose **GitHub** as your provider and select the `lolas-cafe` repository.
4. Set the exact deployment configurations:
    *   **Base Directory**: `Leave blank` (Root folder)
    *   **Build Command**: `npm run build`
    *   **Publish Directory**: `dist`
5. Click **Deploy site**.
6. Once the deployment completes, Netlify gives you a generic site URL (e.g. `lolas-cafe.netlify.app`). You can customize this domain or link it to a professional domain registry like `order.lolascafe.ng` in Netlify's **Domain Management** settings.

---

## 🛠️ Technology Stack
*   **Language**: TypeScript
*   **Framework**: React 18+ (Vite)
*   **Styling**: Tailwind CSS
*   **Animations**: Motion (`motion/react`)
*   **Icons**: Lucide React
*   **State Management**: Reactive LocalStorage wrappers with custom cross-tab events.
