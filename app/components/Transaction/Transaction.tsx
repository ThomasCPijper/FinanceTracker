export interface Transaction {
    id: number;
    date: Date;
    type: string;
    category: string;
    amount: number;
    currency: string;
    description: string;
}