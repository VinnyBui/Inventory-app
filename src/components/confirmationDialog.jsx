import React from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

const ConfirmationDialog = ({ open, onClose, onConfirm, itemName }) => (
  <Dialog open={open} onOpenChange={onClose}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogDescription>
          Are you sure you want to delete the item <strong>{itemName}</strong>? This action cannot be undone.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter className="flex justify-end mt-4">
        <DialogClose asChild>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </DialogClose>
        <Button variant="destructive" onClick={onConfirm}>
          Delete
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

export default ConfirmationDialog;
