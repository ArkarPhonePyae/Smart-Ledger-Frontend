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
    inflowChart: number[];
    outflowChart: number[];
    recentActivity: RecentActivityItem[];
}