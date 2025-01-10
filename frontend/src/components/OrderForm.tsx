'use client'

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2 } from 'lucide-react';
import { Order } from "@/types/order";
import { ProductSelect } from "./ProductSelect";

interface OrderFormProps {
  onSubmit: (order: Omit<Order, "id" | "status" | "createdAt">) => void;
  onCancel: () => void;
  initialValues?: Order | null;
}

interface OrderItem {
  productId: number;
  quantity: number;
  name: string;
  image: string;
}

export default function OrderForm({ onSubmit, onCancel, initialValues }: OrderFormProps) {
  const [id, setId] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [shippingType, setShippingType] = useState(initialValues?.shippingDetails.type || '');
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [excursionName, setExcursionName] = useState("");
  const [seatNumber, setSeatNumber] = useState("");
  const [sector, setSector] = useState("");
  const [transporterName, setTransporterName] = useState("");
  const [items, setItems] = useState<OrderItem[]>([]);
  const [observations, setObservations] = useState("");

  useEffect(() => {
    if (initialValues) {
      console.log(initialValues)
      setId(initialValues.id);
      setCustomerName(initialValues.customerDetails.name);
      setCustomerEmail(initialValues.customerDetails.email);
      setCustomerPhone(initialValues.customerDetails.phone);
      setStreet(initialValues.shippingDetails.street || "");
      setNumber(initialValues.shippingDetails.number || "");
      setNeighborhood(initialValues.shippingDetails.neighborhood || "");
      setCity(initialValues.shippingDetails.city || "");
      setState(initialValues.shippingDetails.state || "");
      setDeliveryDate(initialValues.shippingDetails.deliveryDate);
      setExcursionName(initialValues.shippingDetails.excursionName || "");
      setSeatNumber(initialValues.shippingDetails.seatNumber || "");
      setSector(initialValues.shippingDetails.sector || "");
      setTransporterName(initialValues.shippingDetails.transporterName || "");
      setItems(initialValues.products.map(product => ({
        productId: product.id,
        quantity: product.quantity,
        name: product.name,
        image: product.image
      })));
      setObservations(initialValues.observations || "");
    }
  }, [initialValues]);

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

    const orderData: Omit<Order, "status" | "createdAt"> = {
      id: initialValues?.id,
      customerDetails: {
        name: customerName,
        email: customerEmail,
        phone: customerPhone,
      },
      shippingDetails: {
        type: shippingType,
        street,
        number,
        neighborhood,
        city,
        state,
        deliveryDate,
        excursionName: shippingType === "EXCURSAO" ? excursionName : undefined,
        seatNumber: shippingType === "EXCURSAO" ? seatNumber : undefined,
        sector: shippingType === "EXCURSAO" ? sector : undefined,
        transporterName:
          shippingType === "TRANSPORTADORA" ? transporterName : undefined,
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
            <Label htmlFor="customerEmail">Email do Cliente</Label>
            <Input
              id="customerEmail"
              type="email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="customerPhone">Telefone do Cliente</Label>
            <Input
              id="customerPhone"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="shippingType">Tipo de Transporte</Label>
            <Select value={shippingType} onValueChange={(value) => setShippingType(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo de transporte" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="TRANSPORTADORA">Transportadora</SelectItem>
                <SelectItem value="EXCURSAO">Excursão</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        {shippingType === "TRANSPORTADORA" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="street">Rua</Label>
              <Input
                id="street"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="number">Número</Label>
              <Input
                id="number"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="neighborhood">Bairro</Label>
              <Input
                id="neighborhood"
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="city">Cidade</Label>
              <Input
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="state">Estado</Label>
              <Input
                id="state"
                value={state}
                onChange={(e) => setState(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="transporterName">Nome da Transportadora</Label>
              <Input
                id="transporterName"
                value={transporterName}
                onChange={(e) => setTransporterName(e.target.value)}
                required
              />
            </div>
          </div>
        )}

        {shippingType === "EXCURSAO" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="excursionName">Nome da Excursão</Label>
              <Input
                id="excursionName"
                value={excursionName}
                onChange={(e) => setExcursionName(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="seatNumber">Vaga</Label>
              <Input
                id="seatNumber"
                value={seatNumber}
                onChange={(e) => setSeatNumber(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="sector">Setor</Label>
              <Input
                id="sector"
                value={sector}
                onChange={(e) => setSector(e.target.value)}
                required
              />
            </div>
          </div>
        )}

        <div>
          <Label htmlFor="deliveryDate">Data de Entrega</Label>
          <Input
            id="deliveryDate"
            type="date"
            value={deliveryDate}
            onChange={(e) => setDeliveryDate(e.target.value)}
            required
          />
        </div>

        <div>
          <Label>Itens do Pedido</Label>
          <ProductSelect onProductSelect={handleAddProduct} />
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
          {initialValues ? 'Atualizar Pedido' : 'Cadastrar Pedido'}
        </Button>
      </div>
    </form>
  );
}

