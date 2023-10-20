"use client"

import React, { useState, useEffect, useCallback } from "react"
import Spinner from "../spinner"
import { fetchIssues } from "./action"
import { useRouter, useSearchParams } from "next/navigation"

export default function Search() {
    const Router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const searchParams = useSearchParams()

    const createUrlQuery = useCallback(
        (name: string, value: any) => {
            const params = new URLSearchParams(searchParams)
            params.set(name, value)

            return `?${params.toString()}`
        },
        [searchParams]
    )

    const fetchGithubIssues = async (formData: FormData) => {
        const username = formData.get("search")
        if (!username) {
            return
        }
        setLoading(true)
        setError(null)

        const { issues, prs } = await fetchIssues({
            username: username as string
        })
        setLoading(false)

        if (issues.error || prs.error) {
            console.error(issues.error, "error")
            setError(issues.error[0].message || prs.error[0].message)
            return
        }

        Router.push("/result" + createUrlQuery("username", username))
    }

    useEffect(() => {
        Router.prefetch("/result")
    }, [Router])

    return (
        <>
            <form
                action={fetchGithubIssues}
                className="flex flex-col justify-center items-center mt-4"
            >
                <label htmlFor="search" className="sr-only">
                    Search
                </label>
                <input
                    type="text"
                    name="search"
                    id="search"
                    required
                    className="bg-gray-100 dark:bg-zinc-800/30 border border-gray-300 dark:border-neutral-800 rounded-xl px-4 py-2 w-3/4"
                    placeholder="Search a github user by username"
                />
                {loading && (
                    <div className="flex justify-center items-center w-[85px] bg-gradient-to-r from-blue-500 to-green-500 hover:from-pink-500 hover:to-yellow-500 text-white font-bold mt-4 py-2 px-4 rounded">
                        <Spinner size="small" />
                    </div>
                )}
                <button
                    type="submit"
                    disabled={loading}
                    aria-disabled={loading}
                    className={`${
                        loading && "hidden"
                    } bg-gradient-to-r from-blue-500 to-green-500 hover:from-pink-500 hover:to-yellow-500 text-white font-bold mt-4 py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                    Search
                </button>
            </form>
            <div className="flex flex-col justify-center items-center mt-12">
                {error && (
                    <p className="text-red-500 dark:text-red-400 text-center">
                        {error}
                    </p>
                )}
            </div>
        </>
    )
}
