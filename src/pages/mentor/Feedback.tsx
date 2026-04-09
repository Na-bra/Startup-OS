import { MessageSquare } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/AuthContext';
import { useAllStartups } from '@/hooks/use-startups';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export default function Feedback() {
  const { user } = useAuth();
  const { data: startups = [] } = useAllStartups();

  const { data: records = [], isLoading } = useQuery({
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
    return <div className="space-y-4"><Skeleton className="h-8 w-48" /><Skeleton className="h-32" /></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>Feedback & Sessions</h1>
        <p className="text-muted-foreground mt-1">Your mentorship session logs and feedback.</p>
      </div>

      {records.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <MessageSquare className="h-12 w-12 mb-3 opacity-30" />
            <p>No mentorship sessions yet.</p>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {records.map(record => {
          const startup = startups.find(s => s.id === record.startup_id);
          return (
            <Card key={record.id}>
              <CardContent className="p-5 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-primary" />
                    <h3 className="font-semibold">{startup?.name || 'Unknown Startup'}</h3>
                  </div>
                  <span className="text-xs text-muted-foreground">{record.session_date ? new Date(record.session_date).toLocaleDateString() : ''}</span>
                </div>
                {record.feedback && (
                  <div className="bg-primary/5 rounded-md p-3 text-sm">
                    <p className="text-xs font-medium text-primary mb-1">Feedback</p>
                    <p className="text-foreground">{record.feedback}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
