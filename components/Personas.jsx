import { Pause, Play, Plus, Trash2, X } from "lucide-react";
import { useFormStore } from "../store/formStore";
import { useUIStore } from "../store/uiStore";
import { useDataStore } from "../store/dataStore";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";
import { setData } from "../utils/fetchData";
import showToast from "../utils/showToast";

/**
 * Personas Component
 * Manages the creation, display, and control of user personas for Reddit campaigns
 * @param {string} API_BASE_URL - Base URL for API requests
 */
const Personas = ({ API_BASE_URL }) => {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================

  // Data states - Personas, settings, and client data
  const {
    personas,
    setPersonas,
    settings,
    setClient,
    setCalendars,
    setSettings,
    setPosts,
    setDailyCalendarLimit,
  } = useDataStore();

  // Form states - Persona creation form data
  const { personaForm, updatePersonaForm, setPersonaForm } =
    useFormStore();

  // UI states - Modal visibility and loading indicators
  const {
    setShowPersonaModal,
    showPersonaModal,
    isLoading,
    setIsLoading,
  } = useUIStore();

  // ============================================================================
  // CONSTANTS
  // ============================================================================

  /**
   * Available tone/personality options for persona creation
   * These define the communication style of each persona
   */
  const TONE_PERSONALITY_OPTIONS = [
    "Curious & Asking Questions",
    "Professional & Helpful",
    "Motivational & Inspiring",
    "Academic & Research-Oriented",
    "Casual & Friendly",
  ];

  // ============================================================================
  // PERSONA MANAGEMENT HANDLERS
  // ============================================================================

  /**
   * Deletes a persona from the system
   * @param {string} id - The unique identifier of the persona to delete
   */
  const handleDeletePersona = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/personas/${id}`);
      setPersonas(personas.filter((p) => p._id !== id));
      showToast("Persona deleted successfully!", "success");
    } catch (error) {
      console.error("Error deleting persona:", error);
      showToast("Failed to delete persona", "error");
    }
  };

  /**
   * Toggles the active/paused status of a persona
   * @param {string} id - The unique identifier of the persona to toggle
   */
  const handleTogglePersonaStatus = async (id) => {
    try {
      await axios.post(`${API_BASE_URL}/toggleStatusPersona/${id}`);

      setPersonas(
        personas.map((p) =>
          p._id === id ? { ...p, active: !p.active } : p,
        ),
      );

      showToast("Persona status updated!", "success");
    } catch (error) {
      console.error("Error toggling persona status:", error);
      showToast("Failed to update persona status", "error");
    }
  };

  /**
   * Creates a new persona with the provided form data
   * Validates input, sends to backend, and updates local state
   * @param {Event} e - Form submit event
   */
  const handleCreatePersona = async (e) => {
    e.preventDefault();

    // Extract and trim form values
    const { userName, targetSubreddit, tonePersonality } =
      personaForm;
    const trimmedUserName = userName.trim();
    const trimmedSubreddit = targetSubreddit.trim();
    const trimmedTone = tonePersonality.trim();

    // Validate required fields
    if (!trimmedUserName || !trimmedSubreddit || !trimmedTone) {
      showToast("Please fill in all required fields", "error");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/createPersona`,
        {
          name: trimmedUserName,
          subreddit: trimmedSubreddit,
          tone: trimmedTone,
        },
      );

      // Handle successful creation
      if (response.data.success) {
        // Update all related data stores
        setData(
          response.data.client,
          setClient,
          setPersonas,
          setCalendars,
          setPosts,
          setSettings,
          setDailyCalendarLimit,
        );

        // Close modal and reset form
        setShowPersonaModal(false);
        resetPersonaForm();

        showToast("Persona created successfully!", "success");
      }
    } catch (error) {
      console.error("Error creating persona:", error);

      // Extract and display error message
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Failed to create persona. Please try again.";

      showToast(errorMessage, "error");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Resets the persona form to initial empty state
   */
  const resetPersonaForm = () => {
    setPersonaForm({
      userName: "",
      targetSubreddit: "",
      tonePersonality: "",
    });
  };

  /**
   * Closes the persona creation modal and resets form
   */
  const handleCloseModal = () => {
    setShowPersonaModal(false);
    resetPersonaForm();
  };

  // ============================================================================
  // RENDER HELPERS
  // ============================================================================

  /**
   * Returns appropriate status badge styling based on persona active state
   * @param {boolean} isActive - Whether the persona is active
   * @returns {string} Tailwind CSS classes
   */
  const getStatusBadgeClasses = (isActive) => {
    return isActive
      ? "bg-green-500/20 text-green-300 border border-green-500/30"
      : "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30";
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <>
      {/* Main Personas Container */}
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Personas</h2>

          {/* Create Persona Button */}
          <button
            onClick={() => setShowPersonaModal(true)}
            className="flex items-center gap-2 px-6 py-3 cursor-pointer bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-500 hover:to-blue-600 transition-all shadow-lg shadow-blue-500/30"
            aria-label="Create new persona">
            <Plus className="w-4 h-4" />
            Create Persona
          </button>
        </div>

        {/* Personas Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {personas.map((persona) => (
            <div
              key={persona._id || persona.createdAt}
              className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6 hover:border-slate-600/50 transition-all shadow-xl">
              {/* Persona Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-white">
                    {persona.name}
                  </h3>

                  {/* Status Badge */}
                  <span
                    className={`inline-block px-3 py-1 text-xs rounded-full mt-2 font-medium ${getStatusBadgeClasses(
                      persona.active,
                    )}`}>
                    {persona.active ? "Active" : "Paused"}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  {/* Toggle Active/Pause Button */}
                  <button
                    onClick={() =>
                      handleTogglePersonaStatus(persona._id)
                    }
                    className="p-2 bg-slate-700/50 backdrop-blur-sm text-slate-300 hover:text-blue-400 rounded-lg transition-all border border-slate-600/30 hover:border-blue-500/30 cursor-pointer"
                    aria-label={
                      persona.active
                        ? "Pause persona"
                        : "Activate persona"
                    }>
                    {persona.active ? (
                      <Pause className="w-4 h-4" />
                    ) : (
                      <Play className="w-4 h-4" />
                    )}
                  </button>

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDeletePersona(persona._id)}
                    className="p-2 bg-slate-700/50 backdrop-blur-sm text-slate-300 hover:text-red-400 rounded-lg transition-all border border-slate-600/30 hover:border-red-500/30 cursor-pointer"
                    aria-label="Delete persona">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Persona Details */}
              <div className="space-y-2 text-sm">
                <p className="text-slate-300">
                  <span className="font-medium text-white">
                    Subreddit:
                  </span>{" "}
                  {persona.subreddit}
                </p>
                <p className="text-slate-300">
                  <span className="font-medium text-white">
                    Tone/Personality:
                  </span>{" "}
                  {persona.tone}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {personas.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-400 text-lg">
              No personas created yet. Click "Create Persona" to get
              started.
            </p>
          </div>
        )}
      </div>

      {/* ========================================================================== */}
      {/* CREATE PERSONA MODAL */}
      {/* ========================================================================== */}

      {showPersonaModal && (
        <div className="fixed inset-0 backdrop-blur-xl bg-black/50 flex items-center justify-center z-50 p-4">
          <form
            onSubmit={handleCreatePersona}
            className="bg-slate-800/95 backdrop-blur-xl rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-700/50">
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">
                Create New Persona
              </h3>
              <button
                type="button"
                onClick={handleCloseModal}
                className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                aria-label="Close modal">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              {/* Username Input */}
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-slate-300 mb-2">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  required
                  value={personaForm.userName}
                  onChange={(e) =>
                    updatePersonaForm("userName", e.target.value)
                  }
                  placeholder="Enter username"
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Target Subreddit Select */}
              <div>
                <label
                  htmlFor="subreddit"
                  className="block text-sm font-medium text-slate-300 mb-2">
                  Target Subreddit
                </label>
                <select
                  id="subreddit"
                  value={personaForm.targetSubreddit}
                  required
                  onChange={(e) =>
                    updatePersonaForm(
                      "targetSubreddit",
                      e.target.value,
                    )
                  }
                  className="w-full px-4 py-3 bg-slate-700/90 border border-slate-600/50 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer">
                  <option value="">Select a subreddit</option>
                  {settings.targetSubreddits.map(
                    (subreddit, index) => (
                      <option key={index} value={subreddit}>
                        {subreddit}
                      </option>
                    ),
                  )}
                </select>
              </div>

              {/* Tone/Personality Select */}
              <div>
                <label
                  htmlFor="tone"
                  className="block text-sm font-medium text-slate-300 mb-2">
                  Tone/Personality
                </label>
                <select
                  id="tone"
                  value={personaForm.tonePersonality}
                  required
                  onChange={(e) =>
                    updatePersonaForm(
                      "tonePersonality",
                      e.target.value,
                    )
                  }
                  className="w-full px-4 py-3 bg-slate-700/90 border border-slate-600/50 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer">
                  <option value="">Select tone/personality</option>
                  {TONE_PERSONALITY_OPTIONS.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={handleCloseModal}
                className="flex-1 px-6 py-3 border border-slate-600 text-slate-300 rounded-xl hover:bg-slate-700/50 transition-all cursor-pointer">
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-500 hover:to-blue-600 transition-all shadow-lg shadow-blue-500/30 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <ClipLoader size={20} color="white" />
                  </div>
                ) : (
                  "Create"
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default Personas;
