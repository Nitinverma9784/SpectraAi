# SpectraAI: Closing the Loop on Product Reasoning

This document explains the problem-solving flow of SpectraAI—a platform designed to eliminate "gut-feeling" decisions and stagnant product specifications.

---

## Part 1: Strategic Vision & Identification

### 1. Landing Page — Surfacing the Problem
**The Problem**: Product teams struggle with scattered, unrecorded decisions and specification documents that rot the moment they are written.
**The Solution**: SpectraAI unifies Decision Intelligence and Adaptive Specs into a single loop.
**Visuals**: Hero section with "Closing the Loop" narrative.

<img width="1920" height="1080" alt="image" src="https://github.com/user-attachments/assets/3efc4848-108c-40cf-ba5c-d80c1e93b8af" />


---

## Part 2: Controlled Entry & Organization

### 2. Authentication — Secure Workspace
**Flow**: Google OAuth identifies the user and provides immediate access to their isolated project environments.
**Technical Logic**: Ensures high-security RLS (Row Level Security) for proprietary product data.

<img width="1920" height="1080" alt="image_2026-04-07_22-08-36" src="https://github.com/user-attachments/assets/5775ed35-ebff-4182-b0c1-603d25a9b7c3" />
<img width="1920" height="1080" alt="image_2026-04-07_22-09-19" src="https://github.com/user-attachments/assets/94ac89ff-b5ea-4238-9f33-359e9fb228d9" />


### 3. Global Dashboard — Visibility & Health
**The Problem**: No high-level view of product health across multiple initiatives.
**The Flow**: Each project shows a real-time **Consistency Score** (0-100), immediately flagging projects that have drifted due to conflicting decisions.

<img width="1920" height="1080" alt="image_2026-04-07_22-09-38" src="https://github.com/user-attachments/assets/0ef809c5-44d5-4f6f-9783-35d3b13b9606" />


---

## Part 3: Solving Problem 1 (Decision Intelligence)

### 4. Decision Wizard — Defining the Context
**The Flow**: Instead of jumping to solutions, users are forced to define the **Context** and **Constraints** (Cost, Scalability, Risk).
**Outcome**: This establishes the "Ground Truth" for the AI’s reasoning.

<img width="1920" height="1080" alt="image_2026-04-07_22-10-03" src="https://github.com/user-attachments/assets/bf2558ed-c45f-479e-b92a-357161b3faa2" />


### 5. Multi-Option Wizard — Eliminating Bias
**The Problem**: Teams often pick the first solution they find.
**The Flow**: Users add competing solutions (Options). The AI then generates **Pros/Cons** for each based on the business constraints previously defined.

<img width="1920" height="1080" alt="image_2026-04-07_22-11-15" src="https://github.com/user-attachments/assets/be8626ea-0f98-4ccb-9ffb-2899dd9aa260" />


### 6. Trade-off Matrix — Visualizing Stakeholder Alignment
**The Flow**: A 5-axis **Radar Matrix** visualizes the trade-offs of every option (Impact vs. Risk vs. Effort).
**Outcome**: Stakeholders reach consensus faster through visual data rather than debating paragraphs of text.

<img width="1920" height="1080" alt="image_2026-04-07_22-11-02" src="https://github.com/user-attachments/assets/bc0f0ece-da06-46c8-bcfd-bfe50c93de8d" />


### 7. Deep Reasoning Analysis — AI-Driven Verdict
**The Flow**: Powered by `deepseek/deepseek-r1`, the AI moves beyond "simple summaries" to provide **Deep Reasoning**.
**Output**: A final verdict with a confidence score, highlighting "Hidden Assumptions" that could break the product roadmap.

<img width="1920" height="1080" alt="image_2026-04-07_22-11-15" src="https://github.com/user-attachments/assets/091ac4a0-4dff-4916-b68f-873b30fd7169" />


---

## Part 4: Solving Problem 2 (Adaptive Specs)

### 8. Living Spec Editor — Bridging Logic to Requirements
**The Problem**: PRDs and Specs are often disconnected from the original "Why" (the decision).
**The Flow**: As users write specs in the TipTap editor, they insert **Decision Reference Chips**. Every requirement is explicitly linked to the decision that justified it.

<img width="1920" height="1080" alt="image_2026-04-07_22-11-43" src="https://github.com/user-attachments/assets/5b180ffa-daee-44b3-87ec-9389b45fe77b" />


### 9. Conflict Scanner — Real-time Validation
**The Problem**: "Specification Rot"—Requirements change in one place but contradictions appear elsewhere.
**The Flow**: The scanner performs a semantic audit across all project documents, looking for contradictions.

<img width="1920" height="1080" alt="image_2026-04-07_22-12-21" src="https://github.com/user-attachments/assets/bbf3e85f-4db5-4246-988c-7822b58498fe" />




## Part 5: Ongoing Support

### 10. Spectra Assistant — Contextual Reasoning
**The Flow**: A context-aware sidebar that knows every decision ever made and every spec ever written.
**Capabilities**: The user can ask: *"How does our choice of OAuth2 affect the mobile app PRD?"* and receive a precise, formatted answer.

<img width="1920" height="912" alt="image_2026-04-07_22-27-47" src="https://github.com/user-attachments/assets/b5ce2e01-a2e4-4bb1-91a9-6d865f543c65" />


---

### Implementation Architecture
- **Decision Engine (AIML5)**: Structured reasoning path.
- **Adaptive Specs (AIML6)**: Living document ecosystem.
- **Bi-Directional Bridge**: Real-time synchronization between "The Why" and "The How."
