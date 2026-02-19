# Bounty Board - Testing Guide

## 🧪 Test Scenarios

### 1. Task Creation Flow

#### Test 1.1: Create Task with Valid Data
**Pre-conditions:**
- Wallet connected
- User on "Create Task" view

**Steps:**
1. Enter task title: "Help move furniture"
2. Enter description: "Need help moving sofa and dresser"
3. Set reward: 5 ALGO
4. Set deadline: 7 days
5. Click "Post Task"

**Expected:**
- Task appears in board immediately
- Status is "open"
- Reward shows "5.00 ALGO"
- Task shows in user's account statistics

#### Test 1.2: Create Task - Missing Fields
**Steps:**
1. Leave title empty
2. Click "Post Task"

**Expected:**
- Error message: "Please fill in all required fields"
- Form doesn't submit

#### Test 1.3: Create Task - Invalid Reward
**Steps:**
1. Enter reward: 0.05 ALGO
2. Click "Post Task"

**Expected:**
- Error message: "Minimum reward is 0.1 ALGO"

#### Test 1.4: No Wallet Connected
**Pre-conditions:**
- Wallet disconnected

**Steps:**
1. Try to navigate to "Post Task"

**Expected:**
- "Post Task" button is disabled
- Message: "Connect your wallet to post tasks"

### 2. Task Board Filtering & Sorting

#### Test 2.1: Filter by Status
**Steps:**
1. Go to Task Board
2. Select "Status: Claimed"
3. Observe task list

**Expected:**
- Only tasks with status "claimed" display
- Count updates correctly
- Other statuses hidden

#### Test 2.2: Sort by Reward (Highest First)
**Pre-conditions:**
- Multiple tasks visible with different rewards

**Steps:**
1. Select "Sort by: Highest Reward"
2. Observe task order

**Expected:**
- Tasks sorted by reward descending
- Highest reward task appears first

#### Test 2.3: Sort by Deadline (Nearest First)
**Steps:**
1. Select "Sort by: Nearest Deadline"
2. Observe task order

**Expected:**
- Tasks sorted by deadline ascending
- Nearest deadline appears first

### 3. Task Claiming Flow

#### Test 3.1: Claim Open Task
**Pre-conditions:**
- User not task creator
- Task is in "open" status

**Steps:**
1. Click on task card
2. TaskDetail modal opens
3. Click "Claim Task"

**Expected:**
- Modal closes
- Task status changes to "claimed"
- Claimant field shows current user
- "Submission" tab becomes available
- "Claim Task" button disabled

#### Test 3.2: Cannot Claim Own Task
**Pre-conditions:**
- User is task creator

**Steps:**
1. Click on own task
2. Observe TaskDetail modal

**Expected:**
- "Claim Task" button is disabled or hidden
- Info message: "You created this task"

#### Test 3.3: Cannot Claim Already Claimed Task
**Pre-conditions:**
- Task already claimed by another user

**Steps:**
1. Click on claimed task
2. Observe TaskDetail modal

**Expected:**
- "Claim Task" button is disabled
- "View" button shown instead

### 4. Proof Submission Flow

#### Test 4.1: Submit Valid Proof URI
**Pre-conditions:**
- User has claimed task
- Task status is "claimed"

**Steps:**
1. Open task detail
2. Go to "Submission" tab
3. Enter proof URI: "https://example.com/proof.pdf"
4. Click "Submit Proof"

**Expected:**
- Task status changes to "submitted"
- Proof URI stored
- Modal closes
- Task shows "submitted" badge

#### Test 4.2: Submit Proof - Empty URI
**Steps:**
1. Leave proof URI field empty
2. Click "Submit Proof"

**Expected:**
- Error message: "Please provide a proof URI"
- Form doesn't submit

#### Test 4.3: IPFS Proof URI
**Steps:**
1. Enter IPFS URI: "ipfs://QmXxxx..."
2. Click "Submit Proof"

**Expected:**
- Submission accepted
- Proof URI stored and displayed as link

### 5. Payment Approval Flow

#### Test 5.1: Approve Payment
**Pre-conditions:**
- User is task creator
- Task status is "submitted"
- Proof URI is visible

**Steps:**
1. Open task detail
2. Go to "Actions" tab
3. Click "Approve & Release Payment"

**Expected:**
- Task status changes to "completed"
- Button changes to "View"
- Payment released to claimant
- Modal closes

#### Test 5.2: Cannot Approve as Claimant
**Pre-conditions:**
- User is claimant (not creator)
- Task status is "submitted"

**Steps:**
1. Open task detail
2. Go to "Actions" tab

**Expected:**
- "Approve & Release Payment" button hidden
- Info message shows user's role

#### Test 5.3: Approve Payment Confirmation
**Steps:**
1. Click "Approve & Release Payment"
2. Wallet prompts for signature

**Expected:**
- Wallet shows transaction details
- Payment amount = task reward
- Receiver = claimant address
- User can sign or cancel

### 6. Account Dashboard

#### Test 6.1: View Account Stats
**Pre-conditions:**
- User has created, claimed, and completed tasks

**Steps:**
1. Click "Account" button
2. Observe dashboard

**Expected:**
- Connected wallet address displays
- "Tasks Created" count is correct
- "Tasks Claimed" count is correct
- "Completed" count is correct
- List shows all user's created tasks

