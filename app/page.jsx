"use client";
import { useEffect } from "react";
import { Toaster } from "sonner";
import { useUIStore } from "../store/uiStore";
import { useDataStore } from "../store/dataStore";
import { fetchData } from "../utils/fetchData";
import CalendarGenerator from "../components/CalendarGenerator";
import Header from "../components/Header";
import Navbar from "../components/Navbar";
import Dashboard from "../components/Dashboard";
import Personas from "../components/Personas";
import Settings_ from "../components/Settings";

const API_BASE_URL = "http://localhost:5000/api";

export default function RedditMastermind() {
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
  const { activeTab, setIsRefreshing } = useUIStore();

  useEffect(() => {
    fetchData(
      setIsRefreshing,
      setClient,
      setPersonas,
      setCalendars,
      setPosts,
      setSettings,
      API_BASE_URL,
      setDailyCalendarLimit,
    );
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header API_BASE_URL={API_BASE_URL} />
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "dashboard" && <Dashboard />}

        {activeTab === "calendar" && (
          <CalendarGenerator API_BASE_URL={API_BASE_URL} />
        )}

        {activeTab === "personas" && (
          <Personas API_BASE_URL={API_BASE_URL} />
        )}

        {activeTab === "settings" && (
          <Settings_ API_BASE_URL={API_BASE_URL} />
        )}
      </main>
      <Toaster />
    </div>
  );
}
