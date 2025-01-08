export interface Transaction {
  id: number,
  amount: number,
  type: string, // income || expense
  title?: string | null,
  description?: string | null,
  date: Date,
  updatedAt: Date,
  userId: number
}
