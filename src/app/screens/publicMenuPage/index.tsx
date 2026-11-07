import React, { useEffect, useMemo, useState } from "react";
import { Box, Drawer, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import RoomServiceRoundedIcon from "@mui/icons-material/RoomServiceRounded";
import MenuService, { MenuItem } from "../../services/MenuService";
import { useLanguage } from "../../context/LanguageContext";
import LanguageSwitcher from "../../components/headers/LanguageSwitcher";
import DarkModeToggle from "../../components/headers/DarkModeToggle";
import { CURRENCY_SYMBOL, RESTAURANT_NAME, serverApi } from "../../../lib/config";
import "../../../css/mobile/navbar.css";
import "../../../css/mobile/products.css";
import "../../../css/publicMenu.css";

const CATEGORIES = ["ALL", "DISH", "SALAD", "DESSERT", "DRINK", "OTHER"];
const categoryKey: Record<string, string> = {
  ALL: "allCategories",
  DISH: "dish",
  SALAD: "salad",
  DESSERT: "dessert",
  DRINK: "drink",
  OTHER: "other",
};
const sizeKey: Record<string, string> = {
  SMALL: "sizeSmall",
  NORMAL: "sizeNormal",
  LARGE: "sizeLarge",
  SET: "sizeSet",
};

const imageUrl = (path?: string) => (path ? `${serverApi}/${path}` : "");

/**
 * Stoldagi QR kod ochadigan sahifa: mijoz faqat menyuni ko'radi.
 * Savat, buyurtma, stollar va boshqa sahifalarga havola yo'q.
 */
export default function PublicMenuPage() {
  const { t } = useLanguage();
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("ALL");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<MenuItem | null>(null);

  useEffect(() => {
    new MenuService()
      .getMenu()
      .then(setItems)
      .catch((err) => console.log("getMenu:", err))
      .finally(() => setLoading(false));
  }, []);

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter(
      (i) =>
        (category === "ALL" || i.productCollection === category) &&
        (!q || i.productName.toLowerCase().includes(q))
    );
  }, [items, category, search]);

  // Faqat menyuda bor kategoriyalar ko'rsatiladi
  const categories = useMemo(
    () => CATEGORIES.filter((c) => c === "ALL" || items.some((i) => i.productCollection === c)),
    [items]
  );

  const sizeLabel = (item: MenuItem) =>
    item.productCollection === "DRINK"
      ? `${item.productVolume ?? 1} ${t("volumeLitre")}`
      : t(sizeKey[item.productSize ?? "NORMAL"] ?? "sizeNormal");

  return (
    <div className="public-menu">
      <header className="other-navbar mobile-navbar public-menu-header">
        <div className="navbar-container public-menu-header-inner">
          <img className="mobile-navbar-logo" src="/icons/zomin.svg" alt={RESTAURANT_NAME} />
          <div className="public-menu-header-actions">
            <LanguageSwitcher />
            <DarkModeToggle />
          </div>
        </div>
      </header>

      <div className="mobile-products-page public-menu-body">
        <Box className="mobile-products-hero">
          <span className="mobile-products-hero-kicker">{RESTAURANT_NAME}</span>
          <h1 className="mobile-products-hero-title">{t("menu")}</h1>
          <p className="public-menu-subtitle">{t("menuSubtitle")}</p>
        </Box>

        <div className="public-menu-note">
          <RoomServiceRoundedIcon fontSize="small" />
          <span>{t("menuOnlyNote")}</span>
        </div>

        <Box className="mobile-products-search">
          <Box className="mobile-search-container">
            <input
              type="search"
              placeholder={t("searchDishes")}
              className="mobile-search-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <IconButton className="mobile-search-button" aria-label={t("search")}>
              <SearchIcon />
            </IconButton>
          </Box>
        </Box>

        <Box className="mobile-category-section">
          <Box className="mobile-category-scroll">
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                className={`public-menu-chip${category === c ? " active" : ""}`}
                onClick={() => setCategory(c)}
              >
                {t(categoryKey[c])}
              </button>
            ))}
          </Box>
        </Box>

        <Box className="mobile-products-container">
          {loading ? (
            <div className="public-menu-loading" aria-busy="true" />
          ) : visible.length === 0 ? (
            <Box className="mobile-no-products">
              <span>{t("noProducts")}</span>
            </Box>
          ) : (
            <Box className="mobile-products-grid">
              {visible.map((item) => (
                <button
                  type="button"
                  key={item._id}
                  className="mobile-product-card public-menu-card"
                  onClick={() => setSelected(item)}
                >
                  <Box className="mobile-product-image-container">
                    <img
                      src={imageUrl(item.productImages?.[0])}
                      alt={item.productName}
                      className="mobile-product-image"
                      loading="lazy"
                    />
                    <span className="public-menu-size">{sizeLabel(item)}</span>
                  </Box>
                  <Box className="mobile-product-info">
                    <span className="mobile-product-name public-menu-name">{item.productName}</span>
                    <span className="mobile-product-price">
                      {CURRENCY_SYMBOL}
                      {Number(item.productPrice).toLocaleString("en-US")}
                    </span>
                  </Box>
                </button>
              ))}
            </Box>
          )}
        </Box>

        <footer className="public-menu-footer">
          © {new Date().getFullYear()} {RESTAURANT_NAME}
        </footer>
      </div>

      <Drawer
        anchor="bottom"
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        PaperProps={{ className: "public-menu-sheet" }}
      >
        {selected && (
          <div className="public-menu-sheet-inner">
            <div
              className="public-menu-sheet-img"
              style={{ backgroundImage: `url(${imageUrl(selected.productImages?.[0])})` }}
            >
              <IconButton className="public-menu-sheet-close" onClick={() => setSelected(null)} aria-label="Close">
                <CloseIcon />
              </IconButton>
            </div>
            <div className="public-menu-sheet-body">
              <h2>{selected.productName}</h2>
              <div className="public-menu-sheet-row">
                <span className="public-menu-sheet-price">
                  {CURRENCY_SYMBOL}
                  {Number(selected.productPrice).toLocaleString("en-US")}
                </span>
                <span className="public-menu-sheet-size">{sizeLabel(selected)}</span>
              </div>
              <h3>{t("description")}</h3>
              <p>{selected.productDesc || t("noDescription")}</p>
              <div className="public-menu-note in-sheet">
                <RoomServiceRoundedIcon fontSize="small" />
                <span>{t("menuOnlyNote")}</span>
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
}
