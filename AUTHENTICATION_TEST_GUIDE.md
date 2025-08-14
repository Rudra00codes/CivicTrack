# 🔐 CivicTrack Authentication Testing Guide

## 📋 Pre-Test Setup

Your authentication system has been revised and is now ready for testing. The development server is running at `http://localhost:3000/`.

## 🚀 Authentication Architecture Overview

### **Current Implementation:**
- **Authentication Provider:** Clerk
- **Auth Flow:** Integrated sign-in/sign-up pages
- **Protected Routes:** Dashboard, Report Issue, Issue Details, Admin
- **Public Routes:** Home page (can view issues without auth)
- **Session Management:** Automatic with Clerk
- **User State:** Available via `useUser()` hook

### **Key Features Implemented:**
1. ✅ **Seamless Auth Flow** - Custom sign-in/sign-up pages
2. ✅ **Protected Routes** - Automatic redirect for unauthenticated users
3. ✅ **Report Issue Logic** - Redirects unregistered users to sign-up
4. ✅ **Session Persistence** - User stays logged in across browser sessions
5. ✅ **Admin Detection** - Based on email containing 'admin'
6. ✅ **Sign-out Flow** - Redirects to home page after sign-out

---

## 🧪 **Testing Scenarios**

### **1. Home Page (Public Access)**
- [ ] **Test:** Visit `http://localhost:3000/`
- [ ] **Expected:** Page loads without authentication
- [ ] **Check:** Can see issues on map and in list
- [ ] **Check:** Auth status shows "❌ Not Signed In"
- [ ] **Check:** Sign In/Sign Up buttons visible in header

### **2. Sign Up Flow**
- [ ] **Test:** Click "Sign Up" button in header OR click "Report Issue" (should redirect)
- [ ] **Expected:** Redirects to `/sign-up` with Clerk sign-up form
- [ ] **Test:** Create account with email/password
- [ ] **Expected:** After sign-up, redirects to home page
- [ ] **Check:** Auth status shows "✅ Signed In"
- [ ] **Check:** User info displayed in Auth Test Panel

### **3. Sign In Flow**
- [ ] **Test:** Sign out first, then click "Sign In" button
- [ ] **Expected:** Redirects to `/sign-in` with Clerk sign-in form  
- [ ] **Test:** Sign in with existing credentials
- [ ] **Expected:** After sign-in, redirects to home page
- [ ] **Check:** Auth status shows "✅ Signed In"

### **4. Protected Routes**
#### **Dashboard Access:**
- [ ] **Test (Signed Out):** Navigate to `/dashboard` directly
- [ ] **Expected:** Redirects to sign-in page
- [ ] **Test (Signed In):** Navigate to `/dashboard`
- [ ] **Expected:** Dashboard loads successfully

#### **Report Issue Protection:**
- [ ] **Test (Signed Out):** Click "Report Issue" button
- [ ] **Expected:** Redirects to sign-up page
- [ ] **Test (Signed In):** Click "Report Issue" button
- [ ] **Expected:** Navigates to `/report-issue` directly

### **5. Session Persistence**
- [ ] **Test:** Sign in, then refresh the page
- [ ] **Expected:** Still signed in after refresh
- [ ] **Test:** Sign in, then open new tab with same URL
- [ ] **Expected:** Still signed in in new tab
- [ ] **Test:** Close browser, reopen, visit site
- [ ] **Expected:** Still signed in (persistent session)

### **6. Sign Out Flow**
- [ ] **Test:** Click UserButton (profile circle) → "Sign out"
- [ ] **Expected:** Redirects to home page
- [ ] **Check:** Auth status shows "❌ Not Signed In"
- [ ] **Check:** Sign In/Sign Up buttons reappear in header

### **7. Admin Detection**
- [ ] **Test:** Create account with email containing 'admin' (e.g., admin@test.com)
- [ ] **Expected:** After sign-in, "Admin" link appears in header
- [ ] **Check:** Auth Test Panel shows "Admin: Yes"
- [ ] **Test:** Navigate to `/admin`
- [ ] **Expected:** Admin dashboard loads

### **8. Error Handling**
- [ ] **Test:** Try accessing protected route while loading (hard refresh)
- [ ] **Expected:** Shows loading spinner, then proper auth state
- [ ] **Test:** Sign out during navigation
- [ ] **Expected:** Graceful handling without errors

---

## 🛠️ **Debug Tools**

### **Auth Test Panel**
The floating debug panel in the bottom-right corner shows:
- **Current Auth Status** (Signed In/Out)
- **User Information** (ID, Email, Name, Admin status)
- **Account Details** (Created date, Last sign-in)
- **Test Buttons** (Sign In/Out, Flow testing)

### **Browser Console Commands**
Open DevTools Console and use:
```javascript
// Test user flow and log all auth state
document.querySelector('[data-testid="auth-test-flow"]')?.click();

// Check current user object
console.log('Current User:', window.Clerk?.user);

// Check auth state
console.log('Auth State:', {
  isSignedIn: window.Clerk?.user !== null,
  isLoaded: window.Clerk?.loaded
});
```

### **Network Tab Monitoring**
Watch for requests to:
- `clerk.accounts.dev` - Clerk API calls
- Authentication-related network activity

---

## ✅ **Expected Test Results**

### **All Tests Passing Means:**
1. 🔐 Authentication works seamlessly
2. 🛡️ Protected routes are properly secured  
3. 🏠 Public access to home page works
4. 🔄 Session management is persistent
5. 🚪 Sign-out redirects correctly
6. 👑 Admin detection functions properly
7. 📱 Report Issue flow redirects unregistered users

### **Common Issues & Solutions:**

**❌ "Missing Clerk Publishable Key" Error**
- **Solution:** Ensure `.env.local` has correct `VITE_CLERK_PUBLISHABLE_KEY`

**❌ Infinite redirect loops**
- **Solution:** Check protected route logic and Clerk configuration

**❌ User not persisting after refresh**
- **Solution:** Verify Clerk provider setup in `main.tsx`

---

## 🎯 **Next Steps After Testing**

1. **Remove Auth Test Panel** from production build
2. **Configure production Clerk keys** for deployment  
3. **Add error boundaries** for auth failures
4. **Implement user profile management**
5. **Add more granular admin permissions**

---

**Ready to test? Start with the Home page at http://localhost:3000/ and work through each scenario!**
