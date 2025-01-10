import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import { Loader2 } from 'lucide-react';
import http from '@/api';

interface Product {
  id: number;
  name: string;
  reference: string;
  quantity: number;
  image: string;
}

interface ProductSelectProps {
  onProductSelect: (product: Product, quantity: number) => void;
}

export function ProductSelect({ onProductSelect }: ProductSelectProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const pageSize = 10;

  useEffect(() => {
    fetchProducts();
  }, [currentPage, searchTerm]);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await http.get<{content: Product[], totalPages: number}>('api/v1/products', {
        params: {
          page: currentPage,
          size: pageSize,
          reference: searchTerm,
        }
      });
      setProducts(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProductChange = (productId: string) => {
    const product = products.find(p => p.id.toString() === productId);
    setSelectedProduct(product || null);
    setQuantity(1);
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(e.target.value) || 1;
    setQuantity(Math.min(newQuantity, selectedProduct?.quantity || 1));
  };

  const handleAddProduct = () => {
    if (selectedProduct) {
      onProductSelect(selectedProduct, quantity);
      setQuantity(1);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(0);
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetchProducts();
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearchSubmit} className="flex items-center space-x-2">
        <Input
          type="text"
          placeholder="Buscar por referência..."
          value={searchTerm}
          onChange={handleSearch}
          className="flex-grow"
        />
      </form>
      <Select onValueChange={handleProductChange} value={selectedProduct?.id.toString()}>
        <SelectTrigger>
          <SelectValue placeholder="Selecione um produto" />
        </SelectTrigger>
        <SelectContent>
          {isLoading ? (
            <div className="flex items-center justify-center p-4">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : (
            products.map((product) => (
              <SelectItem key={product.id} value={product.id.toString()}>
                <div className="flex items-center space-x-2">
                  <img src={product.image} alt={product.name} className="w-8 h-8 object-cover rounded" />
                  <span>{product.name} - Ref: {product.reference} (Estoque: {product.quantity})</span>
                </div>
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
      <div className="flex items-center space-x-2">
        <Input
          type="number"
          value={quantity}
          onChange={handleQuantityChange}
          min={1}
          max={selectedProduct?.quantity || 1}
          className="w-24"
        />
        <Button onClick={handleAddProduct} disabled={!selectedProduct || quantity < 1} className="flex-grow" type="button">
          Adicionar ao Pedido
        </Button>
      </div>
    </div>
  );
}

