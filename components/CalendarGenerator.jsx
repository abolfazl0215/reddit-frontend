import { useFormStore } from "../store/formStore";
import { useUIStore } from "../store/uiStore";
import { useDataStore } from "../store/dataStore";
import {
  Calendar,
  MessageSquare,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import showToast from "../utils/showToast";
import { fetchData } from "../utils/fetchData";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";

/**
 * CalendarGenerator Component
 * Manages weekly content calendars with scheduled posts
 * Allows generation, viewing, and deletion of calendar weeks
 * @param {string} API_BASE_URL - Base URL for API requests
 */
const CalendarGenerator = ({ API_BASE_URL }) => {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================

  // Data states - Calendars, posts, and client data
  const {
    calendars,
    setCalendars,
    posts,
    dailyCalendarLimit,
    setDailyCalendarLimit,
    setPosts,
    setPersonas,
    setClient,
    setSettings,
  } = useDataStore();

  // Form states - Generate form and selected post
  const {
    setSelectedPost,
    selectedPost,
    generateForm,
    updateGenerateForm,
  } = useFormStore();

  // UI states - Modal visibility and loading indicators
  const {
    setShowGenerateModal,
    showGenerateModal,
    showPostDetailModal,
    setShowPostDetailModal,
    isLoading,
    setIsLoading,
    setIsRefreshing,
  } = useUIStore();

  // ============================================================================
  // CONSTANTS
  // ============================================================================

  const DAILY_GENERATION_LIMIT = 5;

  // ============================================================================
  // HELPER FUNCTIONS
  // ============================================================================

  /**
   * Retrieves a post by its code/ID
   * @param {number} id - The unique code of the post
   * @returns {Object|undefined} The post object or undefined if not found
   */
  const getPost = (id) => {
    return posts.find((p) => p.code === id);
  };

  /**
   * Formats a date range string
   * @param {Date} startDate - Start date
   * @param {Date} endDate - End date
   * @returns {string} Formatted date range
   */
  const formatDateRange = (startDate, endDate) => {
    const options = {
      month: "short",
      day: "numeric",
      year: "numeric",
    };

    const start = new Date(startDate).toLocaleDateString(
      "en-US",
      options,
    );
    const end = new Date(endDate).toLocaleDateString(
      "en-US",
      options,
    );

    return `${start} - ${end}`;
  };

  /**
   * Checks if a date is in the past
   * @param {Date} date - Date to check
   * @returns {boolean} True if date is in the past
   */
  const isPastDate = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(date) < today;
  };

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  /**
   * Generates a new calendar week
   * Validates daily limit before making API request
   */
  const handleGenerateCalendar = async () => {
    // Check daily generation limit
    if (dailyCalendarLimit >= DAILY_GENERATION_LIMIT) {
      showToast(
        `You can only generate ${DAILY_GENERATION_LIMIT} calendars per day`,
        "error",
      );
      return;
    }

    setIsLoading(true);

    try {
      await axios.post(
        `${API_BASE_URL}/calendar/generate`,
        generateForm,
      );

      // Refresh all data after successful generation
      await fetchData(
        setIsRefreshing,
        setClient,
        setPersonas,
        setCalendars,
        setPosts,
        setSettings,
        API_BASE_URL,
        setDailyCalendarLimit,
      );

      // Close modal and reset form
      setShowGenerateModal(false);
      resetGenerateForm();

      showToast(
        "Content calendar generated successfully!",
        "success",
      );
    } catch (error) {
      console.error("Error generating calendar:", error);

      const errorMessage =
        error.response?.data?.error ||
        "Error generating calendar. Please try again.";

      showToast(errorMessage, "error");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Deletes a calendar week
   * @param {number} calendarIndex - Index of the calendar to delete
   */
  const handleDeleteCalendar = async (calendarIndex) => {
    try {
      const newCalendars = calendars.filter(
        (_, i) => i !== calendarIndex,
      );
      setCalendars(newCalendars);
      showToast("Week only deleted from UI");
    } catch (error) {
      console.error("Error deleting calendar:", error);
      showToast("Failed to delete week", "error");
    }
  };

  /**
   * Opens post detail modal
   * @param {Object} post - Post object to display
   */
  const handlePostClick = (post) => {
    if (!post) return;

    setSelectedPost(post);
    setShowPostDetailModal(true);
  };

  /**
   * Resets the generate form to default values
   */
  const resetGenerateForm = () => {
    updateGenerateForm("numberOfDays", "7days");
    updateGenerateForm("postsPerDay", "1post");
  };

  // ============================================================================
  // RENDER HELPERS
  // ============================================================================

  /**
   * Renders a single post card
   * @param {number} postId - Post code/ID
   * @param {boolean} isPast - Whether the post date is in the past
   */
  const renderPostCard = (postId, isPast) => {
    const post = getPost(postId);
    if (!post) return null;

    return (
      <div
        onClick={() => !isPast && handlePostClick(post)}
        className={`bg-gradient-to-br from-blue-600/20 to-purple-600/20 backdrop-blur-sm border border-blue-500/30 rounded-lg p-3 text-xs ${
          !isPast
            ? "cursor-pointer hover:border-blue-400/50 hover:from-blue-600/30 hover:to-purple-600/30"
            : "opacity-70"
        } transition-all`}
        role="button"
        tabIndex={!isPast ? 0 : -1}
        aria-label={`View post: ${post.title}`}>
        {/* Post Title */}
        <p
          className="font-medium text-white truncate mb-2"
          title={post.title}>
          {post.title}
        </p>

        {/* Persona Name */}
        <p className="text-blue-300 text-xs mb-1">{post.persona}</p>

        {/* Subreddit */}
        <p className="text-slate-400 text-xs mb-2">
          {post.subreddit}
        </p>

        {/* Footer: Time and Comments */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-600/30">
          <span className="text-slate-400 text-xs">
            {new Date(post.publishDate).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
          <span className="flex items-center gap-1 text-slate-400">
            <MessageSquare className="w-3 h-3" />
            {post.comments?.length || 0}
          </span>
        </div>
      </div>
    );
  };

  /**
   * Renders a single day card in the calendar
   * @param {Object} day - Day object containing date and posts
   * @param {number} dayIndex - Index of the day
   */
  const renderDayCard = (day, dayIndex) => {
    const dayName = new Date(day.date).toLocaleDateString("en-US", {
      weekday: "short",
    });
    const isPast = isPastDate(day.date);
    const hasNoPosts = !day.posts || day.posts.length === 0;

    return (
      <div
        key={dayIndex}
        className={`bg-slate-800/50 backdrop-blur-xl rounded-xl p-4 border min-h-[200px] transition-all ${
          isPast
            ? "border-slate-700/30 opacity-50"
            : "border-slate-700/50 hover:border-slate-600/50"
        }`}
        role="article"
        aria-label={`${dayName}, ${new Date(
          day.date,
        ).toLocaleDateString()}`}>
        {/* Day Header */}
        <div className="font-semibold text-sm text-white mb-1">
          {dayName}
        </div>
        <div className="text-xs text-slate-400 mb-3">
          {new Date(day.date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })}
        </div>

        {/* Posts List */}
        <div className="space-y-2">
          {hasNoPosts ? (
            <div className="text-slate-500 text-xs text-center py-4">
              No posts scheduled
            </div>
          ) : (
            day.posts.map((postId, postIndex) => (
              <div key={postIndex}>
                {renderPostCard(postId, isPast)}
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  /**
   * Renders a week calendar section
   * @param {Object} calendar - Calendar object containing week data
   * @param {number} calendarIndex - Index of the calendar
   */
  const renderWeekCalendar = (calendar, calendarIndex) => (
    <div key={calendarIndex} className="space-y-4">
      {/* Week Header */}
      <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl px-6 py-4 border border-slate-700/50">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-400">
              Week {calendarIndex + 1}
            </p>
            <p className="text-lg font-semibold text-white mt-1">
              {formatDateRange(calendar.startDate, calendar.endDate)}
            </p>
          </div>

          {/* Delete Week Button */}
          <button
            onClick={() => handleDeleteCalendar(calendarIndex)}
            className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-all cursor-pointer"
            aria-label={`Delete week ${calendarIndex + 1}`}>
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Days Grid */}
      <div
        className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-4"
        role="list"
        aria-label={`Week ${calendarIndex + 1} schedule`}>
        {calendar.days.map(renderDayCard)}
      </div>
    </div>
  );

  /**
   * Renders the empty state when no calendars exist
   */
  const renderEmptyState = () => (
    <div className="bg-slate-800/30 backdrop-blur-xl rounded-xl p-12 border border-slate-700/50 text-center">
      <Calendar className="w-16 h-16 text-slate-600 mx-auto mb-4" />
      <h3 className="text-xl font-bold text-white mb-2">
        No Calendar Generated
      </h3>
      <p className="text-slate-400 mb-6">
        Create your first content calendar to start scheduling posts
      </p>
      <button
        onClick={() => setShowGenerateModal(true)}
        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-500 hover:to-purple-500 transition-all shadow-lg cursor-pointer">
        Generate Calendar{" "}
        <span className="opacity-75">
          ({dailyCalendarLimit} / {DAILY_GENERATION_LIMIT})
        </span>
      </button>
    </div>
  );

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        {/* Total Weeks Counter */}
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-xl px-6 py-3 border border-slate-700/50">
          <p className="text-sm text-slate-400">Total Weeks</p>
          <p className="text-lg font-semibold text-white mt-1">
            {calendars.length} Week{calendars.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Generate Calendar Button */}
        <div className="flex gap-3">
          <button
            onClick={() => setShowGenerateModal(true)}
            disabled={dailyCalendarLimit >= DAILY_GENERATION_LIMIT}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-500 hover:to-blue-600 transition-all shadow-lg shadow-blue-500/30 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label={
              calendars.length === 0
                ? "Generate first schedule"
                : "Add new week"
            }>
            <Plus className="w-4 h-4" />
            {calendars.length === 0
              ? "Generate Schedule"
              : "Add Week"}
            <span className="opacity-75">
              ({dailyCalendarLimit} / {DAILY_GENERATION_LIMIT})
            </span>
          </button>
        </div>
      </div>

      {/* Calendar Weeks Section */}
      {calendars.length > 0 ? (
        <>
          <div
            className="space-y-8"
            role="region"
            aria-label="Calendar weeks">
            {calendars.map(renderWeekCalendar)}
          </div>

          {/* Generate Next Week Button */}
          <div className="flex justify-center pt-4">
            <button
              onClick={() => setShowGenerateModal(true)}
              disabled={dailyCalendarLimit >= DAILY_GENERATION_LIMIT}
              className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-500 hover:to-green-600 transition-all shadow-lg shadow-green-500/30 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
              <Plus className="w-4 h-4" />
              Generate Next Week{" "}
              <span className="opacity-75">
                ({dailyCalendarLimit} / {DAILY_GENERATION_LIMIT})
              </span>
            </button>
          </div>
        </>
      ) : (
        renderEmptyState()
      )}

      {/* ========================================================================== */}
      {/* POST DETAIL MODAL */}
      {/* ========================================================================== */}

      {showPostDetailModal && selectedPost && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-xl bg-black/50"
          onClick={() => setShowPostDetailModal(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="post-detail-title">
          <div
            className="bg-slate-800/95 border border-white/20 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl shadow-black/50"
            onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10 sticky top-0 bg-slate-800/95 backdrop-blur-sm z-10">
              <h2
                id="post-detail-title"
                className="text-2xl font-bold text-white">
                Post Details
              </h2>
              <button
                onClick={() => setShowPostDetailModal(false)}
                className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                aria-label="Close modal">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4">
              {/* Post Title */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Title
                </label>
                <p className="text-white font-semibold text-lg">
                  {selectedPost.title}
                </p>
              </div>

              {/* Post Body */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Body
                </label>
                <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                  <p className="text-white whitespace-pre-wrap leading-relaxed">
                    {selectedPost.body}
                  </p>
                </div>
              </div>

              {/* Persona & Subreddit Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Persona
                  </label>
                  <p className="text-white font-medium">
                    {selectedPost.persona}
                  </p>
                </div>
                <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Subreddit
                  </label>
                  <p className="text-white font-medium">
                    {selectedPost.subreddit}
                  </p>
                </div>
              </div>

              {/* Publish Date & Status Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Publish Date
                  </label>
                  <p className="text-white">
                    {new Date(
                      selectedPost.publishDate,
                    ).toLocaleString("en-US", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                </div>
                <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Status
                  </label>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      selectedPost.status === "posted"
                        ? "bg-green-500/20 text-green-400 border border-green-500/30"
                        : selectedPost.status === "scheduled"
                        ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                        : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                    }`}>
                    {selectedPost.status.charAt(0).toUpperCase() +
                      selectedPost.status.slice(1)}
                  </span>
                </div>
              </div>

              {/* Upvotes & Comments Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-sm rounded-lg p-4 border border-green-500/20">
                  <label className="block text-sm font-medium text-green-300 mb-2">
                    Upvotes
                  </label>
                  <p className="text-green-400 font-bold text-2xl">
                    {(selectedPost.upvotes || 0).toLocaleString()}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-sm rounded-lg p-4 border border-blue-500/20">
                  <label className="block text-sm font-medium text-blue-300 mb-2">
                    Comments
                  </label>
                  <p className="text-blue-400 font-bold text-2xl">
                    {(
                      selectedPost.comments?.length || 0
                    ).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Comments Section */}
              {selectedPost.comments &&
                selectedPost.comments.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-3">
                      Comments ({selectedPost.comments.length})
                    </label>
                    <div className="space-y-3 max-h-64 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800">
                      {selectedPost.comments.map((comment, idx) => (
                        <div
                          key={idx}
                          className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10 hover:border-white/20 transition-all">
                          <div className="flex items-center justify-between mb-2 gap-2">
                            <span className="text-blue-400 text-sm font-medium truncate">
                              {comment.persona}
                            </span>
                            <span className="text-slate-400 text-xs flex-shrink-0">
                              {new Date(
                                comment.date,
                              ).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                          <p className="text-slate-200 text-sm leading-relaxed">
                            {comment.body}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* Empty Comments State */}
              {(!selectedPost.comments ||
                selectedPost.comments.length === 0) && (
                <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10 text-center">
                  <MessageSquare className="w-12 h-12 text-slate-500 mx-auto mb-2" />
                  <p className="text-slate-400 text-sm">
                    No comments yet
                  </p>
                </div>
              )}

              {/* Modal Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-white/10">
                <button
                  onClick={() => setShowPostDetailModal(false)}
                  className="flex-1 px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all font-medium backdrop-blur-sm border border-white/10 cursor-pointer">
                  Close
                </button>
                <button
                  onClick={() => {
                    showToast(
                      "Post regeneration feature coming soon!",
                      "info",
                    );
                  }}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-lg transition-all font-medium shadow-lg cursor-pointer">
                  Regenerate Content
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================== */}
      {/* GENERATE CALENDAR MODAL */}
      {/* ========================================================================== */}

      {showGenerateModal && (
        <div
          className="fixed inset-0 backdrop-blur-xl bg-black/50 flex items-center justify-center z-50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="generate-calendar-title">
          <div className="bg-slate-800/95 backdrop-blur-xl rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-700/50">
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-6">
              <h3
                id="generate-calendar-title"
                className="text-xl font-bold text-white">
                Generate Content Calendar
              </h3>
              <button
                onClick={() =>
                  !isLoading && setShowGenerateModal(false)
                }
                disabled={isLoading}
                className="text-slate-400 hover:text-white transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Close modal">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              {/* Number of Days Select */}
              <div>
                <label
                  htmlFor="number-of-days"
                  className="block text-sm font-medium text-slate-300 mb-2">
                  Number of Days
                </label>
                <select
                  id="number-of-days"
                  value={generateForm.numberOfDays}
                  onChange={(e) =>
                    updateGenerateForm("numberOfDays", e.target.value)
                  }
                  disabled={isLoading}
                  className="w-full px-4 py-3 bg-slate-700/90 cursor-pointer border border-slate-600/50 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                  <option value="7days">7 days (Full Week)</option>
                  {/* <option value="5days">5 days (Weekdays)</option> */}
                </select>
              </div>

              {/* Posts Per Day Select */}
              <div>
                <label
                  htmlFor="posts-per-day"
                  className="block text-sm font-medium text-slate-300 mb-2">
                  Posts Per Day
                </label>
                <select
                  id="posts-per-day"
                  value={generateForm.postsPerDay}
                  onChange={(e) =>
                    updateGenerateForm("postsPerDay", e.target.value)
                  }
                  disabled={isLoading}
                  className="w-full px-4 py-3 bg-slate-700/90 cursor-pointer border border-slate-600/50 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                  <option value="1post">
                    1 post/day (Conservative)
                  </option>
                  <option value="2post">
                    2 posts/day (Moderate)
                  </option>
                  {/* <option value="3post">3 posts/day (Active)</option>
            <option value="4post">4 posts/day (Aggressive)</option> */}
                </select>
              </div>
            </div>

            {/* Daily Limit Warning */}
            <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <p className="text-sm text-yellow-200/90 flex items-center gap-2">
                <span className="text-yellow-400">⚠️</span>
                Daily limit:{" "}
                <strong>
                  {dailyCalendarLimit} / {DAILY_GENERATION_LIMIT}
                </strong>{" "}
                calendars generated today
              </p>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <button
                type="button"
                onClick={() =>
                  !isLoading && setShowGenerateModal(false)
                }
                disabled={isLoading}
                className="flex-1 px-6 py-3 border border-slate-600 text-slate-300 rounded-xl hover:bg-slate-700/50 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                Cancel
              </button>
              <button
                type="button"
                onClick={handleGenerateCalendar}
                disabled={
                  isLoading ||
                  dailyCalendarLimit >= DAILY_GENERATION_LIMIT
                }
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-500 hover:to-blue-600 transition-all shadow-lg shadow-blue-500/30 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <ClipLoader color="white" size={20} />
                    <span>Generating...</span>
                  </div>
                ) : (
                  "Generate Calendar"
                )}
              </button>
            </div>

            {/* Loading Message */}
            {isLoading && (
              <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                <p className="text-sm text-green-200 flex items-center gap-2">
                  <span className="inline-block w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  Please be patient; this may take a few minutes.
                  Quality &gt; Speed.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarGenerator;
