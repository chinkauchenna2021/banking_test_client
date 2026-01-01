'use client';

import { useState } from 'react';
import PageContainer from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch'; // Assuming shadcn switch
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useAdmin } from '@/hooks/useAdmin';
import { useUser } from '@/hooks/useUser';
import { toast } from 'sonner';
import { 
  Save, 
  Shield, 
  Bell, 
  Server, 
  User as UserIcon,
  Key,
  AlertTriangle 
} from 'lucide-react';

export default function AdminSettingsPage() {
  const { user, updateProfile, changePassword } = useUser();
  
  // System Config State (Mocked state as specific settings hook wasn't provided, 
  // but structured to easily connect to a store)
  const [systemConfig, setSystemConfig] = useState({
    maintenanceMode: false,
    allowRegistrations: true,
    forceTwoFactor: false,
    notificationEmail: 'admin@bank.com'
  });

  const [profileData, setProfileData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleSaveProfile = async () => {
    try {
      await updateProfile(profileData);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    try {
      await changePassword(
        // passwordData.currentPassword, passwordData.newPassword)
         {current_password: passwordData.currentPassword, new_password: passwordData.newPassword, confirm_password: passwordData.confirmPassword}
        );
      toast.success('Password changed successfully');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error('Failed to change password');
    }
  };

  const handleSystemConfigSave = () => {
    // Here you would call an API endpoint like: await updateSystemSettings(systemConfig);
    toast.success('System configuration saved');
  };

  return (
    <PageContainer
      scrollable
      pageTitle="Settings"
      pageDescription="Manage your admin profile and system configurations"
    >
      <div className="space-y-6">
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
          </TabsList>

          {/* General Settings - Admin Profile */}
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>Admin Profile</CardTitle>
                <CardDescription>Update your personal information and contact details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input 
                      id="firstName" 
                      value={profileData.first_name}
                      onChange={(e) => setProfileData({...profileData, first_name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input 
                      id="lastName" 
                      value={profileData.last_name}
                      onChange={(e) => setProfileData({...profileData, last_name: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    id="email" 
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input 
                    id="phone" 
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                  />
                </div>
                <div className="flex justify-end pt-4">
                  <Button onClick={handleSaveProfile}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>Ensure your account is using a strong password</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Current Password</Label>
                    <Input 
                      type="password" 
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>New Password</Label>
                    <Input 
                      type="password" 
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Confirm New Password</Label>
                    <Input 
                      type="password" 
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                    />
                  </div>
                  <Button onClick={handleChangePassword} className="w-full">
                    <Key className="h-4 w-4 mr-2" />
                    Update Password
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Two-Factor Authentication</CardTitle>
                  <CardDescription>Enhance the security of your admin account</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between space-y-0">
                    <div className="space-y-1">
                      <Label className="text-base">2FA Enabled</Label>
                      <p className="text-sm text-muted-foreground">
                        Require 2FA code for admin login
                      </p>
                    </div>
                    <Switch 
                      checked={user?.two_factor_enabled} 
                      disabled // Assuming enableTwoFactor logic requires a more complex flow
                    />
                  </div>
                  <Separator />
                  <div className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Shield className="h-5 w-5 text-green-500 shrink-0" />
                    <p>
                      Your admin account is currently protected by {user?.two_factor_enabled ? 'Two-Factor Authentication' : 'Password only'}. It is highly recommended to enable 2FA.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Notifications */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Manage how you receive system alerts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between space-y-0 border p-4 rounded-lg">
                  <div className="space-y-1">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive emails for new registrations, failed transactions, and system alerts.
                    </p>
                  </div>
                  <Switch 
                    checked={systemConfig.notificationEmail !== ''}
                    onCheckedChange={(checked) => setSystemConfig({
                      ...systemConfig, 
                      notificationEmail: checked ? 'admin@bank.com' : ''
                    })}
                  />
                </div>
                
                <div className="flex items-center justify-between space-y-0 border p-4 rounded-lg">
                  <div className="space-y-1">
                    <Label>Suspicious Activity Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Immediate notification if a user triggers fraud protocols.
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between space-y-0 border p-4 rounded-lg">
                  <div className="space-y-1">
                    <Label>Daily Reports</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive a daily summary of transaction volume and user growth.
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex justify-end pt-4">
                  <Button onClick={handleSystemConfigSave}>Save Preferences</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* System Configuration */}
          <TabsContent value="system">
            <Card className="border-orange-200 dark:border-orange-900">
              <CardHeader className="text-orange-900 dark:text-orange-100">
                <CardTitle className="flex items-center gap-2">
                  <Server className="h-5 w-5" />
                  System Configuration
                </CardTitle>
                <CardDescription>
                  Changes here affect the entire platform. Use with caution.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between space-y-0 border p-4 rounded-lg bg-orange-50 dark:bg-orange-950">
                  <div className="space-y-1">
                    <Label className="text-orange-900 dark:text-orange-100 font-semibold flex items-center gap-2">
                      Maintenance Mode
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Disable the platform for all users except admins.
                    </p>
                  </div>
                  <Switch 
                    checked={systemConfig.maintenanceMode}
                    onCheckedChange={(checked) => setSystemConfig({...systemConfig, maintenanceMode: checked})}
                  />
                </div>

                <div className="flex items-center justify-between space-y-0 border p-4 rounded-lg">
                  <div className="space-y-1">
                    <Label>Allow New Registrations</Label>
                    <p className="text-sm text-muted-foreground">
                      Stop new users from creating accounts.
                    </p>
                  </div>
                  <Switch 
                    checked={systemConfig.allowRegistrations}
                    onCheckedChange={(checked) => setSystemConfig({...systemConfig, allowRegistrations: checked})}
                  />
                </div>

                <div className="flex items-center justify-between space-y-0 border p-4 rounded-lg">
                  <div className="space-y-1">
                    <Label>Force 2FA for All Users</Label>
                    <p className="text-sm text-muted-foreground">
                      Require all users to enable 2FA to perform transactions.
                    </p>
                  </div>
                  <Switch 
                    checked={systemConfig.forceTwoFactor}
                    onCheckedChange={(checked) => setSystemConfig({...systemConfig, forceTwoFactor: checked})}
                  />
                </div>
                
                <div className="flex justify-end pt-4">
                  <Button variant="destructive" onClick={handleSystemConfigSave}>
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Update System Config
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
}