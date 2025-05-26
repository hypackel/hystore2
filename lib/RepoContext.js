"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";

const RepoContext = createContext();

export const useRepo = () => {
  const context = useContext(RepoContext);
  if (!context) {
    throw new Error("useRepo must be used within a RepoProvider");
  }
  return context;
};

export const RepoProvider = ({ children }) => {
  const [repos, setRepos] = useState([]);
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load repos from localStorage on mount
  useEffect(() => {
    const savedRepos = localStorage.getItem("repos");
    if (savedRepos) {
      const parsedRepos = JSON.parse(savedRepos);
      setRepos(parsedRepos);
      // Load apps from all repos
      loadAppsFromRepos(parsedRepos);
    } else {
      // Load example JSON as default
      loadExampleRepo();
    }
  }, []);

  const loadExampleRepo = async () => {
    try {
      setLoading(true);
      const response = await fetch("/examplejson.json");
      const data = await response.json();
      const exampleRepo = {
        id: "example",
        name: data.name || "Example Repo",
        url: "/examplejson.json",
        data: data,
        lastUpdated: new Date().toISOString(),
      };
      setRepos([exampleRepo]);
      setApps(data.apps || []);
      localStorage.setItem("repos", JSON.stringify([exampleRepo]));
    } catch (error) {
      console.error("Error loading example repo:", error);
      toast.error("Failed to load example repository");
    } finally {
      setLoading(false);
    }
  };

  const loadAppsFromRepos = async (repoList) => {
    const allApps = [];
    for (const repo of repoList) {
      if (repo.data?.apps) {
        allApps.push(...repo.data.apps.map(app => ({ ...app, repoName: repo.name })));
      }
    }
    setApps(allApps);
  };

  const addRepo = async (url, name) => {
    try {
      setLoading(true);
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      const newRepo = {
        id: Date.now().toString(),
        name: name || data.name || "Unknown Repo",
        url: url,
        data: data,
        lastUpdated: new Date().toISOString(),
      };

      const updatedRepos = [...repos, newRepo];
      setRepos(updatedRepos);
      localStorage.setItem("repos", JSON.stringify(updatedRepos));
      
      await loadAppsFromRepos(updatedRepos);
      toast.success(`Repository "${newRepo.name}" added successfully`);
      return true;
    } catch (error) {
      console.error("Error adding repo:", error);
      toast.error(`Failed to add repository: ${error.message}`);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const removeRepo = async (repoId) => {
    const updatedRepos = repos.filter(repo => repo.id !== repoId);
    setRepos(updatedRepos);
    localStorage.setItem("repos", JSON.stringify(updatedRepos));
    await loadAppsFromRepos(updatedRepos);
    toast.success("Repository removed successfully");
  };

  const refreshRepo = async (repoId) => {
    try {
      setLoading(true);
      const repo = repos.find(r => r.id === repoId);
      if (!repo) return;

      const response = await fetch(repo.url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      const updatedRepo = {
        ...repo,
        data: data,
        lastUpdated: new Date().toISOString(),
      };

      const updatedRepos = repos.map(r => r.id === repoId ? updatedRepo : r);
      setRepos(updatedRepos);
      localStorage.setItem("repos", JSON.stringify(updatedRepos));
      
      await loadAppsFromRepos(updatedRepos);
      toast.success(`Repository "${repo.name}" refreshed successfully`);
    } catch (error) {
      console.error("Error refreshing repo:", error);
      toast.error(`Failed to refresh repository: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    repos,
    apps,
    loading,
    addRepo,
    removeRepo,
    refreshRepo,
  };

  return <RepoContext.Provider value={value}>{children}</RepoContext.Provider>;
}; 