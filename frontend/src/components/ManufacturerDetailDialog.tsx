import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Manufacturer, ManufacturerStatus } from "@/types";
import { CheckCircle, XCircle, MapPin, FileText, Calendar, AlertTriangle } from "lucide-react";
import { format } from "date-fns";

interface ManufacturerDetailDialogProps {
  manufacturer: Manufacturer | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStatusChange: (id: string, status: ManufacturerStatus) => void;
}

const ManufacturerDetailDialog = ({
  manufacturer,
  open,
  onOpenChange,
  onStatusChange,
}: ManufacturerDetailDialogProps) => {
  if (!manufacturer) return null;

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "ACTIVE":
      case "APPROVED":
      case "VERIFIED":
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

  const isLicenseExpiring = (expiryDate: string | undefined) => {
    if (!expiryDate) return false;
    const expiry = new Date(expiryDate);
    const daysUntilExpiry = Math.ceil((expiry.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
  };

  const isLicenseExpired = (expiryDate: string | undefined) => {
    if (!expiryDate) return false;
    return new Date(expiryDate) < new Date();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Manufacturer Details
            <Badge variant={getStatusVariant(manufacturer.status)}>
              {manufacturer.status}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            Complete onboarding information for {manufacturer.companyName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Basic Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Company Name</label>
                <p className="text-sm font-medium">{manufacturer.companyName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Company Legal Name</label>
                <p className="text-sm">{manufacturer.companyLegalName || "Not provided"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Contact Person</label>
                <p className="text-sm">{manufacturer.contactPerson}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Email</label>
                <p className="text-sm">{manufacturer.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Phone</label>
                <p className="text-sm">{manufacturer.phoneNumber}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Address & Location */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Address & Location
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="text-sm font-medium text-muted-foreground">Address</label>
                <p className="text-sm">{manufacturer.address}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">City</label>
                <p className="text-sm">{manufacturer.city}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">State</label>
                <p className="text-sm">{manufacturer.state}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Pincode</label>
                <p className="text-sm">{manufacturer.pincode}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Country</label>
                <p className="text-sm">{manufacturer.country}</p>
              </div>
              {(manufacturer.latitude && manufacturer.longitude) && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Coordinates</label>
                  <p className="text-sm">
                    {manufacturer.latitude}, {manufacturer.longitude}
                  </p>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Compliance Documents */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Compliance Documents
            </h3>
            <div className="space-y-4">
              {/* GST & PAN */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">GSTIN</label>
                  <p className="text-sm">{manufacturer.gstNumber || "Not provided"}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">PAN Number</label>
                  <p className="text-sm">{manufacturer.panNumber || "Not provided"}</p>
                </div>
              </div>

              {/* PESO License */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium">PESO License</label>
                  {manufacturer.pesoLicenseExpiry && (
                    <>
                      {isLicenseExpired(manufacturer.pesoLicenseExpiry) && (
                        <Badge variant="destructive" className="flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          Expired
                        </Badge>
                      )}
                      {isLicenseExpiring(manufacturer.pesoLicenseExpiry) && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          Expiring Soon
                        </Badge>
                      )}
                    </>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-muted-foreground">License Number</label>
                    <p className="text-sm">{manufacturer.pesoLicenseNumber || "Not provided"}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Expiry Date
                    </label>
                    <p className="text-sm">
                      {manufacturer.pesoLicenseExpiry
                        ? format(new Date(manufacturer.pesoLicenseExpiry), "PPP")
                        : "Not provided"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Factory License */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium">Factory / Shop License</label>
                  {manufacturer.factoryLicenseExpiry && (
                    <>
                      {isLicenseExpired(manufacturer.factoryLicenseExpiry) && (
                        <Badge variant="destructive" className="flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          Expired
                        </Badge>
                      )}
                      {isLicenseExpiring(manufacturer.factoryLicenseExpiry) && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          Expiring Soon
                        </Badge>
                      )}
                    </>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-muted-foreground">License Number</label>
                    <p className="text-sm">{manufacturer.factoryLicenseNumber || "Not provided"}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Expiry Date
                    </label>
                    <p className="text-sm">
                      {manufacturer.factoryLicenseExpiry
                        ? format(new Date(manufacturer.factoryLicenseExpiry), "PPP")
                        : "Not provided"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Fire NOC */}
              <div>
                <label className="text-sm font-medium text-muted-foreground">Fire/Local NOC</label>
                {manufacturer.fireNocUrl ? (
                  <a
                    href={manufacturer.fireNocUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <FileText className="h-3 w-3" />
                    View Document
                  </a>
                ) : (
                  <p className="text-sm">Not provided</p>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Compliance Status */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Compliance Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Verification Status</span>
                {manufacturer.verified ? (
                  <Badge className="flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" />
                    Verified
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <XCircle className="h-3 w-3" />
                    Not Verified
                  </Badge>
                )}
              </div>
              {manufacturer.verificationNotes && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Verification Notes</label>
                  <p className="text-sm mt-1">{manufacturer.verificationNotes}</p>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Action Buttons */}
          <div className="flex gap-2 justify-end">
            {manufacturer.status === "PENDING" && (
              <>
                <Button
                  variant="outline"
                  onClick={() => onStatusChange(manufacturer.id, ManufacturerStatus.APPROVED)}
                >
                  Approve
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => onStatusChange(manufacturer.id, ManufacturerStatus.REJECTED)}
                >
                  Reject
                </Button>
              </>
            )}
            {manufacturer.status === "APPROVED" && (
              <Button
                variant="outline"
                onClick={() => onStatusChange(manufacturer.id, ManufacturerStatus.ACTIVE)}
              >
                Activate
              </Button>
            )}
            {manufacturer.status === "ACTIVE" && (
              <Button
                variant="outline"
                onClick={() => onStatusChange(manufacturer.id, ManufacturerStatus.SUSPENDED)}
              >
                Suspend
              </Button>
            )}
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ManufacturerDetailDialog;

