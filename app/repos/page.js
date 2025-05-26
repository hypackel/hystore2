"use client";

import { useState } from "react";
import { useRepo } from "@/lib/RepoContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Trash2, RefreshCw, Plus, ExternalLink, Calendar, Package } from "lucide-react";
import { toast } from "sonner";

export default function ReposPage() {
  const { repos, loading, addRepo, removeRepo, refreshRepo } = useRepo();
  const [newRepoUrl, setNewRepoUrl] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleAddRepo = async (e) => {
    e.preventDefault();
    if (!newRepoUrl.trim()) {
      toast.error("Please enter a repository URL");
      return;
    }

    setIsAdding(true);
    const success = await addRepo(newRepoUrl.trim());
    if (success) {
      setNewRepoUrl("");
    }
    setIsAdding(false);
  };

  const handleRemoveRepo = async (repoId) => {
    if (window.confirm("Are you sure you want to remove this repository?")) {
      await removeRepo(repoId);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown";
    return new Date(dateString).toLocaleString();
  };

  const getAppCount = (repo) => {
    return repo.data?.apps?.length || 0;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Repositories</h1>
          <Badge variant="secondary">
            {repos.length} repo{repos.length !== 1 ? 's' : ''}
          </Badge>
        </div>
        <p className="text-muted-foreground">
          Manage your app repositories. Add new sources or remove existing ones.
        </p>
      </div>

      {/* Add Repository Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Plus className="h-5 w-5" />
            <span>Add Repository</span>
          </CardTitle>
          <CardDescription>
            Add a new repository by providing its JSON URL. The repository name will be automatically detected.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddRepo} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="repo-url" className="text-sm font-medium">
                Repository URL
              </label>
              <Input
                id="repo-url"
                type="url"
                placeholder="https://example.com/repo.json"
                value={newRepoUrl}
                onChange={(e) => setNewRepoUrl(e.target.value)}
                required
              />
            </div>
            <Button type="submit" disabled={isAdding || loading}>
              {isAdding ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Repository
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Repository List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Your Repositories</h2>
        
        {repos.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Package className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground text-center">
                {loading ? "Loading default repositories..." : "No repositories found. Default repositories will be loaded automatically."}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {repos.map((repo) => (
              <Card key={repo.id} className="relative">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="flex items-center space-x-2">
                        <span>{repo.name}</span>
                        {repo.data?.tintColor && (
                          <div
                            className="w-4 h-4 rounded-full border"
                            style={{ backgroundColor: `#${repo.data.tintColor}` }}
                          />
                        )}
                      </CardTitle>
                      <CardDescription className="break-all">
                        {repo.url}
                      </CardDescription>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => refreshRepo(repo.id)}
                        disabled={loading}
                      >
                        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveRepo(repo.id)}
                        disabled={loading}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {repo.data?.description && (
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {repo.data.description}
                    </p>
                  )}
                  
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">
                      <Package className="h-3 w-3 mr-1" />
                      {getAppCount(repo)} apps
                    </Badge>
                    {repo.data?.website && (
                      <Badge variant="outline">
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Website
                      </Badge>
                    )}
                  </div>
                  
                  <div className="text-xs text-muted-foreground flex items-center space-x-2">
                    <Calendar className="h-3 w-3" />
                    <span>Last updated: {formatDate(repo.lastUpdated)}</span>
                  </div>
                  
                  {repo.data?.website && (
                    <div className="pt-2">
                      <a
                        href={repo.data.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline flex items-center space-x-1"
                      >
                        <ExternalLink className="h-3 w-3" />
                        <span>Visit website</span>
                      </a>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 