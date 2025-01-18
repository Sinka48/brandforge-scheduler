import { Layout } from "@/components/layout/Layout";
import { BrandManager } from "@/components/brand-generator/BrandManager";

export default function BrandListPage() {
  return (
    <Layout>
      <div className="space-y-8">
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