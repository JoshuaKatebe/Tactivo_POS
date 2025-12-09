export class Pump {
  constructor(id, status = "OFFLINE") {
    this.id = id;
    this.status = status;
    this.volume = 0;
    this.amount = 0;
    this.nozzle = 0;
    this.price = 0;
    this.grades = Array.from({ length: 6 }, () => ({ name: "", price: 0 }));
  }
}
