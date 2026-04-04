import { Rocket, MessageSquare, Users, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatCard } from '@/components/shared/StatCard';
import { StageBadge } from '@/components/shared/Stagebage';
import { Progress } from '@/components/ui/progress';
import { mockStartups, mockMilestones, mockMentorships } from '@/data/mock-data';

export default function MentorDashboard() {
  const myMentorships = mockMentorships.filter(m => m.mentor_id === '3');
  const assignedStartupIds = [...new Set(myMentorships.map(m => m.startup_id))];
  const assignedStartups = mockStartups.filter(s => assignedStartupIds.includes(s.id));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>Mentor Dashboard</h1>
        <p className="text-muted-foreground mt-1">Track your mentees' progress and provide guidance.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Assigned Startups" value={assignedStartups.length} icon={Rocket} />
        <StatCard title="Sessions This Month" value={myMentorships.length} icon={MessageSquare} />
        <StatCard title="Active Mentees" value={assignedStartupIds.length} icon={Users} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Assigned Startups</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {assignedStartups.map(startup => {
              const sml = mockMilestones.filter(m => m.startup_id === startup.id);
              const done = sml.filter(m => m.status === 'completed').length;
              const pct = sml.length ? Math.round((done / sml.length) * 100) : 0;
              return (
                <div key={startup.id} className="p-3 rounded-lg border space-y-2">
                  <div className="flex items-center gap-2">
                    <Rocket className="h-4 w-4 text-primary" />
                    <span className="font-medium">{startup.name}</span>
                    <StageBadge stage={startup.stage} />
                  </div>
                  <p className="text-sm text-muted-foreground">{startup.description}</p>
                  <div className="flex items-center gap-2">
                    <Progress value={pct} className="h-1.5 flex-1" />
                    <span className="text-xs text-muted-foreground">{pct}%</span>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Feedback</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {myMentorships.map(record => {
              const startup = mockStartups.find(s => s.id === record.startup_id);
              return (
                <div key={record.id} className="p-3 rounded-lg border space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{startup?.name}</span>
                    <span className="text-xs text-muted-foreground">{new Date(record.session_date).toLocaleDateString()}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{record.notes}</p>
                  {record.feedback && (
                    <p className="text-sm text-primary italic">"{record.feedback}"</p>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
