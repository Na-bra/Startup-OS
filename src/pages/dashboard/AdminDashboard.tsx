import { Rocket, Users, Target, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatCard } from '@/components/shared/StatCard';
import { StageBadge } from '@/components/shared/Stagebadge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/AuthContext';
import { useAllStartups } from '@/hooks/use-startups';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export default function AdminDashboard() {
  const { user } = useAuth();
  const { data: startups = [], isLoading: sl } = useAllStartups();

  const { data: milestones = [] } = useQuery({
    queryKey: ['milestones', 'all'],
    queryFn: async () => {
      const { data, error } = await supabase.from('Milestones').select('*');
      if (error) throw error;
      return data ?? [];
    },
  });

  const { data: roleCounts = { students: 0, mentors: 0 } } = useQuery({
    queryKey: ['role-counts'],
    queryFn: async () => {
      const { data, error } = await supabase.from('user_roles').select('role');
      if (error) throw error;
      const students = data?.filter(r => r.role === 'student').length ?? 0;
      const mentors = data?.filter(r => r.role === 'mentor').length ?? 0;
      return { students, mentors };
    },
  });

  const completedMilestones = milestones.filter((m: any) => m.status === 'completed').length;
  const displayName = user?.full_name || 'Admin';

  if (sl) {
    return <div className="space-y-4"><Skeleton className="h-8 w-48" /><Skeleton className="h-28" /></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome, {displayName}. Overview of the collaborative lab.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Startups" value={startups.length} icon={Rocket} />
        <StatCard title="Students" value={roleCounts.students} icon={Users} />
        <StatCard title="Mentors" value={roleCounts.mentors} icon={Users} />
        <StatCard title="Milestones Done" value={completedMilestones} icon={Target} description={`of ${milestones.length} total`} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">All Startups</CardTitle>
        </CardHeader>
        <CardContent>
          {startups.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No startups created yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Startup</TableHead>
                  <TableHead>Stage</TableHead>
                  <TableHead>Progress</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {startups.map(startup => {
                  const sml = milestones.filter((m: any) => m.startup_id === startup.id);
                  const done = sml.filter((m: any) => m.status === 'completed').length;
                  const pct = sml.length ? Math.round((done / sml.length) * 100) : 0;
                  return (
                    <TableRow key={startup.id}>
                      <TableCell className="font-medium">{startup.name}</TableCell>
                      <TableCell><StageBadge stage={startup.stage as any} /></TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 min-w-[120px]">
                          <Progress value={pct} className="h-1.5 flex-1" />
                          <span className="text-xs text-muted-foreground w-8">{pct}%</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Stage Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          {(['idea', 'validation', 'mvp', 'growth'] as const).map(stage => {
            const count = startups.filter(s => s.stage === stage).length;
            const pct = startups.length ? Math.round((count / startups.length) * 100) : 0;
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
    </div>
  );
}
