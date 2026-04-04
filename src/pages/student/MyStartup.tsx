import { Rocket, Users, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StageBadge } from '@/components/shared/Stagebadge';
import { Badge } from '@/components/ui/badge';
import { mockStartups } from '@/data/mock-data';

export default function MyStartup() {
  const myStartups = mockStartups.filter(s => s.created_by === '1');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>My Startup</h1>
        <p className="text-muted-foreground mt-1">Manage your startup profiles and team.</p>
      </div>

      <div className="grid gap-6">
        {myStartups.map(startup => (
          <Card key={startup.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Rocket className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle>{startup.name}</CardTitle>
                    <StageBadge stage={startup.stage} />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">{startup.description}</p>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Users className="h-4 w-4" />
                  <span>{startup.members.length} member{startup.members.length > 1 ? 's' : ''}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  <span>Created {new Date(startup.created_at).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="flex gap-2">
                {startup.members.map(member => (
                  <Badge key={member.id} variant="secondary" className="capitalize">{member.role}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
