# TinyDreams Strategic Roadmap & Gap Analysis

Based on the comparison between the current project state (Phase 1-12) and the **TinyDreams Strategic Development Report**, the following gaps and new phases have been identified.

## 1. Gap Analysis (Missing Features)

### A. Customer Experience (Personalization)
- **Baby Profile:** Users cannot currently input their child's details (DOB) to get personalized suggestions.
- **Milestone Navigation:** No filter for "0-3 Months", "Teething", etc.
- **Smart Recommendations:** Recommendations are currently simple (category-based), not age/milestone-based.
- **Gift Registry:** Basic Wishlist exists, but no shareable Registry with collaboration features.

### B. Admin & Operations (Depth)
- **Product Certifications (PIM):** No field for OEKO-TEX/GOTS certificates or expiry tracking.
- **Batch & Expiry Tracking:** Inventory is count-based only; no Batch ID or Expiration Date tracking for recalls.
- **Dynamic Attributes:** All products share the same schema; no category-specific fields (e.g., Tog rating for sleepwear vs. piece count for toys).

### C. Trust & Compliance
- **Legal Archiving:** Distant Sales Agreements are not dynamically archived per order.
- **Trust Badges:** "Verified Reviewer" or Age Appropriateness badges are missing from UI.

---

## 2. New Project Phases

To bridge these gaps, we will implement the following phases, starting with Phase 13.

### **Phase 13: Personalization & Operational Excellence (Weeks 25-28)**
**Goal:** Transform the platform from a simple store to a smart parenting partner by introducing Baby Profiles and Deep Admin Inventory features.

#### **13.1. User Personalization (Frontend)**
- [ ] **Baby Profile Module:**
    - Create `baby_profiles` table (`user_id`, `name`, `dob`, `gender`, `relationship`).
    - Build "My Family" section in User Dashboard.
- [ ] **Smart Recommendation Engine:**
    - Implement logic to calculate baby's age in months.
    - Update `ProductCard` to show "Perfect for [Age] Month" badge if matches.
    - Create "For Your Little One" section on Homepage (dynamic query based on baby's age).

#### **13.2. Advanced Product Management (Admin)**
- [ ] **Certification Manager:**
    - Add `certifications` jsonb column to products.
    - Admin UI to upload/select badges (GOTS, BPA-Free, etc.).
    - Display certifications on Product Detail Page.
- [ ] **Inventory Batch Tracking:**
    - Key upgrade: Create `inventory_batches` table (`product_id`, `batch_no`, `expiry_date`, `stock_qty`).
    - Update Order processing to deduct from specific batches (FIFO).

#### **13.3. Storefront UX Enhancements**
- [ ] **Milestone Filters:** Add "Age Range" filter sidebar (0-3m, 3-6m, 6-12m, 12m+).
- [ ] **Sticky Mobile Actions:** Implement "One-Thumb" sticky Add to Cart bar on mobile product pages.

---

### **Phase 14: Trust, Compliance & Legal (Weeks 29-32)**
**Goal:** Align with Turkish E-Commerce laws (ETBIS) and enhance trust signals.

- [ ] **Dynamic Legal Contracts:**
    - Generate PDF of Distant Sales Agreement at checkout.
    - Store PDF link in `orders` table.
- [ ] **Trust Badges Implementation:**
    - Add Trust Seals (Secure Payment, SSL) to Footer and Checkout.
    - Implement "Expert Approved" quote fields for medical/orthopedic products.

---

### **Phase 15: Growth & Automations (Weeks 33+)**
**Goal:** Conversion Rate Optimization (CRO) and Recurring Revenue.

- [ ] **Subscription System:** "Subscribe & Save" for diapers/wipes.
- [ ] **A/B Testing Framework:** Infrastructure to test different hero banners.
- [ ] **Photo Reviews:** Allow users to upload images in reviews.

---

## 3. Immediate Action Plan (Phase 13 Kickoff)

1.  **Database Update:**
    - Create `baby_profiles` table.
    - Add `certifications` and `min_age_months`, `max_age_months` to products.
2.  **Admin Update:**
    - Update Product Form to include Age Range and Certification selection.
3.  **Frontend Update:**
    - Build "Add Child" modal in Profile.
    - Update Homepage to fetch "Recommended for You".
