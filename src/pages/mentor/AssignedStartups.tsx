import { Rocket } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { StageBadge } from '@/components/shared/Stagebadge';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/AuthContext';
import { useAllStartups } from '@/hooks/use-startups';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export default function AssignedStartups() {
  const { user } = useAuth();
  const { data: allStartups = [], isLoading: sl } = useAllStartups();

  const { data: mentorships = [], isLoading: ml } = useQuery({
    queryKey: ['mentorships', user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('MentorshipRecords')
        .select('*')
        .eq('mentor_id', user!.id);
      if (error) throw error;
      return data ?? [];
    },
  });

  const assignedIds = [...new Set(mentorships.map(m => m.startup_id))];
  const startups = allStartups.filter(s => assignedIds.includes(s.id));

  if (sl || ml) {
    return <div className="space-y-4"><Skeleton className="h-8 w-48" /><Skeleton className="h-32" /></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>Assigned Startups</h1>
        <p className="text-muted-foreground mt-1">Startups you're currently mentoring.</p>
      </div>

      {startups.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <Rocket className="h-12 w-12 mb-3 opacity-30" />
            <p>No startups assigned to you yet.</p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {startups.map(startup => (
          <Card key={startup.id}>
            <CardContent className="p-5 space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Rocket className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{startup.name}</h3>
                    <StageBadge stage={startup.stage as any} />
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{startup.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
