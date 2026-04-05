import { MessageSquare, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { mockMentorships, mockStartups } from '@/data/mock-data';

export default function Feedback() {
  const myRecords = mockMentorships.filter(m => m.mentor_id === '3');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>Feedback & Sessions</h1>
          <p className="text-muted-foreground mt-1">Your mentorship session logs and feedback.</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" /> New Session
        </Button>
      </div>

      <div className="space-y-4">
        {myRecords.map(record => {
          const startup = mockStartups.find(s => s.id === record.startup_id);
          return (
            <Card key={record.id}>
              <CardContent className="p-5 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-primary" />
                    <h3 className="font-semibold">{startup?.name}</h3>
                  </div>
                  <span className="text-xs text-muted-foreground">{new Date(record.session_date).toLocaleDateString()}</span>
                </div>
                <p className="text-sm text-muted-foreground">{record.notes}</p>
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
