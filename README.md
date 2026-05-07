# 🌊 FloodSense AI

**FloodSense AI** is a professional, real-time flood risk intelligence and disaster preparedness platform. It leverages AI-driven weather analysis to provide actionable insights for community safety and disaster management.

![FloodSense AI Logo](./public/favicon.png)

## 🚀 Key Features

- **AI-Powered Risk Assessment**: Utilizes Gemini AI to analyze precipitation, wind, and humidity data for real-time flood risk scoring.
- **Interactive Disaster Map**: Visualizes current locations with integrated flood risk overlays and proximity alerts.
- **Tactical Broadcast System**: Simulates (or executes via Twilio) emergency SMS broadcasts to local communities.
- **Multilingual Support**: Available in both English and Hindi to ensure accessibility for local residents.
- **Live Weather Data**: Real-time integration with Open-Meteo for accurate, no-key-required weather updates.

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite 6
- **Styling**: Tailwind CSS 4, Framer Motion (Animations)
- **AI**: Google Gemini AI (@google/genai)
- **Maps**: Leaflet, React-Leaflet, OpenStreetMap
- **Icons**: Lucide React
- **Communications**: Twilio API Integration (Optional)

## 📦 Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/[YOUR_USERNAME]/floodsense-ai.git
   cd floodsense-ai
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory (you can copy `.env.example`):
   ```bash
   cp .env.example .env
   ```
   Add your **Gemini API Key**:
   ```env
   GEMINI_API_KEY="your_api_key_here"
   ```
   *Note: The app will work perfectly with just the Gemini key. Other keys like Twilio are optional.*

4. **Run the development server:**
   ```bash
   npm run dev
   ```

## 🛡️ Security

This project uses a `.gitignore` to ensure that sensitive files like `.env` are never pushed to GitHub. Always use `.env.example` to document required variables without exposing your actual keys.

## 📄 License

MIT License. See [LICENSE](LICENSE) for details.

---
Built with ❤️ for community safety.
