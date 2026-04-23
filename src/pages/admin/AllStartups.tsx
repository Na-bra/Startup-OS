import { Card, CardContent } from '@/components/ui/card';
import { StageBadge } from '@/components/shared/Stagebadge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { useAllStartups } from '@/hooks/use-startups';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export default function AllStartups() {
  const { data: startups = [], isLoading } = useAllStartups();

  const { data: milestones = [] } = useQuery({
    queryKey: ['milestones', 'all'],
    queryFn: async () => {
      const { data, error } = await supabase.from('Milestones').select('*');
      if (error) throw error;
      return data ?? [];
    },
  });

  if (isLoading) {
    return <div className="space-y-4"><Skeleton className="h-8 w-48" /><Skeleton className="h-40" /></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>All Startups</h1>
        <p className="text-muted-foreground mt-1">Monitor and manage all startups in the lab.</p>
      </div>

      <Card>
        <CardContent className="p-0">
          {startups.length === 0 ? (
            <p className="text-muted-foreground text-center py-12">No startups created yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Stage</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {startups.map(startup => {
                  const sml = milestones.filter((m: any) => m.startup_id === startup.id);
                  const done = sml.filter((m: any) => m.status === 'completed').length;
                  const pct = sml.length ? Math.round((done / sml.length) * 100) : 0;
                  return (
                    <TableRow key={startup.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{startup.name}</p>
                          <p className="text-xs text-muted-foreground truncate max-w-[200px]">{startup.description}</p>
                        </div>
                      </TableCell>
                      <TableCell><StageBadge stage={startup.stage as any} /></TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 min-w-[100px]">
                          <Progress value={pct} className="h-1.5 flex-1" />
                          <span className="text-xs text-muted-foreground">{pct}%</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{new Date(startup.created_at).toLocaleDateString()}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
