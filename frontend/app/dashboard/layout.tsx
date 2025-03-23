"use client";

import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import React, {
  ForwardRefExoticComponent,
  RefAttributes,
  useEffect,
  useState,
} from "react";
import Loading from "@/components/custom/loading";
import { User } from "@/interfaces/user";
import { Bell, Bot, LucideProps } from "lucide-react";
import { useUserStore } from "@/store/userStore";
import { usePathname } from "next/navigation";

// This is sample data.
const data: {
  user: User | null;
  navMain: {
    title: string;
    url: string;
    icon: ForwardRefExoticComponent<
      Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
    >;
    items?: { title: string; url: string }[];
  }[];
} = {
  user: null,
  navMain: [
    {
      title: "Categories",
      url: "/dashboard/categories",
      icon: Bot,
    },
    {
      title: "Notifications",
      url: "/dashboard/notifications",
      icon: Bell,
    },
  ],
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading, fetchUser } = useUserStore();
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => setLoading(false), 500);

    return () => clearTimeout(timeout);
  }, [pathname]);

  if (isLoading) return <Loading />;

  data.user = user as User;

  return (
    <>
      {loading && <Loading />}
      <SidebarProvider>
        <AppSidebar data={data} />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>
          {children}
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
