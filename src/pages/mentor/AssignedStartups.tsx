import { Rocket } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StageBadge } from '@/components/shared/Stagebage';
import { Progress } from '@/components/ui/progress';
import { mockStartups, mockMilestones, mockMentorships } from '@/data/mock-data';

export default function AssignedStartups() {
  const myMentorships = mockMentorships.filter(m => m.mentor_id === '3');
  const assignedIds = [...new Set(myMentorships.map(m => m.startup_id))];
  const startups = mockStartups.filter(s => assignedIds.includes(s.id));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>Assigned Startups</h1>
        <p className="text-muted-foreground mt-1">Startups you're currently mentoring.</p>
      </div>

      <div className="grid gap-4">
        {startups.map(startup => {
          const sml = mockMilestones.filter(m => m.startup_id === startup.id);
          const done = sml.filter(m => m.status === 'completed').length;
          const pct = sml.length ? Math.round((done / sml.length) * 100) : 0;
          return (
            <Card key={startup.id}>
              <CardContent className="p-5 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Rocket className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{startup.name}</h3>
                      <StageBadge stage={startup.stage} />
                    </div>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{startup.description}</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Progress:</span>
                  <Progress value={pct} className="h-1.5 flex-1" />
                  <span className="text-xs text-muted-foreground">{done}/{sml.length}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
