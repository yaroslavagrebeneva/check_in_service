import { Sidebar } from '@/components/sidebar';
import { TopNavbar } from '@/components/top-navbar';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <TopNavbar />
      <div className="flex min-h-screen bg-white text-black">
      <Sidebar />
        <main className="flex-1 p-6 mt-[60px]">{children}</main>
    </div>
    </>
  );
};

export default DashboardLayout;