export interface RecentActivityItem {
    id: number;
    title: string;
    subtitle: string;
    amount: string;
    amountClass: string;
    dotColor: string;
    iconBg: string;
    iconColor: string;
    emoji: string;
}

export interface DashboardSummary {
    totalBalance: number;
    youOwe: number;
    youAreOwed: number;
    activeGroups: number;
    totalPersonalExpense?: number;
    totalGroupExpense?: number;
    inflowChart: number[];
    outflowChart: number[];
    isUserDebtor?: boolean;
    recentActivity: RecentActivityItem[];
    aiInsightText?: string;
    aiInsightAmount?: number;
    aiInsightPayeeName?: string;
}