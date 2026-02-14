# PROMPT MASTER: San Valentin Interactive Experience 2026

## ROLE: EXPERT SENIOR FRONTEND & MOTION DEVELOPER
Act as a world-class Senior Frontend Engineer specialized in React 18/19, Next.js (App Router), Tailwind CSS v4, and Framer Motion. Your goal is to build a "Magical & Premium" interactive web experience.

## ARCHITECTURE: DATA-DRIVEN ENGINE
The entire presentation MUST be driven by a structured JSON object (`presentationData.json`). This engine should dynamically render slides based on the following schema:
- **Slide Types:** `cover`, `text-only`, `image-collage`, `interaction`, `final`.
- **Content:** Title, subtitle, body text (Markdown support).
- **Media:** Array of image URLs/objects per slide for the collage engine.
- **Interactions:** Metadata to identify which interactive component to load (e.g., `HeartRepair`, `HandsSnap`).

## TECHNICAL STACK
- **Framework:** Next.js (App Router) with TypeScript.
- **Styling:** Tailwind CSS v4 (Custom Palette: Rose-Pine / Pastels).
- **Animations:** Framer Motion (heavy use of `AnimatePresence`, `layout` props, and complex variants).
- **Icons/Assets:** Lucide React or SVGs from specialized libraries (Heroicons, Tabler). NO heavy external dependencies.

## DESIGN SYSTEM (PLAYFUL & ROMANTIC)
- **UI:** Super rounded corners (`rounded-3xl`), soft deep shadows (`shadow-2xl`), and glassmorphism (backdrop-blur).
- **Transitions:** Every slide transition must feel like a page turn or a magical reveal (use `custom` variants in Framer Motion).
- **Micro-interactions:** Magnetic buttons, hover scaling, and trail effects.

## CORE COMPONENT SPECIFICATIONS

### 1. JSON-DRIVEN SLIDE MANAGER (`SlideManager.tsx`)
- Logic to parse the slide JSON.
- State management for `currentSlide` and `isInteractionComplete`.
- Navigation lock: Users cannot advance if the slide requires an interaction that hasn't finished.
- Support for "Dynamic Component Injection" based on the slide type.

### 2. DYNAMIC COLLAGE ENGINE (`Collage.tsx`)
- Receives an array of images.
- Renders them in a "Magical Masonry" or "Scattered" layout.
- Images should have a staggered entrance animation.

### 3. INTERACTION MODULES (SVG-BASED)
- **HeartRepair:** Use high-quality SVGs. Drag a bandage SVG to "heal" a broken heart SVG. Use `onDragEnd` for collision detection.
- **HandsSnap:** Two hand SVGs (Lucide or custom paths) that "snap" together using distance formulas (Euclidean distance < threshold).
- **Interactive Scripts:** Capability to run specific JS logic or render custom React bits injected via the slide data.

## CODING STANDARDS
- **Clean Code:** Use TypeScript interfaces for all slide data.
- **Performance:** Optimize images with `next/image`.
- **Modularity:** One file per component, clean exports.
- **Homelab Ready:** Code must be portable and efficient for low-power Mini PCs.

---

### CURRENT TASK: IMPLEMENTATION PHASE
Generate the complete code for the **[COMPONENT_NAME]** ensuring it fits into this JSON-driven architecture. Include detailed comments for animation logic and state transitions.