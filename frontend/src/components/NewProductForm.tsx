'use client'

import React, {useEffect, useState} from 'react';
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";

interface NewProduct {
  name: string;
  reference: string;
  quantity: number;
  image: string;
}

interface NewProductFormProps {
  onSubmit: (product: NewProduct) => void;
  onCancel: () => void;
  initialValues?: NewProduct;
}

const NewProductForm: React.FC<NewProductFormProps> = ({ onSubmit, onCancel, initialValues }) => {
  const [product, setProduct] = useState<NewProduct>({
    name: '',
    reference: '',
    quantity: 0,
    image: '',
  });
  const [newImage, setNewImage] = useState<File | null>(null);

  useEffect(() => {
    if (initialValues) {
      setProduct(initialValues);
    }
  }, [initialValues]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProduct(prev => ({ ...prev, [name]: name === 'quantity' ? parseInt(value) : value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProduct(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submittedProduct = { ...product };
    if (!newImage && initialValues) {
      // If no new image was selected, keep the original image
      submittedProduct.image = initialValues.image;
    }
    onSubmit(submittedProduct);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Nome</Label>
        <Input
          id="name"
          name="name"
          value={product.name}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="reference">Referência</Label>
        <Input
          id="reference"
          name="reference"
          value={product.reference}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="quantity">Quantidade</Label>
        <Input
          id="quantity"
          name="quantity"
          type="number"
          value={product.quantity}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="image">Imagem</Label>
        <Input
          id="image"
          name="image"
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
        />
        <p className="text-sm text-gray-500 mt-1">
          {initialValues?.image && !newImage ? "Imagem existente será mantida se nenhuma nova for selecionada." : ""}
        </p>
      </div>
      {product.image && (
        <div>
          <Label>Pré-visualização da Imagem</Label>
          <img src={product.image} alt="Preview" className="mt-2 max-w-full h-auto max-h-48 object-contain" />
        </div>
      )}
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">
          {initialValues ? 'Atualizar Produto' : 'Adicionar Produto'}
        </Button>
      </div>
    </form>
  );
};

export default NewProductForm;

