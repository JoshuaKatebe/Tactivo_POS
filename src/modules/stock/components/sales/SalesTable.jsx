import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function SalesTable({ sales = [] }) {
  return (
    <div className="overflow-x-auto rounded-md border border-slate-200 dark:border-slate-800">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-100 dark:bg-slate-800/50">
            <TableHead>Product</TableHead>
            <TableHead>Qty</TableHead>
            <TableHead>Total (ZMW)</TableHead>
            <TableHead>Sold By</TableHead>
            <TableHead>Station</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {sales.length > 0 ? (
            sales.map((sale) => (
              <TableRow
                key={sale.id}
                className="hover:bg-slate-50 dark:hover:bg-slate-800/60 transition"
              >
                <TableCell className="font-medium">{sale.product_name}</TableCell>
                <TableCell>{sale.quantity}</TableCell>
                <TableCell>{sale.total_amount.toFixed(2)}</TableCell>
                <TableCell>
                  <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                    {sale.sold_by}
                  </Badge>
                </TableCell>
                <TableCell>{sale.station_name}</TableCell>
                <TableCell>{sale.sold_at}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan="6" className="text-center text-gray-500 py-6">
                No sales found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

