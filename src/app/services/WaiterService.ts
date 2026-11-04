import axios, { AxiosRequestConfig } from "axios";
import { serverApi } from "../../lib/config";
import { CartItem } from "../../lib/types/search";

export const WAITER_TOKEN_KEY = "bexruz_waiter_token";

export interface WaiterTable {
  _id: string;
  tableNumber: string;
  tableStatus: "AVAILABLE" | "OCCUPIED" | "CLEANING";
  activeOrders: number;
}

export interface WaiterTableOrder {
  _id: string;
  createdAt: string;
  orderStatus: string;
  orderTotal: number;
  items: { productName: string; itemQuantity: number; itemPrice: number }[];
}

/** Afitsant API: umumiy PIN bilan olingan token Authorization header orqali yuboriladi */
class WaiterService {
  private readonly path = serverApi;

  private auth(): AxiosRequestConfig {
    const token = localStorage.getItem(WAITER_TOKEN_KEY) ?? "";
    return { headers: { Authorization: `Bearer ${token}` } };
  }

  public async login(pin: string): Promise<string> {
    const result = await axios.post(`${this.path}/waiter/login`, { pin });
    return result.data.token as string;
  }

  public async getTables(): Promise<WaiterTable[]> {
    const result = await axios.get(`${this.path}/waiter/tables`, this.auth());
    return result.data;
  }

  public async getTableOrders(tableId: string): Promise<WaiterTableOrder[]> {
    const result = await axios.get(
      `${this.path}/waiter/table/${tableId}/orders`,
      this.auth()
    );
    return result.data;
  }

  /** Narxni server bazadan oladi — faqat mahsulot va soni yuboriladi */
  public async createOrder(tableId: string, items: CartItem[]): Promise<void> {
    await axios.post(
      `${this.path}/waiter/order/create`,
      {
        tableId,
        items: items.map((i) => ({ productId: i._id, itemQuantity: i.quantity })),
      },
      this.auth()
    );
  }
}

export default WaiterService;
