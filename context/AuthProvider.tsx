/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { getAccount } from '@/app/api/getProfile';
import Provider from '@/utils/Provider';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { toast } from 'react-toastify';

interface AuthContextType {
	isAuthenticated: boolean;
	login: (tokens: { accessToken: string; refreshToken: string }) => void;
	logout: () => void;
	cartCount: number;
	addToCart: (product: any) => void;
	clearCart: () => void;
	dataProfile: any;
	isLoading: boolean;
	error: any;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
	children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
	const router = useRouter();
	const [isAuthenticated, setIsAuthenticated] = useState(
		typeof window !== 'undefined' && !!localStorage.getItem('accessToken')
	);

	// Cart state and functions
	const [cartCount, setCartCount] = useState<number>(0);

	useEffect(() => {
		const storedCart = JSON.parse(localStorage.getItem('cart') || '[]');
		setCartCount(storedCart.length);
	}, []);

	const addToCart = (product: any) => {
		const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
		const updatedCart = [...existingCart, product];
		localStorage.setItem('cart', JSON.stringify(updatedCart));
		setCartCount(updatedCart.length);
		toast.success('Thêm vào giỏ hàng thành công!');
	};

	const clearCart = () => {
		localStorage.removeItem('cart');
		setCartCount(0);
	};

	// Auth functions
	const login = ({ accessToken, refreshToken }: { accessToken: string; refreshToken: string }) => {
		if (typeof window !== 'undefined') {
			localStorage.setItem('accessToken', accessToken);
			localStorage.setItem('refreshToken', refreshToken);
			setIsAuthenticated(true);
		}
	};

	const logout = () => {
		if (typeof window !== 'undefined') {
			console.log('Logging out...');
			localStorage.removeItem('accessToken');
			localStorage.removeItem('refreshToken');
			localStorage.removeItem('cart'); // Clear cart when logging out
			setIsAuthenticated(false);
			setCartCount(0);
			console.log('Logged out successfully');
			router.push('/login'); // Navigate to login page immediately
		} else {
			console.error('Logout failed: window is undefined');
		}
	};

	// Fetch user profile
	const {
		data: dataProfile,
		isLoading,
		error,
	} = useQuery({
		queryKey: ['dataProfile'],
		queryFn: getAccount,
	});

	useEffect(() => {
		setIsAuthenticated(!!localStorage.getItem('accessToken'));
		dataProfile;
	}, []);

	return (
		<Provider>
			<AuthContext.Provider
				value={{
					isAuthenticated,
					login,
					logout,
					cartCount,
					addToCart,
					clearCart,
					dataProfile,
					isLoading,
					error,
				}}
			>
				{children}
			</AuthContext.Provider>
		</Provider>
	);
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
};
