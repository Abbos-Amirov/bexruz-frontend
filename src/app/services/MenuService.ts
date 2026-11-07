import axios from "axios";
import { serverApi } from "../../lib/config";

export interface MenuItem {
  _id: string;
  productName: string;
  productPrice: number;
  productCollection: string;
  productSize?: string;
  productVolume?: number;
  productDesc?: string;
  productImages: string[];
}

/** Mijozlar uchun ochiq menyu — faqat o'qish (login/token kerak emas) */
class MenuService {
  public async getMenu(): Promise<MenuItem[]> {
    const result = await axios.get(`${serverApi}/menu/products`);
    return Array.isArray(result.data) ? result.data : [];
  }
}

export default MenuService;
