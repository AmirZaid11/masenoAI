# 🎓 Maseno AI Student Assistant (Grok Edition)

A professional, enterprise-grade AI assistant specifically tailored for **Maseno University (MSU)** students. Now powered by **xAI's Grok API** for superior academic assistance and real-time university insights.

---

## ✨ Features
- 🛡️ **Institutional Knowledge**: Specialized in MSU-specific queries (Timetables, Fees, Hostels).
- 🚀 **Hybrid Intelligence**: Fast local keyword lookup combined with advanced Grok RAG.
- 🌍 **Bilingual Support**: Intelligent responses in both **English** and **Swahili**.
- 🔗 **Verified Links**: Provides direct, absolute links to official university resources.

---

## 🛠️ Setup & Local Development

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/)

### 🚀 Getting Started

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd mai
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory (or use the pre-configured value in `src/lib/grok.ts`):
   ```env
   XAI_API_KEY=your_xai_api_key_here
   ```
   *Note: The application currently has a default key configured internally for immediate use.*

4. **Launch Development Server**:
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:3000`.

---

## 🏗️ Technical Stack
- **Frontend**: React 19, Vite, TypeScript
- **Styling**: Tailwind CSS 4, Motion (Framer Motion)
- **AI Brain**: xAI Grok (Grok-Beta)
- **Icons**: Lucide React

---

## 📝 Usage Tips
- Ask about **"Exam Timetables"** to get direct PDF/Excel download links.
- Use **"Habari"** or **"Sasa"** for Swahili assistance.
- Ask about **"Hostel booking"** or **"Unit registration"** for official process guidance.

---

*Built with ❤️ for the Maseno University Community.*
