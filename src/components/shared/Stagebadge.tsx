import { Badge } from '@/components/ui/badge';
import { StartupStage } from '@/types';
import { cn } from '@/lib/utils';

const stageConfig: Record<StartupStage, { label: string; className: string }> = {
  idea: { label: 'Idea', className: 'bg-muted text-muted-foreground' },
  validation: { label: 'Validation', className: 'bg-warning/15 text-warning border-warning/30' },
  mvp: { label: 'MVP', className: 'bg-primary/15 text-primary border-primary/30' },
  growth: { label: 'Growth', className: 'bg-success/15 text-success border-success/30' },
};

export function StageBadge({ stage }: { stage: StartupStage }) {
  const config = stageConfig[stage];
  return <Badge variant="outline" className={cn('font-medium', config.className)}>{config.label}</Badge>;
}
