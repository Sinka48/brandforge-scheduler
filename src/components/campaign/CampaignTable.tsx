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
import { Button } from "@/components/ui/button";
import { PlayCircle, PauseCircle, Trash2 } from "lucide-react";

interface CampaignTableProps {
  campaigns: Campaign[];
  postCounts: Record<string, { total: number; published: number }>;
  onStatusToggle: (campaignId: string, currentStatus: string) => void;
  onDelete: (campaignId: string) => void;
  onCampaignSelect: (campaignId: string) => void;
}

export function CampaignTable({
  campaigns,
  postCounts,
  onStatusToggle,
  onDelete,
  onCampaignSelect,
}: CampaignTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Status</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Posts</TableHead>
          <TableHead>Start Date</TableHead>
          <TableHead>End Date</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {campaigns.map((campaign) => (
          <TableRow 
            key={campaign.id}
            className="cursor-pointer hover:bg-muted"
          >
            <TableCell>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  onStatusToggle(campaign.id, campaign.status);
                }}
              >
                {campaign.status === 'active' ? (
                  <PlayCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <PauseCircle className="h-5 w-5 text-yellow-500" />
                )}
              </Button>
            </TableCell>
            <TableCell onClick={() => onCampaignSelect(campaign.id)}>
              {campaign.name}
            </TableCell>
            <TableCell onClick={() => onCampaignSelect(campaign.id)}>
              {campaign.description}
            </TableCell>
            <TableCell onClick={() => onCampaignSelect(campaign.id)}>
              {postCounts?.[campaign.id] ? (
                <Badge variant="secondary">
                  {postCounts[campaign.id].published}/{postCounts[campaign.id].total}
                </Badge>
              ) : (
                <Badge variant="secondary">0/0</Badge>
              )}
            </TableCell>
            <TableCell onClick={() => onCampaignSelect(campaign.id)}>
              {campaign.start_date && format(new Date(campaign.start_date), 'PPP')}
            </TableCell>
            <TableCell onClick={() => onCampaignSelect(campaign.id)}>
              {campaign.end_date && format(new Date(campaign.end_date), 'PPP')}
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(campaign.id);
                  }}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}