import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userAdminApi } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const UserManagementPanel = () => {
  const queryClient = useQueryClient();
  const { data: users = [] } = useQuery({ queryKey: ["users-all"], queryFn: async () => {
    const res = await fetch(import.meta.env.VITE_API_BASE_URL + "/users/all", {
      credentials: "include",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return res.json();
  }});

  const [roleMap, setRoleMap] = useState<Record<string, string>>({});

  const roleMutation = useMutation({
    mutationFn: ({ id, role }: { id: string; role: string }) => userAdminApi.updateRole(id, role),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users-all"] }),
  });

  const suspendMutation = useMutation({
    mutationFn: (id: string) => userAdminApi.suspend(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users-all"] }),
  });

  const activateMutation = useMutation({
    mutationFn: (id: string) => userAdminApi.activate(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users-all"] }),
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Management</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Username</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((u: any) => (
              <TableRow key={u.id}>
                <TableCell>{u.username}</TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Input
                      className="w-32"
                      placeholder={u.role}
                      value={roleMap[u.id] || ""}
                      onChange={(e) => setRoleMap({ ...roleMap, [u.id]: e.target.value })}
                    />
                    <Button size="sm" onClick={() => roleMutation.mutate({ id: u.id, role: roleMap[u.id] || u.role })}>
                      Set
                    </Button>
                  </div>
                </TableCell>
                <TableCell>{u.active ? "Active" : "Suspended"}</TableCell>
                <TableCell className="flex gap-2">
                  {u.active ? (
                    <Button variant="destructive" size="sm" onClick={() => suspendMutation.mutate(u.id)}>
                      Suspend
                    </Button>
                  ) : (
                    <Button size="sm" onClick={() => activateMutation.mutate(u.id)}>
                      Activate
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default UserManagementPanel;


