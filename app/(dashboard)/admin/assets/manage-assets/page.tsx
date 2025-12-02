'use client';

import { useState, useEffect } from "react";
import { Asset, AssetCols } from "@/app/constants/AssetCols";
import UserTable from "@/app/ui-components/UserTable";
import { Button } from "@/components/ui/button";
import CreateAssetModal from "@/app/ui-components/CreateAssetModal";
import EditAssetModal from "@/app/ui-components/EditAssetModal";
import ConfirmModal from "@/app/ui-components/ConfirmModal";
import { Trash2 } from "lucide-react";

export default function ManageAssets() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(false);

  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [assetToDelete, setAssetToDelete] = useState<Asset | null>(null);

  // Fetch assets
  useEffect(() => {
    const fetchAssets = async () => {
      setLoading(true);
      const token = sessionStorage.getItem("access_token");
      if (!token) return setLoading(false);

      try {
        const res = await fetch(
          "https://asset-manager-backend-xlkf.onrender.com/admin/assets/list/all",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();
        if (data.success && data.assets) setAssets(data.assets);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAssets();
  }, []);

  // Add or update asset
  const handleSuccess = (asset: Asset) => {
    setAssets((prev) => {
      const index = prev.findIndex((a) => a.id === asset.id);
      if (index > -1) {
        const updated = [...prev];
        updated[index] = asset;
        return updated;
      }
      return [asset, ...prev];
    });
    setSelectedAsset(null);
    setOpenCreate(false);
    setOpenEdit(false);
  };

  // Delete asset
  const handleDelete = async () => {
    if (!assetToDelete) return;

    const token = sessionStorage.getItem("access_token");
    if (!token) return;

    try {
      const res = await fetch(
        `https://asset-manager-backend-xlkf.onrender.com/admin/assets/delete/${assetToDelete.id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      setAssets((prev) => prev.filter((a) => a.id !== assetToDelete.id));
      setAssetToDelete(null);
    } catch (err: any) {
      console.error("Delete error:", err);
      alert(err.message);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="text-lg font-semibold">Manage Assets ({assets.length})</h4>

        <div className="flex gap-2">
          <CreateAssetModal
            open={openCreate}
            setOpen={setOpenCreate}
            onSuccess={handleSuccess}
          />
          <Button onClick={() => setOpenCreate(true)}>Create Asset</Button>
          <Button onClick={() => console.log("Bulk Upload clicked")}>Bulk Upload</Button>
        </div>
      </div>

      {/* Confirm Delete */}
      <ConfirmModal
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Delete Asset?"
        description="This action cannot be undone."
        confirmLabel="Yes, Delete"
        cancelLabel="Cancel"
        onConfirm={handleDelete}
        icon={<Trash2 size={20} />}
      />

      {/* Edit Asset */}
      <EditAssetModal
        open={openEdit}
        setOpen={setOpenEdit}
        asset={selectedAsset}
        onSuccess={handleSuccess}
      />

      <UserTable
        columns={AssetCols(assets)}
        data={assets}
        loading={loading}
        onEdit={(row: Asset) => {
          setSelectedAsset(row);
          setOpenEdit(true);
        }}
        onDelete={(row: Asset) => {
          setAssetToDelete(row);
          setConfirmOpen(true);
        }}
      />
    </div>
  );
}
