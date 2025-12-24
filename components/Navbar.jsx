import { BarChart3, Calendar, Settings, Users } from "lucide-react";
import { useUIStore } from "../store/uiStore";

const Navbar = () => {
  const { activeTab, setActiveTab } = useUIStore();
  return (
    <div className="bg-slate-900/50 backdrop-blur-xl border-b border-slate-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex gap-1 overflow-x-auto">
          {[
            {
              id: "dashboard",
              label: "Dashboard",
              icon: BarChart3,
            },
            { id: "calendar", label: "Calendar", icon: Calendar },
            { id: "personas", label: "Personas", icon: Users },
            {
              id: "settings",
              label: "Campaign Settings",
              icon: Settings,
            },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 font-medium transition-all whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? "text-blue-400 border-b-2 border-blue-400 bg-slate-800/30"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/20"
              }`}>
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Navbar;
