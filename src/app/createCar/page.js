'use client';

import { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
import client from '../../../lib/apolloClient';
import { useRouter } from 'next/navigation'; // Use this for Next.js 13's app directory

const CREATE_CAR_MUTATION = gql`
  mutation CreateCar($input: CarInput!) {
    createCar(data: $input) {
    
      name
    }
  }
`;

const CreateCarPage = () => {
    const router = useRouter(); // Initialize the router

    const [formData, setFormData] = useState({
        name: '',
        price: '',
        description: '',
        mileage: '',
        engine: '',
        transmission: '',
    });
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);

    const [createCar] = useMutation(CREATE_CAR_MUTATION, { client });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // 1. Upload image to Strapi
            let uploadedImage = null;
            if (image) {
                const data = new FormData();
                data.append('files', image);
                let token = localStorage.getItem("jwt")
                const res = await fetch('http://localhost:1337/api/upload', {
                    method: 'POST',
                    body: data,
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const uploadRes = await res.json();
                uploadedImage = uploadRes[0]; // we assume single image
            }

            // 2. Prepare mutation input
            const input = {
                name: formData.name,
                price: parseInt(formData.price),
                description: formData.description,
                specifications: {
                  mileage: formData.mileage,
                  engine: formData.engine,
                  transmission: formData.transmission,
                },
                image: uploadedImage ? uploadedImage.id : undefined,
                };
              

            // 3. Submit GraphQL mutation
            await createCar({ variables: { input } });

            alert('Car created successfully!');
            setFormData({
                name: '',
                price: '',
                description: '',
                mileage: '',
                engine: '',
                transmission: '',
            });
            setImage(null);
            router.push('/cars'); // Redirect to the /cars page after login success

        } catch (err) {
            console.error(err);
            alert('Error creating car');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto p-6 bg-white shadow rounded mt-10">
            <h2 className="text-2xl font-bold mb-6 text-black">Create New Car</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    name="name"
                    placeholder="Car Name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-2 border rounded text-black border-black  "
                    required
                />
                <input
                    type="number"
                    name="price"
                    placeholder="Price"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full p-2 border rounded  text-black border-black  "
                    required
                />
                <textarea
                    name="description"
                    placeholder="Description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full p-2 border rounded  text-black border-black  "
                    rows={3}
                    required
                />
                <input
                    type="text"
                    name="mileage"
                    placeholder="Mileage"
                    value={formData.mileage}
                    onChange={handleChange}
                    className="w-full p-2 border rounded  text-black border-black  "
                    required
                />
                <input
                    type="text"
                    name="engine"
                    placeholder="Engine"
                    value={formData.engine}
                    onChange={handleChange}
                    className="w-full p-2 border rounded  text-black border-black  "
                    required
                />
                <input
                    type="text"
                    name="transmission"
                    placeholder="Transmission"
                    value={formData.transmission}
                    onChange={handleChange}
                    className="w-full p-2 border rounded  text-black border-black  "
                    required
                />

                <input
                    type="file"
                    onChange={handleFileChange}
                    accept="image/*"
                    className="w-full  text-black border-black p-2 border rounded "
                />

                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    disabled={loading}
                >
                    {loading ? 'Creating...' : 'Create Car'}
                </button>
            </form>
        </div>
    );
};

export default CreateCarPage;
