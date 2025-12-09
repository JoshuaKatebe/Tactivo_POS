import { useState, useEffect } from "react";
import Header from "./components/Header";
import ProductsPanel from "./components/ProductsPanel";
import TransactionPanel from "./components/TransactionPanel";
import SidebarRight from "./components/SidebarRight";
import Toast from "./components/Toast";
import BackOfficeModal from "./components/BackOfficeModal";
import BarcodeScanner from "./components/BarcodeScanner";
import HandoverPanel from "./components/HandoverPanel";
import HandoverClearModal from "./components/HandoverClearModal";
import { PUMPS_MOCK } from "../pumps/pumps.mock.js";
import { CreditCard, Smartphone, Phone, DollarSign, Wallet, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { shopApi } from "@/api/shop";
import { pumpsApi } from "@/api/pumps";
import { fuelApi, fuelTransactionsApi } from "@/api/fuel";
import { handoversApi } from "@/api/handovers";
import { useStation } from "@/context/StationContext";
import { useAuth } from "@/context/AuthContext";
import { authApi } from "@/api/auth";

export default function Pos() {
  const navigate = useNavigate();
  const { currentStation } = useStation();
  const { employee, user } = useAuth();

  const [authModal, setAuthModal] = useState({
    visible: false,
    type: null,
    itemId: null,
  });

  const [managerUser, setManagerUser] = useState("");
  const [managerPass, setManagerPass] = useState("");
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
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState(null);

  // Load pumps from API
  const [pumps, setPumps] = useState([]);
  const [pumpsLoading, setPumpsLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false);

  // Handover state
  const [pendingHandovers, setPendingHandovers] = useState([]);
  const [showHandoverPanel, setShowHandoverPanel] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);
  const [selectedHandover, setSelectedHandover] = useState(null);
  const [handoverTransactions, setHandoverTransactions] = useState([]);
  const [clearingHandover, setClearingHandover] = useState(false);

  // Fetch products from API
  useEffect(() => {
    const loadProducts = async () => {
      if (!currentStation?.id) {
        setProductsLoading(false);
        return;
      }

      try {
        setProductsLoading(true);
        setProductsError(null);
        const data = await shopApi.getProducts({
          station_id: currentStation.id,
          active: true,
        });

        // Transform API products to match expected format
        const transformedProducts = data.map((product) => ({
          id: product.id,
          name: product.name,
          price: parseFloat(product.price || 0),
          category: "stock", // Default category, you may want to add category to your product model
          icon: "📦", // Default icon, you may want to add icon to your product model
          sku: product.sku,
          stock_qty: product.stock_qty || 0,
          unit: product.unit,
        }));

        setProducts(transformedProducts);
      } catch (error) {
        console.error("Error loading products:", error);
        setProductsError(error.message || "Failed to load products");
        showToast("Failed to load products. Using cached data.", "error");
      } finally {
        setProductsLoading(false);
      }
    };

    loadProducts();
  }, [currentStation?.id]);

  // Load pumps from API
  useEffect(() => {
    const loadPumps = async () => {
      if (!currentStation?.id) {
        setPumpsLoading(false);
        return;
      }

      try {
        setPumpsLoading(true);
        const pumpConfigs = await pumpsApi.getAll({
          station_id: currentStation.id,
          active: true,
        });

        const transactions = await fuelTransactionsApi.getAll({
          station_id: currentStation.id,
          synced: false,
          limit: 1000,
        });

        const transformedPumps = pumpConfigs.map((pumpConfig) => {
          const pumpTransactions = transactions.filter(
            (tx) => tx.pump_id === pumpConfig.id || tx.pump_number === pumpConfig.pump_number
          );

          const formattedTransactions = pumpTransactions.map((tx) => ({
            id: tx.id,
            nozzle: tx.nozzle_number || tx.nozzle || 1,
            amount: parseFloat(tx.amount || tx.total_amount || 0),
            volume: parseFloat(tx.volume || tx.liters || 0),
            time: tx.created_at ? new Date(tx.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '--:--',
            status: tx.synced ? "cleared" : "pending",
            attendant: tx.attendant || tx.employee_name || "Unknown",
            pricePerL: tx.price_per_liter || pumpConfig.price || 0,
          }));

          const nozzles = (pumpConfig.nozzles || []).map((nozzle) => {
            const currentTx = formattedTransactions.find(
              (t) => t.nozzle === nozzle.number && t.status === "pending"
            );

            return {
              number: nozzle.number,
              status: currentTx ? "filling" : "idle",
              currentSale: currentTx?.amount || 0,
              currentLiters: currentTx?.volume || 0,
              attendant: currentTx?.attendant || null,
            };
          });

          return {
            id: pumpConfig.id,
            name: pumpConfig.name || `Pump ${pumpConfig.pump_number}`,
            grade: pumpConfig.grade || "Unknown",
            price: pumpConfig.price || 0,
            nozzles: nozzles.length > 0 ? nozzles : [
              { number: 1, status: "idle", currentSale: 0, currentLiters: 0, attendant: null },
              { number: 2, status: "idle", currentSale: 0, currentLiters: 0, attendant: null },
            ],
            transactions: formattedTransactions,
          };
        });

        setPumps(transformedPumps);
      } catch (error) {
        console.error("Error loading pumps:", error);
        setPumps([]);
      } finally {
        setPumpsLoading(false);
      }
    };

    loadPumps();

    // Poll for live status updates
    const interval = setInterval(async () => {
      try {
        const liveStatuses = await fuelApi.getPumps();
        if (liveStatuses && Object.keys(liveStatuses).length > 0) {
          setPumps((prevPumps) => {
            return prevPumps.map((pump) => {
              const pumpNumber = pump.pump_number || parseInt(pump.id.replace('pump-', '')) || null;
              if (!pumpNumber) return pump;

              const liveStatus = liveStatuses[pumpNumber];
              if (!liveStatus) return pump;

              const updatedNozzles = pump.nozzles.map((nozzle) => {
                const isActive = liveStatus.Nozzle === nozzle.number &&
                  (liveStatus.Status === 'Filling' || liveStatus.Status === 'EndOfTransaction');

                return {
                  ...nozzle,
                  status: isActive ? "filling" : nozzle.status === "filling" ? "idle" : nozzle.status,
                  currentSale: liveStatus.Amount || nozzle.currentSale,
                  currentLiters: liveStatus.Volume || nozzle.currentLiters,
                };
              });

              return {
                ...pump,
                nozzles: updatedNozzles,
              };
            });
          });
        }
      } catch (error) {
        console.error("Error polling pump statuses:", error);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [currentStation?.id]);

  // Poll for pending handovers every 3 seconds
  useEffect(() => {
    const fetchPendingHandovers = async () => {
      if (!currentStation?.id) return;

      try {
        const handovers = await handoversApi.getPending({
          station_id: currentStation.id,
          sort_by: 'handover_time',
        });
        setPendingHandovers(handovers || []);
      } catch (error) {
        console.error('Error fetching pending handovers:', error);
      }
    };

    fetchPendingHandovers();

    const interval = setInterval(fetchPendingHandovers, 3000);
    return () => clearInterval(interval);
  }, [currentStation?.id]);

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

  // Called when cashier clicks Clear on an attendant (from ProductsPanel)
  // pump param may be a single pump object OR an object { pumpIds: [...] } when aggregated across pumps
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

    // prefill amountPaid (adds to any existing paid)
    setAmountPaid((prev) => Number(prev || 0) + Number(amount || 0));
    setSelectedPayment("cash");
    showToast(`Prepared clearance for ${attendant}: ZMW ${Number(amount).toFixed(2)}`);
  };

  // process payment -> create sale via API and handle pump clears
  const processPayment = async () => {
    if (cart.length === 0) return showToast("Cart is empty", "error");
    if (!selectedPayment) return showToast("Select a payment method", "error");
    if (selectedPayment === "cash" && amountPaid < total)
      return showToast(`Insufficient payment. Required: ${total.toFixed(2)}`, "error");

    if (!currentStation?.id) {
      return showToast("No station selected", "error");
    }

    setProcessingPayment(true);

    try {
      // Separate regular products from pump clear items
      const regularItems = cart.filter(item => !item.meta?.pumpClear);
      const pumpClearItems = cart.filter(item => item.meta?.pumpClear);

      // Create sale for regular shop products
      if (regularItems.length > 0) {
        const saleItems = regularItems.map(item => ({
          product_id: item.id,
          qty: item.quantity,
          unit_price: item.price,
          line_total: item.price * item.quantity,
        }));

        const payments = [{
          type: selectedPayment === "cash" ? "cash" :
            selectedPayment === "loyalty" ? "card" :
              selectedPayment === "credit" ? "airtel_money" :
                selectedPayment === "carlot" ? "mtn_money" :
                  selectedPayment === "account" ? "zamtel_money" :
                    selectedPayment === "cheque" ? "cheque" : "cash",
          amount: total,
        }];

        await shopApi.createSale({
          station_id: currentStation.id,
          employee_id: employee?.id || null,
          total_amount: total,
          items: JSON.stringify(saleItems),
          payments: JSON.stringify(payments),
        });
      }

      // Handle pump clear items (update local state)
      if (pumpClearItems.length > 0) {
        const idsToClearByPump = {};

        // collect ids keyed by pump id
        pumpClearItems.forEach(item => {
          const ids = item.meta.transactionIds || [];
          const pumpIds = item.meta.pumpIds || (item.meta.pumpId ? [item.meta.pumpId] : []);
          pumpIds.forEach(pid => {
            if (!idsToClearByPump[pid]) idsToClearByPump[pid] = new Set();
            ids.forEach(id => idsToClearByPump[pid].add(id));
          });
        });

        // mutate local pumps state
        const updatedPumps = pumps.map(pump => {
          const idsSet = idsToClearByPump[pump.id];
          if (!idsSet) return pump;
          const idsArray = Array.from(idsSet);
          return {
            ...pump,
            transactions: pump.transactions.map(t => idsArray.includes(t.id) ? { ...t, status: "cleared" } : t)
          };
        });

        setPumps(updatedPumps);

        // Mark transactions as synced in the API
        try {
          await Promise.all(
            Object.values(idsToClearByPump).flatMap(idsSet =>
              Array.from(idsSet).map(id => fuelTransactionsApi.markSynced(id))
            )
          );
        } catch (error) {
          console.error("Error syncing transactions:", error);
        }
      }

      showToast(`Payment successful via ${selectedPayment}. Total: ${total.toFixed(2)}`, "success");
      // clear UI
      clearAll();
    } catch (error) {
      console.error("Error processing payment:", error);
      showToast(`Payment failed: ${error.message || "Unknown error"}`, "error");
    } finally {
      setProcessingPayment(false);
    }
  };

  const handlePrintReceipt = () => {
    if (cart.length === 0) {
      showToast("No recent sale to print", "error");
      return;
    }
    showToast("Printing receipt...", "success");
    window.print();
  };

  // Request to remove item from cart (DIRECT - NO AUTH)
  const requestRemoveItem = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
    showToast("Item removed from cart");
  };

  const confirmAuthorization = async (user, pass) => {
    try {
      const response = await authApi.login(user, pass);
      const roles = response?.employee?.roles || [];
      const hasManagerRole = roles.some(r => r.name === "Manager" || r.name === "Store Manager");

      if (hasManagerRole) {
        if (authModal.type === "remove-item") {
          // Note: Removing item is now public, but keeping logic in case we revert or re-use
          setCart((prev) => prev.filter((item) => item.id !== authModal.itemId));
          showToast("Item removed by manager authorization", "success");
        }
        if (authModal.type === "backoffice") {
          navigate("/frontdesk/dashboard");
        }

        setAuthModal({ visible: false, type: null, itemId: null });
        setManagerUser("");
        setManagerPass("");
        setAuthError("");
        return;
      } else {
        setAuthError("User does not have Manager privileges");
      }
    } catch (error) {
      setAuthError("Invalid credentials");
    }

    setShake(true);
    setTimeout(() => setShake(false), 600);
  };

  const handleBarcodeScanned = (barcode) => {
    // Find product by SKU
    const product = products.find(p => p.sku === barcode);

    if (product) {
      addToCart(product);
      showToast(`${product.name} added via barcode scanner`, "success");
    } else {
      showToast(`No product found with SKU: ${barcode}`, "error");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/", { replace: true });
  };

  // Handover handlers
  const handleOpenhandoverPanel = () => {
    setShowHandoverPanel(true);
  };

  const handleQuickClear = async (handover) => {
    try {
      // Fetch handover details with transactions
      const details = await handoversApi.getDetails(handover.id);
      setSelectedHandover(handover);
      setHandoverTransactions(details.transactions || []);
      setShowClearModal(true);
    } catch (error) {
      console.error('Error fetching handover details:', error);
      showToast('Failed to load handover details', 'error');
    }
  };

  const handleConfirmClear = async (clearanceData) => {
    if (!selectedHandover || !employee?.id) {
      showToast('Missing cashier or handover information', 'error');
      return;
    }

    setClearingHandover(true);

    try {
      await handoversApi.clearHandover(selectedHandover.id, {
        cashier_employee_id: employee.id,
        ...clearanceData,
      });

      showToast(`Handover cleared successfully: ZMW ${clearanceData.amount_cashed.toFixed(2)}`, 'success');

      // Close modals and refresh handovers
      setShowClearModal(false);
      setShowHandoverPanel(false);
      setSelectedHandover(null);
      setHandoverTransactions([]);

      // Refresh pending handovers
      const handovers = await handoversApi.getPending({
        station_id: currentStation.id,
        sort_by: 'handover_time',
      });
      setPendingHandovers(handovers || []);
    } catch (error) {
      console.error('Error clearing handover:', error);
      showToast(`Failed to clear handover: ${error.message || 'Unknown error'}`, 'error');
    } finally {
      setClearingHandover(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-[#0d2b5c] to-[#1a3d7c] text-white">
      <Header
        currentCategory={currentCategory}
        setCurrentCategory={setCurrentCategory}
        onBackOfficeRequest={() => setAuthModal({ visible: true, type: "backoffice", itemId: null })}
        onScannerRequest={() => setShowBarcodeScanner(true)}
        stationName={currentStation?.name}
        companyName={currentStation?.company_name}
        userName={employee?.first_name || user?.username || "Guest"}
        handoverCount={pendingHandovers.length}
        onHandoverClick={handleOpenhandoverPanel}
      />

      <div className="flex flex-1 overflow-hidden">
        {productsLoading ? (
          <div className="w-1/2 flex items-center justify-center">
            <div className="text-center">
              <div className="text-lg mb-2">Loading products...</div>
              <div className="text-sm text-gray-400">Please wait</div>
            </div>
          </div>
        ) : productsError ? (
          <div className="w-1/2 flex items-center justify-center">
            <div className="text-center text-red-400">
              <div className="text-lg mb-2">Error loading products</div>
              <div className="text-sm">{productsError}</div>
            </div>
          </div>
        ) : (
          <ProductsPanel
            products={products}
            addToCart={addToCart}
            currentCategory={currentCategory}
            pumps={pumps}
            onClearAttendant={handleClearFromPump}
            stationId={currentStation?.id}
            cashierEmployeeId={employee?.id}
            onShowToast={showToast}
          />
        )}
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
          processingPayment={processingPayment}
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
          onLogout={handleLogout}
          pumps={pumps}
          onClearTransaction={handleClearFromPump}
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
                onClick={async () => {
                  if (!selectedPayment) {
                    showToast("Select a payment method first", "error");
                    return;
                  }
                  if (selectedPayment !== "cash") {
                    setAmountPaid(Number(total));
                  }
                  closePaymentModal();
                  await processPayment();
                }}
                disabled={processingPayment}
                className="px-4 py-2 bg-green-600 text-white rounded shadow disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processingPayment ? "Processing..." : "Confirm & Pay"}
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

      {/* Barcode Scanner Modal */}
      <BarcodeScanner
        isOpen={showBarcodeScanner}
        onClose={() => setShowBarcodeScanner(false)}
        onScan={handleBarcodeScanned}
      />

      {/* New Back Office Modal */}
      <BackOfficeModal
        visible={authModal.visible}
        onClose={() => {
          setAuthModal({ visible: false, type: null, itemId: null });
          setManagerUser("");
          setManagerPass("");
          setAuthError("");
        }}
        onAuthorize={(user, pass) => {
          setManagerUser(user);
          setManagerPass(pass);
          confirmAuthorization(user, pass);
        }}
        authError={authError}
        shake={shake}
      />

      {/* Handover Panel */}
      <HandoverPanel
        isOpen={showHandoverPanel}
        onClose={() => setShowHandoverPanel(false)}
        handovers={pendingHandovers}
        onQuickClear={handleQuickClear}
        onRefresh={async () => {
          if (currentStation?.id) {
            const handovers = await handoversApi.getPending({
              station_id: currentStation.id,
              sort_by: 'handover_time',
            });
            setPendingHandovers(handovers || []);
          }
        }}
      />

      {/* Handover Clear Modal */}
      <HandoverClearModal
        isOpen={showClearModal}
        onClose={() => {
          setShowClearModal(false);
          setSelectedHandover(null);
          setHandoverTransactions([]);
        }}
        handover={selectedHandover}
        transactions={handoverTransactions}
        onConfirm={handleConfirmClear}
        loading={clearingHandover}
      />

    </div>
  );
}
