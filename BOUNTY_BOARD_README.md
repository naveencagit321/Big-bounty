# ⚡ Micro-Task Bounty Board

A decentralized micro-task marketplace built on Algorand where students can post small tasks and offer ALGO as payment, while others can claim tasks, submit proofs of completion, and receive instant payments.

## 🎯 Project Overview

**Difficulty:** Beginner  
**Estimated Time:** 10-12 hours  
**Status:** ✅ Core Features Implemented

### Features Implemented

#### 1. **Smart Contract (Algorand)**
- Task creation with creator, reward, and deadline
- Task claiming mechanism
- Completion proof submission
- Payment release workflow
- Built with PyTeal (Algorand Python SDK)

**Location:** [`smart_contracts/bounty_board/bounty_board.py`](../projects/project_4-contracts/smart_contracts/bounty_board/bounty_board.py)

#### 2. **Frontend Components**

##### **TaskPosting Component**
- Form for creating new tasks
- Input fields: Title, Description, Reward (ALGO), Deadline
- Validation and error handling
- Wallet connection requirement

**Location:** [`src/components/TaskPosting.tsx`](../projects/project_4-frontend/src/components/TaskPosting.tsx)

##### **TaskBoard Component**
- Display all available tasks in a grid
- Filter by status (Open, Claimed, Completed, Disputed)
- Sort by reward amount or deadline
- Task cards with key information (title, reward, time remaining)
- Status badges with color coding

**Location:** [`src/components/TaskBoard.tsx`](../projects/project_4-frontend/src/components/TaskBoard.tsx)

##### **TaskDetail Component**
- Modal for detailed task view
- Three tabs: Details, Submission, Actions
- Proof of completion submission
- Action buttons based on user role (creator/claimant)
- Payment approval workflow

**Location:** [`src/components/TaskDetail.tsx`](../projects/project_4-frontend/src/components/TaskDetail.tsx)

##### **BountyBoardApp Component**
- Main dashboard component
- Navigation between Board, Create Task, and Account views
- Account dashboard showing statistics
- Task management and state management
- Mock data for demo purposes

**Location:** [`src/components/BountyBoardApp.tsx`](../projects/project_4-frontend/src/components/BountyBoardApp.tsx)

#### 3. **Utilities & Types**

##### **Bounty Interfaces**
- `Task`: Task data structure
- `TaskFormData`: Form submission data
- `Account`: User account information

**Location:** [`src/interfaces/bounty.ts`](../projects/project_4-frontend/src/interfaces/bounty.ts)

##### **Utility Functions**
- `sendPayment()`: Send ALGO via Algorand
- `formatAlgo()`: Format microAlgos for display
- `toMicroAlgos()`: Convert ALGO to microAlgos
- `getTimeRemaining()`: Calculate time until deadline

**Location:** [`src/utils/bountyUtils.ts`](../projects/project_4-frontend/src/utils/bountyUtils.ts)

## 🏗️ Architecture

```
┌─────────────────┐
│  React Frontend │  (Task UI, Wallet Connection)
│   (Vite + TS)   │
└────────┬────────┘
         │
    ┌────┴──────────────────────────┐
    │                               │
┌───▼──────────────────┐   ┌────────▼──────────────────┐
│  Smart Contract      │   │  Frontend Components      │
│  (PyTeal/Algorand)   │   │  (React + TypeScript)     │
│  - Create Task       │   │  - TaskPosting            │
│  - Claim Task        │   │  - TaskBoard              │
│  - Submit Proof      │   │  - TaskDetail             │
│  - Release Payment   │   │  - BountyBoardApp         │
└──────────────────────┘   └────────────────────────────┘
    │                               │
    └──────────┬────────────────────┘
               │
        ┌──────▼──────────┐
        │    Algorand     │
        │   Blockchain    │
        │  (Mainnet/Test) │
        └─────────────────┘
```

## 🚀 How to Run

### Prerequisites
- Node.js >= 20.0
- Python >= 3.12
- AlgoKit CLI
- Algorand wallet (Pera, Defly, or Exodus)

### Setup

#### 1. Install Dependencies

**Frontend:**
```bash
cd projects/project_4-frontend
npm install
```

**Smart Contracts:**
```bash
cd projects/project_4-contracts
poetry install
```

#### 2. Start Development Server

**Frontend:**
```bash
npm run dev
```

This starts Vite dev server at `http://localhost:5173`

**Build:**
```bash
npm run build
```

