import { Rocket, Target, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatCard } from '@/components/shared/StatCard';
import { StageBadge } from '@/components/shared/Stagebadge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';
import { useMyStartups } from '@/hooks/use-startups';
import { useMilestonesByStartups } from '@/hooks/use-milestones';
import { Skeleton } from '@/components/ui/skeleton';

export default function StudentDashboard() {
  const { user } = useAuth();
  const { data: startups = [], isLoading: startupsLoading } = useMyStartups();
  const startupIds = startups.map(s => s.id);
  const { data: milestones = [], isLoading: milestonesLoading } = useMilestonesByStartups(startupIds);

  const completedMilestones = milestones.filter(m => m.status === 'completed').length;
  const displayName = user?.full_name || user?.email?.split('@')[0] || 'there';

  const isLoading = startupsLoading || milestonesLoading;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-28" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>Student Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome back, {displayName}! Here's your startup progress.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard title="My Startups" value={startups.length} icon={Rocket} />
        <StatCard title="Milestones" value={`${completedMilestones}/${milestones.length}`} icon={Target} description="completed" />
        <StatCard title="Documents" value={0} icon={FileText} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">My Startups</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {startups.length === 0 && (
              <p className="text-muted-foreground text-sm py-4 text-center">No startups yet. Go to "My Startup" to create one!</p>
            )}
            {startups.map(startup => {
              const sml = milestones.filter(m => m.startup_id === startup.id);
              const done = sml.filter(m => m.status === 'completed').length;
              const pct = sml.length ? Math.round((done / sml.length) * 100) : 0;
              return (
                <div key={startup.id} className="flex items-center gap-4 p-3 rounded-lg border">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Rocket className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium truncate">{startup.name}</p>
                      <StageBadge stage={startup.stage as any} />
                    </div>
                    <div className="flex items-center gap-2 mt-1.5">
                      <Progress value={pct} className="h-1.5 flex-1" />
                      <span className="text-xs text-muted-foreground">{pct}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Info</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>Use the sidebar to navigate between your startup, milestones, and documents.</p>
              <p>Create a startup first, then add milestones to track your progress.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
