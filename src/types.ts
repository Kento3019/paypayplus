export type Member = {
  id: string;
  name: string;
  color: string;
};

export type Room = {
  id: string;
  createdAt: Date;
  members: [Member, Member];
};

export type Payment = {
  id: string;
  title: string;
  amount: number;
  payPayUrl: string | null;
  createdAt: Date;
  completedAt: Date | null;
  isDone: boolean;
  creatorId: string | null;
};
