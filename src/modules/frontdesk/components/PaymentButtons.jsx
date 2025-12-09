// PaymentButtons.jsx
import React from "react";
import { Button } from "@/components/ui/button";
import { CreditCard, Smartphone, Wallet } from "lucide-react";

/**
 * PaymentButtons - presents method buttons (touch friendly)
 */
export default function PaymentButtons({ onPay = () => {} }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <Button className="bg-emerald-500 h-12" onClick={() => onPay("cash")}>Cash</Button>
      <Button className="bg-blue-600 h-12" onClick={() => onPay("card")}><CreditCard className="inline-block mr-2" />Card</Button>
      <Button className="bg-indigo-600 h-12" onClick={() => onPay("airtel")}><Smartphone className="inline-block mr-2" />Airtel Money</Button>
      <Button className="bg-rose-600 h-12" onClick={() => onPay("mtn")}><Wallet className="inline-block mr-2" />MTN/Zamtel</Button>
    </div>
  );
}
