import { useState } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  CalendarIcon,
  MapPinIcon,
  PackageIcon,
  Pencil,
  Trash2,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Order } from "../types/order";

interface OrderItemProps {
  order: Order;
  onUpdateStatus: (id: number, status: Order["status"]) => void;
  onDelete: (id: number) => void;
  onEdit: (order: Order) => void;
}

export default function OrderItem({
  order,
  onUpdateStatus,
  onDelete,
  onEdit,
}: OrderItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null);

  const statusColors = {
    ABERTO: "bg-yellow-100 text-yellow-800",
    COMPLETO: "bg-green-100 text-green-800",
    APROVADO: "bg-blue-100 text-blue-800",
  };

  const handleComplete = () => {
    onUpdateStatus(order.id, "COMPLETO");
    setIsOpen(false);
  };

  const handleImageClick = (imageSrc: string) => {
    setEnlargedImage(imageSrc);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <li className="bg-white shadow-sm rounded-lg overflow-hidden">
      <div className="px-4 py-4 sm:px-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-indigo-600 truncate">
            Pedido #{order.id} - {order.customerDetails.name}
          </p>
          <div className="ml-2 flex-shrink-0 flex">
            <Badge className={statusColors[order.status]}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </Badge>
            <Button variant="ghost" size="icon" onClick={() => onEdit(order)}>
              <Pencil className="h-4 w-4 text-gray-500" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(order.id)}
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        </div>
        <div className="mt-2 sm:flex sm:justify-between">
          <div className="sm:flex">
            <p className="flex items-center text-sm text-gray-500">
              <PackageIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                {order.products.length} itens
            </p>
            <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
              <MapPinIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
              {order.shippingDetails.type}
            </p>
          </div>
          <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
            <CalendarIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
            <p>
              Entrega:{" "}
              <time dateTime={order.shippingDetails.deliveryDate}>
                {formatDate(order.shippingDetails.deliveryDate)}
              </time>
            </p>
          </div>
        </div>
        <div className="mt-2 sm:flex sm:justify-between">
          <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button className="w-full mt-4">Ver Detalhes</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Detalhes do Pedido #{order.id}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-1/3">
                          Informações do Cliente
                        </TableHead>
                        <TableHead className="w-2/3">Detalhes</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Nome</TableCell>
                        <TableCell>{order.customerDetails.name}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Email</TableCell>
                        <TableCell>{order.customerDetails.email}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Telefone</TableCell>
                        <TableCell>{order.customerDetails.phone}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-1/3">
                          Informações de Entrega
                        </TableHead>
                        <TableHead className="w-2/3">Detalhes</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">
                          Tipo de Envio
                        </TableCell>
                        <TableCell>{order.shippingDetails.type}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">
                          Data de Entrega
                        </TableCell>
                        <TableCell>
                          {formatDate(order.shippingDetails.deliveryDate)}
                        </TableCell>
                      </TableRow>
                      {order.shippingDetails.type === "TRANSPORTADORA" && (
                        <>
                          <TableRow>
                            <TableCell className="font-medium">
                              Endereço
                            </TableCell>
                            <TableCell>
                              {order.shippingDetails.street},{" "}
                              {order.shippingDetails.number}
                              <br />
                              {order.shippingDetails.neighborhood}
                              <br />
                              {order.shippingDetails.city},{" "}
                              {order.shippingDetails.state}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">
                              Transportadora
                            </TableCell>
                            <TableCell>
                              {order.shippingDetails.transporterName}
                            </TableCell>
                          </TableRow>
                        </>
                      )}
                      {order.shippingDetails.type === "EXCURSAO" && (
                        <>
                          <TableRow>
                            <TableCell className="font-medium">
                              Nome da Excursão
                            </TableCell>
                            <TableCell>
                              {order.shippingDetails.excursionName}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">
                              Número do Assento
                            </TableCell>
                            <TableCell>
                              {order.shippingDetails.seatNumber}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Setor</TableCell>
                            <TableCell>
                              {order.shippingDetails.sector}
                            </TableCell>
                          </TableRow>
                        </>
                      )}
                    </TableBody>
                  </Table>

                  <div>
                    <h3 className="font-semibold mb-2">Itens do Pedido</h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Imagem</TableHead>
                          <TableHead>Nome</TableHead>
                          <TableHead>Quantidade</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {order.products.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-16 h-16 object-cover rounded-md cursor-pointer"
                                onClick={() => handleImageClick(item.image)}
                              />
                            </TableCell>
                            <TableCell>{item.name}</TableCell>
                            <TableCell>{item.quantity}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {order.observations && (
                    <div>
                      <h3 className="font-semibold mb-2">Observações</h3>
                      <p className="text-sm text-gray-500">
                        {order.observations}
                      </p>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    {order.status !== "COMPLETO" && order.status !== "LOJA" && (
                      <Button onClick={handleComplete}>
                        Marcar como Completo
                      </Button>
                    )}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
      {enlargedImage && (
        <Dialog
          open={!!enlargedImage}
          onOpenChange={() => setEnlargedImage(null)}
        >
          <DialogContent className="max-w-3xl">
            <img
              src={enlargedImage}
              alt="Imagem ampliada"
              className="w-full h-auto"
            />
          </DialogContent>
        </Dialog>
      )}
    </li>
  );
}
