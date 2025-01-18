import { Layout } from "@/components/layout/Layout";
import { BrandManager } from "@/components/brand/BrandManager";
import { Session } from "@supabase/supabase-js";

interface BrandListPageProps {
  session: Session;
}

export default function BrandListPage({ session }: BrandListPageProps) {
  return (
    <Layout session={session}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your Brands</h1>
          <p className="text-muted-foreground">
            View and manage your saved brand identities
          </p>
        </div>

        <BrandManager />
      </div>
    </Layout>
  );
}