#### Test 6.2: Account Stats Update
**Steps:**
1. Create new task
2. Go to Account view
3. Observe stats

**Expected:**
- "Tasks Created" increments by 1
- Task appears in "My Tasks" list

### 7. Responsive Design

#### Test 7.1: Mobile View (< 768px)
**Steps:**
1. Open app on mobile device
2. Navigate through all views

**Expected:**
- Single column layout
- Tasks stack vertically
- Buttons are touch-friendly (44x44px+)
- Text is readable
- No horizontal scrolling

#### Test 7.2: Tablet View (768px - 1024px)
**Steps:**
1. Open app on tablet
2. Resize browser to 768px width

**Expected:**
- 2 column task grid
- Layout adjusts properly
- All content visible

#### Test 7.3: Desktop View (> 1024px)
**Steps:**
1. Open app on desktop
2. Resize browser to 1200px+

**Expected:**
- 3 column task grid (if space allows)
- Optimal spacing
- Full layout utilization

### 8. Wallet Integration

#### Test 8.1: Connect Wallet (Pera)
**Steps:**
1. Click wallet connection button
2. Select "Pera"
3. Approve in Pera mobile app

**Expected:**
- Wallet connected
- Address displayed
- Navigation buttons enabled

#### Test 8.2: Disconnect Wallet
**Steps:**
1. Click connected wallet button
2. Select "Disconnect"

**Expected:**
- Wallet disconnected
- Navigation buttons disabled
- Board still viewable (read-only)

#### Test 8.3: Switch Wallets
**Steps:**
1. Connected to Wallet A
2. Click wallet button
3. Connect Wallet B

**Expected:**
- Wallet A disconnected
- Wallet B connected
- Address updated
- Stats reset to Wallet B's data

### 9. Error Handling

#### Test 9.1: Network Error During Create
**Steps:**
1. Start creating task
2. Simulate network failure
3. Click "Post Task"

**Expected:**
- Error message displayed
- Form retains data
- User can retry

#### Test 9.2: Transaction Rejection
**Steps:**
1. Start claiming task
2. Reject transaction in wallet
3. Observe result

**Expected:**
- Task not claimed
- No status change
- Error message shown

### 10. Time Remaining Display

#### Test 10.1: Time Remaining Format
**Steps:**
1. Create task with 7 day deadline
2. Observe "time remaining" display

**Expected:**
- Format: "7d 3h"
- Updates correctly
- Shows "Expired" if past deadline

#### Test 10.2: Near Deadline Warning
**Steps:**
1. Create task with 1 hour deadline
2. Observe time display

**Expected:**
- Format: "59m"
- Display color indicates urgency
- Visible to potential claimants

## 🔍 Accessibility Testing

### Screen Reader Test
1. Use NVDA (Windows) or VoiceOver (Mac)
2. Navigate through all components
3. Verify labels and descriptions

### Keyboard Navigation
1. Tab through all interactive elements
2. Verify tab order makes sense
3. Test keyboard shortcuts
4. Verify focus indicators visible

### Color Contrast
1. Use WCAG contrast checker
2. Test all badge colors
3. Test link colors
4. Verify 4.5:1 ratio minimum

## ⚡ Performance Testing

### Load Time
```
Expected load time: < 3 seconds
- First contentful paint: < 1.5s
- Largest contentful paint: < 2.5s
```

### Task Rendering
```
50 tasks should load smoothly
- No visible lag during scroll
- Smooth filtering
- Quick sorting
```

### Memory Usage
```
- Initial load: < 50MB
- After interactions: no growth
- No memory leaks detected
```

## 🔐 Security Testing

### Input Validation
- [ ] Sanitize title input
- [ ] Sanitize description input
- [ ] Validate ALGO amounts
- [ ] Validate URLs for proof URI

### Transaction Security
- [ ] All transactions signed
- [ ] Correct receiver address
- [ ] Correct payment amount
- [ ] No unauthorized actions

### Wallet Security
- [ ] Never log wallet address
- [ ] No sensitive data in console
- [ ] Secure transaction signing
- [ ] No duplicate transactions

## 📋 Test Checklist

- [ ] All task creation tests pass
- [ ] All filtering/sorting tests pass
- [ ] Task claiming flow works
- [ ] Proof submission works
- [ ] Payment approval works
- [ ] Account dashboard displays correctly
- [ ] Mobile layout responsive
- [ ] Tablet layout responsive
- [ ] Desktop layout responsive
- [ ] Wallet connection works
- [ ] Wallet switching works
- [ ] Error messages display correctly
- [ ] Time remaining displays correctly
- [ ] Screen reader compatible
- [ ] Keyboard navigation works
- [ ] Load time acceptable
- [ ] No memory leaks
- [ ] Input validation works
- [ ] Transactions secure
- [ ] No console errors

## 🐛 Bug Report Template

```
## Title
Brief description of the bug

## Severity
Critical / High / Medium / Low

## Steps to Reproduce
1. ...
2. ...
3. ...

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- Browser: (Chrome, Firefox, Safari)
- OS: (Windows, Mac, Linux)
- Wallet: (Pera, Defly, KMD)
- Network: (TestNet, MainNet, LocalNet)

## Screenshots/Logs
Include console errors or screenshots

## Notes
Any additional information
```

---

**Note:** These tests assume mock data is in use. When connecting to real smart contracts, additional integration tests will be needed.
