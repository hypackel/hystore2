"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useRepo } from "@/lib/RepoContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  Download, 
  Calendar, 
  User, 
  Package, 
  ExternalLink, 
  Shield,
  Smartphone,
  Globe,
  ChevronDown,
  ChevronUp
} from "lucide-react";

export default function AppDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { apps, loading } = useRepo();
  const [app, setApp] = useState(null);
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [showAllVersions, setShowAllVersions] = useState(false);
  const [showAllScreenshots, setShowAllScreenshots] = useState(false);

  useEffect(() => {
    if (apps.length > 0 && params.bundleId) {
      const decodedBundleId = decodeURIComponent(params.bundleId);
      const urlParams = new URLSearchParams(window.location.search);
      const repoName = urlParams.get('repo');
      
      let foundApp;
      if (repoName) {
        // Find app by both bundle ID and repo name for exact match
        foundApp = apps.find(app => 
          app.bundleIdentifier === decodedBundleId && 
          app.repoName === decodeURIComponent(repoName)
        );
      }
      
      // Fallback to just bundle ID if repo-specific search fails
      if (!foundApp) {
        foundApp = apps.find(app => app.bundleIdentifier === decodedBundleId);
      }
      
      setApp(foundApp);
      if (foundApp?.versions?.length > 0) {
        setSelectedVersion(foundApp.versions[0]);
      }
    }
  }, [apps, params.bundleId]);

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

  const handleDownload = (downloadUrl) => {
    if (downloadUrl) {
      window.open(downloadUrl, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading app details...</p>
        </div>
      </div>
    );
  }

  if (!app) {
    return (
      <div className="text-center py-12">
        <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">App Not Found</h2>
        <p className="text-muted-foreground mb-4">
          The requested app could not be found in any repository.
        </p>
        <Button onClick={() => router.push('/')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Apps
        </Button>
      </div>
    );
  }

  const displayedVersions = showAllVersions ? app.versions : app.versions?.slice(0, 3);
  const displayedScreenshots = showAllScreenshots ? app.screenshotURLs : app.screenshotURLs?.slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      {/* App Info Card */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-start space-y-4 md:space-y-0 md:space-x-6">
            {app.iconURL && (
              <img
                src={app.iconURL}
                alt={`${app.name} icon`}
                className="w-24 h-24 rounded-xl flex-shrink-0 mx-auto md:mx-0"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            )}
            <div className="flex-1 text-center md:text-left">
              <CardTitle className="text-3xl mb-2">{app.name}</CardTitle>
              <CardDescription className="text-lg mb-4">
                {app.subtitle}
              </CardDescription>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                {app.category && (
                  <Badge variant="secondary">
                    {app.category.charAt(0).toUpperCase() + app.category.slice(1)}
                  </Badge>
                )}
                <Badge variant="outline">v{app.version}</Badge>
                {app.beta && <Badge variant="destructive">Beta</Badge>}
                {app.repoName && (
                  <Badge variant="outline">{app.repoName}</Badge>
                )}
              </div>
            </div>
            <div className="flex flex-col space-y-2">
              <Button 
                onClick={() => handleDownload(app.downloadURL)}
                className="w-full md:w-auto"
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              {app.size && (
                <p className="text-sm text-muted-foreground text-center">
                  {formatFileSize(app.size)}
                </p>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* App Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          {app.localizedDescription && (
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none">
                  <p className="whitespace-pre-wrap">{app.localizedDescription}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Screenshots */}
          {app.screenshotURLs && app.screenshotURLs.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Screenshots</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {displayedScreenshots.map((url, index) => (
                    <img
                      key={`screenshot-${url}-${index}`}
                      src={url}
                      alt={`Screenshot ${index + 1}`}
                      className="w-full h-auto rounded-lg border"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  ))}
                </div>
                {app.screenshotURLs.length > 4 && (
                  <Button
                    variant="outline"
                    onClick={() => setShowAllScreenshots(!showAllScreenshots)}
                    className="mt-4"
                  >
                    {showAllScreenshots ? (
                      <>
                        <ChevronUp className="h-4 w-4 mr-2" />
                        Show Less
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-4 w-4 mr-2" />
                        Show All ({app.screenshotURLs.length})
                      </>
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>
          )}

          {/* Version History */}
          {app.versions && app.versions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Version History</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {displayedVersions.map((version, index) => (
                  <div key={index} className="border-l-2 border-muted pl-4 pb-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">v{version.version}</Badge>
                        <span className="text-sm text-muted-foreground">
                          {formatDate(version.date)}
                        </span>
                      </div>
                      {version.downloadURL && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownload(version.downloadURL)}
                        >
                          <Download className="h-3 w-3 mr-1" />
                          Download
                        </Button>
                      )}
                    </div>
                    {version.localizedDescription && (
                      <p className="text-sm whitespace-pre-wrap">
                        {version.localizedDescription}
                      </p>
                    )}
                    {version.size && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Size: {formatFileSize(version.size)}
                      </p>
                    )}
                  </div>
                ))}
                {app.versions.length > 3 && (
                  <Button
                    variant="outline"
                    onClick={() => setShowAllVersions(!showAllVersions)}
                  >
                    {showAllVersions ? (
                      <>
                        <ChevronUp className="h-4 w-4 mr-2" />
                        Show Less
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-4 w-4 mr-2" />
                        Show All Versions ({app.versions.length})
                      </>
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* App Info */}
          <Card>
            <CardHeader>
              <CardTitle>Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {app.developerName && (
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{app.developerName}</span>
                </div>
              )}
              {app.bundleIdentifier && (
                <div className="flex items-center space-x-2">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-mono text-xs break-all">
                    {app.bundleIdentifier}
                  </span>
                </div>
              )}
              {app.versionDate && (
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{formatDate(app.versionDate)}</span>
                </div>
              )}
              {app.size && (
                <div className="flex items-center space-x-2">
                  <Download className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{formatFileSize(app.size)}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Permissions */}
          {app.appPermissions && (
            <Card>
              <CardHeader>
                <CardTitle>Permissions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {app.appPermissions.entitlements && (
                  <div>
                    <h4 className="text-sm font-medium mb-2 flex items-center">
                      <Shield className="h-4 w-4 mr-2" />
                      Entitlements ({app.appPermissions.entitlements.length})
                    </h4>
                    <div className="space-y-1">
                      {app.appPermissions.entitlements.slice(0, 5).map((entitlement, index) => (
                        <p key={index} className="text-xs font-mono bg-muted p-2 rounded">
                          {entitlement}
                        </p>
                      ))}
                      {app.appPermissions.entitlements.length > 5 && (
                        <p className="text-xs text-muted-foreground">
                          +{app.appPermissions.entitlements.length - 5} more...
                        </p>
                      )}
                    </div>
                  </div>
                )}
                {app.appPermissions.privacy && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Privacy Permissions</h4>
                    <div className="space-y-1">
                      {Object.entries(app.appPermissions.privacy).slice(0, 3).map(([key, value]) => (
                        <div key={key} className="text-xs">
                          <p className="font-medium">{key.replace('NS', '').replace('UsageDescription', '')}</p>
                          <p className="text-muted-foreground">{value}</p>
                        </div>
                      ))}
                      {Object.keys(app.appPermissions.privacy).length > 3 && (
                        <p className="text-xs text-muted-foreground">
                          +{Object.keys(app.appPermissions.privacy).length - 3} more...
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
} 