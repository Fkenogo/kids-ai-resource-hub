
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';

interface AdminFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  filterType: string;
  setFilterType: (value: string) => void;
  filterCost: string;
  setFilterCost: (value: string) => void;
}

export const AdminFilters = ({
  searchTerm,
  setSearchTerm,
  filterType,
  setFilterType,
  filterCost,
  setFilterCost
}: AdminFiltersProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Filters & Search</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search resources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="online_course">Online Course</SelectItem>
              <SelectItem value="interactive_tool">Interactive Tool</SelectItem>
              <SelectItem value="book">Book</SelectItem>
              <SelectItem value="game">Game</SelectItem>
              <SelectItem value="video">Video</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={filterCost} onValueChange={setFilterCost}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Filter by cost" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Costs</SelectItem>
              <SelectItem value="free">Free</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="freemium">Freemium</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};
