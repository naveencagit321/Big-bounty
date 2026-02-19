// Algorand utilities for task interactions and payments

import { getAlgodConfigFromViteEnvironment } from "./network/getAlgoClientConfigs";

/**
 * Send payment via Algorand
 */
export async function sendPayment(
  receiver: string,
  amount: number,
  sender: string,
  note?: string
): Promise<string> {
  const algodConfig = getAlgodConfigFromViteEnvironment();
  
  try {
    // Note: Actual implementation would use proper Algorand SDK
    // const params = await algod.transactionParams().do();
    
    const txn = {
      from: sender,
      to: receiver,
      amount: amount,
      note: note ? new TextEncoder().encode(note) : undefined,
    };

    // Note: This is a placeholder - actual signing would happen via wallet
    console.log("Payment transaction prepared:", txn);
    return "txn_id_placeholder";
  } catch (error) {
    console.error("Error preparing payment:", error);
    throw error;
  }
}

/**
 * Format ALGO amount for display
 */
export function formatAlgo(microAlgos: number): string {
  return (microAlgos / 1_000_000).toFixed(2);
}

/**
 * Convert ALGO to microAlgos
 */
export function toMicroAlgos(algos: number): number {
  return Math.round(algos * 1_000_000);
}

/**
 * Get time remaining until deadline
 */
export function getTimeRemaining(deadline: number): string {
  const now = Math.floor(Date.now() / 1000);
  const remaining = deadline - now;

  if (remaining < 0) return "Expired";

  const days = Math.floor(remaining / 86400);
  const hours = Math.floor((remaining % 86400) / 3600);
  const minutes = Math.floor((remaining % 3600) / 60);

  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}
