"use client";

import { useState } from "react";
import Link from "next/link";
import { useRepo } from "@/lib/RepoContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Download, Calendar, User } from "lucide-react";

export default function AppsPage() {
  const { apps, loading } = useRepo();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const filteredApps = apps.filter(app => {
    const matchesSearch = app.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.subtitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.developerName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || app.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(apps.map(app => app.category).filter(Boolean))];

  const formatFileSize = (bytes) => {
    if (!bytes) return "Unknown size";
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${Math.round(bytes / (1024 ** i) * 100) / 100} ${sizes[i]}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown date";
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading apps...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search apps..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-input bg-background rounded-md text-sm"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>
        
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {filteredApps.length} app{filteredApps.length !== 1 ? 's' : ''} found
          </p>
          {selectedCategory && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedCategory("")}
            >
              Clear filter
            </Button>
          )}
        </div>
      </div>

      {filteredApps.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No apps found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredApps.map((app, index) => (
            <Link key={`${app.bundleIdentifier}-${index}`} href={`/app/${encodeURIComponent(app.bundleIdentifier)}`}>
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-start space-x-3">
                    {app.iconURL && (
                      <img
                        src={app.iconURL}
                        alt={`${app.name} icon`}
                        className="w-12 h-12 rounded-lg flex-shrink-0"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg line-clamp-2">{app.name}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {app.subtitle || app.localizedDescription}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {app.category && (
                      <Badge variant="secondary">
                        {app.category.charAt(0).toUpperCase() + app.category.slice(1)}
                      </Badge>
                    )}
                    <Badge variant="outline">v{app.version}</Badge>
                  </div>
                  
                  <div className="space-y-2 text-sm text-muted-foreground">
                    {app.developerName && (
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4" />
                        <span className="truncate">{app.developerName}</span>
                      </div>
                    )}
                    {app.size && (
                      <div className="flex items-center space-x-2">
                        <Download className="h-4 w-4" />
                        <span>{formatFileSize(app.size)}</span>
                      </div>
                    )}
                    {app.versionDate && (
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(app.versionDate)}</span>
                      </div>
                    )}
                    {app.repoName && (
                      <div className="text-xs">
                        <Badge variant="outline" className="text-xs">
                          {app.repoName}
                        </Badge>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
