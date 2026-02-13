import ProfileSidebar from '@/components/profile/ProfileSidebar';

export default function ProfileLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-1">
                    <ProfileSidebar />
                </div>
                <div className="lg:col-span-3">
                    {children}
                </div>
            </div>
        </div>
    );
}
