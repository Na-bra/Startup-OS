import { Rocket, MessageSquare, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatCard } from '@/components/shared/StatCard';
import { StageBadge } from '@/components/shared/Stagebadge';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/AuthContext';
import { useAllStartups } from '@/hooks/use-startups';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export default function MentorDashboard() {
  const { user } = useAuth();
  const { data: startups = [], isLoading } = useAllStartups();
  const displayName = user?.full_name || 'Mentor';

  const { data: mentorships = [] } = useQuery({
    queryKey: ['mentorships', user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('MentorshipRecords')
        .select('*')
        .eq('mentor_id', user!.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  if (isLoading) {
    return <div className="space-y-4"><Skeleton className="h-8 w-48" /><Skeleton className="h-28" /></div>;
  }

  const assignedIds = [...new Set(mentorships.map(m => m.startup_id))];
  const assignedStartups = startups.filter(s => assignedIds.includes(s.id));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>Mentor Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome, {displayName}. Track your mentees' progress.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Assigned Startups" value={assignedStartups.length} icon={Rocket} />
        <StatCard title="Sessions" value={mentorships.length} icon={MessageSquare} />
        <StatCard title="All Startups" value={startups.length} icon={Users} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Assigned Startups</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {assignedStartups.length === 0 && (
            <p className="text-muted-foreground text-center py-4">No startups assigned yet.</p>
          )}
          {assignedStartups.map(startup => (
            <div key={startup.id} className="p-3 rounded-lg border space-y-2">
              <div className="flex items-center gap-2">
                <Rocket className="h-4 w-4 text-primary" />
                <span className="font-medium">{startup.name}</span>
                <StageBadge stage={startup.stage as any} />
              </div>
              <p className="text-sm text-muted-foreground">{startup.description}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Feedback</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {mentorships.length === 0 && (
            <p className="text-muted-foreground text-center py-4">No mentorship sessions yet.</p>
          )}
          {mentorships.slice(0, 5).map(record => {
            const startup = startups.find(s => s.id === record.startup_id);
            return (
              <div key={record.id} className="p-3 rounded-lg border space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">{startup?.name || 'Unknown'}</span>
                  <span className="text-xs text-muted-foreground">{record.session_date ? new Date(record.session_date).toLocaleDateString() : ''}</span>
                </div>
                {record.feedback && <p className="text-sm text-primary italic">"{record.feedback}"</p>}
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
