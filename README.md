# Speed Queen Kraków - Next.js 16
A high-performance, multilingual landing page for the Speed Queen self-service laundromats in Kraków. This project is built as a highly optimized, production-ready implementation of a modern small-business website.

## 🛠 Technical Highlights

### Geolocation-Aware "Call to Action"
The Hero section doesn't just provide a static link. It utilizes the browser's **Geolocation API** to calculate the distance between the user and our three laundry locations (Orlińskiego, Pawia, Słowackiego). It then dynamically sets the primary CTA to open Google Maps directions to the **physically closest** facility, reducing friction for the customer.

### Automated Language Detection
Using **Next.js Proxy**, the application analyzes the `Accept-Language` headers from the user's browser. If the user's system is set to Polish, they are automatically redirected to the `/pl` locale; otherwise, it defaults to `/en`. This ensures a seamless first-time experience without requiring manual selection.

### Custom Regex Text Formatter
To keep the design flexible while using a centralized JSON configuration for content, the project includes a custom **`FormattedText`** component. It uses a regex-based parser to inject styles directly into strings (e.g., `[[bold text]]` for weights or `!!red text!!` for brand colors), allowing for rich typography within simple configuration files.

### Intelligent Review Aggregation & Caching
The site fetches real-time customer feedback via the **Google Places API**. To optimize performance and stay within API usage limits:
- **Server-Side Fetching:** Reviews are fetched on the server with a 24-hour revalidation window (`revalidate: 86400`).
- **De-duplication:** It automatically merges and de-duplicates reviews across all three locations.
- **Priority Sorting:** (Implemented in the component layer) to ensure high-quality, descriptive reviews are showcased.

### Modular Pricing with Location Switcher
The **`PricingTabs`** component features a sticky location switcher that maintains visibility as the user scrolls through the service list. It dynamically handles machine availability and pricing variations between the different laundry hubs, including specific logic for the Speed Queen loyalty card benefits.

## 🚀 Performance
- **Optimized Assets:** Automatic WebP conversion and responsive sizing using `next/image`.
- **Minimal Layout Shift:** Careful use of `framer-motion` and CSS variables to ensure high Lighthouse scores (>90) for both performance and accessibility.
- **Production Build:** Hosted on Vercel for edge-cached content delivery.

## 🏗 Setup & Deployment
1. **Prerequisites:** Node.js 18+, `pnpm` (recommended).
2. **Environment Variables:**
   - `GOOGLE_PLACES_API_KEY`: For reviews.
   - `RESEND_API_KEY`: For the contact form.
   - `NEXT_PUBLIC_GOOGLE_PLACEID_*`: Unique IDs for each location.
3. **Execution:**
   ```bash
   npm install
   npm run dev
   ```

## 🗺 Roadmap
- [ ] **Google Calendar API:** Direct integration for machine booking/reservation.
- [ ] **Interactive Gallery:** Image lightbox and location-specific photo filtering.
- [ ] **Contact System Expansion:** Automated mailing list subscription via Resend.
