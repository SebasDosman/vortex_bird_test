/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FilmResponse } from "../../../types";
import { FilmService } from "../../../services/film.service";
import { Badge, Button, ConfirmModal, Navbar, Pagination } from "../../../components";


const filmService = new FilmService();

export const FilmsManagement: React.FC = () => {
    const [films, setFilms] = useState<FilmResponse[]>([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [deleteFilmId, setDeleteFilmId] = useState<number | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [searchTitle, setSearchTitle] = useState("");
    const [showEnabledOnly, setShowEnabledOnly] = useState(false);

    const fetchFilms = async () => {
        setIsLoading(true);
        setError(null);

        try {
            let response;

            if (searchTitle.trim()) {
                response = await filmService.getFilmByTitle(searchTitle.trim(), currentPage);
            } else {
                response = showEnabledOnly 
                    ? await filmService.getAllEnabledFilms(currentPage)
                    : await filmService.getAllFilms(currentPage);
            }

            setFilms(response.content);
            setTotalPages(response.totalPages);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchFilms();
    }, [currentPage, showEnabledOnly, searchTitle]);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
    
        try {
            if (searchTitle.trim()) {
                const response = await filmService.getFilmByTitle(searchTitle.trim(), currentPage);

                setFilms(response.content);
                setTotalPages(response.totalPages);
            } else {
                fetchFilms();
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleToggleStatus = async (id: number) => {
        try {
            await filmService.updateFilmStatus(id);

            setFilms(films.map(film => 
                film.id === id ? { ...film, enabled: !film.enabled } : film
            ));
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleDeleteClick = (id: number) => {
        setDeleteFilmId(id);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        if (!deleteFilmId) return;
        
        setIsDeleting(true);
        try {
            await filmService.deleteFilm(deleteFilmId);

            setFilms(films.filter(film => film.id !== deleteFilmId));
            setShowDeleteModal(false);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsDeleting(false);
            setDeleteFilmId(null);
        }
    };

    return (
        <>
            <Navbar/>
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Films Management</h1>
                    <Link to="/admin/films/create">
                        <Button variant="primary">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                            New Film
                        </Button>
                    </Link>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
                        <form onSubmit={ handleSearch } className="flex w-full md:w-1/2">
                            <input type="text" value={ searchTitle } onChange={ (e) => setSearchTitle(e.target.value) } placeholder="Search by title..." className="w-full px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"/>
                            <Button type="submit" className="rounded-l-none">Search</Button>
                        </form>
                        
                        <div className="flex items-center">
                            <label className="inline-flex items-center cursor-pointer">
                                <input type="checkbox" checked={ showEnabledOnly } onChange={ () => setShowEnabledOnly(!showEnabledOnly) } className="sr-only peer"/>
                                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                                <span className="ms-3 text-sm font-medium text-gray-700">Only enabled</span>
                            </label>
                        </div>
                    </div>

                    {
                        error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
                                <span className="block sm:inline">{ error }</span>
                            </div>
                        )
                    }

                    {
                    isLoading ? (
                            <div className="text-center py-8">
                                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-red-600 border-r-transparent"></div>
                                <p className="mt-2 text-gray-600">Loading films...</p>
                            </div>
                        ) : films.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-gray-600">Films not found.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Genre</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Classification</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">State</th>
                                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {
                                            films.map((film) => (
                                                <tr key={ film.id } className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                    { 
                                                        film.imageUrl ? (
                                                            <img src={ film.imageUrl } alt={ film.title } className="h-16 w-12 object-cover rounded"/>
                                                        ) : (
                                                            <div className="h-16 w-12 bg-gray-200 flex items-center justify-center rounded">
                                                                <span className="text-gray-500 text-xs">Without image</span>
                                                            </div>
                                                        )
                                                    }
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-medium text-gray-900">{ film.title }</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-700">{ film.genre }</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-700">{ film.classification }</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-700">{ film.duration } min</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <Badge text={ film.enabled ? 'Enabled' : 'Not Enabled' } variant={ film.enabled ? 'success' : 'danger' }/>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <div className="flex justify-end space-x-2">
                                                            <Link to={ `/admin/films/edit/${ film.id }` }>
                                                                <button className="text-blue-600 hover:text-blue-900">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                                                    </svg>
                                                                </button>
                                                            </Link>
                                                            <button className={ `${ film.enabled ? 'text-yellow-600 hover:text-yellow-900' : 'text-green-600 hover:text-green-900' }` } onClick={ () => handleToggleStatus(film.id) }>
                                                                {
                                                                    film.enabled ? (
                                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                                                        </svg>
                                                                    ) : (
                                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                        </svg>
                                                                    )
                                                                }
                                                            </button>
                                                            <button className="text-red-600 hover:text-red-900" onClick={ () => handleDeleteClick(film.id) }>
                                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>
                            </div>
                        )
                    }

                    {
                        totalPages > 1 && !isLoading && films.length > 0 && (
                            <Pagination currentPage={ currentPage } totalPages={ totalPages } onPageChange={ handlePageChange }/>
                        )
                    }
                </div>

                <ConfirmModal isOpen={ showDeleteModal } onClose={ () => setShowDeleteModal(false) } onConfirm={ handleDeleteConfirm } title="Delete Film" message="Are you sure you want to delete this film?" confirmText="Delete" cancelText="Cancel" isLoading={ isDeleting }/>
            </div>
        </>
    );
};