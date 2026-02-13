import { getSystemSettings } from '@/actions/getSystemSettings';
import AdminSettingsForm from '@/components/admin/settings/AdminSettingsForm';
import { Settings } from 'lucide-react';

export default async function SettingsPage() {
    const settings = await getSystemSettings();

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8 flex items-center gap-3">
                <div className="p-3 bg-white border border-gray-100 rounded-xl shadow-sm">
                    <Settings className="w-6 h-6 text-gray-700" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">System Settings</h1>
                    <p className="text-gray-500 mt-1">Manage global application configurations.</p>
                </div>
            </div>

            <AdminSettingsForm initialSettings={settings} />
        </div>
    );
}
