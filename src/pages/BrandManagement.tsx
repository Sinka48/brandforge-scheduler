import { Layout } from "@/components/layout/Layout";
import { BrandManager } from "@/components/brand/BrandManager";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";

export default function BrandManagementPage() {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Brand Management</h1>
            <p className="text-muted-foreground">
              View and manage your saved brand identities
            </p>
          </div>
          <Button onClick={() => navigate("/brand/identity")}>
            <Plus className="mr-2 h-4 w-4" />
            Generate New Brand
          </Button>
        </div>
        <BrandManager />
      </div>
    </Layout>
  );
}