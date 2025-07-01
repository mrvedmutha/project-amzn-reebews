export function OrderSummarySkeleton() {
  return (
    <div className="bg-card rounded-lg border p-6 sticky top-24 animate-pulse">
      <div className="h-6 w-3/4 bg-gray-300 rounded mb-6"></div>

      <div className="space-y-4">
        <div className="flex justify-between">
          <div className="h-5 w-1/4 bg-gray-300 rounded"></div>
          <div className="h-5 w-1/3 bg-gray-300 rounded"></div>
        </div>
        <div className="flex justify-between">
          <div className="h-5 w-1/3 bg-gray-300 rounded"></div>
          <div className="h-8 w-1/2 bg-gray-300 rounded"></div>
        </div>
        <div className="flex justify-between font-medium text-lg">
          <div className="h-6 w-1/4 bg-gray-300 rounded"></div>
          <div className="h-6 w-1/3 bg-gray-300 rounded"></div>
        </div>

        <div className="border-t pt-4">
          <div className="h-5 w-1/2 bg-gray-300 rounded mb-4"></div>
          <div className="space-y-2">
            <div className="h-4 w-full bg-gray-300 rounded"></div>
            <div className="h-4 w-5/6 bg-gray-300 rounded"></div>
            <div className="h-4 w-full bg-gray-300 rounded"></div>
          </div>
        </div>

        <div className="pt-4 border-t">
          <div className="h-5 w-1/2 bg-gray-300 rounded mb-4"></div>
          <div className="space-y-2">
            <div className="h-10 w-full bg-gray-300 rounded"></div>
            <div className="h-10 w-full bg-gray-300 rounded"></div>
          </div>
        </div>

        <div className="pt-4 border-t">
          <div className="h-8 w-full bg-gray-300 rounded"></div>
        </div>
      </div>
    </div>
  );
}
