# Testing SpectraAI

This document explains how to test SpectraAI to verify it solves the two core problems defining the product:

1. **Problem 1 (AIML5):** Lack of structured reasoning for competing product decisions.
2. **Problem 2 (AIML6):** Product specifications rotting and becoming inconsistent over time.

---

## 1. Getting Started: Seeding the Data

To test the application properly, you need sample data. We have built an automatic seeder that injects a realistic SaaS project.

1. Ensure your local dev server is running (`npm run dev`).
2. Go to `http://localhost:3000` and click **"Start building"** or **"Log in"**.
3. Create an account via email or use Google Sign in.
4. On your **Dashboard** (`/dashboard`), click the **"Seed Demo Data"** button at the top right.

This will instantly populate your account with:
- **Project:** "Athena E-Commerce Platform"
- **Decision:** "Authentication Provider selection" with two heavily debated options (Auth0 vs Supabase Auth).
- **Specifications:** A "User Management PRD" and a "Security Architecture" technical spec.
- **Conflict:** A mock contradiction generated between the two specifications.

---

## 2. Testing AIML5: Product Decision Intelligence

**The Goal:** Provide structured, explainable decision logic for prioritization and architectural choices, replacing unstructured "gut feelings" or messy Notion tables.

### Steps to Test:
1. Go to **Decisions** in the left sidebar and select the **"Authentication Provider selection"** decision.
2. Observe the current state: You have a structured context to evaluate, and two options defined with formal Pros, Cons, Effort, Impact, and Risk scoring.
3. Click the **"Analyze Options"** button on the right side of the screen.
4. **What happens:** The AI streaming panel will generate a live comparative analysis of the trade-offs, summarizing the risks vs efforts, and provide a final recommended course of action. This fulfills the requirement of having a *structured, explainable decision framework*.

*(Note: Data is streamed via a fallback simulation if no valid OpenRouter API key is provided, guaranteeing the feature is always verifiable).*

---

## 3. Testing AIML6: Adaptive Specification Engine

**The Goal:** Continuously validate product documents, finding conflicting requirements or gaps caused by evolving discovery, preventing spec rot.

### Steps to Test:
1. Go to **Conflicts** in the left sidebar.
2. You will see an active conflict listing: *"Session expiration policies contradict"* (Severity: Medium/High).
3. Look at the data provided: Look at how it flags that the **User Management PRD** specifies a requirement for a 24-hour token, while the **Security Architecture** spec allows 7-day token validity.
4. **What happens:** Notice the structured AI resolution strategy inside the conflict box itself: *"Consider 24-hours for enterprise/B2B users, and 7-days for consumer/B2C users"*.
5. (Optional): Click the **"Run Scan"** button at the top right. This is the manual trigger designed to instruct the AI to cross-reference your specs in the database to detect newly introduced anomalies and create these conflict alerts.

By linking decisions (AIML5) mathematically against constraints, and then scanning written text specifications for conflicting overlaps (AIML6), SpectraAI closes the loop.
