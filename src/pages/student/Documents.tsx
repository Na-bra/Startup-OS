import { FileText, Upload, Download } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useMyStartups } from '@/hooks/use-startups';
import { Skeleton } from '@/components/ui/skeleton';

export default function Documents() {
  const { data: startups = [], isLoading: sl } = useMyStartups();
  const startupIds = startups.map(s => s.id);

  const { data: docs = [], isLoading: dl } = useQuery({
    queryKey: ['documents', startupIds],
    enabled: startupIds.length > 0,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('Documents')
        .select('*')
        .in('startup_id', startupIds)
        .order('uploaded_at', { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  if (sl || dl) {
    return <div className="space-y-4"><Skeleton className="h-8 w-48" /><Skeleton className="h-20" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>Documents</h1>
          <p className="text-muted-foreground mt-1">Manage your startup documents and files.</p>
        </div>
        <Button disabled>
          <Upload className="h-4 w-4 mr-2" /> Upload (coming soon)
        </Button>
      </div>

      <div className="grid gap-3">
        {docs.map(doc => {
          const startup = startups.find(s => s.id === doc.startup_id);
          return (
            <Card key={doc.id}>
              <CardContent className="flex items-center gap-4 p-4">
                <div className="h-10 w-10 rounded-lg bg-destructive/10 flex items-center justify-center shrink-0">
                  <FileText className="h-5 w-5 text-destructive" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{(doc as any).name || doc.file_type || 'Document'}</p>
                  <p className="text-xs text-muted-foreground">{startup?.name} • {new Date(doc.uploaded_at).toLocaleDateString()}</p>
                </div>
                <Button variant="ghost" size="icon" disabled>
                  <Download className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          );
        })}
        {docs.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <FileText className="h-12 w-12 mb-3 opacity-30" />
              <p>No documents uploaded yet.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
