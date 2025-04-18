'use client';

import {useEffect, useState} from "react";
import {Products} from "@/types/Products";

export default function ProductsPage() {
    const [products, setProducts] = useState<Products[]>([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const  fetchProducts=async () =>
        {
            const res = await fetch('/api/products');
            if (!res.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await res.json();
            if (!data.items) {
                throw new Error('No items found');
            }
            const  products:Products[] = data.items.map((item: Products) => ({
                name: item.name ??"not found",
                price: item.price ?? -1,
                description: item.description ?? "not found",
            }));


            setProducts(products);
            setLoading(false);
        }
        fetchProducts();
    }, []);
    if (loading) {
        return (<p>Loading...</p>);
    }
    return (
        <div style={{padding: "20px"}}>
            <h1>Products</h1>
            <ul>
                {products.map((product,index) => (
                    <li key ={index} style={{border: "1px solid black", margin: "10px", padding: "10px"}}>
                        <h2>{product.name}</h2>
                        <p>{product.description}</p>
                        <p>${product.price}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}