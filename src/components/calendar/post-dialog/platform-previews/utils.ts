import { PLATFORM_LIMITS } from './types';

export const getValidationIssues = (content: string, selectedPlatforms: string[]) => {
  return selectedPlatforms.map(platform => {
    const limit = PLATFORM_LIMITS[platform];
    if (!limit) return null;
    
    const issues = [];
    
    if (content.length > limit.maxLength) {
      issues.push({
        platform: limit.name,
        issue: `Content exceeds ${limit.name}'s ${limit.maxLength} character limit`
      });
    }

    if (limit.hashtags && content.includes('#') && !content.match(/#[a-zA-Z0-9]+/g)) {
      issues.push({
        platform: limit.name,
        issue: `Invalid hashtag format detected`
      });
    }

    return issues.length > 0 ? issues : null;
  }).flat().filter(Boolean);
};