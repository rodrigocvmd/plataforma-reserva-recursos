"use client";

import { useState, useEffect } from "react";

interface Resource {
	id: string;
	name: string;
	description: string | null;
	ownerId: string;
	createdAt: string;
	updatedAt: string;
}

export default function ResourcesPage() {
	const [resources, setResources] = useState<Resource[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		async function fetchResources() {
			try {
				const response = await fetch("/api/resources");
				if (!response.ok) {
					throw new Error("Não há locais disponíveis no momento");
				}
				const data = await response.json();
				setResources(data);
			} catch (err) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		}

		fetchResources();
	}, []);

	if (loading) {
		return <p className="text-center mt-8">Loading...</p>;
	}

	if (error) {
		return <p className="text-center mt-8 text-red-500">Error: {error}</p>;
	}

	return (
		<div className="container mx-auto p-4">
			<h1 className="text-3xl font-bold mb-6">Available Resources</h1>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{resources.map((resource) => (
					<div key={resource.id} className="border rounded-lg p-4 shadow-lg">
						<h2 className="text-xl font-semibold mb-2">{resource.name}</h2>
						<p className="text-gray-700">{resource.description}</p>
					</div>
				))}
			</div>
		</div>
	);
}