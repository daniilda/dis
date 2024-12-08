import { observer } from "mobx-react-lite";
import { FC } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../card";
import { Skeleton } from "../skeleton";

interface Props {
  title?: string;
  controls?: number[];
}

export const SkeletonCard: FC<Props> = observer((x) => {
  return (
    <Card className="appear">
      <CardHeader
        className="flex-row items-center justify-between space-y-0"
        controls={x.controls?.map((width, i) => (
          <Skeleton key={i} style={{ width }} className="h-9" />
        ))}
      >
        <CardTitle>{x.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Skeleton className="h-10" />
        <Skeleton className="h-10" />
        <Skeleton className="h-10" />
        <Skeleton className="h-10" />
      </CardContent>
    </Card>
  );
});
