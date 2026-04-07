# SpectraAI Demo Script: Guided Manual Testing (AIML5 & AIML6)

This guide provides step-by-step instructions for judges to manually interact with SpectraAI to solve **Decision Intelligence (AIML5)** and **Adaptive Specifications (AIML6)**.

---

## 1. Setup (The Workspace)
Before testing, ensure you have a clean starting point.
1. Log in to the app.
2. If your dashboard is empty, click **"Seed Demo Data"**. 
3. Open the **"Athena E-Commerce Platform"** project.

---

## 2. Solving AIML5 (Decision Intelligence)
**Problem:** Product teams lack structured trade-off reasoning during ideation.
**Solution:** A GenAI platform that evaluates alternative options and documents logic.

### Steps to Demo:
1.  **Create a New Decision**:
    *   Click **"Decisions"** in the sidebar.
    *   Click **"New Decision"**.
    *   **Title**: `Primary Database Architecture`
    *   **Context**: `We need to decide between a SQL and NoSQL approach for our global order history system.`
    *   **Option 1**: `PostgreSQL (RDS)` | Pros: `ACID compliance, Relationships` | Cons: `Scaling write-heavy spikes`
    *   **Option 2**: `DynamoDB` | Pros: `Infinite scale, Low latency` | Cons: `Complex queries, No joins`
    *   Click **"Create Decision"**.
2.  **Trigger AI Reasoning**:
    *   Open the newly created decision.
    *   Click **"Run AI Analysis"**.
    *   **Observation**: Watch the AI stream a technical comparison. It will weigh Impact vs. Risk.
3.  **Visualization**:
    *   Notice the **Trade-off Matrix** (Radar Chart) at the top. The AI will sync its analysis to this chart, showing you the "Logical Winner" based on the Strategic Alignment score it generated.

---

## 3. Solving AIML6 (Adaptive Specifications)
**Problem:** Specifications rot and become inconsistent over time.
**Solution:** An engine that validates documentation consistency across artifacts.

### Steps to Demo:
1.  **Create a Conflict**:
    *   Click **"Specifications"** in the sidebar.
    *   Open **"Checkout Flow UX Protocol"**.
    *   Notice it says: *"Total checkout steps must not exceed 3."*
    *   Go back and open **"Platform Security Architecture"**.
    *   Edit it to include: *"All checkouts must require a 5-step multi-factor verification process."*
2.  **Detect the Rot**:
    *   Click **"Conflicts"** in the sidebar.
    *   Observe how the system has flagged a **Contradiction**.
3.  **AI Synchronization**:
    *   Look at the **AI Suggestion** field in the conflict card.
    *   The engine will suggest a fix: e.g., *"Implement background MFA to keep UX steps at 3 while satisfying security constraints."*
    *   This demonstrates the engine **continuously validating** and ensuring documentation stays aligned.

---

## 4. Key Summary for Judges
- **Decisions (AIML5)**: Turning gut feeling into data-driven radar charts and LLM-backed architectural recommendations.
- **Specifications (AIML6)**: Moving from static PDFs to "living" docs that talk to each other and flag their own contradictions.
- **The Loop**: Decisions made in Step 2 automatically inform the validation rules in Step 3.
