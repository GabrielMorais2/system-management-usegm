import React from 'react';
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";

interface Product {
  id: number;
  name: string;
  reference: string;
  quantity: number;
  image: string;
}

interface ProductItemProps {
  product: Product;
}

const ProductItem: React.FC<ProductItemProps> = ({ product }) => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-0">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-48 object-cover"
        />
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="text-lg mb-2">{product.name}</CardTitle>
        <p className="text-sm text-gray-600 mb-1">Ref: {product.reference}</p>
        <p className="text-sm font-semibold">Quantidade: {product.quantity}</p>
      </CardContent>
    </Card>
  );
};

export default ProductItem;

