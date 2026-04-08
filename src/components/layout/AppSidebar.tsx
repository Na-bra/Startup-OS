import {
  LayoutDashboard, Rocket, Target, FileText, Users, MessageSquare,
  BarChart3, Globe, LogOut, ChevronDown,
} from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarHeader, SidebarFooter, useSidebar,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const studentNav = [
  { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
  { title: 'My Startup', url: '/startup', icon: Rocket },
  { title: 'Milestones', url: '/milestones', icon: Target },
  { title: 'Documents', url: '/documents', icon: FileText },
];

const mentorNav = [
  { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
  { title: 'Assigned Startups', url: '/assigned-startups', icon: Rocket },
  { title: 'Feedback', url: '/feedback', icon: MessageSquare },
];

const adminNav = [
  { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
  { title: 'All Startups', url: '/all-startups', icon: Rocket },
  { title: 'Users', url: '/users', icon: Users },
  { title: 'Analytics', url: '/analytics', icon: BarChart3 },
];

const navByRole: Record<UserRole, typeof studentNav> = {
  student: studentNav,
  mentor: mentorNav,
  admin: adminNav,
};

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const location = useLocation();
  const { user, role, logout } = useAuth();

  const navItems = role ? navByRole[role] : studentNav;
  const initials = user?.full_name?.split(' ').map(n => n[0]).join('') ?? '?';

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Rocket className="h-4 w-4 text-primary-foreground" />
          </div>
          {!collapsed && (
            <span className="text-lg font-bold text-sidebar-foreground" style={{ fontFamily: 'var(--font-heading)' }}>
              Startup OS
            </span>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/50 uppercase text-xs tracking-wider">
            {!collapsed && (role === 'student' ? 'Student' : role === 'mentor' ? 'Mentor' : 'Admin')}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location.pathname === item.url}>
                    <NavLink to={item.url} end className="hover:bg-sidebar-accent" activeClassName="bg-sidebar-accent text-sidebar-primary font-medium">
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={location.pathname === '/showcase'}>
                  <NavLink to="/showcase" className="hover:bg-sidebar-accent" activeClassName="bg-sidebar-accent text-sidebar-primary font-medium">
                    <Globe className="h-4 w-4" />
                    {!collapsed && <span>Public Showcase</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3">
        {!collapsed && (
          <div className="flex items-center gap-2 rounded-md p-2">
            <Avatar className="h-7 w-7">
              {user?.avatar_url && <AvatarImage src={user.avatar_url} />}
              <AvatarFallback className="bg-primary text-primary-foreground text-xs">{initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1 text-left">
              <p className="text-xs font-medium leading-none text-sidebar-foreground">{user?.full_name}</p>
              <p className="text-xs text-sidebar-foreground/50 capitalize">{role}</p>
            </div>
            <button onClick={logout} className="text-sidebar-foreground/50 hover:text-destructive transition-colors" title="Log out">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
