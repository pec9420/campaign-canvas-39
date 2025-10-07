import { ReactNode } from "react";
import { Navigation } from "./navigation";
import { Header } from "./header";

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
  profile?: {
    business_name: string;
    business: {
      location: string;
    };
  } | null;
  onSwitchBusiness?: () => void;
}

export function DashboardLayout({
  children,
  title,
  profile,
  onSwitchBusiness
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar - Hidden on mobile, shown on md+ */}
      <div className="hidden md:block">
        <Navigation
          profile={profile}
          onSwitchBusiness={onSwitchBusiness}
        />
      </div>

      {/* Main Content */}
      <div className="md:ml-64">
        {/* Header */}
        <Header title={title} />

        {/* Page Content */}
        <main className="p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}