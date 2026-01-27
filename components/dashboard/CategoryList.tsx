import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function CategoryList({ data }: { data: { category: string, count: number }[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Categories</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-1">
        {data.map((item) => (
          <div key={item.category} className="flex items-center justify-between text-sm">
            <span>{item.category}</span>
            <span className="font-bold">{item.count}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
