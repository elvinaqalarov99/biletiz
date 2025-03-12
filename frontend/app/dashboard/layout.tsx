'use client'

import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import React, { ForwardRefExoticComponent, RefAttributes } from "react";
import { UserProvider, useUser } from "@/providers/UserProvider";
import Loading from "@/components/custom/loading";
import { User } from "@/interfaces/user";
import { Bot, LucideProps } from "lucide-react";


// This is sample data.
const data :
    {
      user: User | null,
      navMain: {
        title: string,
        url: string,
        icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>,
        items: { title: string, url: string}[]
      }[]
    }
    = {
  user : null,
  navMain: [
    {
      title: "Settings",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "All settings",
          url: "/dashboard",
        },
      ],
    },
  ],
}


export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
      <UserProvider>
        <InnerDashboardLayout>{children}</InnerDashboardLayout>
      </UserProvider>
  );
}

function InnerDashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useUser();

  if (loading) return <Loading/>;

  data.user = user as User;

  return (
      <UserProvider>
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
                      <BreadcrumbLink href="/dashboard">
                        Dashboard
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
            </header>
            {children}
          </SidebarInset>
        </SidebarProvider>
      </UserProvider>
  )
}
