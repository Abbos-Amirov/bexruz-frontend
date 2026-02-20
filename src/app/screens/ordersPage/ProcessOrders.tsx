import React from "react";
import { Box, Stack } from "@mui/material";
import Button from "@mui/material/Button";
import moment from "moment";
import { retrievePendingOrders, retrieveProcessOrders } from "./selector";
import { createSelector } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { Order, OrderItem, OrderUpdateInput } from "../../../lib/types/order";
import { Product } from "../../../lib/types/product";
import { serverApi } from "../../../lib/config";
import { useGlobals } from "../../hooks/useGlobals";
import { OrderStatus } from "../../../lib/enums/order.enum";
import OrderService from "../../services/OrderService";
import { sweetErrorHandling } from "../../../lib/sweetAlert";
import { T } from "../../../lib/types/common";
import { Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PhoneIcon from "@mui/icons-material/Phone";
import useDeviceDetect from "../../hooks/useDeviceDetect";

/** REDUX SLICE & SELECTOR */

const pendingOrdersRetriever = createSelector(
  retrievePendingOrders,
  (pendingOrders) => ({ pendingOrders })
);

const processOrdersRetriever = createSelector(
  retrieveProcessOrders,
  (processOrders) => ({ processOrders })
);

interface ProcessOrdersProps {
  callHandler: (id: string) => void;
}

export default function ProcessOrders(props: ProcessOrdersProps) {
  const { callHandler } = props;
  const { setOrderBulder, authTable } = useGlobals();
  const { processOrders } = useSelector(processOrdersRetriever);
  const { pendingOrders } = useSelector(pendingOrdersRetriever);
  const device = useDeviceDetect();

  /** HANDLERS **/
  const deleteOrderHandler = async (e: T) => {
    try {
      const orderId = e.target.value;
      const input: OrderUpdateInput = {
        orderId: orderId,
        orderStatus: OrderStatus.CANCELLED,
      };

      const confirmation = window.confirm("Do you want to delete the order?");
      if (confirmation) {
        const order = new OrderService();
        await order.updateOrder(input);
        setOrderBulder(new Date());
      }
    } catch (err) {
      console.log(err);
      sweetErrorHandling(err).then();
    }
  };

  const finishOrderHandler = async (e: T) => {
    try {
      const orderId = e.target.value;
      const input: OrderUpdateInput = {
        orderId: orderId,
        orderStatus: OrderStatus.COMPLETED,
      };

      const confirmation = window.confirm("Have you received your order?");
      if (confirmation) {
        const order = new OrderService();
        await order.updateOrder(input);
        setOrderBulder(new Date());
      }
    } catch (err) {
      console.log(err);
      sweetErrorHandling(err).then();
    }
  };
  if (device === "mobile") {
    const allOrders = pendingOrders?.concat(processOrders) || [];
    return (
      <Box>
        <Box className="mobile-orders-list">
          {allOrders.length > 0 ? (
            allOrders.map((order: Order) => (
              <Box key={order._id} className="mobile-order-card mobile-order-processing">
                {/* Order Items */}
                <Box className="mobile-order-items">
                  {order.orderItems?.map((item: OrderItem) => {
                    const product: Product = order.productData.filter(
                      (ele: Product) => item.productId === ele._id
                    )[0];
                    if (!product) return null;
                    const imagePath = `${serverApi}/${product.productImages[0]}`;
                    return (
                      <Box key={item._id} className="mobile-order-item">
                        <img src={imagePath} className="mobile-order-item-img" alt={product.productName} />
                        <Box className="mobile-order-item-info">
                          <Typography className="mobile-order-item-name">
                            {product.productName}
                          </Typography>
                          <Box className="mobile-order-item-price-row">
                            <Typography className="mobile-order-item-price">
                              ${item.itemPrice}
                            </Typography>
                            <Typography className="mobile-order-item-quantity">
                              x {item.itemQuantity}
                            </Typography>
                            <Typography className="mobile-order-item-total">
                              ${(item.itemQuantity * item.itemPrice).toFixed(2)}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    );
                  })}
                </Box>

                {/* Order Summary */}
                <Box className="mobile-order-summary">
                  <Box className="mobile-order-summary-row">
                    <Typography>Product price</Typography>
                    <Typography>${(order.orderTotal - order.orderDelivery).toFixed(2)}</Typography>
                  </Box>
                  <Box className="mobile-order-summary-row">
                    <Typography>Delivery cost</Typography>
                    <Typography>${order.orderDelivery.toFixed(2)}</Typography>
                  </Box>
                  <Box className="mobile-order-summary-total">
                    <Typography>Total</Typography>
                    <Typography>${order.orderTotal.toFixed(2)}</Typography>
                  </Box>
                  <Typography className="mobile-order-date">
                    {moment().format("MMM DD, YYYY HH:mm")}
                  </Typography>
                </Box>

                {/* Action Buttons */}
                <Box className="mobile-order-actions">
                  <Button
                    value={order._id}
                    variant="outlined"
                    className="mobile-order-cancel-btn"
                    startIcon={<DeleteIcon />}
                    onClick={deleteOrderHandler}
                    disabled={order.orderStatus !== OrderStatus.PENDING}
                  >
                    Cancel
                  </Button>
                  <Button
                    value={order._id}
                    variant="contained"
                    className="mobile-order-process-btn"
                    startIcon={authTable ? <PhoneIcon /> : <CheckCircleIcon />}
                    onClick={(e) => {
                      if (authTable) {
                        callHandler(authTable._id);
                      } else {
                        finishOrderHandler(e);
                      }
                    }}
                  >
                    {authTable ? "Call" : "Verify"}
                  </Button>
                </Box>
              </Box>
            ))
          ) : (
            <Box className="mobile-no-orders">
              <img src="/icons/noimage-list.svg" alt="No orders" />
              <Typography>No processing orders</Typography>
            </Box>
          )}
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      <Stack>
        {pendingOrders?.concat(processOrders).map((order: Order) => {
          return (
            <Box key={order._id} className="order-main-box">
              <Box className="order-box-scroll">
                {order.orderItems?.map((item: OrderItem) => {
                  const product: Product = order.productData.filter(
                    (ele: Product) => item.productId === ele._id
                  )[0];
                  const imagePath = `${serverApi}/${product.productImages[0]}`;
                  return (
                    <Box key={item._id} className="orders-name-price">
                      <img src={imagePath} className="order-dish-img" />
                      <p className="title-dish">{product.productName}</p>
                      <Box className="price-box">
                        <p>${item.itemPrice}</p>
                        <img src="/icons/close.svg" />
                        <p>{item.itemQuantity}</p>
                        <img src="/icons/pause.svg" />
                        <p>${item.itemQuantity * item.itemPrice}</p>
                      </Box>
                    </Box>
                  );
                })}
                <Box className="total-price-box">
                  <Box className="box-total">
                    <p>Product price</p>
                    <p>${order.orderTotal - order.orderDelivery}</p>
                    <img src={"/icons/plus.svg"} />
                    <p>delivery cost</p>
                    <p>${order.orderDelivery}</p>
                    <img src={"/icons/pause.svg"} />
                    <p>Total</p>
                    <p>${order.orderTotal}</p>
                  </Box>
                  <p className="data-compl">
                    {moment().format("YY-MM-DD HH:mm")}
                  </p>

                  <Button
                    value={order._id}
                    variant="contained"
                    className="cancel-button"
                    color={"secondary"}
                    onClick={deleteOrderHandler}
                    disabled={order.orderStatus !== OrderStatus.PENDING}
                  >
                    cancel
                  </Button>
                  <Button
                    value={order._id}
                    variant="contained"
                    className="verify-button"
                    onClick={(e) => {
                      if (authTable) {
                        callHandler(authTable._id);
                      } else {
                        finishOrderHandler(e);
                      }
                    }}
                  >
                    {authTable ? "Call" : "Verify"}
                  </Button>
                </Box>
              </Box>
            </Box>
          );
        })}

        {pendingOrders?.concat(processOrders)?.length === 0 && (
          <Box
            width={"800px"}
            display="flex"
            flexDirection="row"
            justifyContent="center"
          >
            <img
              src={"/icons/noimage-list.svg"}
              style={{ width: 400, height: 400 }}
            />
          </Box>
        )}
      </Stack>
    </Box>
  );
}
