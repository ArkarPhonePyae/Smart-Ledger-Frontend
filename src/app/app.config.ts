import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors } from '@angular/common/http'; // 👈 ဒီလိုင်းကို ထည့်ပါ
import { LucideAngularModule } from 'lucide-angular';

import { routes } from './app.routes';
import { jwtInterceptor } from './core/interceptors/jwt-interceptor'; // 👈 Interceptor ဖိုင်နေရာကို သေချာထည့်ပါ
import {
    ChevronLeft,
    LayoutDashboard,
    Receipt,
    Users,
    UserCheck,
    PieChart,
    ShieldAlert,
    Settings,
    ChevronUp,
    User,
    Sliders,
    LogOut,
    Menu,
    Search,
    HelpCircle,
    Moon,
    Sun,
    Bell,
    Plus,
    Wallet,
    TrendingUp,
    ArrowUpRight,
    ArrowDownLeft,
    Briefcase,
    ShieldCheck,
    Sparkles,
    FileText,
    UserPlus,
    ChevronRight,
    X,
    CheckCircle,
    AlertCircle,
} from 'lucide-angular';

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(routes),
        provideAnimations(),
        provideHttpClient(withInterceptors([jwtInterceptor])), // 👈 Backend နဲ့ ချိတ်ရန်နှင့် Token ထည့်ရန် ဤနေရာတွင် ထည့်ပါ
        importProvidersFrom(
            LucideAngularModule.pick({
                ChevronLeft,
                LayoutDashboard,
                Receipt,
                Users,
                UserCheck,
                PieChart,
                ShieldAlert,
                Settings,
                ChevronUp,
                User,
                Sliders,
                LogOut,
                Menu,
                Search,
                HelpCircle,
                Moon,
                Sun,
                Bell,
                Plus,
                Wallet,
                TrendingUp,
                ArrowUpRight,
                ArrowDownLeft,
                Briefcase,
                ShieldCheck,
                Sparkles,
                FileText,
                UserPlus,
                ChevronRight,
                X,
                CheckCircle,
                AlertCircle,
            })
        ),
    ],
};