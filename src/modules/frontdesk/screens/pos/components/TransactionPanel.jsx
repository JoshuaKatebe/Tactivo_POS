import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Trash2 } from "lucide-react";

export default function TransactionPanel({
  cart = [],
  subtotal = 0,
  tax = 0,
  total = 0,
  change = 0,
  processPayment,
  openPaymentModal,   // <-- used to open the same modal
  removeItem,
}) {
  return (
    <div className="w-1/3 min-w-[350px] p-4 bg-gradient-to-b from-slate-100 to-slate-200 
                    text-black flex flex-col border-r border-slate-300">

      {/* Title */}
      <h2 className="text-lg font-bold mb-3 text-slate-800">Current Transaction</h2>

      {/* Cart Table */}
      <Card className="flex flex-col flex-1 overflow-hidden border border-slate-300 shadow-sm">
        <div className="bg-slate-200 border-b border-slate-300">
          <Table>
            <TableHeader>
              <TableRow className="text-sm font-semibold">
                <TableHead>BC</TableHead>
                <TableHead>Desc</TableHead>
                <TableHead>Qty</TableHead>
                <TableHead>U.P</TableHead>
                <TableHead>Tot</TableHead>
                <TableHead>Del</TableHead>
              </TableRow>
            </TableHeader>
          </Table>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <Table>
            <TableBody>
              {cart.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-slate-500 py-4">
                    No items in cart
                  </TableCell>
                </TableRow>
              ) : (
                cart.map((item) => (
                  <TableRow key={item.id} className="text-sm">
                    <TableCell>{item.sku || item.barcode || item.id}</TableCell>
                    <TableCell className="truncate max-w-[120px]">{item.name}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{item.price.toFixed(2)}</TableCell>
                    <TableCell>{(item.price * item.quantity).toFixed(2)}</TableCell>

                    {/* Delete Button */}
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Totals */}
      <Card className="p-4 mt-3 border border-slate-300 shadow-sm">

        <div className="flex justify-between text-sm mb-1">
          <span>Subtotal:</span>
          <span className="font-medium text-slate-800">ZMW {subtotal.toFixed(2)}</span>
        </div>

        <div className="flex justify-between text-sm mb-1">
          <span>Tax:</span>
          <span className="font-medium text-slate-800">ZMW {tax.toFixed(2)}</span>
        </div>

        <div className="flex justify-between font-bold text-base border-t pt-2 mt-2">
          <span>Total:</span>
          <span className="text-slate-900">ZMW {total.toFixed(2)}</span>
        </div>

        <div className="flex justify-between font-bold text-lg text-emerald-700 border-t pt-2 mt-3">
          <span>Change:</span>
          <span>ZMW {Number(change).toFixed(2)}</span>
        </div>
      </Card>

      {/* Process Payment */}
      <div className="mt-3 flex">
        <Button
          onClick={() => openPaymentModal?.()}   // <-- SAME AS SidebarRight
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-4"
        >
          PROCESS PAYMENT
        </Button>
      </div>
    </div>
  );
}
