import React, { useEffect, useRef } from "react";
import type { Product } from "../hooks/useCatalogQuery";
import { Button } from "../../../shared/ui/Button";

interface Props {
  product: Product;
  onClose: () => void;
}

export const ProductModal = ({ product, onClose }: Props) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) {
      dialog.showModal();
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const handleClose = () => {
    dialogRef.current?.close();
    onClose();
  };

  return (
    <dialog
      ref={dialogRef}
      onCancel={handleClose}
      className="backdrop:bg-black/60 backdrop:backdrop-blur-sm rounded-2xl shadow-2xl p-0 w-11/12 max-w-lg mx-auto open:animate-in open:fade-in open:zoom-in-95"
      aria-labelledby="modal-title"
    >
      <div className="p-6">
        <div className="aspect-video w-full bg-gray-100 rounded-lg mb-6 overflow-hidden flex items-center justify-center">
          <img
            src={product.thumbnail}
            alt={`Imagem do ${product.title}`}
            className="object-cover w-full h-full"
            loading="lazy"
          />
        </div>

        <h2 id="modal-title" className="text-2xl font-bold text-gray-900">
          {product.title}
        </h2>
        <p className="text-sm text-blue-600 font-semibold uppercase tracking-wider mt-1">
          {product.category}
        </p>

        <p className="text-gray-600 mt-4 leading-relaxed">
          {product.description}
        </p>

        <div className="mt-8 flex items-center justify-between border-t border-gray-100 pt-6">
          <span className="text-3xl font-bold text-gray-900">
            ${product.price.toFixed(2)}
          </span>
          <Button onClick={handleClose} autoFocus>
            Fechar
          </Button>
        </div>
      </div>
    </dialog>
  );
};
