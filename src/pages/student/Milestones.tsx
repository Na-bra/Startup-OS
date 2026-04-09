import { useState } from 'react';
import { CheckCircle2, Circle, Clock, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { useMyStartups } from '@/hooks/use-startups';
import { useMilestonesByStartups, useCreateMilestone, useUpdateMilestone } from '@/hooks/use-milestones';

const statusIcon = {
  completed: <CheckCircle2 className="h-4 w-4 text-success" />,
  'in-progress': <Clock className="h-4 w-4 text-warning" />,
  pending: <Circle className="h-4 w-4 text-muted-foreground" />,
};

const statusBadge = {
  completed: 'bg-success/15 text-success border-success/30',
  'in-progress': 'bg-warning/15 text-warning border-warning/30',
  pending: 'bg-muted text-muted-foreground',
};

export default function Milestones() {
  const { data: startups = [], isLoading: sl } = useMyStartups();
  const startupIds = startups.map(s => s.id);
  const { data: milestones = [], isLoading: ml } = useMilestonesByStartups(startupIds);
  const createMilestone = useCreateMilestone();
  const updateMilestone = useUpdateMilestone();

  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [selectedStartup, setSelectedStartup] = useState('');

  const total = milestones.length;
  const completed = milestones.filter(m => m.status === 'completed').length;
  const pct = total ? Math.round((completed / total) * 100) : 0;

  const handleCreate = async () => {
    if (!title.trim() || !selectedStartup) return;
    await createMilestone.mutateAsync({
      startup_id: selectedStartup,
      title: title.trim(),
      description: description.trim() || undefined,
      due_date: dueDate || undefined,
    });
    setTitle('');
    setDescription('');
    setDueDate('');
    setOpen(false);
  };

  const cycleStatus = (m: typeof milestones[0]) => {
    const next = m.status === 'pending' ? 'in-progress' : m.status === 'in-progress' ? 'completed' : 'pending';
    updateMilestone.mutate({
      startup_id: m.startup_id!,
      milestone_id: m.id,
      status: next,
    });
  };

  if (sl || ml) {
    return <div className="space-y-4"><Skeleton className="h-8 w-48" /><Skeleton className="h-20" /><Skeleton className="h-32" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>Milestones</h1>
          <p className="text-muted-foreground mt-1">Track your growth stages.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button disabled={startups.length === 0}><Plus className="h-4 w-4 mr-2" /> Add Milestone</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>New Milestone</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-2">
              <div>
                <label className="text-sm font-medium">Startup</label>
                <Select value={selectedStartup} onValueChange={setSelectedStartup}>
                  <SelectTrigger><SelectValue placeholder="Pick a startup" /></SelectTrigger>
                  <SelectContent>
                    {startups.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium">Title</label>
                <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Complete MVP" />
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Details..." />
              </div>
              <div>
                <label className="text-sm font-medium">Due Date</label>
                <Input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} />
              </div>
              <Button onClick={handleCreate} disabled={createMilestone.isPending || !title.trim() || !selectedStartup} className="w-full">
                {createMilestone.isPending ? 'Creating...' : 'Create Milestone'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Overall Progress</span>
            <span className="text-sm text-muted-foreground">{completed}/{total} milestones</span>
          </div>
          <Progress value={pct} className="h-2" />
        </CardContent>
      </Card>

      {milestones.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <p>No milestones yet. {startups.length === 0 ? 'Create a startup first.' : 'Add one above!'}</p>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {milestones.map(milestone => {
          const startup = startups.find(s => s.id === milestone.startup_id);
          const st = (milestone.status as string) || 'pending';
          return (
            <Card key={milestone.id} className="cursor-pointer" onClick={() => cycleStatus(milestone)}>
              <CardHeader className="pb-3">
                <div className="flex items-start gap-3">
                  {statusIcon[st as keyof typeof statusIcon] || statusIcon.pending}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <CardTitle className="text-base">{milestone.title}</CardTitle>
                      <Badge variant="outline" className={statusBadge[st as keyof typeof statusBadge] || statusBadge.pending}>{st}</Badge>
                      <span className="text-xs text-muted-foreground">• {startup?.name}</span>
                    </div>
                    {milestone.description && <p className="text-sm text-muted-foreground mt-1">{milestone.description}</p>}
                    {milestone.due_date && <p className="text-xs text-muted-foreground mt-1">Due: {new Date(milestone.due_date).toLocaleDateString()}</p>}
                    <p className="text-xs text-muted-foreground/50 mt-1 italic">Click to cycle status</p>
                  </div>
                </div>
              </CardHeader>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
