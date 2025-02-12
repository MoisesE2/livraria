export type Pedido = {
    id: number;
    userId: number;
    products: number[];
    totalPrice: number;
    status: 0 | 1 | 2; // 0-Processando, 1-Enviado, 2-Entregue
    paymentMethod: 'creditCard' | 'pix' | 'boleto';
    orderDate: string;
  };