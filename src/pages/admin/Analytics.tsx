import { BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StageBadge } from '@/components/shared/Stagebage';
import { Progress } from '@/components/ui/progress';
import { mockStartups, mockMilestones, mockMentorships, mockActivities } from '@/data/mock-data';

export default function Analytics() {
  const stageDistribution = (['idea', 'validation', 'mvp', 'growth'] as const).map(stage => ({
    stage,
    count: mockStartups.filter(s => s.stage === stage).length,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>Analytics</h1>
        <p className="text-muted-foreground mt-1">Lab performance and engagement insights.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Stage Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {stageDistribution.map(({ stage, count }) => {
              const pct = Math.round((count / mockStartups.length) * 100);
              return (
                <div key={stage} className="flex items-center gap-3 mb-4">
                  <StageBadge stage={stage} />
                  <Progress value={pct} className="h-3 flex-1" />
                  <span className="text-sm font-medium w-10 text-right">{count}</span>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Activity Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 rounded-lg bg-muted">
                <p className="text-2xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>{mockActivities.length}</p>
                <p className="text-xs text-muted-foreground">Total Activities</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted">
                <p className="text-2xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>{mockMentorships.length}</p>
                <p className="text-xs text-muted-foreground">Mentorship Sessions</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted">
                <p className="text-2xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>{mockMilestones.filter(m => m.status === 'completed').length}</p>
                <p className="text-xs text-muted-foreground">Milestones Done</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted">
                <p className="text-2xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>{mockStartups.length}</p>
                <p className="text-xs text-muted-foreground">Active Startups</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
