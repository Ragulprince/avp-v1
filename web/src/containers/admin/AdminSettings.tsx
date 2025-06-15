
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, User, Bell, Shield, Database, Mail } from 'lucide-react';

const AdminSettings = () => {
  const [generalSettings, setGeneralSettings] = useState({
    instituteName: 'Academy Learning Platform',
    instituteEmail: 'admin@academy.com',
    institutePhone: '+91 9876543210',
    address: 'Education City, Academy Campus',
    timezone: 'Asia/Kolkata',
    language: 'English'
  });

  const [systemSettings, setSystemSettings] = useState({
    allowRegistration: true,
    emailVerification: true,
    twoFactorAuth: false,
    sessionTimeout: '60',
    maxLoginAttempts: '5',
    passwordMinLength: '8'
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    reminderEmails: true,
    reportEmails: true
  });

  return (
    <div className="space-y-6 p-4 lg:p-6">
      <div className="flex items-center space-x-3">
        <Settings className="w-8 h-8 text-blue-600" />
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">System Settings</h1>
          <p className="text-gray-600">Manage academy configuration and preferences</p>
        </div>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
          <TabsTrigger value="general" className="text-xs lg:text-sm">General</TabsTrigger>
          <TabsTrigger value="security" className="text-xs lg:text-sm">Security</TabsTrigger>
          <TabsTrigger value="notifications" className="text-xs lg:text-sm">Notifications</TabsTrigger>
          <TabsTrigger value="backup" className="text-xs lg:text-sm">Backup</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="w-5 h-5 mr-2" />
                Institute Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="instituteName">Institute Name</Label>
                  <Input
                    id="instituteName"
                    value={generalSettings.instituteName}
                    onChange={(e) => setGeneralSettings({...generalSettings, instituteName: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="instituteEmail">Institute Email</Label>
                  <Input
                    id="instituteEmail"
                    type="email"
                    value={generalSettings.instituteEmail}
                    onChange={(e) => setGeneralSettings({...generalSettings, instituteEmail: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="institutePhone">Phone Number</Label>
                  <Input
                    id="institutePhone"
                    value={generalSettings.institutePhone}
                    onChange={(e) => setGeneralSettings({...generalSettings, institutePhone: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select value={generalSettings.timezone} onValueChange={(value) => setGeneralSettings({...generalSettings, timezone: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asia/Kolkata">Asia/Kolkata</SelectItem>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="America/New_York">America/New_York</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={generalSettings.address}
                  onChange={(e) => setGeneralSettings({...generalSettings, address: e.target.value})}
                  rows={3}
                />
              </div>
              <Button>Save General Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Security Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="allowRegistration">Allow Student Registration</Label>
                    <Switch
                      id="allowRegistration"
                      checked={systemSettings.allowRegistration}
                      onCheckedChange={(checked) => setSystemSettings({...systemSettings, allowRegistration: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="emailVerification">Email Verification Required</Label>
                    <Switch
                      id="emailVerification"
                      checked={systemSettings.emailVerification}
                      onCheckedChange={(checked) => setSystemSettings({...systemSettings, emailVerification: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="twoFactorAuth">Two-Factor Authentication</Label>
                    <Switch
                      id="twoFactorAuth"
                      checked={systemSettings.twoFactorAuth}
                      onCheckedChange={(checked) => setSystemSettings({...systemSettings, twoFactorAuth: checked})}
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                    <Input
                      id="sessionTimeout"
                      type="number"
                      value={systemSettings.sessionTimeout}
                      onChange={(e) => setSystemSettings({...systemSettings, sessionTimeout: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                    <Input
                      id="maxLoginAttempts"
                      type="number"
                      value={systemSettings.maxLoginAttempts}
                      onChange={(e) => setSystemSettings({...systemSettings, maxLoginAttempts: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="passwordMinLength">Password Min Length</Label>
                    <Input
                      id="passwordMinLength"
                      type="number"
                      value={systemSettings.passwordMinLength}
                      onChange={(e) => setSystemSettings({...systemSettings, passwordMinLength: e.target.value})}
                    />
                  </div>
                </div>
              </div>
              <Button>Save Security Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="w-5 h-5 mr-2" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(notificationSettings).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <Label htmlFor={key} className="flex-1">
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </Label>
                  <Switch
                    id={key}
                    checked={value}
                    onCheckedChange={(checked) => 
                      setNotificationSettings({...notificationSettings, [key]: checked})
                    }
                  />
                </div>
              ))}
              <Button>Save Notification Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="backup" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="w-5 h-5 mr-2" />
                Backup & Data Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Button variant="outline" className="h-20 flex flex-col">
                  <Database className="w-6 h-6 mb-2" />
                  Create Backup
                </Button>
                <Button variant="outline" className="h-20 flex flex-col">
                  <Database className="w-6 h-6 mb-2" />
                  Restore Backup
                </Button>
                <Button variant="outline" className="h-20 flex flex-col">
                  <Mail className="w-6 h-6 mb-2" />
                  Export Data
                </Button>
                <Button variant="outline" className="h-20 flex flex-col">
                  <Settings className="w-6 h-6 mb-2" />
                  System Logs
                </Button>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-medium text-yellow-800 mb-2">Automatic Backups</h4>
                <p className="text-sm text-yellow-700">Last backup: Today at 3:00 AM</p>
                <p className="text-sm text-yellow-700">Next scheduled: Tomorrow at 3:00 AM</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettings;
