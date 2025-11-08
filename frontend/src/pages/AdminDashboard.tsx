import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Users, Package, ShoppingCart, TrendingUp, CheckCircle, XCircle, Trash2, Eye, Tags, Map, FileText, Settings } from "lucide-react";
import Navbar from "@/components/Navbar";
import AddManufacturerDialog from "@/components/AddManufacturerDialog";
import ManufacturerDetailDialog from "@/components/ManufacturerDetailDialog";
import ComplianceTagsManager from "@/components/ComplianceTagsManager";
import GeofencingManager from "@/components/GeofencingManager";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserManagementPanel from "@/components/UserManagementPanel";
import ReportsPanel from "@/components/ReportsPanel";
import { manufacturerApi } from "@/lib/api";
import { ManufacturerStatus, Manufacturer } from "@/types";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

const AdminDashboard = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [manufacturerToDelete, setManufacturerToDelete] = useState<Manufacturer | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedManufacturer, setSelectedManufacturer] = useState<Manufacturer | null>(null);
  const [activeTab, setActiveTab] = useState<string>("manufacturers");

  // Fetch dashboard stats
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["adminStats"],
    queryFn: manufacturerApi.getDashboardStats,
  });

  // Fetch manufacturers based on status filter
  const { data: manufacturersData, isLoading: manufacturersLoading } = useQuery({
    queryKey: ["manufacturers", selectedStatus],
    queryFn: async () => {
      if (selectedStatus === "all") {
        return await manufacturerApi.getAllManufacturers({ page: 0, size: 50 });
      }
      return await manufacturerApi.getManufacturersByStatus({
        status: selectedStatus,
        page: 0,
        size: 50,
      });
    },
  });

  const manufacturers = manufacturersData?.content || [];

  // Verify manufacturer mutation
  const verifyMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: ManufacturerStatus }) =>
      manufacturerApi.verifyManufacturer(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["manufacturers"] });
      queryClient.invalidateQueries({ queryKey: ["adminStats"] });
      toast.success("Manufacturer status updated successfully");
    },
    onError: () => {
      toast.error("Failed to update manufacturer status");
    },
  });

  const handleVerify = (id: string, status: ManufacturerStatus) => {
    verifyMutation.mutate({ id, status });
  };

  // Delete manufacturer mutation
  const deleteMutation = useMutation({
    mutationFn: manufacturerApi.deleteManufacturer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["manufacturers"] });
      queryClient.invalidateQueries({ queryKey: ["adminStats"] });
      toast.success("Manufacturer deleted successfully");
      setDeleteDialogOpen(false);
      setManufacturerToDelete(null);
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.error || "Failed to delete manufacturer";
      toast.error(errorMessage);
    },
  });

  const handleDeleteClick = (manufacturer: Manufacturer) => {
    setManufacturerToDelete(manufacturer);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (manufacturerToDelete) {
      deleteMutation.mutate(manufacturerToDelete.id);
    }
  };

  const handleViewDetails = (manufacturer: Manufacturer) => {
    setSelectedManufacturer(manufacturer);
    setDetailDialogOpen(true);
  };

  const handleStatusChange = (id: string, status: ManufacturerStatus) => {
    handleVerify(id, status);
    setDetailDialogOpen(false);
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "ACTIVE":
      case "APPROVED":
        return "default";
      case "PENDING":
        return "secondary";
      case "REJECTED":
      case "SUSPENDED":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage your crackers marketplace</p>
          </div>
          <AddManufacturerDialog />
        </div>

        {statsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-4 w-24" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-16" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Active Manufacturers
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats?.activeCount || 0}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Pending Approvals
                </CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats?.pendingCount || 0}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Approved
                </CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats?.approvedCount || 0}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Verified
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats?.verifiedCount || 0}</div>
              </CardContent>
            </Card>
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="manufacturers" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Manufacturers
            </TabsTrigger>
            <TabsTrigger value="compliance" className="flex items-center gap-2">
              <Tags className="h-4 w-4" />
              Compliance Tags
            </TabsTrigger>
            <TabsTrigger value="geofencing" className="flex items-center gap-2">
              <Map className="h-4 w-4" />
              Geofencing
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              User Management
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Reports
            </TabsTrigger>
          </TabsList>

          {/* Manufacturers Tab */}
          <TabsContent value="manufacturers" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Manufacturer Onboarding</CardTitle>
                <div className="flex gap-2">
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="APPROVED">Approved</SelectItem>
                      <SelectItem value="ACTIVE">Active</SelectItem>
                      <SelectItem value="REJECTED">Rejected</SelectItem>
                      <SelectItem value="SUSPENDED">Suspended</SelectItem>
                      <SelectItem value="INACTIVE">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  <AddManufacturerDialog />
                </div>
              </CardHeader>
              <CardContent>
                {manufacturersLoading ? (
                  <div className="space-y-2">
                    {[...Array(5)].map((_, i) => (
                      <Skeleton key={i} className="h-12 w-full" />
                    ))}
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Company Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>City</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Verified</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {manufacturers.map((manufacturer) => (
                        <TableRow key={manufacturer.id}>
                          <TableCell className="font-medium">{manufacturer.companyName}</TableCell>
                          <TableCell>{manufacturer.email}</TableCell>
                          <TableCell>{manufacturer.city}</TableCell>
                          <TableCell>
                            <Badge variant={getStatusVariant(manufacturer.status)}>
                              {manufacturer.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {manufacturer.verified ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <XCircle className="h-4 w-4 text-muted-foreground" />
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2 flex-wrap">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleViewDetails(manufacturer)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              {manufacturer.status === "PENDING" && (
                                <>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleVerify(manufacturer.id, ManufacturerStatus.APPROVED)}
                                  >
                                    Approve
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => handleVerify(manufacturer.id, ManufacturerStatus.REJECTED)}
                                  >
                                    Reject
                                  </Button>
                                </>
                              )}
                              {manufacturer.status === "APPROVED" && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleVerify(manufacturer.id, ManufacturerStatus.ACTIVE)}
                                >
                                  Activate
                                </Button>
                              )}
                              {manufacturer.status === "ACTIVE" && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleVerify(manufacturer.id, ManufacturerStatus.SUSPENDED)}
                                >
                                  Suspend
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteClick(manufacturer)}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
                {!manufacturersLoading && manufacturers.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No manufacturers found
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Compliance Tags Tab */}
          <TabsContent value="compliance" className="space-y-4">
            <ComplianceTagsManager />
          </TabsContent>

          {/* Geofencing Tab */}
          <TabsContent value="geofencing" className="space-y-4">
            <GeofencingManager />
          </TabsContent>

          {/* User Management Tab */}
          <TabsContent value="users" className="space-y-4">
            <UserManagementPanel />
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-4">
            <ReportsPanel />
          </TabsContent>
        </Tabs>

        {/* Manufacturer Detail Dialog */}
        <ManufacturerDetailDialog
          manufacturer={selectedManufacturer}
          open={detailDialogOpen}
          onOpenChange={setDetailDialogOpen}
          onStatusChange={handleStatusChange}
        />

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the manufacturer{" "}
                <span className="font-semibold">{manufacturerToDelete?.companyName}</span> and their
                associated user account. This action cannot be undone.
                {manufacturerToDelete && (
                  <div className="mt-4 p-3 bg-muted rounded-md">
                    <p className="text-sm">
                      <strong>Company:</strong> {manufacturerToDelete.companyName}
                    </p>
                    <p className="text-sm">
                      <strong>Email:</strong> {manufacturerToDelete.email}
                    </p>
                    <p className="text-sm">
                      <strong>Status:</strong> {manufacturerToDelete.status}
                    </p>
                  </div>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setManufacturerToDelete(null)}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteConfirm}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default AdminDashboard;
