'use client'

import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
} from "@/components/ui/sidebar"
import {User} from "@/interfaces/user";
import { LucideProps } from "lucide-react";

interface AppSidebarProps {
    data: {
        user: User | null;
        navMain: {
            title: string;
            url: string;
            icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;
            items: { title: string; url: string }[]
        }[]
    }
}

export function AppSidebar({data, ...props}: AppSidebarProps & React.ComponentProps<typeof Sidebar>) {
    data.user = data.user as User;

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                {/*add custom header logo*/}
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain}/>
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={data.user}/>
            </SidebarFooter>
            <SidebarRail/>
        </Sidebar>
    )
}
