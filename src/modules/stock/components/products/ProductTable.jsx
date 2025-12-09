import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Settings2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function ProductTable({ products, onAdjust }) {
  return (
    <div className="overflow-x-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm">

      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50 dark:bg-slate-800">
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>SKU</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Cost</TableHead>
            <TableHead>Stock Qty</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((p, i) => (
            <TableRow key={i}>
              <TableCell className="font-medium">{p.name}</TableCell>
              <TableCell><Badge variant="outline">{p.category}</Badge></TableCell>
              <TableCell className="font-mono text-xs">{p.sku}</TableCell>
              <TableCell>ZMW {p.price}</TableCell>
              <TableCell>ZMW {p.cost}</TableCell>
              <TableCell className={p.stock_qty < 5 ? "text-red-500 font-semibold" : ""}>
                {p.stock_qty}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onAdjust && onAdjust(p)}
                  title="Adjust Stock"
                >
                  <Settings2 className="w-4 h-4 text-slate-500" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

