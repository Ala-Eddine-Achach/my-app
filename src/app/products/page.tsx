'use client';

import {useEffect, useState} from "react";
import {Products} from "@/types/Products";

export default function ProductsPage() {
    const [products, setProducts] = useState<Products[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState<string>("");

    const fetchProducts = async (searchTerm: string = "") => {
        setLoading(true);
        const res = await fetch('/api/products?search=' + encodeURIComponent(searchTerm));
        if (!res.ok) {
            throw new Error('Failed to fetch data');
        }
        const data = await res.json();
        if (!data.items) {
            throw new Error('No items found');
        }
        const products: Products[] = data.items.map((item: Products) => ({
            name: item.name ?? "not found",
            price: item.price ?? -1,
            description: item.description ?? "not found",
        }));


        setProducts(products);
        setLoading(false);
    }
    useEffect(() => {
        fetchProducts(search);
    }, []);

    if (loading) {
        return (<p>Loading...</p>);
    }
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        fetchProducts(search);
    };
    return (
        <div style={{padding: "20px"}}>
            <h1>Products</h1>
            <form onSubmit={handleSubmit} style={{marginBottom: "20px"}}>
                <input type="text" placeholder="Search products..." defaultValue={search}  value={search} onChange={(e) => setSearch(e.target.value)}
                style={{marginRight: "10px"}}/>
                <button type="submit"  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Search</button>
                <button type="button" onClick={() => fetchProducts()} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">Reset</button>
            </form>
            {loading && <div className={"loader"}>Loading...</div>}
            {!loading && products.length === 0 && <div style={{color: "red"}}>No products found</div>}
            {!loading && products.length > 0 &&
                <ul>

                    {products.map((product, index) => (
                        <li key={index} style={{border: "1px solid black", margin: "10px", padding: "10px"}}>
                            <h2>{product.name}</h2>
                            <p>{product.description}</p>
                            <p>${product.price}</p>
                        </li>
                    ))}
                </ul>
            }
        </div>
);
}