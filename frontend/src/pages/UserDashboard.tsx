import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Package, Heart, MapPin } from "lucide-react";
import Navbar from "@/components/Navbar";

const UserDashboard = () => {
  const stats = [
    { title: "Total Orders", value: "12", icon: ShoppingCart },
    { title: "Active Orders", value: "3", icon: Package },
    { title: "Wishlist Items", value: "8", icon: Heart },
    { title: "Saved Addresses", value: "2", icon: MapPin },
  ];

  const orders = [
    {
      id: "#ORD-001",
      date: "2025-10-10",
      items: 3,
      total: 1197,
      status: "delivered",
    },
    {
      id: "#ORD-002",
      date: "2025-10-12",
      items: 2,
      total: 798,
      status: "processing",
    },
    {
      id: "#ORD-003",
      date: "2025-10-13",
      items: 5,
      total: 2145,
      status: "shipped",
    },
  ];

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "delivered":
        return "default";
      case "processing":
        return "secondary";
      case "shipped":
        return "outline";
      default:
        return "secondary";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">My Dashboard</h1>
          <p className="text-muted-foreground">Track your orders and manage your account</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>{order.date}</TableCell>
                    <TableCell>{order.items} items</TableCell>
                    <TableCell>₹{order.total}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(order.status)}>
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">View Details</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserDashboard;
