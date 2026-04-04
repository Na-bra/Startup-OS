import { Target, CheckCircle2, Circle, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { mockMilestones, mockTasks, mockStartups } from '@/data/mock-data';

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
  const myStartups = mockStartups.filter(s => s.created_by === '1');
  const myMilestones = mockMilestones.filter(m => myStartups.some(s => s.id === m.startup_id));
  const total = myMilestones.length;
  const completed = myMilestones.filter(m => m.status === 'completed').length;
  const pct = total ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>Milestones</h1>
        <p className="text-muted-foreground mt-1">Track your growth stages and tasks.</p>
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

      <div className="space-y-4">
        {myMilestones.map(milestone => {
          const tasks = mockTasks.filter(t => t.milestone_id === milestone.id);
          const startup = mockStartups.find(s => s.id === milestone.startup_id);
          return (
            <Card key={milestone.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start gap-3">
                  {statusIcon[milestone.status]}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <CardTitle className="text-base">{milestone.title}</CardTitle>
                      <Badge variant="outline" className={statusBadge[milestone.status]}>{milestone.status}</Badge>
                      <span className="text-xs text-muted-foreground">• {startup?.name}</span>
                    </div>
                    {milestone.description && (
                      <p className="text-sm text-muted-foreground mt-1">{milestone.description}</p>
                    )}
                    {milestone.due_date && (
                      <p className="text-xs text-muted-foreground mt-1">Due: {new Date(milestone.due_date).toLocaleDateString()}</p>
                    )}
                  </div>
                </div>
              </CardHeader>
              {tasks.length > 0 && (
                <CardContent className="pt-0">
                  <div className="space-y-2 pl-7">
                    {tasks.map(task => (
                      <div key={task.id} className="flex items-center gap-2">
                        <Checkbox checked={task.status === 'done'} disabled />
                        <span className={`text-sm ${task.status === 'done' ? 'line-through text-muted-foreground' : ''}`}>
                          {task.title}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
