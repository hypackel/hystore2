"use client";

import { useSettings } from "@/lib/SettingsContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Settings, 
  Eye, 
  Download, 
  Smartphone, 
  Palette, 
  Grid, 
  Clock,
  RotateCcw,
  ExternalLink
} from "lucide-react";

export default function SettingsModal() {
  const { 
    settings, 
    updateSetting, 
    resetSettings, 
    isOpen, 
    closeSettings 
  } = useSettings();

  const handleReset = () => {
    resetSettings();
  };

  return (
    <Dialog open={isOpen} onOpenChange={closeSettings}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Settings
          </DialogTitle>
          <DialogDescription>
            Customize your app browsing experience
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* View Settings */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              <h3 className="text-lg font-semibold">View Settings</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="viewMode">Card Size</Label>
                <Select value={settings.viewMode} onValueChange={(value) => updateSetting("viewMode", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="comfy">Comfy</SelectItem>
                    <SelectItem value="compact">Compact</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="gridColumns">Grid Columns</Label>
                <Select value={settings.gridColumns} onValueChange={(value) => updateSetting("gridColumns", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auto">Auto</SelectItem>
                    <SelectItem value="1">1 Column</SelectItem>
                    <SelectItem value="2">2 Columns</SelectItem>
                    <SelectItem value="3">3 Columns</SelectItem>
                    <SelectItem value="4">4 Columns</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="showRepoNames">Show Repo Names</Label>
                <Switch
                  id="showRepoNames"
                  checked={settings.showRepoNames}
                  onCheckedChange={(checked) => updateSetting("showRepoNames", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="showVersions">Show Versions</Label>
                <Switch
                  id="showVersions"
                  checked={settings.showVersions}
                  onCheckedChange={(checked) => updateSetting("showVersions", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="showFileSizes">Show File Sizes</Label>
                <Switch
                  id="showFileSizes"
                  checked={settings.showFileSizes}
                  onCheckedChange={(checked) => updateSetting("showFileSizes", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="showDates">Show Dates</Label>
                <Switch
                  id="showDates"
                  checked={settings.showDates}
                  onCheckedChange={(checked) => updateSetting("showDates", checked)}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* App Actions */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              <h3 className="text-lg font-semibold">App Actions</h3>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="defaultAction">Default Action</Label>
              <Select value={settings.defaultAction} onValueChange={(value) => updateSetting("defaultAction", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="download">
                    <div className="flex items-center gap-2">
                      <Download className="h-4 w-4" />
                      Direct Download
                    </div>
                  </SelectItem>
                  <SelectItem value="sidestore">
                    <div className="flex items-center gap-2">
                      <Smartphone className="h-4 w-4" />
                      Open in SideStore
                    </div>
                  </SelectItem>
                  <SelectItem value="altstore">
                    <div className="flex items-center gap-2">
                      <ExternalLink className="h-4 w-4" />
                      Open in AltStore
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">
                {settings.defaultAction === "sidestore" && "Uses sidestore:// URL scheme"}
                {settings.defaultAction === "altstore" && "Uses altstore:// URL scheme"}
                {settings.defaultAction === "download" && "Downloads the IPA file directly"}
              </p>
            </div>
          </div>

          <Separator />

          {/* Appearance */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              <h3 className="text-lg font-semibold">Appearance</h3>
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="enableAnimations">Enable Animations</Label>
              <Switch
                id="enableAnimations"
                checked={settings.enableAnimations}
                onCheckedChange={(checked) => updateSetting("enableAnimations", checked)}
              />
            </div>
          </div>

          <Separator />

          {/* Auto Refresh */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <h3 className="text-lg font-semibold">Auto Refresh</h3>
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="autoRefresh">Auto Refresh Repos</Label>
              <Switch
                id="autoRefresh"
                checked={settings.autoRefresh}
                onCheckedChange={(checked) => updateSetting("autoRefresh", checked)}
              />
            </div>

            {settings.autoRefresh && (
              <div className="space-y-2">
                <Label htmlFor="refreshInterval">Refresh Interval (minutes)</Label>
                <Input
                  id="refreshInterval"
                  type="number"
                  min="5"
                  max="120"
                  value={settings.refreshInterval}
                  onChange={(e) => updateSetting("refreshInterval", Number.parseInt(e.target.value) || 30)}
                  className="w-32"
                />
              </div>
            )}
          </div>

          <Separator />

          {/* URL Schemes Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">URL Schemes</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Badge variant="outline">SideStore</Badge>
                <code className="text-xs">sidestore://source?url=...</code>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">AltStore</Badge>
                <code className="text-xs">altstore://install?url=...</code>
              </div>
              <p className="text-xs">
                These URL schemes will open the respective app store apps on your device if installed.
              </p>
            </div>
          </div>

          {/* Reset Button */}
          <div className="flex justify-between items-center pt-4">
            <Button
              variant="outline"
              onClick={handleReset}
              className="flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Reset to Defaults
            </Button>
            
            <Button onClick={closeSettings}>
              Done
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 