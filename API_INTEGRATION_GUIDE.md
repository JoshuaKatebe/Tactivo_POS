# API Integration Guide

This guide details the API endpoints and real-time events required to integrate the **Pumps** and **Tanks** dashboards.

## Base URL
-   REST API: `http://<server-ip>:3000/api`
-   WebSocket: `ws://<server-ip>:3000/ws`

---

## ⛽ Pumps Dashboard Integration

### 1. Initial Load: Get All Pump Statuses
Fetch the current state of all pumps when the dashboard loads.

-   **Endpoint**: `GET /fuel/pumps`
-   **Response**:
    ```json
    {
        "error": false,
        "data": {
            "1": { "Pump": 1, "Status": "Idle", "Nozzle": 1, "Price": 1.65, "Volume": 0, "Amount": 0 },
            "2": { "Pump": 2, "Status": "Filling", "Nozzle": 2, "Price": 1.70, "Volume": 15.4, "Amount": 26.18 }
        }
    }
    ```

### 2. Actions: Control Pumps
Perform actions on a specific pump.

#### Authorize Pump
-   **Endpoint**: `POST /fuel/pumps/{pumpNumber}/authorize`
-   **Body**:
    ```json
    {
        "nozzleNumber": 1,
        "presetType": "Volume",  // Optional: "Volume" or "Amount"
        "presetDose": 20.0,      // Optional: Target volume or amount
        "price": 1.65            // Optional: Unit price
    }
    ```

#### Stop Pump
-   **Endpoint**: `POST /fuel/pumps/{pumpNumber}/stop`

#### Emergency Stop
-   **Endpoint**: `POST /fuel/pumps/{pumpNumber}/emergency-stop`

### 3. Real-time Updates (WebSocket)
Listen for status changes to update the UI instantly without polling.

-   **Event: Pump Status Update**
    ```json
    {
        "type": "pumpStatus",
        "data": {
            "pump": 1,
            "status": {
                "Pump": 1,
                "Status": "Filling",  // Idle, Calling, Authorize, Filling, EndOfTransaction
                "Nozzle": 1,
                "Volume": 10.5,
                "Amount": 17.32,
                "Price": 1.65
            }
        }
    }
    ```

-   **Event: Transaction Complete**
    ```json
    {
        "type": "transaction",
        "data": {
            "pump": 1,
            "transaction": 12345,
            "data": {
                "Volume": 20.0,
                "Amount": 33.00,
                "Price": 1.65,
                "Date": "2025-12-07T16:00:00"
            }
        }
    }
    ```

---

## 🛢️ Tanks Dashboard Integration

### 1. Initial Load: Get Tank Levels
Fetch the current levels, volume, and temperature of all tanks.

-   **Endpoint**: `GET /fuel/tanks`
-   **Response**:
    ```json
    {
        "error": false,
        "data": {
            "1": {
                "Probe": 1,
                "FuelGradeName": "Petrol",
                "ProductHeight": 1200,      // mm
                "ProductVolume": 8500,      // Liters
                "WaterHeight": 12,          // mm
                "Temperature": 26.3,        // Celsius
                "TankFillingPercentage": 85
            },
            "2": { ... }
        }
    }
    ```

### 2. Real-time Updates (WebSocket)
Receive updates when tank levels change.

-   **Event: Tank Status Update**
    ```json
    {
        "type": "tankStatus",
        "data": {
            "tank": 1,
            "status": {
                "Probe": 1,
                "ProductVolume": 8495,
                "ProductHeight": 1198,
                "Temperature": 26.3,
                "TankFillingPercentage": 84.9
            }
        }
    }
    ```

## Implementation Tips
1.  **WebSocket Connection**: Connect to `/ws` on page load. Use a heartbeat (ping/pong) or auto-reconnect logic to maintain the connection.
2.  **State Management**: Store pump/tank data in a global state (e.g., React Context or Redux). Update individual items in the store when WebSocket events arrive.
3.  **Error Handling**: Handle 4xx/5xx API errors gracefully (e.g., show a toast notification if authorization fails).
