# Content Broadcasting System

A website where teachers upload content, principals approve it, and students watch live broadcasts.

## Features

- Login with email and password
- Teachers can upload content (title, subject, description, file, schedule)
- Principals can approve or reject content
- Students can view approved content on a public live page

## How to Run

1. Clone the repo
2. Go to frontend folder
3. Run `npm install`
4. Run `npm run dev`
5. Open http://localhost:3000

## Test Accounts

**Teachers**
- teacher1@example.com / pass
- teacher2@example.com / pass

**Principal**
- principal@example.com / pass

## Folder Structure

- `src/app/` - Next.js pages
- `src/components/` - Reusable components
- `src/context/` - Auth and data state
- `src/services/` - API calls
- `src/lib/` - Mock data and utils

## Tech Used

- Next.js
- React
- Tailwind CSS
- shadcn/ui

## Known Problems

- Protected route check has a duplicate condition (line 12 in ProtectedRoute.jsx)
- Teacher token not recognized after refresh (auth.service.jsx line 36-44)
- Start time and end time are swapped in upload

## Notes

- All data is mocked in lib/data.js
- To connect to a real backend, update the service files
- No real database – everything resets on server restart