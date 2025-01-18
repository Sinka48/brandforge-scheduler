export interface Brand {
  id: string;
  user_id: string;
  questionnaire_id: string;
  asset_type: string;
  url: string;
  version: number;
  created_at: string;
  metadata: {
    colors: string[];
    typography: {
      headingFont: string;
      bodyFont: string;
    };
  };
}