import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router';
import AppLayout from './Layouts/AppLayout';
import Home from './Pages/Home';
import OperationsDevice from './Pages/Operations/Device';
import OperationsIndex from './Pages/Operations/Index';
import OperationsSite from './Pages/Operations/Site';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 30_000,
            retry: 1,
        },
    },
});

const root = document.getElementById('app');

if (!root) {
    throw new Error('Missing #app root');
}

createRoot(root).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <Routes>
                    <Route element={<AppLayout />}>
                        <Route path="/" element={<Home />} />
                        <Route path="/operations" element={<OperationsIndex />} />
                        <Route path="/operations/sites/:slug" element={<OperationsSite />} />
                        <Route path="/operations/devices/:deviceId" element={<OperationsDevice />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </QueryClientProvider>
    </StrictMode>,
);
