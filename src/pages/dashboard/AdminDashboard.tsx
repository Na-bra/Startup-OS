import { Rocket, Users, Target, BarChart3, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatCard } from '@/components/shared/StatCard';
import { StageBadge } from '@/components/shared/Stagebadge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { mockStartups, mockMilestones, mockUsers, mockMentorships } from '@/data/mock-data';

export default function AdminDashboard() {
  const totalStartups = mockStartups.length;
  const totalMentors = mockUsers.filter(u => u.role === 'mentor').length;
  const totalStudents = mockUsers.filter(u => u.role === 'student').length;
  const allMilestones = mockMilestones;
  const completedMilestones = allMilestones.filter(m => m.status === 'completed').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">Overview of the collaborative lab's startup ecosystem.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Startups" value={totalStartups} icon={Rocket} />
        <StatCard title="Students" value={totalStudents} icon={Users} />
        <StatCard title="Mentors" value={totalMentors} icon={Users} />
        <StatCard title="Milestones Done" value={completedMilestones} icon={Target} description={`of ${allMilestones.length} total`} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">All Startups</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Startup</TableHead>
                <TableHead>Stage</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Mentor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockStartups.map(startup => {
                const sml = mockMilestones.filter(m => m.startup_id === startup.id);
                const done = sml.filter(m => m.status === 'completed').length;
                const pct = sml.length ? Math.round((done / sml.length) * 100) : 0;
                const mentorship = mockMentorships.find(m => m.startup_id === startup.id);
                const mentor = mentorship ? mockUsers.find(u => u.id === mentorship.mentor_id) : null;
                return (
                  <TableRow key={startup.id}>
                    <TableCell className="font-medium">{startup.name}</TableCell>
                    <TableCell><StageBadge stage={startup.stage} /></TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 min-w-[120px]">
                        <Progress value={pct} className="h-1.5 flex-1" />
                        <span className="text-xs text-muted-foreground w-8">{pct}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{mentor?.full_name ?? 'Unassigned'}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Stage Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {(['idea', 'validation', 'mvp', 'growth'] as const).map(stage => {
              const count = mockStartups.filter(s => s.stage === stage).length;
              const pct = Math.round((count / totalStartups) * 100);
              return (
                <div key={stage} className="flex items-center gap-3 mb-3">
                  <StageBadge stage={stage} />
                  <Progress value={pct} className="h-2 flex-1" />
                  <span className="text-sm text-muted-foreground w-16">{count} ({pct}%)</span>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Mentorship Sessions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockMentorships.slice(0, 4).map(record => {
              const startup = mockStartups.find(s => s.id === record.startup_id);
              const mentor = mockUsers.find(u => u.id === record.mentor_id);
              return (
                <div key={record.id} className="flex items-start gap-3 p-2 rounded border text-sm">
                  <TrendingUp className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p><span className="font-medium">{mentor?.full_name}</span> → {startup?.name}</p>
                    <p className="text-xs text-muted-foreground">{new Date(record.session_date).toLocaleDateString()}</p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
