# Bounty Board - Deployment & Integration Guide

## Quick Start

### 1. Build the Project

#### Frontend Build
```bash
cd projects/project_4-frontend
npm install
npm run build
```

#### Smart Contract Compilation
```bash
cd projects/project_4-contracts
poetry install
poetry run algokit project build
```

### 2. Deploy Smart Contract

#### To TestNet
```bash
cd projects/project_4-contracts
poetry run algokit deploy testnet
```

#### To LocalNet
```bash
poetry run algokit deploy localnet
```

### 3. Configure Frontend

Create `.env.local` in `projects/project_4-frontend/`:

```env
# Network Configuration
VITE_ALGOD_NETWORK=testnet
VITE_ALGOD_SERVER=https://testnet-api.algonode.cloud
VITE_ALGOD_PORT=443
VITE_ALGOD_TOKEN=

# Indexer Configuration
VITE_INDEXER_SERVER=https://testnet-idx.algonode.cloud
VITE_INDEXER_PORT=443
VITE_INDEXER_TOKEN=
```

### 4. Run Development Server

```bash
cd projects/project_4-frontend
npm run dev
```

Visit: `http://localhost:5173`

## Integration Steps

### Step 1: Connect BountyBoardApp to Smart Contract

Update `src/components/BountyBoardApp.tsx`:

```typescript
import { useWallet } from '@txnlab/use-wallet-react'
import { algodClient } from '../utils/network/getAlgoClientConfigs'

// In component:
const { signer } = useWallet()

const handleTaskCreated = async (newTask: Task) => {
  // Call smart contract
  const result = await contractClient.create_task(
    newTask.title,
    newTask.description,
    newTask.reward,
    newTask.deadline,
    { sender: walletAddress, signer }
  )
  
  setTasks((prev) => [{ ...newTask, id: result.txnId }, ...prev])
}
```

### Step 2: Setup AlgoKit Client Generator

The AlgoKit client generator creates TypeScript bindings from the smart contract ABI.

```bash
cd projects/project_4-frontend
npm run generate:app-clients
```

This generates contract clients in `src/contracts/`.

### Step 3: Initialize Box Storage

The smart contract uses box storage for task data. Initialize box names:

```python
# In bounty_board.py
task_key = String("task_") + task_id.bytes
```

### Step 4: Add Payment Authorization

```typescript
// In TaskDetail.tsx - handleApprovePayment

const handleApprovePayment = async (taskId: number) => {
  const task = tasks.find(t => t.id === taskId)
  
  // Create axfer transaction (payment)
  const response = await contractClient.approve_and_pay(
    taskId,
    {
      sender: walletAddress,
      signer,
      // Include payment to claimant
      sendParams: {
        fee: 1000,
        amount: task.reward,
        to: task.claimant
      }
    }
  )
}
```

## Testing Checklist

- [ ] Wallet connection works (Pera, Defly, KMD)
- [ ] Can create tasks and see them in board
- [ ] Can claim tasks
- [ ] Can submit proof URIs
- [ ] Can approve payments
- [ ] Task status updates correctly
- [ ] Filtering and sorting work
- [ ] Account dashboard displays stats
- [ ] Responsive on mobile
- [ ] Transactions sign and send successfully

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| VITE_ALGOD_NETWORK | Network name | testnet, localnet, mainnet |
| VITE_ALGOD_SERVER | Algod server URL | https://testnet-api.algonode.cloud |
| VITE_ALGOD_PORT | Port (443 for HTTPS) | 443 |
| VITE_ALGOD_TOKEN | Node auth token | empty for public nodes |
| VITE_INDEXER_SERVER | Indexer server URL | https://testnet-idx.algonode.cloud |
| VITE_INDEXER_PORT | Indexer port | 443 |
| VITE_INDEXER_TOKEN | Indexer auth token | empty for public nodes |

## Useful Resources

- [Algorand Developer Docs](https://developer.algorand.org/)
- [AlgoKit Documentation](https://developer.algorand.org/docs/get-started/algokit/)
- [PyTeal Documentation](https://pyteal.readthedocs.io/)
- [useWallet Integration Guide](https://github.com/TxnLab/use-wallet)
- [Algorand SDK for JavaScript](https://github.com/algorand/js-algorand-sdk)

## Troubleshooting

### Smart Contract Not Found
- Ensure contract is deployed: `algokit project deploy`
- Check contract ID in environment variables
- Verify correct network (testnet vs mainnet)

### Wallet Connection Issues
- Check supported wallets in `App.tsx`
- Verify network config matches wallet settings
- Clear browser cache and reconnect

### Transaction Failures
- Verify account has ALGO for fees
- Check contract method parameters
- Review error logs in browser console

### Box Storage Issues
- Ensure minimum balance for box creation
- Box size shouldn't exceed 4KB per box
- Create boxes before storing data

## Deployment Checklist

- [ ] All dependencies installed
- [ ] Smart contract compiled successfully
- [ ] Contract deployed to chosen network
- [ ] Frontend environment variables configured
- [ ] AlgoKit client generated
- [ ] All components integrated with contract calls
- [ ] Wallet connections tested
- [ ] Transactions tested on testnet
- [ ] UI/UX tested across devices
- [ ] Error handling implemented
- [ ] Gas fees calculated and acceptable
- [ ] Ready for mainnet deployment

## Production Deployment

### Frontend (Vercel/Netlify)
```bash
npm run build
# Deploy dist/ folder
```

### Smart Contract (Mainnet)
```bash
algokit deploy mainnet
# Use mainnet-safe flag to confirm
```

## Support

For issues or questions:
1. Check the [Algorand Discord](https://discord.gg/algorand)
2. Review [GitHub Issues](https://github.com/algorandfoundation/algokit-cli/issues)
3. Check [AlgoKit Documentation](https://developer.algorand.org/docs/get-started/algokit/)
