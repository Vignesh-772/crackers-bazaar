import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { geofencingApi } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const GeofencingManager = () => {
  const queryClient = useQueryClient();
  const { data: rules = [] } = useQuery({ queryKey: ["geofencingRules"], queryFn: geofencingApi.getAll });

  const [form, setForm] = useState({
    name: "",
    description: "",
    zoneType: "RESTRICTED",
    latitude: "",
    longitude: "",
    radiusMeters: "500",
    isActive: true,
  });

  const createMutation = useMutation({
    mutationFn: geofencingApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["geofencingRules"] });
      setForm({ name: "", description: "", zoneType: "RESTRICTED", latitude: "", longitude: "", radiusMeters: "500", isActive: true });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: geofencingApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["geofencingRules"] });
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Geofencing Rules</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Zone Type</Label>
            <Input value={form.zoneType} onChange={(e) => setForm({ ...form, zoneType: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Radius (meters)</Label>
            <Input value={form.radiusMeters} onChange={(e) => setForm({ ...form, radiusMeters: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Latitude</Label>
            <Input value={form.latitude} onChange={(e) => setForm({ ...form, latitude: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Longitude</Label>
            <Input value={form.longitude} onChange={(e) => setForm({ ...form, longitude: e.target.value })} />
          </div>
          <div className="flex items-end">
            <Button
              type="button"
              onClick={() =>
                createMutation.mutate({
                  name: form.name,
                  description: form.description,
                  zoneType: form.zoneType,
                  latitude: Number(form.latitude),
                  longitude: Number(form.longitude),
                  radiusMeters: Number(form.radiusMeters),
                  isActive: true,
                })
              }
            >
              Add Rule
            </Button>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Zone</TableHead>
              <TableHead>Lat</TableHead>
              <TableHead>Lng</TableHead>
              <TableHead>Radius</TableHead>
              <TableHead>Active</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rules.map((r: any) => (
              <TableRow key={r.id}>
                <TableCell>{r.name}</TableCell>
                <TableCell>{r.zoneType}</TableCell>
                <TableCell>{r.latitude}</TableCell>
                <TableCell>{r.longitude}</TableCell>
                <TableCell>{r.radiusMeters}</TableCell>
                <TableCell>{r.isActive ? "Yes" : "No"}</TableCell>
                <TableCell>
                  <Button variant="destructive" size="sm" onClick={() => deleteMutation.mutate(r.id)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default GeofencingManager;


