export function simulatePTS(request) {
  return new Promise((resolve) => {
    setTimeout(() => {

      const response = {
        Error: false,
        Packets: []
      };

      request.Packets.forEach(packet => {
        switch (packet.Type) {

          case "PumpGetStatus":
            response.Packets.push({
              Type: "PumpIdleStatus",
              Data: {
                Pump: packet.Data.Pump,
                NozzleUp: 0,
                LastPrice: 23.45,
                LastVolume: 0,
                LastAmount: 0,
                Request: "",
                User: "demo_attendant"
              }
            });
            break;

          case "PumpAuthorize":
            response.Packets.push({
              Type: "PumpFillingStatus",
              Data: {
                Pump: packet.Data.Pump,
                Transaction: Math.floor(Math.random()*10000),
                Nozzle: packet.Data.Nozzle,
                Volume: (Math.random()*2).toFixed(2),
                Amount: (Math.random()*50).toFixed(2),
                Price: packet.Data.Price,
                User: "demo_attendant"
              }
            });
            break;

          case "PumpStop":
            response.Packets.push({
              Type: "PumpIdleStatus",
              Data: {
                Pump: packet.Data.Pump,
                NozzleUp: 0,
                LastPrice: 23.45,
                LastVolume: (Math.random()*5).toFixed(2),
                LastAmount: (Math.random()*100).toFixed(2),
                Request: "",
                User: "demo_attendant"
              }
            });
            break;

          default:
            response.Packets.push({ Type: packet.Type, Data: packet.Data });
        }
      });

      resolve(response);
    }, 800);
  });
}
