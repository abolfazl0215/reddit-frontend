import axios from "axios";
import { X } from "lucide-react";
import { useFormStore } from "../store/formStore";
import { useUIStore } from "../store/uiStore";
import { useDataStore } from "../store/dataStore";
import showToast from "../utils/showToast";

/**
 * Settings Component
 * Manages campaign settings including client information, target subreddits, and ChatGPT queries
 * @param {string} API_BASE_URL - Base URL for API requests
 */
const Settings = ({ API_BASE_URL }) => {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================

  // Data states - Client settings and configurations
  const { settings, setSettings } = useDataStore();

  // Form states - Input field values
  const { newSubreddit, setNewSubreddit, newQuery, setNewQuery } =
    useFormStore();

  // UI states - Loading indicators
  const { setIsLoading } = useUIStore();

  // ============================================================================
  // SUBREDDIT MANAGEMENT
  // ============================================================================

  /**
   * Adds a new subreddit to the target list
   * Prevents duplicates and updates both local state and backend
   */
  const addSubreddit = async () => {
    if (
      !newSubreddit ||
      settings.targetSubreddits.includes(newSubreddit)
    ) {
      return;
    }

    const updated = {
      ...settings,
      targetSubreddits: [...settings.targetSubreddits, newSubreddit],
    };

    setSettings(updated);
    setNewSubreddit("");
    setIsLoading(true);

    try {
      await axios.post(`${API_BASE_URL}/settings`, updated);
    } catch (error) {
      console.error("Error adding subreddit:", error);
      showToast("Failed to add subreddit", "error");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Removes a subreddit from the target list
   * @param {string} subreddit - The subreddit to remove
   */
  const removeSubreddit = async (subreddit) => {
    const updated = {
      ...settings,
      targetSubreddits: settings.targetSubreddits.filter(
        (s) => s !== subreddit,
      ),
    };

    setSettings(updated);
    setIsLoading(true);

    try {
      await axios.post(`${API_BASE_URL}/settings`, updated);
    } catch (error) {
      console.error("Error removing subreddit:", error);
      showToast("Failed to remove subreddit", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================================================
  // QUERY MANAGEMENT
  // ============================================================================

  /**
   * Adds a new ChatGPT query to the target list
   * Prevents duplicates and updates both local state and backend
   */
  const addQuery = async () => {
    if (!newQuery || settings.chatGptQueries.includes(newQuery)) {
      return;
    }

    const updated = {
      ...settings,
      chatGptQueries: [...settings.chatGptQueries, newQuery],
    };

    setSettings(updated);
    setNewQuery("");
    setIsLoading(true);

    try {
      await axios.post(`${API_BASE_URL}/settings`, updated);
    } catch (error) {
      console.error("Error adding query:", error);
      showToast("Failed to add query", "error");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Removes a query from the ChatGPT queries list
   * @param {string} query - The query to remove
   */
  const removeQuery = async (query) => {
    const updated = {
      ...settings,
      chatGptQueries: settings.chatGptQueries.filter(
        (q) => q !== query,
      ),
    };

    setSettings(updated);
    setIsLoading(true);

    try {
      await axios.post(`${API_BASE_URL}/settings`, updated);
    } catch (error) {
      console.error("Error removing query:", error);
      showToast("Failed to remove query", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================================================
  // SETTINGS SAVE
  // ============================================================================

  /**
   * Saves all settings to the backend
   * Shows success/error toast notifications
   */
  const saveSettings = async () => {
    setIsLoading(true);

    try {
      await axios.post(`${API_BASE_URL}/settings`, settings);
      showToast("Settings saved successfully!", "success");
    } catch (error) {
      console.error("Error saving settings:", error);
      showToast("Error saving settings. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <h2 className="text-2xl font-bold text-white">
        Campaign Settings
      </h2>

      {/* Settings Container */}
      <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6 shadow-xl space-y-6">
        {/* Client Name Input */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Client Name (Company)
          </label>
          <input
            type="text"
            value={settings.clientName || ""}
            onChange={(e) =>
              setSettings({
                ...settings,
                clientName: e.target.value,
              })
            }
            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>

        {/* Client Info Textarea */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Client (Company) Info
          </label>
          <textarea
            value={settings?.clientInfo || ""}
            onChange={(e) =>
              setSettings({
                ...settings,
                clientInfo: e.target.value,
              })
            }
            rows={4}
            className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>

        {/* Target Subreddits Section */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Target Subreddits
          </label>

          {/* Add Subreddit Input */}
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={newSubreddit}
              onChange={(e) => setNewSubreddit(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addSubreddit()}
              placeholder="e.g., r/marketing"
              className="flex-1 px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            <button
              onClick={addSubreddit}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-500 hover:to-blue-600 transition-all shadow-lg shadow-blue-500/30 cursor-pointer">
              Add
            </button>
          </div>

          {/* Subreddit Tags List */}
          <div className="flex flex-wrap gap-2">
            {settings.targetSubreddits.map((subreddit, index) => (
              <div
                key={index}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-300 rounded-xl border border-blue-500/30 backdrop-blur-sm">
                <span>{subreddit}</span>
                <button
                  onClick={() => removeSubreddit(subreddit)}
                  className="hover:text-blue-100 transition-colors cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ChatGPT Queries Section */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            ChatGPT Queries to Target
          </label>

          {/* Add Query Input */}
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={newQuery}
              onChange={(e) => setNewQuery(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addQuery()}
              placeholder="e.g., Best presentation tools"
              className="flex-1 px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            <button
              onClick={addQuery}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-500 hover:to-blue-600 transition-all shadow-lg shadow-blue-500/30 cursor-pointer">
              Add
            </button>
          </div>

          {/* Query Tags List */}
          <div className="flex flex-wrap gap-2">
            {settings.chatGptQueries.map((query, index) => (
              <div
                key={index}
                className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 text-purple-300 rounded-xl border border-purple-500/30 backdrop-blur-sm">
                <span>{query}</span>
                <button
                  onClick={() => removeQuery(query)}
                  className="hover:text-purple-100 transition-colors cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={saveSettings}
          className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-500 hover:to-green-600 transition-all font-medium shadow-lg shadow-green-500/30 cursor-pointer">
          Save Settings
        </button>
      </div>
    </div>
  );
};

export default Settings;
