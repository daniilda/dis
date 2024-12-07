import { cn } from "@/utils/cn";
import {
  Table,
  TableCaption,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  TableFooter,
} from "./table";
import { ElementRef, ReactNode, useEffect, useRef } from "react";
import { TooltipProvider } from "./tooltip";

export interface Column<T> {
  header: ReactNode;
  accessor?: (item: T) => ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  caption?: string;
  data: NoInfer<T>[];
  columns: Column<T>[];
  footer?: React.ReactNode;
  onRowClick?: (item: T) => void;
  className?: string;
  scrollTopOnDataChange?: boolean;
}

export const DataTable = <T,>({
  caption,
  data,
  columns,
  footer,
  onRowClick,
  className,
  scrollTopOnDataChange = true,
}: DataTableProps<T>) => {
  const ref = useRef<ElementRef<typeof Table>>(null);

  useEffect(() => {
    if (scrollTopOnDataChange && ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [scrollTopOnDataChange, data]);

  return (
    <TooltipProvider>
      <Table ref={ref} className={className}>
        {caption && <TableCaption>{caption}</TableCaption>}
        <TableHeader className="sticky top-0 bg-card z-10">
          <TableRow className="hover:bg-transparent">
            {columns.map((column, index) => (
              <TableHead
                key={index}
                className={cn("whitespace-pre text-nowrap", column.className)}
              >
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, rowIndex) => (
            <TableRow
              key={rowIndex}
              onClick={onRowClick ? () => onRowClick(item) : undefined}
              tabIndex={onRowClick ? 0 : undefined}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  onRowClick?.(item);
                }
              }}
              className={
                onRowClick
                  ? "cursor-pointer hover:bg-slate-100 transition-colors"
                  : "hover:bg-transparent"
              }
            >
              {columns.map((column, colIndex) => (
                <TableCell key={colIndex} className={column.className}>
                  {column.accessor
                    ? column.accessor(item)
                    : typeof item === "string" || typeof item === "number"
                      ? item
                      : null}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
        {footer && (
          <TableFooter>
            <TableRow>{footer}</TableRow>
          </TableFooter>
        )}
      </Table>
    </TooltipProvider>
  );
};
