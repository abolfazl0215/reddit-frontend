import { CheckCircle, RefreshCw, XCircle } from "lucide-react";
import { fetchData } from "../utils/fetchData";
import { useFormStore } from "../store/formStore";
import { useUIStore } from "../store/uiStore";
import { useDataStore } from "../store/dataStore";

const Header = ({ API_BASE_URL }) => {
  // data states
  const {
    setSettings,
    setClient,
    setPersonas,
    setCalendars,
    setPosts,
    setDailyCalendarLimit,
  } = useDataStore();
  // UI states
  const { setIsRefreshing, isRefreshing } = useUIStore();

  return (
    <header className="bg-slate-900/80 backdrop-blur-xl border-b border-slate-700/50 sticky top-0 z-40 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              The Reddit Mastermind
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              AI powered reddit marketing
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-slate-800/50 backdrop-blur-sm px-4 py-2 rounded-lg border border-slate-700/50">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-sm text-slate-300">Online</span>
            </div>
            <button
              onClick={() =>
                fetchData(
                  setIsRefreshing,
                  setClient,
                  setPersonas,
                  setCalendars,
                  setPosts,
                  setSettings,
                  API_BASE_URL,
                  setDailyCalendarLimit,
                )
              }
              disabled={isRefreshing}
              className="flex cursor-pointer items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-500 hover:to-blue-600 transition-all disabled:opacity-50 shadow-lg shadow-blue-500/30">
              <RefreshCw
                className={`w-4 h-4 ${
                  isRefreshing ? "animate-spin" : ""
                }`}
              />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
