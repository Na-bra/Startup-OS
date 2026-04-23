import { useState } from 'react';
import { Rocket, Plus, Calendar, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StageBadge } from '@/components/shared/Stagebadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { useMyStartups, useCreateStartup, useDeleteStartup } from '@/hooks/use-startups';

export default function MyStartup() {
  const { data: startups = [], isLoading } = useMyStartups();
  const createStartup = useCreateStartup();
  const deleteStartup = useDeleteStartup();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [stage, setStage] = useState('idea');

  const handleCreate = async () => {
    if (!name.trim()) return;
    await createStartup.mutateAsync({ name: name.trim(), description: description.trim(), stage });
    setName('');
    setDescription('');
    setStage('idea');
    setOpen(false);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-40" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>My Startup</h1>
          <p className="text-muted-foreground mt-1">Manage your startup profiles.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" /> New Startup</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Startup</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div>
                <label className="text-sm font-medium">Name</label>
                <Input value={name} onChange={e => setName(e.target.value)} placeholder="My Awesome Startup" />
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="What does your startup do?" />
              </div>
              <div>
                <label className="text-sm font-medium">Stage</label>
                <Select value={stage} onValueChange={setStage}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="idea">Idea</SelectItem>
                    <SelectItem value="validation">Validation</SelectItem>
                    <SelectItem value="mvp">MVP</SelectItem>
                    <SelectItem value="growth">Growth</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleCreate} disabled={createStartup.isPending || !name.trim()} className="w-full">
                {createStartup.isPending ? 'Creating...' : 'Create Startup'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {startups.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <Rocket className="h-12 w-12 mb-3 opacity-30" />
            <p className="font-medium">No startups yet</p>
            <p className="text-sm">Click "New Startup" to get started!</p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6">
        {startups.map(startup => (
          <Card key={startup.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Rocket className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle>{startup.name}</CardTitle>
                    <StageBadge stage={startup.stage as any} />
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:text-destructive"
                  onClick={() => deleteStartup.mutate(startup.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">{startup.description || 'No description.'}</p>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  <span>Created {new Date(startup.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
