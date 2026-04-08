import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { GraduationCap, MessageSquare, Settings } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import type { UserRole } from '@/types';

const roles: { value: UserRole; label: string; description: string; icon: React.ElementType }[] = [
  { value: 'student', label: 'Student', description: 'Build and manage your startup project', icon: GraduationCap },
  { value: 'mentor', label: 'Mentor', description: 'Guide and give feedback to startups', icon: MessageSquare },
  { value: 'admin', label: 'Admin', description: 'Manage users, startups, and analytics', icon: Settings },
];

export default function SelectRole() {
  const { user } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSelect = async (role: UserRole) => {
    if (!user) return;
    setLoading(true);
    try {
      const { error } = await supabase
        .from('user_roles')
        .upsert({ user_id: user.id, role }, { onConflict: 'user_id' });

      if (error) throw error;
      navigate('/dashboard');
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-2xl text-center">
        <h1 className="mb-2 text-3xl font-bold" style={{ fontFamily: 'var(--font-heading)' }}>
          Welcome to Startup OS
        </h1>
        <p className="mb-8 text-muted-foreground">Choose your role to get started</p>
        <div className="grid gap-4 sm:grid-cols-3">
          {roles.map(({ value, label, description, icon: Icon }) => (
            <Card
              key={value}
              onClick={() => !loading && handleSelect(value)}
              className="cursor-pointer transition-all hover:border-primary hover:shadow-md"
            >
              <CardHeader className="items-center text-center">
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">{label}</CardTitle>
                <CardDescription>{description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </AuthLayout>
  );
}