#### 3. Deploy Smart Contract

```bash
cd projects/project_4-contracts
algokit deploy
```

## 📱 User Workflows

### Task Creator Workflow
1. Connect wallet
2. Click "Post Task"
3. Fill in task details (title, description, reward, deadline)
4. Submit form (creates escrow transaction)
5. View task in board
6. Receive submission from claimant
7. Review proof and approve payment

### Task Claimant Workflow
1. Connect wallet
2. Browse task board
3. Click "Claim Task" on desired task
4. Complete the task
5. Submit proof (URI to file/photo)
6. Wait for creator approval
7. Receive payment when approved

### Account Dashboard
- View statistics: tasks created, claimed, completed
- Manage your tasks
- Track reputation

## 💰 Payment Flow

```
Creator Deposits ALGO
        ↓
[Escrow Contract Holds Funds]
        ↓
Claimant Completes Task
        ↓
Creator Reviews Proof
        ↓
Creator Approves Payment
        ↓
Claimant Receives ALGO
```

## 🔧 Smart Contract Methods

### `create_task(title, description, reward_amount, deadline) → task_id`
Create a new bounty task and fund the escrow

### `claim_task(task_id) → bool`
Mark a task as claimed by the current user

### `submit_task_completion(task_id, proof_uri) → bool`
Submit proof of task completion (IPFS link, cloud storage URL, etc.)

### `approve_and_pay(task_id) → bool`
Task creator approves and releases payment to claimant

### `get_next_task_id() → uint64`
Get the next available task ID

## 🛠️ Technical Stack

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, DaisyUI
- **Smart Contracts:** PyTeal, Algorand Python SDK
- **Wallet Integration:** TxnLab useWallet (Pera, Defly, Exodus)
- **Storage:** Algorand box storage for task data
- **Proof Upload:** IPFS or cloud storage URLs

## 📊 Data Structures

### Task Object
```typescript
{
  id: number;
  title: string;
  description: string;
  creator: string;           // Creator wallet address
  reward: number;            // In microAlgos
  status: "open" | "claimed" | "submitted" | "completed" | "disputed";
  claimant?: string;         // Claimant wallet address
  deadline: number;          // Unix timestamp
  createdAt: number;         // Unix timestamp
  submissionUri?: string;    // Link to proof
}
```

## 🔒 Security Considerations

1. **Escrow Mechanism:** Funds are held in a smart contract until approval
2. **Proof Verification:** Creator reviews proof before releasing funds
3. **Wallet Integration:** All transactions require wallet signature
4. **Dispute Resolution:** Can extend with arbitration mechanism (future)

## 📈 Future Enhancements

1. **Dispute Resolution**
   - Arbitration system for contested completions
   - Voting by community members
   - Partial refunds

2. **Advanced Features**
   - Task reputation/rating system
   - User profiles with history
   - Task categories and search
   - Automated escrow with smart conditions

3. **Improved Proof Handling**
   - Direct IPFS file upload
   - Media gallery support
   - Document verification

4. **Analytics & Reporting**
   - Task completion statistics
   - User performance metrics
   - Marketplace analytics

5. **Additional Payment Options**
   - Support for ASAs (Algorand Standard Assets)
   - Multi-sig escrow
   - Recurring tasks

## 🧪 Testing

### Frontend Tests
```bash
npm run test
```

### Smart Contract Tests
```bash
cd projects/project_4-contracts
pytest
```

### E2E Tests
```bash
npm run playwright:test
```

## 📝 Learning Outcomes

By building this project, you'll learn:

✅ **Escrow Mechanisms**
- How to hold funds in a smart contract
- Release conditions and approval workflows

✅ **Two-Sided Marketplaces**
- Task creation and discovery
- Matching buyers and sellers
- State management for transactions

✅ **Dispute Resolution**
- Creator-driven approval process
- Proof submission and verification
- Payment release mechanisms

✅ **Conditional Payments**
- Executing transactions based on conditions
- Using smart contracts for automated escrow
- Payment authorization workflows

## 🌍 Real-World Applications

This system enables:
- Students to earn money through small gigs
- Quick payment and instant settlement via Algorand
- Transparent and trustless transactions
- Scalable marketplace for services

## 📄 License

Part of the AlgoKit Project Catalog

## 🤝 Contributing

Contributions welcome! Please follow the coding standards and submit PRs.

---

**Built with ❤️ for the Algorand ecosystem**
