import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

export function ComparisonSkeleton() {
  return (
    <div className="overflow-x-auto border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">
              <Skeleton className="h-5 w-24" />
            </TableHead>
            <TableHead className="text-center">
              <Skeleton className="h-5 w-16 mx-auto" />
            </TableHead>
            <TableHead className="text-center">
              <Skeleton className="h-5 w-16 mx-auto" />
            </TableHead>
            <TableHead className="text-center">
              <Skeleton className="h-5 w-16 mx-auto" />
            </TableHead>
            <TableHead className="text-center">
              <Skeleton className="h-5 w-16 mx-auto" />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 10 }).map((_, index) => (
            <TableRow key={index}>
              <TableCell>
                <Skeleton className="h-5 w-48" />
              </TableCell>
              <TableCell className="text-center">
                <Skeleton className="h-5 w-5 mx-auto" />
              </TableCell>
              <TableCell className="text-center">
                <Skeleton className="h-5 w-5 mx-auto" />
              </TableCell>
              <TableCell className="text-center">
                <Skeleton className="h-5 w-5 mx-auto" />
              </TableCell>
              <TableCell className="text-center">
                <Skeleton className="h-5 w-5 mx-auto" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
