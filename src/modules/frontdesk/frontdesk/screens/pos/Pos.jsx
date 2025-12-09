import { useState } from "react";
import Header from "./components/Header";
import ProductsPanel from "./components/ProductsPanel";
import TransactionPanel from "./components/TransactionPanel";
import SidebarRight from "./components/SidebarRight";
import Toast from "./components/Toast";
import BackOfficeModal from "./components/BackOfficeModal";
import { PUMPS_MOCK } from "../pumps/pumps.mock.js";
import { CreditCard, Smartphone, Phone, DollarSign, Wallet, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Pos() {
  const navigate = useNavigate();

  const MANAGER_USERNAME = "manager";
  const MANAGER_PASSWORD = "12345";

  const [authModal, setAuthModal] = useState({
    visible: false,
    type: null,
    itemId: null,
  });

  const [authError, setAuthError] = useState("");
  const [shake, setShake] = useState(false);

  const handleBackOfficeRequest = () => {
    setAuthModal({ visible: true, type: "backoffice", itemId: null });
  };

  const [cart, setCart] = useState([]);
  const [amountPaid, setAmountPaid] = useState(0);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [toast, setToast] = useState({ message: "", type: "success", visible: false });
  const [currentCategory, setCurrentCategory] = useState("all");

  const [products] = useState([
    { id: 1, name: "Chips", price: 25, category: "stock", icon: "🍟" },
    { id: 2, name: "Soda", price: 18, category: "stock", icon: "🥤" },
    { id: 3, name: "Chocolate Bar", price: 13, category: "stock", icon: "🍫" },
    { id: 16, name: "Petrol 95", price: 28.5, category: "fuel", icon: "⛽" },
    { id: 17, name: "Diesel", price: 26.75, category: "fuel", icon: "⛽" },
  ]);

  const [pumps] = useState(() => JSON.parse(JSON.stringify(PUMPS_MOCK)));
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const openCashDrawer = () => {
    showToast("Cash drawer opened (Safe Drop)", "success");
  };

  const openPaymentModal = () => setShowPaymentModal(true);
  const closePaymentModal = () => setShowPaymentModal(false);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const TAX_RATE = 0.16;
  const taxableAmount = cart.reduce((sum, item) => {
    const isPumpClear = !!item.meta?.pumpClear;
    const isFuelProduct = item.category === "fuel";
    const isTaxable = !isPumpClear && !isFuelProduct;
    return sum + (isTaxable ? item.price * item.quantity : 0);
  }, 0);

  const tax = taxableAmount * TAX_RATE;
  const total = subtotal + tax;
  const change = Math.max(0, Number(amountPaid || 0) - total);

  const showToast = (message, type = "success") => {
    setToast({ message, type, visible: true });
    setTimeout(() => setToast({ message: "", type, visible: false }), 3000);
  };

  const addToCart = (product) => {
    const exists = cart.find((item) => item.id === product.id);
    if (exists) {
      setCart(cart.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    showToast(`${product.name} added to cart`);
  };

  const clearCart = () => {
    setCart([]);
    showToast("Cart cleared");
  };

  const clearAll = () => {
    setCart([]);
    setAmountPaid(0);
    setSelectedPayment(null);
    showToast("All cleared");
  };

  const handleClearFromPump = (amount, attendant, pump, transactionIds = []) => {
    const pumpIds = pump?.pumpIds || (pump?.id ? [pump.id] : []);
    const nameLabel = pump?.name ? `${pump.name}` : `${attendant}`;

    const cartItemId = `pump-clear-${pumpIds.join("|")}-${attendant}-${Date.now()}`;
    const cartItem = {
      id: cartItemId,
      name: `Clear ${attendant} • ${nameLabel}`,
      price: Number(amount || 0),
      quantity: 1,
      meta: {
        pumpClear: true,
        pumpIds,
        attendant,
        transactionIds,
      },
    };

    setCart((prev) => [...prev, cartItem]);

    setAmountPaid((prev) => Number(prev || 0) + Number(amount || 0));
    setSelectedPayment("cash");
    showToast(`Prepared clearance for ${attendant}: ZMW ${Number(amount).toFixed(2)}`);
  };

  const processPayment = () => {
    if (cart.length === 0) return showToast("Cart is empty", "error");
    if (!selectedPayment) return showToast("Select a payment method", "error");
    if (selectedPayment === "cash" && amountPaid < total)
      return showToast(`Insufficient payment. Required: ${total.toFixed(2)}`, "error");

    showToast(`Payment successful via ${selectedPayment}. Total: ${total.toFixed(2)}`);
    clearAll();
  };

  const handlePrintReceipt = () => {
    if (cart.length === 0) {
      showToast("No recent sale to print", "error");
      return;
    }
    showToast("Printing receipt...", "success");
    window.print();
  };

  const requestRemoveItem = (id) => {
    setAuthModal({ visible: true, type: "remove-item", itemId: id });
  };

  const confirmAuthorization = (user, pass) => {
    if (user === MANAGER_USERNAME && pass === MANAGER_PASSWORD) {
      if (authModal.type === "remove-item") {
        setCart((prev) => prev.filter((item) => item.id !== authModal.itemId));
        showToast("Item removed by manager authorization", "success");
      }
      if (authModal.type === "backoffice") {
        navigate("/frontdesk/dashboard");
      }

      setAuthModal({ visible: false, type: null, itemId: null });
      setAuthError("");
      return;
    }

    setAuthError("Invalid manager credentials");
    setShake(true);
    setTimeout(() => setShake(false), 600);
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-[#0d2b5c] to-[#1a3d7c] text-white">
      <Header
        currentCategory={currentCategory}
        setCurrentCategory={setCurrentCategory}
        onBackOfficeRequest={() => setAuthModal({ visible: true, type: "backoffice", itemId: null })}
      />

      <div className="flex flex-1 overflow-hidden">
        <ProductsPanel
          products={products}
          addToCart={addToCart}
          currentCategory={currentCategory}
          pumps={pumps}
          onClearAttendant={handleClearFromPump}
        />
        <TransactionPanel
          cart={cart}
          subtotal={subtotal}
          tax={tax}
          total={total}
          change={change}
          clearCart={clearCart}
          processPayment={processPayment}
          openPaymentModal={openPaymentModal}
          removeItem={requestRemoveItem}
        />

        <SidebarRight
          amountPaid={amountPaid}
          setAmountPaid={setAmountPaid}
          total={total}
          selectedPayment={selectedPayment}
          setSelectedPayment={setSelectedPayment}
          clearAll={clearAll}
          showToast={showToast}
          openCashDrawer={openCashDrawer}
          printReceipt={handlePrintReceipt}
        />
      </div>

      {/* Payment Modal (UNTOUCHED) */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-lg w-full max-w-lg p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">Select Payment Method</h3>
              <button
                onClick={closePaymentModal}
                className="text-sm text-slate-500 hover:text-slate-700 px-2 py-1 rounded"
              >
                Close
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-4">
              {[
                { name: "cash", label: "Cash", Icon: DollarSign, color: "bg-emerald-500" },
                { name: "loyalty", label: "Card", Icon: CreditCard, color: "bg-blue-600" },
                { name: "credit", label: "Airtel Money", Icon: Smartphone, color: "bg-orange-500" },
                { name: "carlot", label: "MTN Money", Icon: Phone, color: "bg-yellow-600" },
                { name: "account", label: "Zamtel Money", Icon: Wallet, color: "bg-purple-600" },
                { name: "cheque", label: "Cheque", Icon: FileText, color: "bg-slate-600" },
              ].map((m) => {
                const active = selectedPayment === m.name;
                return (
                  <button
                    key={m.name}
                    onClick={() => setSelectedPayment(m.name)}
                    className={`flex flex-col items-center justify-center gap-2 p-3 rounded-lg border
                      ${active ? "ring-2 ring-indigo-500 bg-indigo-50" : "bg-white hover:bg-gray-50"}
                      transition`}
                    aria-pressed={active}
                  >
                    <div className={`w-14 h-14 rounded-md flex items-center justify-center text-white ${m.color}`}>
                      <m.Icon className="w-6 h-6" />
                    </div>
                    <div className="text-sm font-medium text-slate-800">{m.label}</div>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  if (!selectedPayment) {
                    showToast("Select a payment method first", "error");
                    return;
                  }
                  if (selectedPayment !== "cash") {
                    setAmountPaid(Number(total));
                  }
                  processPayment();
                  closePaymentModal();
                }}
                className="px-4 py-2 bg-green-600 text-white rounded shadow"
              >
                Confirm & Pay
              </button>

              <button
                onClick={closePaymentModal}
                className="px-4 py-2 bg-gray-200 text-slate-900 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast.visible && <Toast message={toast.message} type={toast.type} />}

      {/* New Back Office Modal */}
      <BackOfficeModal
        visible={authModal.visible}
        onClose={() => setAuthModal({ visible: false, type: null, itemId: null })}
        onAuthorize={confirmAuthorization}
        authError={authError}
        shake={shake}
      />

    </div>
  );
}
