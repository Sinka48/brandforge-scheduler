import { Campaign } from "@/types/campaign";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { useState } from "react";
import { CampaignPosts } from "./CampaignPosts";

interface CampaignManagerProps {
  campaigns: Campaign[];
}

export function CampaignManager({ campaigns }: CampaignManagerProps) {
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>End Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {campaigns.map((campaign) => (
            <TableRow 
              key={campaign.id}
              className="cursor-pointer hover:bg-muted"
              onClick={() => setSelectedCampaignId(
                selectedCampaignId === campaign.id ? null : campaign.id
              )}
            >
              <TableCell>{campaign.name}</TableCell>
              <TableCell>{campaign.description}</TableCell>
              <TableCell>
                <Badge variant={campaign.status === 'active' ? 'default' : 'secondary'}>
                  {campaign.status}
                </Badge>
              </TableCell>
              <TableCell>
                {campaign.start_date && format(new Date(campaign.start_date), 'PPP')}
              </TableCell>
              <TableCell>
                {campaign.end_date && format(new Date(campaign.end_date), 'PPP')}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selectedCampaignId && (
        <div className="mt-6">
          <h2 className="text-2xl font-bold mb-4">Campaign Posts</h2>
          <CampaignPosts campaignId={selectedCampaignId} />
        </div>
      )}
    </div>
  );
}