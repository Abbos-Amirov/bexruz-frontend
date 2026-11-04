import { Box, Container, IconButton, Stack, Tooltip } from "@mui/material";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import { NavLink, useHistory } from "react-router-dom";
import Basket from "./Basket";
import { CartItem } from "../../../lib/types/search";
import { RESTAURANT_NAME } from "../../../lib/config";
import { useLanguage } from "../../context/LanguageContext";
import { useWaiter } from "../../context/WaiterContext";
import LanguageSwitcher from "./LanguageSwitcher";
import DarkModeToggle from "./DarkModeToggle";
import "../../../css/mobile/navbar.css";

interface OtherNavbarProps {
  cartItems: CartItem[];
  onAdd: (item: CartItem) => void;
  onRemove: (item: CartItem) => void;
  onDelete: (item: CartItem) => void;
  onDeleteAll: () => void;
}

export default function OtherNavbar(props: OtherNavbarProps) {
  const { cartItems, onAdd, onDelete, onDeleteAll, onRemove } = props;
  const { t } = useLanguage();
  const { logout } = useWaiter();
  const history = useHistory();

  const handleLogout = () => {
    onDeleteAll();
    logout();
    history.replace("/login");
  };

  return (
    <div className="other-navbar mobile-navbar">
      <Container className="navbar-container">
        <Stack className="menu">
          <Box className="mobile-navbar-left">
            <img
              className="brand-logo mobile-navbar-logo"
              src="/icons/zomin.svg"
              alt={RESTAURANT_NAME}
            />
          </Box>

          <Stack className="links mobile-navbar-right">
            <Box className={"hover-line"}>
              <NavLink to="/tables" activeClassName="underline">
                {t("tables")}
              </NavLink>
            </Box>
            <Box className={"hover-line"}>
              <NavLink to="/products" activeClassName="underline">
                {t("menu")}
              </NavLink>
            </Box>
            <Box className={"hover-line navbar-help-link"}>
              <NavLink to="/help" activeClassName="underline">
                {t("help")}
              </NavLink>
            </Box>
            <Basket
              cartItems={cartItems}
              onAdd={onAdd}
              onRemove={onRemove}
              onDelete={onDelete}
              onDeleteAll={onDeleteAll}
            />
            <LanguageSwitcher />
            <DarkModeToggle />
            <Tooltip title={t("logout")}>
              <IconButton onClick={handleLogout} aria-label={t("logout")} size="small">
                <LogoutRoundedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>
      </Container>
    </div>
  );
}
