import { Routes as RouterRoutes, Route, Navigate } from "react-router-dom";
import { Session } from "@supabase/supabase-js";
import IndexPage from "@/pages/Index";
import CalendarPage from "@/pages/Calendar";
import BrandsPage from "@/pages/Brands";
import SettingsPage from "@/pages/Settings";
import CampaignsPage from "@/pages/Campaigns";

interface RoutesProps {
  session: Session | null;
}

export function Routes({ session }: RoutesProps) {
  // If not authenticated, only show index page which contains login form
  if (!session) {
    return (
      <RouterRoutes>
        <Route path="/" element={<IndexPage session={null} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </RouterRoutes>
    );
  }

  return (
    <RouterRoutes>
      <Route path="/" element={<IndexPage session={session} />} />
      <Route path="/feed" element={<CalendarPage session={session} />} />
      <Route path="/brands" element={<BrandsPage session={session} />} />
      <Route path="/settings" element={<SettingsPage session={session} />} />
      <Route path="/campaigns" element={<CampaignsPage session={session} />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
    </RouterRoutes>
  );
}

function AuthCallback() {
  const { data: { session }, error } = await supabase.auth.getSession()
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) throw error;

        if (data?.session) {
          // Check if this was a social login
          const provider = new URLSearchParams(window.location.search).get('provider');
          
          if (provider === 'facebook') {
            // Store the connection in our social_connections table
            const { error: connectionError } = await supabase
              .from('social_connections')
              .upsert({
                user_id: data.session.user.id,
                platform: 'facebook',
                access_token: data.session.provider_token,
                refresh_token: data.session.provider_refresh_token,
                platform_user_id: data.session.user.identities?.[0]?.id,
                platform_username: data.session.user.identities?.[0]?.identity_data?.full_name,
                token_expires_at: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000) // 60 days from now
              });

            if (connectionError) {
              console.error('Error storing social connection:', connectionError);
              toast({
                title: "Error",
                description: "Failed to store social media connection. Please try again.",
                variant: "destructive",
              });
            } else {
              toast({
                title: "Success",
                description: "Successfully connected Facebook account!",
              });
            }
          }
        }
        
        navigate('/settings');
      } catch (error) {
        console.error('Error in auth callback:', error);
        toast({
          title: "Error",
          description: "Authentication failed. Please try again.",
          variant: "destructive",
        });
        navigate('/');
      }
    };

    handleCallback();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-4">Connecting your account...</h2>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
      </div>
    </div>
  );
}