import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserPlus, Loader2, MapPin, AlertTriangle, CheckCircle, Mail, Phone } from "lucide-react";
import { manufacturerApi } from "@/lib/api";
import { ManufacturerRequest } from "@/types";
import { toast } from "sonner";
import DocumentUpload from "./DocumentUpload";
import { Alert, AlertDescription } from "@/components/ui/alert";

const AddManufacturerDialog = () => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState("basic");
  const [emailVerified, setEmailVerified] = useState(false);
  const [mobileVerified, setMobileVerified] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");

  // Form state
  const [pesoLicenseUrl, setPesoLicenseUrl] = useState("");
  const [factoryLicenseUrl, setFactoryLicenseUrl] = useState("");

  const [formData, setFormData] = useState<ManufacturerRequest>({
    companyName: "",
    companyLegalName: "",
    contactPerson: "",
    email: "",
    phoneNumber: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
    latitude: undefined,
    longitude: undefined,
    gstNumber: "",
    panNumber: "",
    licenseNumber: "",
    licenseValidity: "",
    pesoLicenseNumber: "",
    pesoLicenseExpiry: "",
    factoryLicenseNumber: "",
    factoryLicenseExpiry: "",
    fireNocUrl: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Create manufacturer mutation
  const createMutation = useMutation({
    mutationFn: manufacturerApi.createManufacturer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["manufacturers"] });
      queryClient.invalidateQueries({ queryKey: ["adminStats"] });
      toast.success("Manufacturer added successfully!");
      setOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.error || "Failed to add manufacturer";
      toast.error(errorMessage);
    },
  });

  const resetForm = () => {
    setFormData({
      companyName: "",
      companyLegalName: "",
      contactPerson: "",
      email: "",
      phoneNumber: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      country: "India",
      latitude: undefined,
      longitude: undefined,
      gstNumber: "",
      panNumber: "",
      licenseNumber: "",
      licenseValidity: "",
      pesoLicenseNumber: "",
      pesoLicenseExpiry: "",
      factoryLicenseNumber: "",
      factoryLicenseExpiry: "",
      fireNocUrl: "",
      username: "",
      password: "",
      confirmPassword: "",
    });
    setErrors({});
    setCurrentTab("basic");
    setEmailVerified(false);
    setMobileVerified(false);
    setOtpSent(false);
    setOtp("");
    setPesoLicenseUrl("");
    setFactoryLicenseUrl("");
  };

  const handleChange = (field: keyof ManufacturerRequest, value: string | number | undefined) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // GSTIN format validation: 15 characters, alphanumeric, specific pattern
  const validateGSTIN = (gstin: string): boolean => {
    if (!gstin) return true; // Optional field
    // GSTIN format: 15 characters, first 2 digits (state code), next 10 alphanumeric (PAN), 1 digit, 1 letter, 1 digit
    const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    return gstinRegex.test(gstin.toUpperCase());
  };

  // PAN format validation: 10 characters, specific pattern
  const validatePAN = (pan: string): boolean => {
    if (!pan) return true; // Optional field
    // PAN format: 5 letters, 4 digits, 1 letter
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    return panRegex.test(pan.toUpperCase());
  };

  // Extract company legal name from GST/PAN
  const handleGSTOrPANChange = (value: string, type: "gst" | "pan") => {
    handleChange(type === "gst" ? "gstNumber" : "panNumber", value.toUpperCase());
    
    // Auto-fill company legal name from PAN (first 5 characters are company name pattern)
    // This is a simplified approach - in real scenario, you'd query GST/PAN database
    if (type === "pan" && value.length >= 5 && !formData.companyLegalName) {
      // Extract company name pattern from PAN
      const companyNamePattern = value.substring(0, 5);
      // This is just a placeholder - real implementation would decode from GST/PAN database
    }
  };

  // Verify email (placeholder - would call backend API)
  const handleVerifyEmail = async () => {
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    // TODO: Call backend API to send verification email
    toast.success("Verification email sent! Please check your inbox.");
    setEmailVerified(true);
  };

  // Send OTP to mobile (placeholder - would call backend API)
  const handleSendOTP = async () => {
    if (!formData.phoneNumber || !/^[0-9]{10}$/.test(formData.phoneNumber)) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }
    // TODO: Call backend API to send OTP
    toast.success("OTP sent to your mobile number!");
    setOtpSent(true);
  };

  // Verify OTP (placeholder - would call backend API)
  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }
    // TODO: Call backend API to verify OTP
    toast.success("Mobile number verified!");
    setMobileVerified(true);
    setOtpSent(false);
    setOtp("");
  };

  // Get coordinates from address using geocoding (placeholder)
  const handleGetCoordinates = async () => {
    if (!formData.address || !formData.city || !formData.state) {
      toast.error("Please enter address, city, and state first");
      return;
    }
    // TODO: Integrate with Google Maps Geocoding API or similar
    // For now, we'll use a placeholder
    toast.info("Map integration coming soon. Please enter coordinates manually.");
    // Example: You would call a geocoding service here
    // const coords = await geocodeAddress(formData.address, formData.city, formData.state);
    // handleChange("latitude", coords.lat);
    // handleChange("longitude", coords.lng);
  };

  // Check if license is expiring soon (within 30 days)
  const isLicenseExpiringSoon = (expiryDate: string | undefined): boolean => {
    if (!expiryDate) return false;
    const expiry = new Date(expiryDate);
    const today = new Date();
    const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
  };

  // Check if license is expired
  const isLicenseExpired = (expiryDate: string | undefined): boolean => {
    if (!expiryDate) return false;
    return new Date(expiryDate) < new Date();
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Basic Info Validation
    if (!formData.companyName.trim()) {
      newErrors.companyName = "Company name is required";
    }
    if (!formData.contactPerson.trim()) {
      newErrors.contactPerson = "Contact person is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    } else if (!emailVerified) {
      newErrors.email = "Email must be verified";
    }
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!/^[0-9]{10}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Phone number must be 10 digits";
    } else if (!mobileVerified) {
      newErrors.phoneNumber = "Mobile number must be verified with OTP";
    }

    // GSTIN Validation
    if (formData.gstNumber && !validateGSTIN(formData.gstNumber)) {
      newErrors.gstNumber = "Invalid GSTIN format (e.g., 27ABCDE1234F1Z5)";
    }

    // PAN Validation
    if (formData.panNumber && !validatePAN(formData.panNumber)) {
      newErrors.panNumber = "Invalid PAN format (e.g., ABCDE1234F)";
    }

    // Address Validation
    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }
    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }
    if (!formData.state.trim()) {
      newErrors.state = "State is required";
    }
    if (!formData.pincode.trim()) {
      newErrors.pincode = "Pincode is required";
    } else if (!/^[0-9]{6}$/.test(formData.pincode)) {
      newErrors.pincode = "Pincode must be 6 digits";
    }
    if (!formData.country.trim()) {
      newErrors.country = "Country is required";
    }

    // Credentials Validation
    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirm password is required";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix all form errors");
      return;
    }

    createMutation.mutate(formData);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Add Manufacturer
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Manufacturer</DialogTitle>
          <DialogDescription>
            Fill in all required manufacturer details. Fields marked with * are required.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <Tabs value={currentTab} onValueChange={setCurrentTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="compliance">Compliance</TabsTrigger>
              <TabsTrigger value="address">Address</TabsTrigger>
              <TabsTrigger value="credentials">Credentials</TabsTrigger>
            </TabsList>

            {/* Basic Information Tab */}
            <TabsContent value="basic" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">
                    Manufacturer Name <span className="text-destructive">*</span>
                    <span className="text-xs text-muted-foreground ml-2">(Read-only after creation)</span>
                  </Label>
                  <Input
                    id="companyName"
                    value={formData.companyName}
                    onChange={(e) => handleChange("companyName", e.target.value)}
                    placeholder="ABC Crackers Pvt Ltd"
                  />
                  {errors.companyName && (
                    <p className="text-sm text-destructive">{errors.companyName}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="companyLegalName">
                    Company Legal Name
                    <span className="text-xs text-muted-foreground ml-2">(From GST/PAN)</span>
                  </Label>
                  <Input
                    id="companyLegalName"
                    value={formData.companyLegalName}
                    onChange={(e) => handleChange("companyLegalName", e.target.value)}
                    placeholder="ABC Crackers Private Limited"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contactPerson">
                    Contact Person Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="contactPerson"
                    value={formData.contactPerson}
                    onChange={(e) => handleChange("contactPerson", e.target.value)}
                    placeholder="John Doe"
                  />
                  {errors.contactPerson && (
                    <p className="text-sm text-destructive">{errors.contactPerson}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">
                    Mobile Number <span className="text-destructive">*</span>
                    <span className="text-xs text-muted-foreground ml-2">(Verified OTP)</span>
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={(e) => handleChange("phoneNumber", e.target.value)}
                      placeholder="9876543210"
                      maxLength={10}
                      disabled={mobileVerified}
                    />
                    {!mobileVerified && (
                      <>
                        {!otpSent ? (
                          <Button type="button" variant="outline" onClick={handleSendOTP}>
                            <Phone className="mr-2 h-4 w-4" />
                            Send OTP
                          </Button>
                        ) : (
                          <div className="flex gap-2">
                            <Input
                              type="text"
                              placeholder="Enter OTP"
                              value={otp}
                              onChange={(e) => setOtp(e.target.value)}
                              maxLength={6}
                              className="w-24"
                            />
                            <Button type="button" variant="outline" onClick={handleVerifyOTP}>
                              Verify
                            </Button>
                          </div>
                        )}
                      </>
                    )}
                    {mobileVerified && (
                      <div className="flex items-center text-green-600">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Verified
                      </div>
                    )}
                  </div>
                  {errors.phoneNumber && (
                    <p className="text-sm text-destructive">{errors.phoneNumber}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">
                    Email ID <span className="text-destructive">*</span>
                    <span className="text-xs text-muted-foreground ml-2">(Verified)</span>
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      placeholder="contact@company.com"
                      disabled={emailVerified}
                    />
                    {!emailVerified && (
                      <Button type="button" variant="outline" onClick={handleVerifyEmail}>
                        <Mail className="mr-2 h-4 w-4" />
                        Verify
                      </Button>
                    )}
                    {emailVerified && (
                      <div className="flex items-center text-green-600">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Verified
                      </div>
                    )}
                  </div>
                  {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                </div>
              </div>
            </TabsContent>

            {/* Compliance Tab */}
            <TabsContent value="compliance" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="gstNumber">
                    GSTIN
                    <span className="text-xs text-muted-foreground ml-2">(Validate format)</span>
                  </Label>
                  <Input
                    id="gstNumber"
                    value={formData.gstNumber}
                    onChange={(e) => handleGSTOrPANChange(e.target.value, "gst")}
                    placeholder="27ABCDE1234F1Z5"
                    maxLength={15}
                  />
                  {errors.gstNumber && (
                    <p className="text-sm text-destructive">{errors.gstNumber}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="panNumber">PAN Number</Label>
                  <Input
                    id="panNumber"
                    value={formData.panNumber}
                    onChange={(e) => handleGSTOrPANChange(e.target.value, "pan")}
                    placeholder="ABCDE1234F"
                    maxLength={10}
                  />
                  {errors.panNumber && (
                    <p className="text-sm text-destructive">{errors.panNumber}</p>
                  )}
                </div>
              </div>

              <div className="space-y-4 border rounded-lg p-4">
                <h4 className="font-medium">PESO License</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="pesoLicenseNumber">PESO License Number</Label>
                    <Input
                      id="pesoLicenseNumber"
                      value={formData.pesoLicenseNumber}
                      onChange={(e) => handleChange("pesoLicenseNumber", e.target.value)}
                      placeholder="PESO2024001"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pesoLicenseExpiry">Expiry Date</Label>
                    <Input
                      id="pesoLicenseExpiry"
                      type="date"
                      value={formData.pesoLicenseExpiry}
                      onChange={(e) => handleChange("pesoLicenseExpiry", e.target.value)}
                    />
                    {formData.pesoLicenseExpiry && (
                      <>
                        {isLicenseExpired(formData.pesoLicenseExpiry) && (
                          <Alert variant="destructive">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertDescription>License has expired!</AlertDescription>
                          </Alert>
                        )}
                        {isLicenseExpiringSoon(formData.pesoLicenseExpiry) && (
                          <Alert>
                            <AlertTriangle className="h-4 w-4" />
                            <AlertDescription>License expiring soon (within 30 days)</AlertDescription>
                          </Alert>
                        )}
                      </>
                    )}
                  </div>
                </div>
                <DocumentUpload
                  label="PESO License Document (Upload)"
                  value={pesoLicenseUrl}
                  onChange={setPesoLicenseUrl}
                  accept=".pdf,.jpg,.jpeg,.png"
                />
              </div>

              <div className="space-y-4 border rounded-lg p-4">
                <h4 className="font-medium">Factory / Shop License</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="factoryLicenseNumber">License Number</Label>
                    <Input
                      id="factoryLicenseNumber"
                      value={formData.factoryLicenseNumber}
                      onChange={(e) => handleChange("factoryLicenseNumber", e.target.value)}
                      placeholder="FACTORY2024001"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="factoryLicenseExpiry">Expiry Date</Label>
                    <Input
                      id="factoryLicenseExpiry"
                      type="date"
                      value={formData.factoryLicenseExpiry}
                      onChange={(e) => handleChange("factoryLicenseExpiry", e.target.value)}
                    />
                    {formData.factoryLicenseExpiry && (
                      <>
                        {isLicenseExpired(formData.factoryLicenseExpiry) && (
                          <Alert variant="destructive">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertDescription>License has expired!</AlertDescription>
                          </Alert>
                        )}
                        {isLicenseExpiringSoon(formData.factoryLicenseExpiry) && (
                          <Alert>
                            <AlertTriangle className="h-4 w-4" />
                            <AlertDescription>License expiring soon (within 30 days)</AlertDescription>
                          </Alert>
                        )}
                      </>
                    )}
                  </div>
                </div>
                <DocumentUpload
                  label="Factory License Document (Upload)"
                  value={factoryLicenseUrl}
                  onChange={setFactoryLicenseUrl}
                  accept=".pdf,.jpg,.jpeg,.png"
                />
              </div>

              <div className="space-y-2">
                <DocumentUpload
                  label="Fire/Local NOC (Upload)"
                  value={formData.fireNocUrl}
                  onChange={(url) => handleChange("fireNocUrl", url)}
                  accept=".pdf,.jpg,.jpeg,.png"
                />
              </div>
            </TabsContent>

            {/* Address Tab */}
            <TabsContent value="address" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="address">
                  Address (Plant / Office) <span className="text-destructive">*</span>
                  <span className="text-xs text-muted-foreground ml-2">(Map & geofence)</span>
                </Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleChange("address", e.target.value)}
                  placeholder="Street address, building name, etc."
                  rows={3}
                />
                {errors.address && <p className="text-sm text-destructive">{errors.address}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">
                    City <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleChange("city", e.target.value)}
                    placeholder="Mumbai"
                  />
                  {errors.city && <p className="text-sm text-destructive">{errors.city}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">
                    State <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => handleChange("state", e.target.value)}
                    placeholder="Maharashtra"
                  />
                  {errors.state && <p className="text-sm text-destructive">{errors.state}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pincode">
                    Pincode <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="pincode"
                    value={formData.pincode}
                    onChange={(e) => handleChange("pincode", e.target.value)}
                    placeholder="400001"
                    maxLength={6}
                  />
                  {errors.pincode && <p className="text-sm text-destructive">{errors.pincode}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">
                    Country <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="country"
                    value={formData.country}
                    onChange={(e) => handleChange("country", e.target.value)}
                    placeholder="India"
                  />
                  {errors.country && <p className="text-sm text-destructive">{errors.country}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="latitude">Latitude</Label>
                  <div className="flex gap-2">
                    <Input
                      id="latitude"
                      type="number"
                      step="any"
                      value={formData.latitude || ""}
                      onChange={(e) => handleChange("latitude", e.target.value ? parseFloat(e.target.value) : undefined)}
                      placeholder="19.0760"
                    />
                    <Button type="button" variant="outline" onClick={handleGetCoordinates}>
                      <MapPin className="mr-2 h-4 w-4" />
                      Get from Map
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="longitude">Longitude</Label>
                  <Input
                    id="longitude"
                    type="number"
                    step="any"
                    value={formData.longitude || ""}
                    onChange={(e) => handleChange("longitude", e.target.value ? parseFloat(e.target.value) : undefined)}
                    placeholder="72.8777"
                  />
                </div>
              </div>
            </TabsContent>

            {/* Credentials Tab */}
            <TabsContent value="credentials" className="space-y-4 mt-4">
              <div className="bg-muted p-4 rounded-lg mb-4">
                <p className="text-sm text-muted-foreground">
                  These credentials will be used by the manufacturer to login to the system.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">
                  Username <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => handleChange("username", e.target.value)}
                  placeholder="manufacturer_username"
                />
                {errors.username && <p className="text-sm text-destructive">{errors.username}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">
                  Password <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  placeholder="At least 6 characters"
                />
                {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">
                  Confirm Password <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleChange("confirmPassword", e.target.value)}
                  placeholder="Re-enter password"
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-destructive">{errors.confirmPassword}</p>
                )}
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-between mt-6 pt-4 border-t">
            <div>
              {currentTab === "compliance" && (
                <Button type="button" variant="outline" onClick={() => setCurrentTab("basic")}>
                  Previous
                </Button>
              )}
              {currentTab === "address" && (
                <Button type="button" variant="outline" onClick={() => setCurrentTab("compliance")}>
                  Previous
                </Button>
              )}
              {currentTab === "credentials" && (
                <Button type="button" variant="outline" onClick={() => setCurrentTab("address")}>
                  Previous
                </Button>
              )}
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setOpen(false);
                  resetForm();
                }}
              >
                Cancel
              </Button>

              {currentTab === "basic" && (
                <Button type="button" onClick={() => setCurrentTab("compliance")}>
                  Next
                </Button>
              )}
              {currentTab === "compliance" && (
                <Button type="button" onClick={() => setCurrentTab("address")}>
                  Next
                </Button>
              )}
              {currentTab === "address" && (
                <Button type="button" onClick={() => setCurrentTab("credentials")}>
                  Next
                </Button>
              )}
              {currentTab === "credentials" && (
                <Button type="submit" disabled={createMutation.isPending}>
                  {createMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    "Add Manufacturer"
                  )}
                </Button>
              )}
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddManufacturerDialog;
