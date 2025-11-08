import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { complianceApi } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const ComplianceTagsManager = () => {
  const queryClient = useQueryClient();
  const [productId, setProductId] = useState("");
  const [tagType, setTagType] = useState("GREEN_CRACKER");
  const [tagValue, setTagValue] = useState("");

  const { data: tags = [] } = useQuery({
    queryKey: ["complianceTags", productId],
    queryFn: () => (productId ? complianceApi.getByProduct(productId) : Promise.resolve([])),
  });

  const addMutation = useMutation({
    mutationFn: () => complianceApi.addTag(productId, tagType, tagValue),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["complianceTags", productId] });
      setTagValue("");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: complianceApi.deleteTag,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["complianceTags", productId] }),
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Compliance Tags</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Product ID</Label>
            <Input value={productId} onChange={(e) => setProductId(e.target.value)} placeholder="Product UUID" />
          </div>
          <div className="space-y-2">
            <Label>Tag Type</Label>
            <Input value={tagType} onChange={(e) => setTagType(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Tag Value</Label>
            <div className="flex gap-2">
              <Input value={tagValue} onChange={(e) => setTagValue(e.target.value)} placeholder="e.g., Yes or Class 1" />
              <Button type="button" onClick={() => addMutation.mutate()} disabled={!productId || !tagValue}>
                Add
              </Button>
            </div>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tags.map((t: any) => (
              <TableRow key={t.id}>
                <TableCell>{t.tagType}</TableCell>
                <TableCell>{t.tagValue}</TableCell>
                <TableCell>
                  <Button variant="destructive" size="sm" onClick={() => deleteMutation.mutate(t.id)}>
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

export default ComplianceTagsManager;


