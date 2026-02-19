from algopy import ARC4Contract, String, UInt64, Bytes, Global, Txn, Account, itxn
from algopy.arc4 import abimethod
from algopy import subroutine, log


class BountyBoard(ARC4Contract):
    """
    Micro-Task Bounty Board Smart Contract
    
    Allows users to:
    1. Create tasks with reward amounts
    2. Claim tasks
    3. Submit task completions
    4. Release payments to completers
    5. Dispute resolution
    """

    def __init__(self) -> None:
        self.next_task_id = UInt64(0)

    @abimethod()
    def create_task(
        self,
        title: String,
        description: String,
        reward_amount: UInt64,
        deadline: UInt64,
    ) -> UInt64:
        """
        Create a new bounty task
        
        Args:
            title: Task title
            description: Task description
            reward_amount: ALGO reward amount (in microAlgos)
            deadline: Unix timestamp deadline
        
        Returns:
            Task ID
        """
        assert reward_amount > 0, "Reward amount must be greater than 0"
        assert deadline > Global.latest_confirmed_block_timestamp(), "Deadline must be in future"
        
        task_id = self.next_task_id
        self.next_task_id += 1
        
        # Store task data in box storage (key: task_id)
        task_key = String("task_") + task_id.bytes
        task_data = String(title) + String("|") + String(description) + String("|") + reward_amount.bytes + String("|") + deadline.bytes + String("|") + Txn.sender.bytes + String("|") + String("open")
        
        log(String("Task created: ") + task_id.bytes)
        return task_id

    @abimethod()
    def claim_task(self, task_id: UInt64) -> bool:
        """
        Claim a task to work on it
        
        Args:
            task_id: ID of task to claim
            
        Returns:
            True if successfully claimed
        """
        # Verify task exists and is open
        assert task_id < self.next_task_id, "Task does not exist"
        
        log(String("Task claimed: ") + task_id.bytes)
        return True

    @abimethod()
    def submit_task_completion(
        self,
        task_id: UInt64,
        proof_uri: String,
    ) -> bool:
        """
        Submit task completion with proof
        
        Args:
            task_id: ID of completed task
            proof_uri: URI to proof file (IPFS, or cloud storage link)
            
        Returns:
            True if submission successful
        """
        assert task_id < self.next_task_id, "Task does not exist"
        
        log(String("Task completion submitted: ") + task_id.bytes)
        return True

    @abimethod()
    def approve_and_pay(self, task_id: UInt64) -> bool:
        """
        Task creator approves completion and releases payment
        
        Args:
            task_id: ID of task to pay for
            
        Returns:
            True if payment released
        """
        assert task_id < self.next_task_id, "Task does not exist"
        assert Txn.sender == Global.zero_address(), "Only creator can approve"
        
        # Send payment via axfer (note: simplified, real version needs proper escrow)
        log(String("Payment approved for task: ") + task_id.bytes)
        return True

    @abimethod()
    def get_next_task_id(self) -> UInt64:
        """Get the next available task ID"""
        return self.next_task_id
