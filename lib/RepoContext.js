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

const DEFAULT_REPOS = [
  "https://esign.yyyue.xyz/app.json",
  "https://raw.githubusercontent.com/vizunchik/AltStoreRus/master/apps.json",
  "https://qnblackcat.github.io/AltStore/apps.json",
  "https://wuxu1.github.io/wuxu-complete.json",
  "https://wuxu1.github.io/wuxu-complete-plus.json",
  "https://raw.githubusercontent.com/YTLitePlus/YTLitePlus-Altstore/main/apps.json",
  "https://raw.githubusercontent.com/TheNightmanCodeth/chromium-ios/refs/heads/master/altstore-source.json",
  "https://ipa.cypwn.xyz/cypwn.json",
  "https://driftywinds.github.io/repos/esign.json",
  "https://raw.githubusercontent.com/lo-cafe/winston-altstore/refs/heads/main/apps.json",
  "https://community-apps.sidestore.io/sidecommunity.json",
  "https://raw.githubusercontent.com/yodaluca23/SpotC-AltStore-Repo/main/AltStore%20Repo.json",
  "https://raw.githubusercontent.com/Neoncat-OG/TrollStore-IPAs/refs/heads/main/apps_altstore.json",
  "https://website.burrito.software/altstore/channels/burritosource.json",
  "https://ipa.cypwn.xyz/cypwn_ts.json",
  "https://flyinghead.github.io/flycast-builds/altstore.json",
  "https://raw.githubusercontent.com/khcrysalis/Feather/main/app-repo.json",
  "https://alts.lao.sb/source.json",
  "https://appmarket.tech/altstore.json",
  "https://theodyssey.dev/altstore/odysseysource.json",
  "https://provenance-emu.com/apps.json",
  "https://www.sachcharak.com/esign/repo/RAK.json",
  "https://apps.sidestore.io/",
  "https://repos.yattee.stream/alt/apps.json",
  "https://raw.githubusercontent.com/whoeevee/EeveeSpotify/refs/heads/swift/Repositories/repo.altstore.json",
  "https://altstore.oatmealdome.me/",
  "https://css.eyz.ink/appstore",
  "https://hyrepo-630100498932.us-east4.run.app/repo.json"
];

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
      loadAppsFromRepos(parsedRepos);
    } else {
      // Load default repositories
      loadDefaultRepos();
    }
  }, []);

  const loadDefaultRepos = async () => {
    setLoading(true);
    const loadedRepos = [];
    
    for (const url of DEFAULT_REPOS) {
      try {
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          const repo = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            name: data.name || extractRepoName(url),
            url: url,
            data: data,
            lastUpdated: new Date().toISOString(),
          };
          loadedRepos.push(repo);
        }
      } catch (error) {
        console.error(`Failed to load repo ${url}:`, error);
      }
    }
    
    setRepos(loadedRepos);
    localStorage.setItem("repos", JSON.stringify(loadedRepos));
    await loadAppsFromRepos(loadedRepos);
    setLoading(false);
  };

  const extractRepoName = (url) => {
    try {
      const urlObj = new URL(url);
      const hostname = urlObj.hostname;
      const pathname = urlObj.pathname;
      
      if (hostname.includes('github')) {
        const parts = pathname.split('/');
        return parts[1] || hostname;
      }
      
      return hostname.replace('www.', '');
    } catch {
      return 'Unknown Repo';
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

  const addRepo = async (url) => {
    try {
      setLoading(true);
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      // Check if repo already exists
      const existingRepo = repos.find(repo => repo.url === url);
      if (existingRepo) {
        toast.error("Repository already exists");
        return false;
      }
      
      const newRepo = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        name: data.name || extractRepoName(url),
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
        name: data.name || repo.name,
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

  const resetToDefaults = async () => {
    setRepos([]);
    setApps([]);
    localStorage.removeItem("repos");
    await loadDefaultRepos();
    toast.success("Reset to default repositories successfully");
  };

  const value = {
    repos,
    apps,
    loading,
    addRepo,
    removeRepo,
    refreshRepo,
    resetToDefaults,
  };

  return <RepoContext.Provider value={value}>{children}</RepoContext.Provider>;
}; 