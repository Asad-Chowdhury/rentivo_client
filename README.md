# Rentivo - Car Rental Platform

**Rentivo** is a full-stack car rental platform where users can explore rental cars, view detailed listings, book vehicles, manage their bookings, and maintain their own car listings through a secure authenticated dashboard.

**Live Site (Client):** https://rentivo-client.vercel.app  
**Client Repository:** Rentivo Client  
**Backend API:** Express/MongoDB server running with secured car listing and booking endpoints

## Project Highlights

- Secure authentication with Better Auth, Google login, email/password login, JWT token generation, and protected private routes.
- Dynamic car discovery experience with home page available cars, explore page search/filter, and detailed product pages.
- Booking workflow with pickup/return date selection, dynamic price calculation, driver option, special note, and booking persistence.
- User dashboard pages for profile, my bookings, my added cars, add car, update listing, and delete listing confirmation.
- Professional responsive UI built for mobile, tablet, and desktop with dark/light theme support.
- MongoDB-powered data model for users, car listings, and bookings.
- Recruiter-friendly UI details including clean layout, loading states, toast notifications, confirmation modals, and route reload safety.

## Core Pages

- `/` - Home page with banner, available cars, and supporting sections.
- `/explore-cars` - Public car catalog with search and category filtering.
- `/cars/[id]` - Public car details page with booking controls.
- `/add-car` - Protected form to create a new car listing.
- `/my-added-cars` - Protected owner dashboard for listed cars, update modal, and delete confirmation.
- `/my-bookings` - Protected booking management page with confirm and cancel actions.
- `/profile` - Protected user profile dashboard with account summary and quick actions.
- `/login` and `/register` - Authentication pages with validation and Google login.

## Tech Stack

**Frontend**

- Next.js 16 App Router
- React 19
- Tailwind CSS 4
- DaisyUI 5
- Framer Motion
- React Icons
- Contentstack React Toastify

**Authentication and Security**

- Better Auth
- Better Auth JWT plugin
- Better Auth MongoDB adapter
- JWT authorization headers for protected backend API calls
- Next.js Proxy for private route protection

**Database and Backend Integration**

- MongoDB
- Express.js backend API
- REST endpoints for cars and bookings

## Key Features

### Authentication

- Email/password registration and login.
- Google OAuth login.
- Password validation with uppercase, lowercase, and minimum length rules.
- Session-aware Navbar with conditional menu rendering.
- JWT token attached to frontend API requests through `Authorization: Bearer <token>`.

### Car Listings

- Add new car listing with car name, price, type, image URL, seats, location, description, and availability.
- View all cars in a clean grid layout.
- View full car details with pricing and rental policy UI.
- Update existing owner listings through a modal form.
- Delete listings with a confirmation modal.

### Booking System

- Book a car with pickup date, return date, duration, driver-needed option, and special note.
- Dynamic subtotal, platform fee, protection fee, and total price calculation.
- My Bookings page with booking cards and car images.
- Confirm booking and cancel booking actions with toast feedback.

### Profile Dashboard

- Professional profile page with avatar, user details, account status, and dashboard shortcuts.
- Cars listed, total bookings, rating, and earnings summary.
- Profile completeness, notifications, recent activity, and sign-out controls.

## Private Route Protection

Private routes are protected in `src/proxy.js`:

```js
export const config = {
  matcher: [
    "/add-car",
    "/my-added-cars/:path*",
    "/my-bookings/:path*",
    "/profile/:path*",
  ],
};
```

Public routes include:

- Home
- Explore Cars
- Car Details
- Login
- Register

## Environment Variables

Create a `.env` file in the project root and configure:

```env
BETTER_AUTH_SECRET=your_better_auth_secret
BETTER_AUTH_URL=http://localhost:3000
MONGODB_URI=your_mongodb_connection_string
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

Do not commit real credentials to GitHub.

## Local Development

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open the client:

```text
http://localhost:3000
```

The backend API should be running locally at:

```text
https://rentivo-server-three.vercel.app
```

## Available Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## API Integration Overview

The client currently communicates with the backend through these main endpoints:

- `GET /car-listing`
- `GET /car-listing/:userId`
- `GET /car-listing/details/:id`
- `POST /add-new-car`
- `PATCH /car-listing/:id`
- `DELETE /car-listing/:id`
- `POST /booking/:userId`
- `GET /booking/:userId`
- `PATCH /booking/:userId`
- `DELETE /booking/:userId`

Protected API calls include a JWT authorization header from Better Auth:

```js
authorization: `Bearer ${tokenData.token}`;
```

The Explore Cars search and filter use backend query parameters. The server applies MongoDB `$regex` for car-name search and `$in` for car-type filtering.

## UI and UX Notes

- Responsive design for mobile, tablet, and desktop.
- Clean dashboard-style profile and management pages.
- Toast notifications for booking, listing, update, and delete actions.
- Loading states for data fetching.
- Custom 404 page.
- Theme-aware colors designed to work in both light and dark modes.

## Deployment Notes

- Deploy the client on Vercel or another Next.js-compatible platform.
- Add the same environment variables in the hosting provider dashboard.
- Update `BETTER_AUTH_URL` to the deployed client URL.
- Configure backend CORS to allow the deployed client origin.
- Ensure MongoDB credentials are stored only as environment variables.

## Project Status

Rentivo is built as a polished full-stack portfolio project focused on real-world rental workflows, secure authentication, protected dashboard routes, and a clean recruiter-friendly interface.
