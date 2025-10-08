import { useNavigate, useLocation } from "react-router-dom";
import { Home, Zap, Palette, Settings, ArrowLeftRight, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { BusinessProfile } from "@/data/profiles";

interface NavigationProps {
  profile?: BusinessProfile | null;
  onSwitchBusiness?: () => void;
}

export function Navigation({ profile, onSwitchBusiness }: NavigationProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const navigationItems = [
    {
      icon: Home,
      label: "Dashboard",
      path: "/dashboard",
      active: location.pathname === "/dashboard"
    },
    {
      icon: Zap,
      label: "Campaigns",
      path: "/campaigns",
      active: location.pathname === "/campaigns"
    },
    {
      icon: Palette,
      label: "Brand Hub",
      path: "/brand-hub",
      active: location.pathname === "/brand-hub"
    },
    {
      icon: Settings,
      label: "Settings",
      path: "/settings",
      active: location.pathname === "/settings"
    }
  ];

  return (
    <div className="w-64 bg-card border-r border-border h-screen flex flex-col fixed left-0 top-0 z-30 shadow-lg">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <h1 className="text-xl font-bold text-foreground">Campaign Canvas</h1>
      </div>

      {/* Profile Section */}
      {profile && (
        <div className="p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
              <span className="text-primary font-semibold text-sm">
                {profile.business_name?.charAt(0)?.toUpperCase() || 'B'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {profile.business_name}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {profile.locations?.[0] || "No location"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.path}>
                <Button
                  variant={item.active ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-start h-11 font-medium transition-all duration-200",
                    item.active
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  )}
                  onClick={() => navigate(item.path, { state: { profileId: profile?.id } })}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.label}
                </Button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-border space-y-3">
        <Button
          variant="outline"
          className="w-full justify-start h-11 font-medium"
          onClick={onSwitchBusiness}
        >
          <ArrowLeftRight className="w-5 h-5 mr-3" />
          Switch Business
        </Button>

        <div className="flex items-center space-x-3 pt-2">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="text-sm font-medium text-foreground">User</span>
        </div>
      </div>
    </div>
  );
}