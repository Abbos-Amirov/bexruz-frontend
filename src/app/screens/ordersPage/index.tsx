import { useEffect, useState } from "react";
import { Container, Stack, Box, TextField } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PausedOrders from "./PausedOrders";
import ProcessOrders from "./ProcessOrders";
import FinishedOrders from "./FinishedOrders";
import Divider from "../../components/divider";
import { Dispatch } from "@reduxjs/toolkit";
import { Order, OrderInquiry } from "../../../lib/types/order";
import {
  setFinishedOrders,
  setPausedOrders,
  setPendingOrders,
  setProcessOrders,
} from "./slice";
import { useDispatch } from "react-redux";
import { OrderStatus } from "../../../lib/enums/order.enum";
import OrderService from "../../services/OrderService";
import { useGlobals } from "../../hooks/useGlobals";
import { useHistory } from "react-router-dom";
import "../../../css/order.css";
import { serverApi } from "../../../lib/config";
import { MemberType } from "../../../lib/enums/member.enum";
import useDeviceDetect from "../../hooks/useDeviceDetect";
import "../../../css/mobile/order.css";

/** REDUX SLICE & SELECTOR */
const actionDispatch = (dispatch: Dispatch) => ({
  setPausedOrders: (data: Order[]) => dispatch(setPausedOrders(data)),
  setPendingOrders: (data: Order[]) => dispatch(setPendingOrders(data)),
  setProcessOrders: (data: Order[]) => dispatch(setProcessOrders(data)),
  setFinishedOrders: (data: Order[]) => dispatch(setFinishedOrders(data)),
});

interface OrdersPageProps {
  callHandler: (id: string) => void;
}

export default function OrdersPage(props: OrdersPageProps) {
  const {
    setFinishedOrders,
    setPausedOrders,
    setProcessOrders,
    setPendingOrders,
  } = actionDispatch(useDispatch());
  const { callHandler } = props;
  const { orderBulder, authMember, authTable } = useGlobals();
  const history = useHistory();
  const device = useDeviceDetect();
  const [orderInquiry, setOrderInquiry] = useState<OrderInquiry>({
    page: 1,
    limit: 5,
    orderStatus: OrderStatus.PAUSE,
  });

  // TABLE & USER
  const finishedOrder = authMember ? OrderStatus.COMPLETED : OrderStatus.SERVED;

  useEffect(() => {
    const order = new OrderService();

    order
      .getMyOrders({ ...orderInquiry, orderStatus: OrderStatus.PAUSE })
      .then((data) => setPausedOrders(data))
      .catch((err) => console.log(err));

    order
      .getMyOrders({
        ...orderInquiry,
        orderStatus: OrderStatus.PENDING,
      })
      .then((data) => setPendingOrders(data))
      .catch((err) => console.log(err));

    order
      .getMyOrders({
        ...orderInquiry,
        orderStatus: OrderStatus.PROCESS,
      })
      .then((data) => setProcessOrders(data))
      .catch((err) => console.log(err));

    order
      .getMyOrders({ ...orderInquiry, orderStatus: finishedOrder })
      .then((data) => setFinishedOrders(data))
      .catch((err) => console.log(err));
  }, [orderInquiry, orderBulder]);

  if (device === "mobile") {
    return (
      <div className="mobile-orders-page">
        <Box className="mobile-orders-container">
          <PausedOrders />
          <ProcessOrders callHandler={callHandler} />
          <FinishedOrders />
        </Box>
      </div>
    );
  }

  return (
    <div className="order-page">
      <Container className="order-container">
        <Stack className="order-left">
          <Stack className="order-main-content">
            <PausedOrders />
            <ProcessOrders callHandler={callHandler} />
            <FinishedOrders />
          </Stack>
        </Stack>

        <Stack className="order-right">
          <Box className="order-info-box">
            <Box className="member-box">
              <div className="order-user-img">
                <img
                  src={
                    authMember?.memberImage
                      ? `${serverApi}/${authMember?.memberImage}`
                      : authTable
                      ? "/img/table.jpg"
                      : "/icons/default-user.svg"
                  }
                  className="order-user-avatar"
                />
                <div className="order-user-icon-box">
                  <img
                    src={
                      authMember?.memberType === MemberType.RESTAURANT
                        ? "/icons/restaurant.svg"
                        : "/icons/user-badge.svg"
                    }
                    className="order-user-prof-img"
                  />
                </div>
              </div>
              <span className="order-user-name">
                {authMember?.memberNick ?? authTable?.tableNumber}
              </span>
              <span className="order-user-prof">
                {authMember?.memberType ?? "TABLE"}
              </span>
              <Box className="user-location">
                <Divider width="250" height="1" bg="#999" />
                <LocationOnIcon />
                <span>
                  {authMember?.memberAddress
                    ? authMember.memberAddress
                    : "Do not exist"}
                </span>
              </Box>
            </Box>
          </Box>

          <Box className="payment-card">
            <TextField
              variant="outlined"
              fullWidth
              placeholder="Card number : 5243 4090 2002 7495"
              className="input-field"
            />
            <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
              <TextField
                placeholder="07 / 24"
                className="input-field"
                fullWidth
              />
              <TextField
                placeholder="CVV : 010"
                className="input-field"
                fullWidth
              />
            </Stack>
            <TextField
              variant="outlined"
              fullWidth
              placeholder="Jay Robertson"
              className="input-field name-input"
              sx={{ mt: 2 }}
            />

            <Box className="payment-methods">
              <img src="/icons/western-card.svg" />
              <img src="/icons/master-card.svg" />
              <img src="/icons/paypal-card.svg" />
              <img src="/icons/visa-card.svg" />
            </Box>
          </Box>
        </Stack>
      </Container>
    </div>
  );
}
