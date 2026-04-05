import { Rocket, Target, FileText, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatCard } from '@/components/shared/StatCard';
import { StageBadge } from '@/components/shared/Stagebadge';
import { Progress } from '@/components/ui/progress';
import { mockStartups, mockMilestones, mockDocuments, mockActivities, mockTasks } from '@/data/mock-data';

export default function StudentDashboard() {
  const myStartups = mockStartups.filter(s => s.created_by === '1');
  const myMilestones = mockMilestones.filter(m => myStartups.some(s => s.id === m.startup_id));
  const completedMilestones = myMilestones.filter(m => m.status === 'completed').length;
  const myDocs = mockDocuments.filter(d => myStartups.some(s => s.id === d.startup_id));
  const myActivities = mockActivities.filter(a => a.user_id === '1').slice(0, 5);
  const myTasks = mockTasks.filter(t => t.assignee_id === '1');
  const completedTasks = myTasks.filter(t => t.status === 'done').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>Student Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome back, Alice! Here's your startup progress.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="My Startups" value={myStartups.length} icon={Rocket} />
        <StatCard title="Milestones" value={`${completedMilestones}/${myMilestones.length}`} icon={Target} description="completed" />
        <StatCard title="Tasks Done" value={`${completedTasks}/${myTasks.length}`} icon={Activity} />
        <StatCard title="Documents" value={myDocs.length} icon={FileText} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">My Startups</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {myStartups.map(startup => {
              const sml = mockMilestones.filter(m => m.startup_id === startup.id);
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
                      <StageBadge stage={startup.stage} />
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
            <CardTitle className="text-lg">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {myActivities.map(activity => (
                <div key={activity.id} className="flex items-start gap-3 text-sm">
                  <div className="h-2 w-2 rounded-full bg-primary mt-1.5 shrink-0" />
                  <div>
                    <p className="text-foreground capitalize">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(activity.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
