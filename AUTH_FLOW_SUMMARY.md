/**
 * CivicTrack Authentication Flow Summary
 * Updated: August 12, 2025
 * 
 * This document outlines the authentication user flows implemented in CivicTrack
 */

## 🔄 User Flow Scenarios

### **Scenario 1: New User Registration via Report Issue**
1. User visits home page (public access ✅)
2. User clicks "Report Issue" button
3. System detects user not signed in → Redirects to `/sign-up`
4. User creates account via Clerk
5. After registration → Redirects to home page
6. User can now access "Report Issue" directly

### **Scenario 2: Returning User Sign In**
1. User visits any page
2. User clicks "Sign In" in header
3. Redirects to `/sign-in` page
4. User authenticates via Clerk
5. After sign-in → Redirects to home page
6. User session persists across browser sessions

### **Scenario 3: Protected Route Access**
1. Unauthenticated user tries to access `/dashboard`, `/report-issue`, `/admin`
2. System automatically redirects to sign-in
3. After authentication → Redirects back to intended page
4. Authenticated users access protected routes directly

### **Scenario 4: Admin User Flow**
1. User with admin email (contains 'admin') signs in
2. System detects admin status via email check
3. Admin link appears in header navigation
4. Admin can access `/admin` dashboard
5. Regular users cannot see admin navigation

### **Scenario 5: Session Management**
1. User signs in → Session created
2. User refreshes page → Session persists
3. User opens new tab → Still authenticated
4. User closes browser → Session persists (until manual sign-out)
5. User signs out → Session cleared, redirects to home

## 🛡️ Route Protection Summary

| Route | Access Level | Redirect Behavior |
|-------|-------------|-------------------|
| `/` | Public | No redirect |
| `/sign-in` | Public (signed-out only) | Signed-in users stay on current page |
| `/sign-up` | Public (signed-out only) | Signed-in users stay on current page |
| `/dashboard` | Protected | Redirect to sign-in |
| `/report-issue` | Protected | Redirect to sign-in |
| `/issues/:id` | Protected | Redirect to sign-in |
| `/admin` | Admin Only | Redirect to sign-in |

## 🔧 Implementation Details

### **Authentication State Management:**
- **Provider:** Clerk (`ClerkProvider` in `main.tsx`)
- **State Access:** `useUser()`, `useAuth()` hooks
- **Loading States:** Handled via `isLoaded` flag
- **Route Protection:** `ProtectedRoute` component with `<Outlet />`

### **Key Components:**
- **`App.tsx`** - Route configuration with auth logic
- **`Header.tsx`** - Auth buttons and user state display
- **`ProtectedRoute.tsx`** - Route-level authentication guard
- **`AuthTestComponent.tsx`** - Debug panel (development only)

### **Admin Detection Logic:**
```typescript
const isAdmin = user?.primaryEmailAddress?.emailAddress?.includes('admin');
```

### **Sign-out Configuration:**
- **Redirect URL:** `/` (home page)
- **Session Cleanup:** Automatic via Clerk
- **State Reset:** Automatic via Clerk hooks

This implementation ensures a smooth, secure, and user-friendly authentication experience across all user scenarios.
