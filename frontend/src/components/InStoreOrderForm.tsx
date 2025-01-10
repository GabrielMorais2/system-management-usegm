'use client'

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2 } from 'lucide-react';
import { Order } from "@/types/order";
import { ProductSelect } from "./ProductSelect";

interface InStoreOrderFormProps {
  onSubmit: (order: Omit<Order, "id" | "status" | "createdAt">) => void;
  onCancel: () => void;
}

interface OrderItem {
  productId: number;
  quantity: number;
  name: string;
  image: string;
}

export default function InStoreOrderForm({ onSubmit, onCancel }: InStoreOrderFormProps) {
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [items, setItems] = useState<OrderItem[]>([]);
  const [observations, setObservations] = useState("");

  const handleAddProduct = (product: any, quantity: number) => {
    const newItem: OrderItem = {
      productId: product.id,
      quantity: quantity,
      name: product.name,
      image: product.image
    };
    setItems([...items, newItem]);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const orderData: Omit<Order, "id" | "status" | "createdAt"> = {
      customerDetails: {
        name: customerName,
        phone: customerPhone,
      },
      shippingDetails: {
        type: "LOJA",
      },
      observations,
      products: items.map(({ productId, quantity, name, image }) => ({ id: productId, quantity, name, image })),
    };

    onSubmit(orderData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="customerName">Nome do Cliente</Label>
            <Input
              id="customerName"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="customerPhone">Telefone do Cliente</Label>
            <Input
              id="customerPhone"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
            />
          </div>
        </div>

        <div>
          <Label>Itens do Pedido</Label>
          <ProductSelect onProductSelect={handleAddProduct} selectedProducts={items} />
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Imagem</TableHead>
                <TableHead>Nome do Item</TableHead>
                <TableHead>Quantidade</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" />
                  </TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveItem(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div>
          <Label htmlFor="observations">Observações</Label>
          <Textarea
            id="observations"
            value={observations}
            onChange={(e) => setObservations(e.target.value)}
          />
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" onClick={onCancel} variant="outline">
          Cancelar
        </Button>
        <Button type="submit">
          Finalizar Venda
        </Button>
      </div>
    </form>
  );
}

