/*---------------------------------
This will represent Order content for User
----------------------------------*/

import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Dialog } from "../ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "../ui/table";
import ShoppingOrderDetailsView from "./order-details";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersByUserId, getOrderDetails, resetOrderDetails, } from "@/store/shop/order-slice";
import { Badge } from "../ui/badge";

function ShoppingOrders() {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const { orderList, orderDetails } = useSelector(
    (state) => state.shopOrder
  );

  function handleFetchOrderDetails(getId) {
    dispatch(getOrderDetails(getId));
  }

  useEffect(() => {
    dispatch(getAllOrdersByUserId(user?.id));
  }, [dispatch, user?.id]);

  useEffect(() => {
    if (orderDetails !== null) {
      setOpenDetailsDialog(true);
    }
  }, [orderDetails]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl sm:text-2xl font-bold">
          Order History
        </CardTitle>
      </CardHeader>

      <CardContent>
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Order Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="text-right">Details</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody className="[&>tr>td]:py-5">
              {orderList && orderList.length > 0 ? (
                orderList.map((orderItem) => (
                  <TableRow key={orderItem?._id}>
                    <TableCell className="max-w-[180px] truncate">
                      {orderItem?._id}
                    </TableCell>

                    <TableCell>
                      {orderItem?.orderDate?.split("T")[0]}
                    </TableCell>

                    <TableCell>
                      <Badge
                        className={`px-3 py-1 text-white ${
                          orderItem?.orderStatus === "confirmed"
                            ? "bg-green-500"
                            : orderItem?.orderStatus === "rejected"
                            ? "bg-red-600"
                            : orderItem?.orderStatus === "pending"
                            ? "bg-yellow-500"
                            : "bg-black"
                        }`}
                      >
                        {orderItem?.orderStatus}
                      </Badge>
                    </TableCell>

                    <TableCell>${orderItem?.totalAmount}</TableCell>

                    <TableCell className="text-right">
                      <Dialog
                        open={openDetailsDialog}
                        onOpenChange={() => {
                          setOpenDetailsDialog(false);
                          dispatch(resetOrderDetails());
                        }}
                      >
                        <Button
                          size="sm"
                          onClick={() =>
                            handleFetchOrderDetails(orderItem?._id)
                          }>
                          View Details
                        </Button>

                        <ShoppingOrderDetailsView
                          orderDetails={orderDetails}
                        />
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-10 text-muted-foreground"
                  >
                    No orders found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Card View */}
        <div className="grid gap-4 md:hidden">
          {orderList && orderList.length > 0 ? (
            orderList.map((orderItem) => (
              <div
                key={orderItem?._id}
                className="border rounded-xl p-4 shadow-sm space-y-3"
              >
                <div>
                  <p className="text-xs text-muted-foreground">Order ID</p>
                  <p className="text-sm font-medium break-all">
                    {orderItem?._id}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Date</p>
                    <p className="text-sm">
                      {orderItem?.orderDate?.split("T")[0]}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">Amount</p>
                    <p className="text-sm font-semibold">
                      ${orderItem?.totalAmount}
                    </p>
                  </div>
                </div>

                <div>
                  <Badge
                    className={`px-3 py-1 text-white ${
                      orderItem?.orderStatus === "confirmed"
                        ? "bg-green-500"
                        : orderItem?.orderStatus === "rejected"
                        ? "bg-red-600"
                        : orderItem?.orderStatus === "pending"
                        ? "bg-yellow-500"
                        : "bg-black"
                    }`}
                  >
                    {orderItem?.orderStatus}
                  </Badge>
                </div>

                <Dialog
                  open={openDetailsDialog}
                  onOpenChange={() => {
                    setOpenDetailsDialog(false);
                    dispatch(resetOrderDetails());
                  }}
                >
                  <Button
                    className="w-full"
                    onClick={() =>
                      handleFetchOrderDetails(orderItem?._id)
                    }
                  >
                    View Details
                  </Button>

                  <ShoppingOrderDetailsView
                    orderDetails={orderDetails}
                  />
                </Dialog>
              </div>
            ))
          ) : (
            <div className="text-center py-10 text-muted-foreground">
              No orders found
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default ShoppingOrders;