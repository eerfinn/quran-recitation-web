import { Navigation } from '@/components/ui/Navigation';

interface MainLayoutProps {
    children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navigation />

            {/* Main Content */}
            <div className="lg:pl-72">
                <main className="pt-20 lg:pt-8 px-4 sm:px-6 lg:px-8 pb-10">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
