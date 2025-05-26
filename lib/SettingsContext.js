"use client";

import { createContext, useContext, useState, useEffect } from "react";

const SettingsContext = createContext();

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};

const DEFAULT_SETTINGS = {
  viewMode: "comfy", // "comfy" or "compact"
  defaultAction: "download", // "download", "sidestore", "altstore"
  theme: "system", // "light", "dark", "system"
  showRepoNames: true,
  showVersions: true,
  showFileSizes: true,
  showDates: true,
  gridColumns: "auto", // "auto", "1", "2", "3", "4"
  enableAnimations: true,
  autoRefresh: false,
  refreshInterval: 30, // minutes
};

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [isOpen, setIsOpen] = useState(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem("settings");
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings({ ...DEFAULT_SETTINGS, ...parsedSettings });
      } catch (error) {
        console.error("Error loading settings:", error);
      }
    }
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("settings", JSON.stringify(settings));
  }, [settings]);

  const updateSetting = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
    localStorage.removeItem("settings");
  };

  const openSettings = () => setIsOpen(true);
  const closeSettings = () => setIsOpen(false);

  const generateAppUrl = (app, action = settings.defaultAction) => {
    const downloadUrl = app.downloadURL;
    
    switch (action) {
      case "sidestore":
        return `sidestore://source?url=${encodeURIComponent(downloadUrl)}`;
      case "altstore":
        return `altstore://install?url=${encodeURIComponent(downloadUrl)}`;
      default:
        return downloadUrl;
    }
  };

  const value = {
    settings,
    updateSetting,
    resetSettings,
    isOpen,
    openSettings,
    closeSettings,
    generateAppUrl,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}; 