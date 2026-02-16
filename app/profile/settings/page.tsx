import { getUserProfile } from '@/actions/profile';
import { Settings, User, Mail, Shield } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default async function SettingsPage() {
    const profile = await getUserProfile();

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-gray-100 rounded-2xl">
                    <Settings className="w-8 h-8 text-gray-600" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
                    <p className="text-gray-500 mt-1">Manage your account preferences and security</p>
                </div>
            </div>

            <div className="grid gap-6">
                {/* Profile Information */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-2 mb-6 text-gray-900 font-semibold">
                        <User className="w-5 h-5" />
                        <h2>Personal Information</h2>
                    </div>

                    <div className="space-y-4 max-w-md">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                            <input
                                type="text"
                                defaultValue={profile?.full_name || ''}
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                            <input
                                type="email"
                                defaultValue={profile?.email || ''}
                                disabled
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed"
                            />
                            <p className="text-xs text-gray-400 mt-1">Email cannot be changed directly.</p>
                        </div>
                        <Button className="mt-2">Update Profile</Button>
                    </div>
                </div>

                {/* Password & Security */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-2 mb-6 text-gray-900 font-semibold">
                        <Shield className="w-5 h-5" />
                        <h2>Security</h2>
                    </div>

                    <div className="space-y-4 max-w-md">
                        <p className="text-sm text-gray-500">
                            We'll send you an email to reset your password if you wish to change it.
                        </p>
                        <Button variant="outline">Change Password</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
