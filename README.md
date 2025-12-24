# 🚀 The Reddit Mastermind - Frontend

> AI-powered Reddit marketing automation platform built with Next.js
> and modern React patterns

![Next.js] ![React] ![Tailwind CSS] ![Zustand]

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Environment Setup](#environment-setup)
- [Usage](#usage)
- [Components Documentation](#components-documentation)
- [State Management](#state-management)
- [API Integration](#api-integration)
- [Styling Guidelines](#styling-guidelines)
- [Contributing](#contributing)

---

## 🎯 Overview

**The Reddit Mastermind** is a sophisticated content management system
designed to automate and optimize Reddit marketing campaigns. It
leverages AI to generate personas, schedule content calendars, and
manage multi-account posting strategies with intelligent analytics.

### Key Capabilities

- **AI-Powered Content Generation**: Automated post creation with
  context-aware AI
- **Multi-Persona Management**: Create and control multiple Reddit
  personas with distinct personalities
- **Smart Calendar System**: Weekly content scheduling with daily post
  limits (5 calendars/day)
- **Real-time Analytics**: Track upvotes, comments, and engagement
  metrics
- **Subreddit Targeting**: Focused campaigns on specific subreddits

---

## ✨ Features

### 🎭 Persona Management

- Create unlimited personas with customizable tones
- 5 personality types: Curious, Professional, Motivational, Academic,
  Casual
- Active/Pause status control
- Subreddit-specific targeting
- Real-time persona switching

### 📅 Calendar Generator

- Generate 7-day content calendars
- 1-2 posts per day scheduling
- Post detail viewer with comments
- Past/future date handling
- Daily generation limit (5 calendars)

### 📊 Dashboard Analytics

- Total posts counter
- Upvotes tracking
- Engaged users metrics
- Active personas overview
- Recent activity feed

### ⚙️ Campaign Settings

- Subreddit list management
- Global campaign configuration
- API integration settings

---

## 🛠 Tech Stack

### Core Framework

- **Next.js 14+** - React framework with App Router
- **React 18+** - UI library with hooks

### State Management

- **Zustand** - Lightweight state management
  - `dataStore` - Data entities (personas, posts, calendars)
  - `uiStore` - UI states (modals, loading, active tab)
  - `formStore` - Form inputs and validation

### Styling

- **Tailwind CSS 3.0+** - Utility-first CSS framework
- **Lucide React** - Icon library
- **React Spinners** - Loading indicators

### HTTP Client

- **Axios** - Promise-based HTTP client

### Notifications

- **Sonner** - Toast notifications

---

## 📁 Project Structure

```
reddit-mastermind-frontend/
├── pages/
│   └── app.js                 # Main application entry point
├── components/
│   ├── CalendarGenerator.jsx  # Weekly content calendar UI
│   ├── Dashboard.jsx           # Analytics dashboard
│   ├── Header.jsx              # App header with refresh
│   ├── Navbar.jsx              # Navigation tabs
│   ├── Personas.jsx            # Persona management
│   └── Settings.jsx            # Campaign settings
├── store/
│   ├── dataStore.js            # Data state management
│   ├── formStore.js            # Form state management
│   └── uiStore.js              # UI state management
├── utils/
│   ├── fetchData.js            # API data fetching logic
│   └── showToast.js            # Toast notification helper
├── public/                     # Static assets
├── styles/                     # Global styles
└── package.json                # Dependencies
```

---

## 🚀 Installation

### Prerequisites

- Node.js 18+
- npm or yarn
- Backend API running on `http://localhost:5000`

### Steps

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd reddit-mastermind-frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start development server**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open browser**
   ```
   http://localhost:3000
   ```

---

## 🔧 Environment Setup

### API Configuration

Update `API_BASE_URL` in `pages/app.js`:

```javascript
const API_BASE_URL = "http://localhost:5000/api";
```

For production, use environment variables:

```bash
# .env.local
NEXT_PUBLIC_API_BASE_URL=https://reddit-back.liara.run/api
```

Then update the code:

```javascript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
```

---

## 💡 Usage

### Creating a Persona

1. Navigate to **Personas** tab
2. Click **Create Persona**
3. Fill in:
   - Username (unique identifier)
   - Target Subreddit (from settings list)
   - Tone/Personality (choose from 5 options)
4. Click **Create**

### Generating a Content Calendar

1. Navigate to **Calendar** tab
2. Click **Generate Schedule** or **Add Week**
3. Configure:
   - Number of Days: 7 days (Full Week)
   - Posts Per Day: 1-2 posts
4. Click **Generate Calendar**
5. Wait 2-5 minutes for AI generation

**Note**: Maximum 5 calendar generations per day

### Viewing Post Details

1. Click any post card in the calendar
2. View:
   - Title and body content
   - Persona and subreddit info
   - Publish date and status
   - Upvotes and comments
   - Full comment thread

### Managing Personas

- **Pause/Resume**: Click play/pause icon
- **Delete**: Click trash icon
- **View Details**: Shown on persona card

---

## 📦 Components Documentation

### CalendarGenerator

**Props:**

- `API_BASE_URL` (string) - Backend API endpoint

**Features:**

- Weekly calendar grid (7 days)
- Post cards with persona info
- Generate modal with options
- Post detail modal with comments
- Daily generation limit (5/day)
- Past date detection

**Key Functions:**

```javascript
handleGenerateCalendar(); // Generate new week
handleDeleteCalendar(id); // Remove week
handlePostClick(post); // Open post details
```

### Dashboard

**Data Sources:**

- `posts` - Total posts count
- `client.totalUpvotes` - Cumulative upvotes
- `client.engagedUsers` - Unique users engaged
- `personas` - Active personas count

**Stat Cards:**

- Blue: Total Posts
- Green: Upvotes
- Purple: Engaged Users
- Orange: Active Personas

### Personas

**Props:**

- `API_BASE_URL` (string)

**Features:**

- Create new personas
- Toggle active/paused status
- Delete personas
- Form validation
- Tone selection (5 options)

**API Endpoints:**

```javascript
POST /createPersona       // Create new
DELETE /personas/:id      // Delete
POST /toggleStatusPersona/:id  // Toggle status
```

### Header

**Features:**

- App title with gradient
- Online status indicator
- Refresh button with loading state
- Sticky positioning

### Navbar

**Tabs:**

1. Dashboard (BarChart3)
2. Calendar (Calendar)
3. Personas (Users)
4. Campaign Settings (Settings)

**State:**

- Active tab highlighting
- Border bottom indicator
- Hover effects

---

## 🗄 State Management

### dataStore (Zustand)

Manages all application data entities:

```javascript
{
  settings: {},              // Campaign settings
  client: {},                // Client info & stats
  personas: [],              // Persona list
  calendars: [],             // Content calendars
  posts: [],                 // All posts
  dailyCalendarLimit: 0      // Today's generation count
}
```

**Setters:**

```javascript
setSettings(val);
setClient(val);
setPersonas(val);
setCalendars(val);
setPosts(val);
setDailyCalendarLimit(val);
```

### uiStore (Zustand)

Manages UI state and modals:

```javascript
{
  activeTab: "dashboard",        // Current tab
  isRefreshing: false,           // Data refresh state
  isLoading: false,              // Global loading
  showGenerateModal: false,      // Calendar modal
  showPostDetailModal: null,     // Post detail modal
  showPersonaModal: false        // Persona modal
}
```

### formStore (Zustand)

Manages form inputs (implementation needed):

```javascript
{
  personaForm: {
    userName: "",
    targetSubreddit: "",
    tonePersonality: ""
  },
  generateForm: {
    numberOfDays: "7days",
    postsPerDay: "1post"
  },
  selectedPost: null
}
```

---

## 🔌 API Integration

### Base Configuration

```javascript
const API_BASE_URL = "http://localhost:5000/api";
```

### Endpoints Used

#### Calendar

- `POST /calendar/generate` - Generate new calendar
  ```javascript
  Body: {
    numberOfDays, postsPerDay;
  }
  ```

#### Personas

- `POST /createPersona` - Create persona
  ```javascript
  Body: {
    name, subreddit, tone;
  }
  ```
- `DELETE /personas/:id` - Delete persona
- `POST /toggleStatusPersona/:id` - Toggle active status

#### Data Fetching

- `GET /data` - Fetch all application data (handled by `fetchData`
  utility)

### Error Handling

All API calls include try-catch blocks with toast notifications:

```javascript
try {
  const response = await axios.post(endpoint, data);
  showToast("Success message", "success");
} catch (error) {
  const errorMessage = error.response?.data?.error || "Default error";
  showToast(errorMessage, "error");
}
```

---

## 🎨 Styling Guidelines

### Color Palette

```css
/* Primary Colors */
--slate-900: #0f172a    /* Background */
--slate-800: #1e293b    /* Cards */
--slate-700: #334155    /* Borders */
--blue-600: #2563eb     /* Primary actions */
--purple-600: #9333ea   /* Secondary actions */

/* Status Colors */
--green-500: #22c55e    /* Success/Active */
--yellow-500: #eab308   /* Warning/Paused */
--red-500: #ef4444      /* Error/Delete */
```

### Design Patterns

**Cards:**

```css
bg-slate-800/50 backdrop-blur-xl rounded-2xl
border border-slate-700/50 p-6
```

**Buttons:**

```css
/* Primary */
bg-gradient-to-r from-blue-600 to-blue-700
text-white rounded-xl hover:from-blue-500 hover:to-blue-600

/* Secondary */
border border-slate-600 text-slate-300
rounded-xl hover:bg-slate-700/50
```

**Modals:**

```css
fixed inset-0 backdrop-blur-xl bg-black/50
flex items-center justify-center z-50
```

### Responsive Breakpoints

```css
sm: 640px   /* Small devices */
md: 768px   /* Medium devices */
lg: 1024px  /* Large devices */
xl: 1280px  /* Extra large */
```

---

## 🤝 Contributing

### Development Workflow

1. **Create feature branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make changes**

   - Follow existing code structure
   - Add JSDoc comments
   - Use consistent naming

3. **Test thoroughly**

   - Test all user flows
   - Check responsive design
   - Verify API integration

4. **Commit with meaningful messages**

   ```bash
   git commit -m "feat: add persona filtering feature"
   ```

5. **Push and create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

### Code Style

- Use functional components with hooks
- Implement proper JSDoc comments
- Follow component structure:
  1. State Management
  2. Constants
  3. Helper Functions
  4. Event Handlers
  5. Render Helpers
  6. Main Render

### Component Template

```javascript
/**
 * ComponentName
 * Brief description
 * @param {string} prop1 - Description
 */
const ComponentName = ({ prop1 }) => {
  // State Management
  const { data } = useDataStore();

  // Constants
  const CONSTANT_VALUE = 123;

  // Event Handlers
  const handleAction = () => {
    // Implementation
  };

  // Render
  return <div>{/* Content */}</div>;
};

export default ComponentName;
```

---

## 📝 TODO / Future Enhancements

- [ ] Add Settings component implementation
- [ ] Implement formStore with actual form logic
- [ ] Add real-time activity feed (replace mock data)
- [ ] Implement post regeneration feature
- [ ] Add post editing functionality
- [ ] Create analytics graphs/charts
- [ ] Add export calendar feature
- [ ] Implement search/filter for posts
- [ ] Add dark/light theme toggle
- [ ] Create mobile-responsive optimizations
- [ ] Add keyboard shortcuts
- [ ] Implement undo/redo for actions

---

## 🐛 Known Issues

1. **Daily Calendar Limit**: Resets at midnight UTC (needs timezone
   adjustment)
2. **Form Validation**: Minimal validation on client side
3. **Error Recovery**: No retry mechanism for failed API calls
4. **Mobile UX**: Calendar grid needs better mobile layout
5. **Performance**: Large post lists may cause rendering lag

---

## 📄 License

This project is proprietary software. All rights reserved.

---

## 👥 Authors

**Your Team Name**

- Frontend Development
- UI/UX Design
- API Integration

---

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Tailwind CSS for utility-first styling
- Zustand for simple state management
- Lucide for beautiful icons
- Sonner for elegant notifications

---

## 📞 Support

For issues and questions:

- Contact: abolfazl021mokhtari@gmail.com

---

**Built with ❤️ using Next.js and AI**
