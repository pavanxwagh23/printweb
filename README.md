# 🖨️ PrintWeb

A modern, responsive print service web application built with **Next.js**, **TypeScript**, and **Tailwind CSS**. Upload documents, configure print settings, preview results in real-time, and get instant pricing — all from your browser.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-38bdf8?logo=tailwindcss)
![License](https://img.shields.io/badge/License-MIT-green)

---

## ✨ Features

- **📄 File Upload** — Drag & drop or browse to upload PDFs, DOCX, JPG, and PNG files (up to 50MB each)
- **👁️ Live Document Preview** — View uploaded documents with zoom, page navigation, and real-time config reflection
- **⚙️ Print Configuration** — Choose paper size, orientation, color mode, sides, copies, pages per sheet, and page selection
- **🎨 B&W Preview** — Grayscale filter applied in real-time when B&W mode is selected
- **📊 Detailed Price Breakdown** — Line-by-line cost calculation with per-page rates, effective pages, and totals
- **🛒 Order Summary** — Complete overview of files, configuration, pricing, and estimated print time
- **💳 Checkout Modal** — Simulated checkout flow with order confirmation

---

## 💰 Pricing

| Mode | Side | Rate |
|------|------|------|
| Color | Single-sided | ₹6/page |
| Color | Double-sided | ₹5/page |
| B&W | Single-sided | ₹3/page |
| B&W | Double-sided | ₹4/page |

> Price = Effective Pages × Rate per Page × Copies

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/pavanxwagh/printweb.git
cd printweb

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

---

## 📁 Project Structure

```
printweb/
├── app/
│   ├── globals.css          # Global styles & design tokens
│   ├── layout.tsx           # Root layout with metadata
│   └── page.tsx             # Main page — orchestrates all components
├── components/
│   ├── CheckoutModal.tsx    # Checkout & order confirmation flow
│   ├── DocumentPreview.tsx  # PDF/image preview with zoom & navigation
│   ├── FileUpload.tsx       # Drag & drop file upload with validation
│   ├── LandingHero.tsx      # Hero section with feature highlights
│   ├── OrderSummary.tsx     # Detailed order & price breakdown
│   └── PrintConfigPanel.tsx # Print configuration controls
├── types/
│   └── index.ts             # TypeScript interfaces & pricing constants
├── utils/
│   └── pricing.ts           # Price calculation & print time estimation
├── public/
│   └── pdf.worker.min.mjs   # PDF.js worker for client-side PDF rendering
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 16** | React framework with App Router |
| **TypeScript** | Type-safe development |
| **Tailwind CSS** | Utility-first styling |
| **react-pdf** | Client-side PDF rendering |
| **pdfjs-dist** | PDF parsing & page count detection |
| **lucide-react** | Modern icon library |
| **react-dropzone** | File drag & drop handling |

---

## 📸 Key Components

### File Upload
Supports PDF, DOCX, JPG, and PNG files. Automatically detects PDF page count using PDF.js. Shows upload progress with simulated animation.

### Document Preview
Renders PDFs page-by-page with zoom controls (50%–200%). Applies a live grayscale filter when B&W mode is selected. Shows active print configuration as color-coded badges.

### Print Config Panel
Configurable options: copies, color mode (Color/B&W), paper size (A4/Legal/Letter), orientation, single/double-sided, pages per sheet (1/2/4), and page range selection.

### Order Summary
Displays a detailed price breakdown: per-page rate, effective pages, copies multiplier, print cost formula, and estimated print time.

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

<p align="center">
  Built with ❤️ by <a href="https://github.com/pavanxwagh">pavanxwagh</a>
</p>
