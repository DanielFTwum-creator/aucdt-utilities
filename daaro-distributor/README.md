# DaaRo Water Distributor Portal (`daaro-distributor`)

A premium, high-fidelity customer-ordering web portal and administrative dashboard built for **Stephanie's DaaRo Water Distribution Network** (authorized distributor of DaaRo Natural Mineral Springs under DAA and Sons Ltd). Sourced from the aquifers of Begoro, Ghana.

## 🚀 Features

### 1. Customer Ordering Portal
- **Rich Interactive UI**: Responsive catalog showcasing DaaRo's water products (350ml, 500ml, 1L bottles, sachet water, and 20L dispensers) with intuitive quantity toggles.
- **WhatsApp Integration**: Validates client info (name, phone, address, custom landmarks) and automatically opens a formatted WhatsApp billing template directed to Stephanie's phone number (`+233 54 511 1245`).
- **Offline-First Persistence**: Custom orders placed are immediately saved locally (via browser `LocalStorage`), allowing the administration desk to track and fulfill orders without a centralized database requirement.

### 2. Administrator Command Deck
*Accessed by clicking the **Portal Access** lock icon in the top header and entering the passcode: **`TUC-ICT-2026`**.*
- **Overview & Performance Analytics**: Displays core business metrics (gross revenue, bottle volume mix, active distributors, stock level warnings) and charts (sales/order trend lines, product distribution charts using Recharts).
- **Orders Ledger**: Review, filter, and transition order states (`Pending` -> `Dispatched` -> `Completed` / `Cancelled`). Toggle invoice payment status and launch a WhatsApp dispatch confirmation message to clients.
- **Inventory Control**: Real-time stock count monitor with warning badges for items falling below safety limits. Directly edit and override stock quantities.
- **Geographic Delivery Map**: An interactive SVG layout of Greater Accra routing zones (East Legon, Legon Campus, Madina/Adenta, Oyibi/Dodowa) displaying shipment density metrics.
- **System Maintenance**: Download local database backups in JSON and reset workspace data back to mock defaults.

## 🛠️ Stack

- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS v4 (vanilla HSL gradient design, glassmorphic overlays)
- **Icons**: Lucide React
- **Charts**: Recharts (fully responsive SVG analytics)
- **Deployment**: Docker containerization (Nginx Alpine)

## 💻 Local Development Setup

Ensure you have **Node.js** and **pnpm** installed.

```bash
# Navigate to the project directory
cd daaro-distributor

# Install dependencies
pnpm install

# Start the Vite local development server
pnpm run dev
```

The application will run on [http://localhost:3000](http://localhost:3000).

## 🐳 Docker Deployment

```bash
# Build the container
docker build -t daaro-distributor .

# Run the container (Map port 80 to host port 8080)
docker run -d -p 8080:80 --name daaro-distributor-app daaro-distributor
```
