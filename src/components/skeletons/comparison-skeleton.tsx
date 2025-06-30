import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function ComparisonSkeleton() {
  return (
    <div id="comparison" className="w-full py-16 px-4 md:px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-10 text-center space-y-4">
          <h2 className="text-3xl font-bold">
            <span className="text-yellow-500">Feature</span> Comparison
          </h2>
          <p className="text-lg max-w-xl mx-auto">
            Compare our plans to find the perfect fit for your business
          </p>
        </div>

        <div className="overflow-x-auto border rounded-lg">
          <Table>
            <TableCaption>
              A detailed comparison of Reebews pricing plans
            </TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">Feature</TableHead>
                <TableHead className="text-center">Free</TableHead>
                <TableHead className="text-center">
                  <div className="flex flex-col items-center justify-center">
                    Basic
                    <Skeleton className="h-5 w-16 mt-1" />
                  </div>
                </TableHead>
                <TableHead className="text-center">Pro</TableHead>
                <TableHead className="text-center">Enterprise</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Generate skeleton rows for features */}
              {Array.from({ length: 12 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-1">
                      <Skeleton className="h-4 w-32" />
                      {index % 3 === 0 && <Skeleton className="h-4 w-4" />}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Skeleton className="h-5 w-16 mx-auto" />
                  </TableCell>
                  <TableCell className="text-center">
                    <Skeleton className="h-5 w-16 mx-auto" />
                  </TableCell>
                  <TableCell className="text-center">
                    <Skeleton className="h-5 w-16 mx-auto" />
                  </TableCell>
                  <TableCell className="text-center">
                    <Skeleton className="h-5 w-16 mx-auto" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
