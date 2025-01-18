import { Card } from "@/components/ui/card";
import { format } from "date-fns";

interface Post {
  id: string;
  content: string;
  date: Date;
  platforms: string[];
  image?: string;
  status: 'draft' | 'scheduled';
  time?: string;
}

interface MonthViewProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  posts: Post[];
  selectedPosts?: string[];
  onSelectPost?: (postId: string) => void;
}

export function MonthView({ selectedDate, onSelectDate, posts, selectedPosts = [], onSelectPost }: MonthViewProps) {
  const daysInMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
  const lastDayOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), daysInMonth);
  
  const getDaysArray = () => {
    const daysArray = [];
    for (let i = 1; i <= daysInMonth; i++) {
      daysArray.push(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), i));
    }
    return daysArray;
  };

  const handleDayClick = (date: Date) => {
    onSelectDate(date);
  };

  return (
    <div className="grid grid-cols-7 gap-4">
      {getDaysArray().map((date) => {
        const dayPosts = posts.filter(post => post.date.toDateString() === date.toDateString());
        return (
          <Card key={date.toString()} className="p-4 cursor-pointer hover:bg-accent transition-colors" onClick={() => handleDayClick(date)}>
            <div className="text-center">
              <h3 className="font-medium">{format(date, 'd')}</h3>
              <p className="text-sm text-muted-foreground">{dayPosts.length} posts</p>
            </div>
            {dayPosts.length > 0 && (
              <div className="mt-2">
                {dayPosts.map(post => (
                  <div key={post.id} className="text-sm">
                    {post.content}
                  </div>
                ))}
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}
