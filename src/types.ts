export type Payment = {
  id: string;
  title: string;
  amount: number;
  payPayUrl: string | null;
  createdAt: Date;
  completedAt: Date | null;
  isDone: boolean;
};
