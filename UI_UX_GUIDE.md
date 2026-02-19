# Bounty Board UI/UX Guide

## 📱 Component Hierarchy

```
App (with WalletProvider)
  ↓
Home
  ↓
BountyBoardApp (main dashboard)
  ├─ Header (navigation)
  │   ├─ Logo "⚡ Bounty Board"
  │   ├─ Navigation Buttons
  │   │   ├─ 📋 Tasks (Board View)
  │   │   ├─ ➕ Post Task (Create View)
  │   │   └─ 👤 Account (Account View)
  │   └─ Wallet Status
  │
  └─ Main Content
      ├─ TaskBoard (View: "board")
      │   ├─ Filter & Sort Bar
      │   │   ├─ Status Filter Dropdown
      │   │   ├─ Sort By Dropdown
      │   │   └─ Task Count Display
      │   └─ Task Cards Grid (responsive)
      │       └─ TaskCard (repeating)
      │           ├─ Title & Status Badge
      │           ├─ Description Preview
      │           ├─ Creator & Claimant Info
      │           ├─ Reward & Time Remaining
      │           └─ "Claim Task" / "View" Button
      │
      ├─ TaskPosting (View: "create")
      │   ├─ Form Title
      │   ├─ Error Alert (conditional)
      │   └─ Form Fields
      │       ├─ Task Title Input
      │       ├─ Description Textarea
      │       ├─ Reward Amount Input
      │       ├─ Deadline Days Input
      │       └─ "Post Task" Button
      │
      └─ Account Dashboard (View: "account")
          ├─ Connected Wallet Display
          ├─ Stats Grid (3 columns)
          │   ├─ Tasks Created
          │   ├─ Tasks Claimed
          │   └─ Completed
          └─ My Tasks Section
              └─ Task List Items
```

## 🎨 Color Scheme

### Status Badge Colors
- **Open** - Green (badge-success) ✅
- **Claimed** - Yellow (badge-warning) ⚠️
- **Submitted** - Blue (badge-info) ℹ️
- **Completed** - Purple (badge-primary) ✨
- **Disputed** - Red (badge-error) ❌

### Reward Display
- Text: Green (#16a34a)
- Icon: 💰
- Format: "10.50 ALGO"

### Time Remaining
- Text: Orange (if < 1 day)
- Icon: ⏰
- Format: "7d 3h" or "23h 45m"

## 📐 Responsive Breakpoints

| Screen Size | Layout |
|-------------|--------|
| Mobile (< 768px) | Single column |
| Tablet (768px - 1024px) | 2 columns |
| Desktop (> 1024px) | 2-3 columns |

## 🎭 User States

### Not Connected
- Show wallet connection warning
- Disable "Post Task" and "Account" buttons
- Board is viewable (read-only)

### Connected but No Wallet
- Show "Connect your wallet" message
- Enable all navigation
- Can post tasks
- Can claim tasks

### Task Creator
- "Claim Task" button disabled
- "Approve & Release Payment" button visible when submitted
- Can see approval action in TaskDetail

### Task Claimant
- "Claim Task" button disabled (already claimed)
- "Submit Proof" tab becomes active
- Can submit proof URI

### Neutral User
- Can view all tasks
- Can claim open tasks
- Normal interaction

## 📋 Form Validation

### TaskPosting Form
```
✓ Title: 1-100 characters, required
✓ Description: 1+ character, required
✓ Reward: 0.1 - 1,000,000 ALGO, required
✓ Deadline: 1 - 365 days, required

Error Messages:
✗ "Please fill in all required fields"
✗ "Minimum reward is 0.1 ALGO"
✗ "Please connect your wallet first"
✗ "Failed to create task" (generic)
```

### TaskDetail Proof Submission
```
✓ Proof URI: Valid URL format
✓ Must be provided, required

Error Messages:
✗ "Please provide a proof URI"
✗ "Failed to submit proof"
```

## 🔄 Task Status Flow

```
┌─────────┐
│  OPEN   │ ← Task created
└────┬────┘
     │ User claims task
     ↓
┌─────────┐
│ CLAIMED │ ← Claimant works on task
└────┬────┘
     │ Submit proof
     ↓
┌──────────┐
│SUBMITTED │ ← Waiting for creator approval
└────┬─────┘
     │ Creator approves
     ↓
┌──────────┐
│COMPLETED │ ← Payment released
└──────────┘

Alternative:
SUBMITTED → DISPUTED (if contested)
```

## 📲 Mobile Optimizations

- Single column task grid
- Larger touch targets (buttons 44x44px minimum)
- Readable text sizes
- Simplified modals (full height on small screens)
- Touch-friendly filters
- Sticky header for navigation

## ♿ Accessibility Features

- Semantic HTML structure
- ARIA labels on buttons
- Color contrast ratios meet WCAG AA
- Keyboard navigation support
- Focus indicators on interactive elements
- Screen reader friendly

## 🎬 User Interactions

### Browse Tasks
1. User lands on board view
2. Sees task list filtered by "open" (default)
3. Can change filters and sort
4. Clicks on task to view details

### Post Task
1. User clicks "Post Task" button
2. Form appears with all fields
3. User fills in task details
4. Click "Post Task" button
5. Form validates
6. Task created and added to board
7. Success feedback and view returns to board

### Claim Task
1. User views open task in TaskDetail modal
2. Clicks "Claim Task" button
3. Task status changes to "claimed"
4. Modal closes
5. Task appears in board with "claimed" badge
6. "Submission" tab now active for this user

### Submit Proof
1. Claimant views claimed task
2. Enters proof URI (IPFS link, cloud storage, etc.)
3. Clicks "Submit Proof"
4. Status changes to "submitted"
5. Creator can now see the proof link

### Approve Payment
1. Creator views submitted task
2. Reviews proof in TaskDetail modal
3. Clicks "Approve & Release Payment"
4. Transaction sent to blockchain
5. Status changes to "completed"
6. Claimant receives ALGO

## 🎯 Key Metrics Displayed

### Task Board
- Total task count
- Tasks by status (via filter)
- Reward amounts
- Time remaining

### Account Dashboard
- Total tasks created
- Total tasks claimed
- Total tasks completed
- List of your tasks

### Task Detail
- Full creator address
- Claimant address (if claimed)
- Exact deadline timestamp
- Full description
- Submission proof URI
- Status and reward

## 🔔 Feedback Mechanisms

### Success States
- Task created successfully
- Task claimed successfully
- Proof submitted successfully
- Payment approved successfully

### Error States
- Form validation errors
- Wallet not connected
- Transaction failed
- Server errors

### Loading States
- "Creating Task..."
- "Submitting..."
- "Approving..."
- Spinner on task board

## 🎨 Design System

### Typography
- Headings: Bold, Large (2xl - 3xl)
- Body text: Regular, Medium (base)
- Labels: Semibold, Small (sm)
- Metadata: Regular, Extra small (xs)

### Spacing
- Component padding: 4-6 units (Tailwind)
- Section margins: 6-8 units
- Grid gaps: 4 units
- Form field spacing: 4 units

### Shadows
- Cards: shadow-md (hover: shadow-lg)
- Modals: shadow-xl
- Buttons: no shadow

### Border Radius
- Cards: lg
- Inputs: lg
- Badges: default
- Buttons: lg
