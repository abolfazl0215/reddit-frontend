import axios from "axios";

// get client data
export const fetchData = async (
  setIsRefreshing,
  setClient,
  setPersonas,
  setCalendars,
  setPosts,
  setSettings,
  API_BASE_URL,
  setDailyCalendarLimit,
) => {
  setIsRefreshing(true);
  try {
    const response = await axios.get(`${API_BASE_URL}/getClientData`);
    const client = response.data?.client;
    setClient(client);
    setPersonas(client?.personas || []);
    setCalendars(client?.calendars || []);
    setPosts(client?.posts || []);
    setSettings({
      clientName: client?.name || "",
      clientInfo: client?.info || "",
      targetSubreddits: client?.targetSubreddits || [],
      chatGptQueries: client?.gptQueries || [],
    });
    setDailyCalendarLimit(client?.dailyCalendarLimit?.count || 0);
  } catch (error) {
    console.error("Error fetching data:", error);
  } finally {
    setIsRefreshing(false);
  }
};

// update client data
export const setData = (
  client,
  setClient,
  setPersonas,
  setCalendars,
  setPosts,
  setSettings,
  setDailyCalendarLimit,
) => {
  setClient(client);
  setPersonas(client?.personas || []);
  setCalendars(client?.calendars || []);
  setPosts(client?.posts || []);
  setSettings({
    clientName: client?.name || "",
    clientInfo: client?.info || "",
    targetSubreddits: client?.targetSubreddits || [],
    chatGptQueries: client?.gptQueries || [],
  });
  setDailyCalendarLimit(client?.dailyCalendarLimit?.count || 0);
};
