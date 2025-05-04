/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CreateFilmRequest, FilmClassification, FilmGenre, UpdateFilmRequest } from "../../../types/film";
import { FilmService } from "../../../services/film.service";
import { Button } from "../../../components";


const filmService = new FilmService();

interface FilmFormProps {
    mode: "create" | "edit";
}

export const FilmForm: React.FC<FilmFormProps> = ({ mode }) => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    
    const [film, setFilm] = useState<CreateFilmRequest>({
        title: "",
        description: "",
        genre: FilmGenre.ACTION,
        classification: FilmClassification.ALL_AUDIENCES,
        duration: 90,
        ticketPrice: 10000
    });

    useEffect(() => {
        if (mode === "edit" && id) {
            const fetchFilm = async () => {
                setIsLoading(true);
                try {
                    const filmData = await filmService.getFilmById(Number(id));
                    setFilm({
                        title: filmData.title,
                        description: filmData.description,
                        genre: filmData.genre as FilmGenre,
                        classification: filmData.classification as FilmClassification,
                        duration: filmData.duration,
                        ticketPrice: filmData.ticketPrice
                    });
                    setImagePreview(filmData.imageUrl);
                } catch (err: any) {
                    setError(err.message);
                } finally {
                    setIsLoading(false);
                }
            };
            
            fetchFilm();
        }
    }, [id, mode]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFilm(prev => ({
            ...prev,
            [name]: name === "duration" ? Number(value) : value
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedFile(file);
            
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            if (mode === "create") {
                if (!selectedFile) throw new Error("Please select an image file.");
                
                await filmService.createFilm(film, selectedFile);
                navigate("/admin/films");
            } else if (mode === "edit" && id) {
                const updateData: UpdateFilmRequest = {
                    ...film,
                    id: Number(id)
                };
                
                await filmService.updateFilm(updateData);
                navigate("/admin/films");
            }
        } catch (err: any) {
            setError(err.message || `Error at ${mode === "create" ? "create" : "update"} film`);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading && mode === "edit") {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-red-600 border-r-transparent"></div>
                <p className="ml-2 text-gray-600">Loading information...</p>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="flex items-center mb-6">
                <button onClick={ () => navigate("/admin/films") } className="mr-4 text-gray-600 hover:text-gray-900">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={ 1.5 } stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                    </svg>
                </button>
                <h1 className="text-2xl font-bold text-gray-800">
                    { mode === "create" ? "Create Film" : "Edit Film" }
                </h1>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
                {
                    error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
                            <span className="block sm:inline">{ error }</span>
                        </div>
                    )
                }

                <form onSubmit={ handleSubmit } className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-6">
                            <div>
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                                    Title <span className="text-red-500">*</span>
                                </label>
                                <input type="text" id="title" name="title" value={ film.title } onChange={ handleInputChange } required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"/>
                            </div>

                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                    Description <span className="text-red-500">*</span>
                                </label>
                                <textarea id="description" name="description" value={ film.description } onChange={ handleInputChange } required rows={ 5 } className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"/>
                            </div>

                            <div>
                                <label htmlFor="genre" className="block text-sm font-medium text-gray-700 mb-1">
                                    Genre <span className="text-red-500">*</span>
                                </label>
                                <select id="genre" name="genre" value={ film.genre } onChange={ handleInputChange } required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500">
                                    {
                                        Object.values(FilmGenre).map((genre) => (
                                            <option key={ genre } value={ genre }>
                                                { genre.charAt(0) + genre.slice(1).toLowerCase() }
                                            </option>
                                        ))
                                    }
                                </select>
                            </div>

                            <div>
                                <label htmlFor="classification" className="block text-sm font-medium text-gray-700 mb-1">
                                    Classification <span className="text-red-500">*</span>
                                </label>
                                <select id="classification" name="classification" value={ film.classification } onChange={ handleInputChange } required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500">
                                    {
                                        Object.values(FilmClassification).map((classification) => (
                                            <option key={ classification } value={ classification }>
                                                { classification }
                                            </option>
                                        ))
                                    }
                                </select>
                            </div>

                            <div>
                                <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                                    Duration (minutes) <span className="text-red-500">*</span>
                                </label>
                                <input type="number" id="duration" name="duration" value={ film.duration } onChange={ handleInputChange } required min="1" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"/>
                            </div>

                            <div>
                                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                                    Ticket price <span className="text-red-500">*</span>
                                </label>
                                <input type="number" id="price" name="price" value={ film.ticketPrice } onChange={ handleInputChange } required min="1" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"/>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Image { mode === "create" && <span className="text-red-500">*</span> }
                            </label>
                            
                            <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 h-64 mb-4">
                                {
                                    imagePreview ? (
                                        <div className="relative w-full h-full">
                                            <img src={ imagePreview } alt="Preview" className="w-full h-full object-contain"/>
                                            <button type="button" onClick={ () => { setImagePreview(null); setSelectedFile(null); } } className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={ 1.5 } stroke="currentColor" className="w-5 h-5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                        ) : (
                                        <div className="space-y-2 text-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="mx-auto h-12 w-12 text-gray-400">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                                            </svg>
                                            <p className="text-sm text-gray-500">
                                                Drop your image here or{" "}
                                                <label htmlFor="image-upload" className="text-red-600 hover:text-red-500 cursor-pointer">
                                                    search on your device
                                                </label>
                                            </p>
                                            <p className="text-xs text-gray-500">PNG, JPG, GIF (max. 5MB)</p>
                                        </div>
                                    )
                                }
                                <input id="image-upload" name="image" type="file" className="hidden" accept="image/*" onChange={ handleFileChange } required={ mode === "create" }/>
                            </div>
                        
                            {
                                !imagePreview && (
                                    <div className="text-center">
                                        <Button type="button" variant="secondary" onClick={ () => document.getElementById("image-upload")?.click() }>
                                            Select Image
                                        </Button>
                                    </div>
                                )
                            }
                        </div>
                    </div>

                    <div className="flex justify-end mt-8 space-x-4">
                        <Button type="button" variant="secondary" onClick={ () => navigate("/admin/films") } disabled={ isLoading }>
                            Cancel
                        </Button>
                        <Button type="submit" variant="primary" disabled={ isLoading }>
                            {
                                isLoading ? (
                                    <>
                                    <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-r-transparent mr-2"></div>
                                    {mode === "create" ? "Creating..." : "Updating..."}
                                    </>
                                ) : (
                                    mode === "create" ? "Create Film" : "Update Film"
                                )
                            }
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};