import OrderTabs from '../components/OrderTabs';
import OrderList from '../components/OrderList';

export default function Home() {
    return (
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Visão Geral dos Pedidos</h2>
                <OrderTabs />
                <OrderList />
            </div>
        </div>
    );
}
