'use client'

import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Pencil, PlusIcon, Search, Trash2} from 'lucide-react';
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,} from "@/components/ui/dialog";
import NewProductForm from './NewProductForm';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Pagination} from "@/components/ui/pagination";
import {toast} from './ui/use-toast';
import http from '@/api';

interface Product {
  id: number;
  name: string;
  reference: string;
  quantity: number;
  image: string;
}

interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

const StockList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [expandedImage, setExpandedImage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const pageSize = 10;

  useEffect(() => {
    fetchProducts();
  }, [currentPage, searchTerm]);

  const fetchProducts = async () => {
    try {
      const response = await http.get<PageResponse<Product>>('api/v1/products', {
        params: {
          page: currentPage,
          size: pageSize,
          reference: searchTerm ? searchTerm : null,
        }
      });
      setProducts(response.data.content);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os produtos.",
        variant: "destructive",
      });
    }
  };

  const handleAddProduct = async (newProduct: Omit<Product, 'id'>) => {
    try {
      await http.post('api/v1/products', newProduct);
      setIsOpen(false);
      fetchProducts();
      toast({
        title: "Sucesso",
        description: "Produto adicionado com sucesso.",
      });
    } catch (error) {
      console.error('Error adding new product:', error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o produto.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateProduct = async (updatedProduct: Product) => {
    try {
      await http.put(`api/v1/products/${updatedProduct.id}`, updatedProduct);
      setEditingProduct(null);
      fetchProducts();
      toast({
        title: "Sucesso",
        description: "Produto atualizado com sucesso.",
      });
    } catch (error) {
      console.error('Error updating product:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o produto.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteProduct = async (productId: number) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      try {
        await http.delete(`api/v1/products/${productId}`);
        fetchProducts();
        toast({
          title: "Sucesso",
          description: "Produto excluído com sucesso.",
        });
      } catch (error) {
        console.error('Error deleting product:', error);
        toast({
          title: "Erro",
          description: "Não foi possível excluir o produto.",
          variant: "destructive",
        });
      }
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setCurrentPage(0);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Estoque</h1>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center">
              <PlusIcon className="mr-2 h-4 w-4" />
              Novo Produto
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Novo Produto</DialogTitle>
            </DialogHeader>
            <NewProductForm onSubmit={handleAddProduct} onCancel={() => setIsOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
      <div className="flex items-center space-x-2">
        <Search className="w-4 h-4 text-gray-500" />
        <Input
          type="text"
          placeholder="Buscar por referência..."
          value={searchTerm}
          onChange={handleSearch}
          className="max-w-sm"
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Imagem</TableHead>
            <TableHead>Nome</TableHead>
            <TableHead>Referência</TableHead>
            <TableHead>Quantidade</TableHead>
            <TableHead className="w-[100px]">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-16 h-16 object-cover rounded cursor-pointer"
                  onClick={() => setExpandedImage(product.image)}
                />
              </TableCell>
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.reference}</TableCell>
              <TableCell>{product.quantity}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setEditingProduct(product)}
                  >
                    <Pencil className="h-4 w-4 text-gray-500" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteProduct(product.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex justify-between items-center mt-4">
        <Button
          variant="outline"
          onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
          disabled={currentPage === 0}
        >
          Anterior
        </Button>
        <div className="flex items-center space-x-2">
          <Pagination
            currentPage={currentPage + 1}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page - 1)}
          />
          <span className="text-sm text-gray-600">
            Página {currentPage + 1} de {totalPages}
          </span>
        </div>
        <Button
          variant="outline"
          onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
          disabled={currentPage === totalPages - 1}
        >
          Próxima
        </Button>
      </div>
      <Dialog open={!!expandedImage} onOpenChange={() => setExpandedImage(null)}>
        <DialogContent className="max-w-3xl">
          <img
            src={expandedImage || ''}
            alt="Imagem ampliada"
            className="w-full h-auto"
          />
        </DialogContent>
      </Dialog>
      <Dialog open={!!editingProduct} onOpenChange={() => setEditingProduct(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar Produto</DialogTitle>
          </DialogHeader>
          {editingProduct && (
            <NewProductForm
              onSubmit={(updatedProduct) => handleUpdateProduct({ ...updatedProduct, id: editingProduct.id })}
              onCancel={() => setEditingProduct(null)}
              initialValues={editingProduct}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StockList;