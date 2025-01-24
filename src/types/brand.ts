export interface Brand {
  id: string;
  asset_type: string;
  created_at: string;
  metadata: {
    name?: string;
    socialAssets?: {
      profileImage?: string;
      coverImage?: string;
    };
    socialBio?: string;
  };
  questionnaire_id: string;
  url: string;
  user_id: string;
  version: number;
  asset_category?: string;
  social_asset_type?: string;
  social_name?: string;
  social_bio?: string;
}

export interface BrandAsset extends Brand {
  asset_category: string;
  social_asset_type: string | null;
  social_name: string | null;
  social_bio: string | null;
}