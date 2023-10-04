"use client"

import React, { useState } from "react"

import {
    getLongComments,
    getOthersComments,
    getOwnComments
} from "@/helpers/get-comments"
import { getPullRequests } from "@/helpers/get-pull-requests"
import { Comment } from "@/types/comments"
import { PR } from "@/types/pull_requests"

import IssueCollapsibleComponent from "../issues/collapsible"
import PullRequestCollapsibleComponent from "../pull-request/collapsible"
import Spinner from "../spinner"
import { fetchIssues } from "./action"

export default function Search() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const [ownIssueComments, setOwnIssueComments] = useState<Comment[]>([])
    const [longIssueComments, setLongIssueComments] = useState<Comment[]>([])
    const [othersIssueComments, setOthersIssueComments] = useState<Comment[]>(
        []
    )

    const [openPrs, setOpenPrs] = useState<PR[]>([])
    const [openInactivePrs, setOpenInactivePrs] = useState<PR[]>([])
    const [closedPrs, setClosedPrs] = useState<PR[]>([])
    const [closedPrsByOthers, setClosedPrsByOthers] = useState<PR[]>([])
    const [mergedPrs, setMergedPrs] = useState<PR[]>([])

    const fetchGithubIssues = async (formData: FormData) => {
        const username = formData.get("search")
        if (!username) {
            return
        }
        setLoading(true)
        setError(null)
        setOwnIssueComments([])
        setLongIssueComments([])
        setOthersIssueComments([])
        setClosedPrs([])
        setClosedPrsByOthers([])
        setMergedPrs([])
        setOpenPrs([])
        setOpenInactivePrs([])
        const { issues, prs } = await fetchIssues({
            username: username as string
        })
        setLoading(false)

        if (issues.error || prs.error) {
            console.error(issues.error, "error")
            setError(issues.error[0].message || prs.error[0].message)
            return
        }

        const issue = getOwnComments({
            data: issues.data,
            username: username as string
        })
        const longIssue = getLongComments({
            data: issues.data
        })
        const othersIssue = getOthersComments({
            data: issues.data,
            username: username as string
        })
        const {
            closedPRs,
            closedPRsByOthers,
            mergedPRs,
            openInactivePRs,
            openPRs
        } = getPullRequests({
            data: prs.data,
            username: username as string
        })

        setOwnIssueComments(issue)
        setLongIssueComments(longIssue)
        setOthersIssueComments(othersIssue)
        setClosedPrs(closedPRs)
        setClosedPrsByOthers(closedPRsByOthers)
        setMergedPrs(mergedPRs)
        setOpenInactivePrs(openInactivePRs)
        setOpenPrs(openPRs)
    }
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
            <div className="flex flex-col justify-center items-center mt-4">
                {ownIssueComments.length > 0 && (
                    <div className="flex flex-col justify-center items-center mt-4">
                        <IssueCollapsibleComponent
                            type="own"
                            issues={ownIssueComments}
                        />
                    </div>
                )}
            </div>
            <div className="flex flex-col justify-center items-center mt-4">
                {longIssueComments.length > 0 && (
                    <div className="flex flex-col justify-center items-center mt-4">
                        <IssueCollapsibleComponent
                            type="long"
                            issues={longIssueComments}
                        />
                    </div>
                )}
            </div>
            <div className="flex flex-col justify-center items-center mt-4">
                {othersIssueComments.length > 0 && (
                    <div className="flex flex-col justify-center items-center mt-4">
                        <IssueCollapsibleComponent
                            type="others"
                            issues={othersIssueComments}
                        />
                    </div>
                )}
            </div>
            <div className="flex flex-col justify-center items-center mt-4">
                {openPrs.length > 0 && (
                    <div className="flex flex-col justify-center items-center mt-4">
                        <PullRequestCollapsibleComponent
                            type="open"
                            pullRequests={openPrs}
                        />
                    </div>
                )}
            </div>
            <div className="flex flex-col justify-center items-center mt-4">
                {openInactivePrs.length > 0 && (
                    <div className="flex flex-col justify-center items-center mt-4">
                        <PullRequestCollapsibleComponent
                            type="inactive"
                            pullRequests={openInactivePrs}
                        />
                    </div>
                )}
            </div>
            <div className="flex flex-col justify-center items-center mt-4">
                {mergedPrs.length > 0 && (
                    <div className="flex flex-col justify-center items-center mt-4">
                        <PullRequestCollapsibleComponent
                            type="merged"
                            pullRequests={mergedPrs}
                        />
                    </div>
                )}
            </div>
            <div className="flex flex-col justify-center items-center mt-4">
                {closedPrs.length > 0 && (
                    <div className="flex flex-col justify-center items-center mt-4">
                        <PullRequestCollapsibleComponent
                            type="closed"
                            pullRequests={closedPrs}
                        />
                    </div>
                )}
            </div>
            <div className="flex flex-col justify-center items-center mt-4">
                {closedPrsByOthers.length > 0 && (
                    <div className="flex flex-col justify-center items-center mt-4">
                        <PullRequestCollapsibleComponent
                            type="closed by others"
                            pullRequests={closedPrsByOthers}
                        />
                    </div>
                )}
            </div>
        </>
    )
}
