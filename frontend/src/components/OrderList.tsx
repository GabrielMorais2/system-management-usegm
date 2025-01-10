'use client'

import { useEffect, useState } from 'react';
import OrderItem from './OrderItem';
import OrderForm from './OrderForm';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Order } from "@/types/order";
import axios from "axios";
import { PlusIcon } from 'lucide-react';
import OrderTabs from './OrderTabs';
import { Pagination } from '@/components/ui/pagination';
import InStoreOrderForm from './InStoreOrderForm';
import http from '@/api';
import { toast } from './ui/use-toast';

interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

export default function OrderList() {
  const role = localStorage.getItem('role');
  const [orders, setOrders] = useState<Order[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isInStoreOrderOpen, setIsInStoreOrderOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('todos');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const pageSize = 10;

  useEffect(() => {
    fetchOrders();
  }, [currentPage, activeTab]);

  const fetchOrders = async () => {
    try {
      const status = activeTab !== 'todos' ? activeTab.toUpperCase() : '';
      const response = await http.get<PageResponse<Order>>('api/v1/orders', {
        params: {
          page: currentPage,
          size: pageSize,
          status: status
        }
      });
      setOrders(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Erro ao buscar os pedidos', error);
    }
  };

  const handleAddInStoreOrder = async (newOrder: Omit<Order, 'id' | 'status' | 'createdAt'>) => {
    try {
      await http.post('api/v1/orders', { ...newOrder, shippingDetails: { type: 'LOJA' } });
      setIsInStoreOrderOpen(false);
      fetchOrders();
    } catch (error) {
      console.error('Erro ao adicionar nova venda em loja', error);
    }
  };

  const handleUpdateStatus = async (id: number, status: Order['status']) => {
    try {
      await http.patch(`api/v1/orders/${id}/status`, { status });
      fetchOrders();
    } catch (error) {
      console.error('Erro ao atualizar o status do pedido', error);
    }
  };

  const handleAddOrder = async (newOrder: Omit<Order, 'id' | 'status' | 'createdAt'>) => {
    try {
      await http.post('api/v1/orders', newOrder);
      setIsOpen(false);
      fetchOrders();
    } catch (error) {
      console.error('Erro ao adicionar novo pedido', error);
    }
  };

  const handleEditOrder = async (updatedOrder: Omit<Order, "status" | "createdAt">) => {
    try {
      if (updatedOrder.id) {
        await http.put(`api/v1/orders/${updatedOrder.id}`, updatedOrder);
      } else {
        console.error('Error: Attempting to edit an order without an id');
        return;
      }
      setEditingOrder(null);
      fetchOrders();
    } catch (error) {
      console.error('Erro ao editar o pedido', error);
    }
  };

  const handleDeleteOrder = async (id: number) => {
    try {
      await http.delete(`api/v1/orders/${id}`);
      fetchOrders();
    } catch (error) {
      const errorMessage = error?.response?.data.message;
      toast({
        title: "Erro ao deletar pedido",
        description: errorMessage == "Access Denied" ? "Acesso negado" : errorMessage,
        variant: "destructive"
      });
      console.error('Erro ao deletar o pedido', error);
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">Pedidos</h1>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
        {role == 'ADMIN' ? <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center justify-center w-full sm:w-auto">
                <PlusIcon className="mr-2 h-4 w-4" />
                Novo Pedido
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] md:max-w-[700px] lg:max-w-[800px] xl:max-w-[900px] w-[calc(100vw-2rem)] max-h-[calc(100vh-2rem)] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Novo Pedido</DialogTitle>
              </DialogHeader>
              <OrderForm 
                onSubmit={handleAddOrder} 
                onCancel={() => setIsOpen(false)}
              />
            </DialogContent>
          </Dialog>
          : ""}
          
          <Dialog open={isInStoreOrderOpen} onOpenChange={setIsInStoreOrderOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center justify-center w-full sm:w-auto">
                <PlusIcon className="mr-2 h-4 w-4" />
                Venda em Loja
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] md:max-w-[700px] lg:max-w-[800px] xl:max-w-[900px] w-[calc(100vw-2rem)] max-h-[calc(100vh-2rem)] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Venda em Loja</DialogTitle>
              </DialogHeader>
              <InStoreOrderForm 
                onSubmit={handleAddInStoreOrder} 
                onCancel={() => setIsInStoreOrderOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <OrderTabs activeTab={activeTab} onTabChange={(tab) => { setActiveTab(tab); setCurrentPage(0); }} />
      <ul className="space-y-4">
        {orders.map((order) => (
          <OrderItem 
            key={order.id} 
            order={order} 
            onUpdateStatus={handleUpdateStatus}
            onDelete={handleDeleteOrder}
            onEdit={(order) => setEditingOrder(order)}
          />
        ))}
      </ul>
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4">
        <Button
          variant="outline"
          onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
          disabled={currentPage === 0}
          className="w-full sm:w-auto"
        >
          Anterior
        </Button>
        <Pagination
          currentPage={currentPage + 1}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page - 1)}
        />
        <Button
          variant="outline"
          onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
          disabled={currentPage === totalPages - 1}
          className="w-full sm:w-auto"
        >
          Próxima
        </Button>
      </div>
      {editingOrder && (
        <Dialog open={!!editingOrder} onOpenChange={() => setEditingOrder(null)}>
          <DialogContent className="sm:max-w-[600px] md:max-w-[700px] lg:max-w-[800px] xl:max-w-[900px] w-[calc(100vw-2rem)] max-h-[calc(100vh-2rem)] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Editar Pedido #{editingOrder.id}</DialogTitle>
            </DialogHeader>
            <OrderForm 
              onSubmit={handleEditOrder}
              onCancel={() => setEditingOrder(null)} 
              initialValues={editingOrder}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

