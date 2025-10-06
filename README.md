# 🌿 GreenGrove - Nursery Management System

A comprehensive nursery management website built with Next.js, featuring plant inventory, customer management, order tracking, and care scheduling.

## ✨ Features

### 📊 **Dashboard**
- Key metrics and analytics
- Revenue tracking in Indian Rupees (₹)
- Low stock alerts
- Recent activity feed

### 🌱 **Plant Management**
- Complete plant inventory
- Category-based organization
- Stock level monitoring
- Price management in ₹

### 👥 **Customer Management**
- Customer profiles and contact info
- Order history tracking
- Customer relationship management

### 🛒 **Order Management**
- Order processing and tracking
- Status updates (Pending, Processing, Shipped, Delivered)
- Order item details
- Revenue tracking

### 📅 **Care Schedule**
- Plant care task scheduling
- Watering, fertilizing, pruning reminders
- Task completion tracking
- Due date alerts

### 📈 **Reports & Analytics**
- Sales performance metrics
- Inventory insights
- Customer analytics
- Growth tracking

### 📦 **Inventory Management**
- Stock level monitoring
- Low stock alerts
- Category breakdown
- Inventory value tracking

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/your-username/greengrove-nursery.git
cd greengrove-nursery
```

2. **Install dependencies**
```bash
npm install
```

3. **Run the development server**
```bash
npm run dev
```

4. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## 🛠️ Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Prisma ORM
- **UI Components**: Radix UI
- **Icons**: Lucide React
- **Authentication**: Custom auth system
- **File Upload**: UploadThing

## 📁 Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Home page
│   ├── plants/            # Plant management
│   ├── customers/         # Customer management
│   ├── orders/            # Order management
│   ├── care-schedule/     # Care scheduling
│   ├── reports/           # Analytics
│   └── inventory/         # Inventory management
├── components/            # React components
│   ├── Dashboard.tsx      # Main dashboard
│   ├── InventoryTable.tsx # Plant inventory table
│   ├── CustomerTable.tsx  # Customer management
│   ├── OrderTable.tsx     # Order management
│   └── CareScheduleTable.tsx # Care scheduling
├── actions/               # Server actions
├── lib/                   # Utilities
└── prisma/               # Database schema
```

## 🌐 Deployment

### Deploy on Vercel (Recommended)

1. **Push to GitHub**
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Deploy on Vercel**
- Go to [vercel.com](https://vercel.com)
- Import your GitHub repository
- Deploy with default settings
- Your site will be live at `https://your-project.vercel.app`

### Environment Variables

For production deployment, add these environment variables:

```env
DATABASE_URL="your_database_url"
UPLOADTHING_SECRET="your_uploadthing_secret"
UPLOADTHING_APP_ID="your_uploadthing_app_id"
```

## 💰 Currency

All monetary values are displayed in **Indian Rupees (₹)** with proper formatting:
- Revenue: ₹45,67,890
- Plant prices: ₹4,599, ₹4,400
- Order amounts: ₹8,999, ₹15,675

## 🎯 Demo Features

The application includes mock data for demonstration:
- Sample plants with prices in ₹
- Mock customer data
- Example orders and care schedules
- Analytics with Indian currency formatting

## 📱 Responsive Design

- Mobile-first approach
- Dark/Light mode support
- Responsive navigation
- Touch-friendly interface

## 🔧 Development

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Database Setup (Optional)

1. **Install Prisma**
```bash
npx prisma generate
```

2. **Set up database**
```bash
npx prisma db push
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🌟 Features Highlights

- **Modern UI/UX** with Tailwind CSS
- **Type Safety** with TypeScript
- **Responsive Design** for all devices
- **Indian Currency Support** (₹)
- **Mock Data** for immediate testing
- **Production Ready** deployment
- **Scalable Architecture** with Next.js

## 📞 Support

For support or questions:
- Create an issue on GitHub
- Check the deployment guide
- Review the documentation

---

**Built with ❤️ for nursery management**

🌿 **GreenGrove - Where Nature Meets Technology** 🌿