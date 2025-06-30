import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

export function PricingSkeleton() {
  return (
    <div id="pricing" className="w-full py-16 px-4 md:px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-10 text-center space-y-4">
          <h2 className="text-3xl font-bold">
            Let's Talk About <span className="text-yellow-500">Pricing</span>
          </h2>
          <p className="text-lg max-w-xl mx-auto">
            Choose the plan that's right for your business needs
          </p>

          <div className="flex items-center justify-center mt-6 space-x-4">
            <div className="flex items-center justify-center gap-4 relative">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-6 w-10" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Generate 4 skeleton cards */}
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={index} className="relative flex flex-col">
              {/* Popular badge skeleton for second card */}
              {index === 1 && (
                <div className="absolute -top-2 right-5">
                  <Skeleton className="h-6 w-24" />
                </div>
              )}

              <CardHeader>
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-4 w-32" />
              </CardHeader>

              <CardContent className="flex-grow">
                <div className="mb-4">
                  <Skeleton className="h-10 w-24 mb-1" />
                  <Skeleton className="h-4 w-16" />
                </div>

                <div className="space-y-2">
                  {Array.from({ length: 6 }).map((_, featureIndex) => (
                    <div key={featureIndex} className="flex items-start">
                      <Skeleton className="h-5 w-5 mr-2 shrink-0" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  ))}
                </div>
              </CardContent>

              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Skeleton className="h-4 w-64 mx-auto" />
        </div>
      </div>
    </div>
  );
}
