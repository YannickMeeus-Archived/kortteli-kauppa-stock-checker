import { Product } from "./product";

export interface CabinetItem {
  amount: number; // How many items are currently held in this location
  barcode: string; // Internal Barcode
  epc: string; // Unique global identifier for this particular product
  location: string; // Which cabinet in the current location does this exist in
  product: Product; // Additional product details
}
