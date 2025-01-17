interface OptimalTime {
  time: string;
  engagement: 'High' | 'Medium' | 'Low';
  description: string;
}

// These would ideally come from analytics data
const PLATFORM_OPTIMAL_TIMES: Record<string, OptimalTime[]> = {
  facebook: [
    { time: '09:00', engagement: 'High', description: 'Morning commute peak' },
    { time: '13:00', engagement: 'Medium', description: 'Lunch break' },
    { time: '15:00', engagement: 'High', description: 'Afternoon engagement peak' },
    { time: '19:00', engagement: 'High', description: 'Evening leisure time' },
  ],
  twitter: [
    { time: '08:00', engagement: 'High', description: 'Early morning check' },
    { time: '12:00', engagement: 'Medium', description: 'Midday break' },
    { time: '17:00', engagement: 'High', description: 'End of workday' },
    { time: '21:00', engagement: 'Medium', description: 'Late evening browsing' },
  ],
  instagram: [
    { time: '11:00', engagement: 'High', description: 'Late morning peak' },
    { time: '14:00', engagement: 'Medium', description: 'Early afternoon' },
    { time: '19:00', engagement: 'High', description: 'Prime time' },
    { time: '21:00', engagement: 'High', description: 'Evening browsing' },
  ],
  linkedin: [
    { time: '08:00', engagement: 'High', description: 'Start of workday' },
    { time: '12:00', engagement: 'Medium', description: 'Lunch break' },
    { time: '17:00', engagement: 'High', description: 'End of workday' },
    { time: '19:00', engagement: 'Medium', description: 'Evening check' },
  ],
};

export const getOptimalTimes = (platforms: string[]): OptimalTime[] => {
  const times = platforms.flatMap(platform => 
    PLATFORM_OPTIMAL_TIMES[platform] || []
  );
  
  // Remove duplicates and sort by time
  return Array.from(new Map(times.map(time => 
    [time.time, time]
  )).values()).sort((a, b) => 
    a.time.localeCompare(b.time)
  );
};