import React, {useEffect, useState} from 'react';
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis} from 'recharts';
import {format, parseISO} from 'date-fns';
import {Order} from '../types/order';
import http from '@/api';

const Dashboard: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState<string>('all');

  useEffect(() => {
    const fetchOrders = async (all: boolean) => {
        try {
          const response = await http.get<{ content: Order[] }>('api/v1/orders', {
            params: { all }
          });
          setOrders(response.data.content);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching orders:', error);
          setLoading(false);
        }
      };
    fetchOrders(true);
  }, []);

  const months = Array.from(
    new Set(orders.map(order => format(parseISO(order.createdAt), 'yyyy-MM')))
  );

  const filteredOrders = selectedMonth === 'all'
    ? orders
    : orders.filter(order => format(parseISO(order.createdAt), 'yyyy-MM') === selectedMonth);

  const ordersByStatus = filteredOrders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(ordersByStatus).map(([status, count]) => ({
    status,
    count,
  }));

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Dashboard</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Cards para Totais */}
        {/* ... */}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Pedidos por Status</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filtro de Mês */}
          <div className="mb-4 flex justify-end">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="border rounded px-3 py-2"
            >
              <option value="all">Todos os Meses</option>
              {months.map(month => (
                <option key={month} value={month}>{month}</option>
              ))}
            </select>
          </div>
          {/* Gráfico */}
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="status" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
