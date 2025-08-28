"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Availability {
	id: string;
	startTime: string;
	endTime: string;
	resourceId: string;
}

export default function ResourceAvailabilitiesPage({ params }: { params: { id: string } }) {
	const { id: resourceId } = params;
	const [availabilities, setAvailabilities] = useState<Availability[]>([]);
	const [startTime, setStartTime] = useState("");
	const [endTime, setEndTime] = useState("");
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();

	useEffect(() => {
		async function fetchAvailabilities() {
			try {
				const response = await fetch(`/api/resources/${resourceId}/availabilities`);
				if (!response.ok) {
					throw new Error("Não há disponibilidades disponíveis no momento");
				}
				const data = await response.json();
				setAvailabilities(data);
			} catch (err) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		}

		fetchAvailabilities();
	}, [resourceId]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);

		try {
			const response = await fetch(`/api/resources/${resourceId}/availabilities`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ startTime, endTime }),
			});

			if (!response.ok) {
				throw new Error("Failed to add availability");
			}

			const newAvailability = await response.json();
			setAvailabilities([...availabilities, newAvailability]);
			setStartTime("");
			setEndTime("");
		} catch (err) {
			setError(err.message);
		}
	};

	if (loading) {
		return <p className="text-center mt-8">Loading...</p>;
	}

	if (error) {
		return <p className="text-center mt-8 text-red-500">Error: {error}</p>;
	}

	return (
		<div className="container mx-auto p-4">
			<h1 className="text-3xl font-bold mb-6">Manage Availabilities for Resource {resourceId}</h1>

			<div className="mb-8">
				<h2 className="text-2xl font-semibold mb-4">Add New Availability</h2>
				<form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
					<div className="mb-4">
						<label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="startTime">
							Start Time
						</label>
						<input
							id="startTime"
							type="datetime-local"
							value={startTime}
							onChange={(e) => setStartTime(e.target.value)}
							className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
							required
						/>
					</div>
					<div className="mb-6">
						<label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="endTime">
							End Time
						</label>
						<input
							id="endTime"
							type="datetime-local"
							value={endTime}
							onChange={(e) => setEndTime(e.target.value)}
							className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
							required
						/>
					</div>
					{error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
					<div className="flex items-center justify-between">
						<button
							type="submit"
							className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
							Add Availability
						</button>
					</div>
				</form>
			</div>

			<div>
				<h2 className="text-2xl font-semibold mb-4">Existing Availabilities</h2>
				{availabilities.length === 0 ? (
					<p>No availabilities found for this resource.</p>
				) : (
					<ul>
						{availabilities.map((availability) => (
							<li key={availability.id} className="border rounded-lg p-4 mb-2 shadow-sm">
								<p>Start: {new Date(availability.startTime).toLocaleString()}</p>
								<p>End: {new Date(availability.endTime).toLocaleString()}</p>
								{/* TODO: Adicionar botões de editar e deletar disponibilidade */}
							</li>
						))}
					</ul>
				)}
			</div>
		</div>
	);
}