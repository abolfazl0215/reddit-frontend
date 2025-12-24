import { useDataStore } from "../store/dataStore";
import { MessageSquare, TrendingUp, Users } from "lucide-react";

/**
 * Mock data for recent activity feed
 * TODO: Replace with real-time data from backend
 */
const RECENT_ACTIVITY_MOCK = [
  {
    id: 1,
    action: "Posted in r/marketing",
    persona: "MarketingPro",
    time: "2 hours ago",
  },
  {
    id: 2,
    action: "Comment on discussion thread",
    persona: "TechGuru",
    time: "4 hours ago",
  },
  {
    id: 3,
    action: "Upvoted in r/startup",
    persona: "StartupFan",
    time: "6 hours ago",
  },
];

/**
 * Dashboard Component
 * Displays key metrics, statistics, and recent activity overview
 * Main landing page showing campaign performance at a glance
 */
const Dashboard = () => {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================

  const { client, personas, posts } = useDataStore();

  // ============================================================================
  // CONSTANTS & CONFIGURATION
  // ============================================================================

  /**
   * Statistics card configurations
   * Defines the metrics displayed on the dashboard
   */
  const STATS_CONFIG = [
    {
      label: "Total Posts",
      value: posts?.length || 0,
      icon: MessageSquare,
      color: "blue",
    },
    {
      label: "Upvotes",
      value: client?.totalUpvotes || 0,
      icon: TrendingUp,
      color: "green",
    },
    {
      label: "Engaged Users",
      value: client?.engagedUsers || 0,
      icon: Users,
      color: "purple",
    },
    {
      label: "Active Personas",
      value: personas?.filter((p) => p.active).length || 0,
      icon: Users,
      color: "orange",
    },
  ];

  /**
   * Color scheme mapping for stat cards
   * Maps color names to Tailwind CSS classes
   */
  const COLOR_SCHEMES = {
    blue: {
      bg: "bg-blue-500/20 border border-blue-500/30",
      text: "text-blue-400",
    },
    green: {
      bg: "bg-green-500/20 border border-green-500/30",
      text: "text-green-400",
    },
    purple: {
      bg: "bg-purple-500/20 border border-purple-500/30",
      text: "text-purple-400",
    },
    orange: {
      bg: "bg-orange-500/20 border border-orange-500/30",
      text: "text-orange-400",
    },
  };

  // ============================================================================
  // RENDER HELPERS
  // ============================================================================

  /**
   * Renders a single statistics card
   * @param {Object} stat - Statistics configuration object
   * @param {number} index - Card index for key prop
   */
  const renderStatCard = (stat, index) => {
    const colorScheme = COLOR_SCHEMES[stat.color];
    const Icon = stat.icon;

    return (
      <div
        key={index}
        className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 hover:border-slate-600/50 transition-all shadow-xl"
        role="article"
        aria-label={`${stat.label}: ${stat.value}`}>
        <div className="flex items-center justify-between">
          {/* Stat Text Content */}
          <div>
            <p className="text-sm text-slate-400">{stat.label}</p>
            <p className="text-3xl font-bold text-white mt-2">
              {stat.value.toLocaleString()}
            </p>
          </div>

          {/* Stat Icon */}
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorScheme.bg}`}
            aria-hidden="true">
            <Icon className={`w-6 h-6 ${colorScheme.text}`} />
          </div>
        </div>
      </div>
    );
  };

  /**
   * Renders a single activity item
   * @param {Object} activity - Activity data object
   */
  const renderActivityItem = (activity) => (
    <div
      key={activity.id}
      className="flex items-center gap-4 p-4 bg-slate-700/30 backdrop-blur-sm rounded-xl border border-slate-600/30 hover:border-slate-500/50 transition-all"
      role="listitem">
      {/* Activity Icon */}
      <div
        className="w-10 h-10 bg-blue-500/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-blue-500/30 flex-shrink-0"
        aria-hidden="true">
        <Users className="w-5 h-5 text-blue-400" />
      </div>

      {/* Activity Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white truncate">
          {activity.action}
        </p>
        <p className="text-xs text-slate-400 mt-1">
          by {activity.persona}
        </p>
      </div>

      {/* Activity Timestamp */}
      <span className="text-xs text-slate-400 flex-shrink-0">
        {activity.time}
      </span>
    </div>
  );

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="space-y-6">
      {/* Statistics Cards Grid */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        role="region"
        aria-label="Dashboard statistics">
        {STATS_CONFIG.map(renderStatCard)}
      </div>

      {/* Recent Activity Section */}
      <div
        className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6 shadow-xl"
        role="region"
        aria-label="Recent activity">
        {/* Section Header */}
        <h2 className="text-xl font-bold text-white mb-4">
          Recent Activity
        </h2>

        {/* Activity List */}
        <div className="space-y-3" role="list">
          {RECENT_ACTIVITY_MOCK.length > 0 ? (
            RECENT_ACTIVITY_MOCK.map(renderActivityItem)
          ) : (
            // Empty State
            <div className="text-center py-8">
              <p className="text-slate-400">
                No recent activity to display
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
