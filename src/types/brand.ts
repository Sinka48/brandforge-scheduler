export interface Brand {
  id: string;
  asset_type: string;
  created_at: string;
  metadata: {
    colors: string[];
    typography: {
      headingFont: string;
      bodyFont: string;
    };
  };
  questionnaire_id: string;
  url: string;
  user_id: string;
  version: number;
}