"use client"

import { useEffect, useState } from "react"
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  AreaChart,
  Area,
} from "recharts"
import { getArticles } from "@/lib/database"
import type { ArticleType } from "@/types/article"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getArticleUrl } from "@/utils/articleLinks"

const ArticleStats = () => {
  const [articles, setArticles] = useState<ArticleType["articles"]>([])
  const [regionsStats, setRegionsStats] = useState<Record<string, number>>({})
  const [tagsStats, setTagsStats] = useState<Record<string, number>>({})
  const [recentArticles, setRecentArticles] = useState<ArticleType["articles"]>([])
  const [topViewedArticles, setTopViewedArticles] = useState<Array<{ title: string; views: number }>>([])
  const [publishedArticles, setPublishedArticles] = useState<Array<{ date: string; count: number }>>([])
  const [timeFrame, setTimeFrame] = useState<"daily" | "monthly" | "yearly">("monthly")
  const [selectedTag, setSelectedTag] = useState<string>("All")

  useEffect(() => {
    const fetchArticles = async () => {
      const fetchedArticles = await getArticles()
      setArticles(fetchedArticles)

      // Calculate region distribution
      const regions = fetchedArticles.reduce((acc: Record<string, number>, article) => {
        acc[article.region] = (acc[article.region] || 0) + 1
        return acc
      }, {})
      setRegionsStats(regions)

      // Calculate tag distribution
      const tags = fetchedArticles.reduce((acc: Record<string, number>, article) => {
        acc[article.tag] = (acc[article.tag] || 0) + 1
        return acc
      }, {})
      setTagsStats(tags)

      // Get recent articles (limit to 5)
      setRecentArticles(
        fetchedArticles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5),
      )

      // Filter and set top viewed articles based on selected tag
      const filteredArticles =
        selectedTag === "All"
          ? fetchedArticles
          : fetchedArticles.filter((article) => article.tag.toLowerCase() === selectedTag.toLowerCase())

      setTopViewedArticles(
        filteredArticles
          .sort((a, b) => (b.views || 0) - (a.views || 0))
          .slice(0, 5)
          .map((article) => ({
            title: article.title.length > 30 ? article.title.substring(0, 30) + "..." : article.title,
            views: article.views || 0,
          })),
      )

      // Calculate published articles by time frame
      const publishedArticlesData = fetchedArticles.reduce((acc: Record<string, number>, article) => {
        const date =
          timeFrame === "daily"
            ? new Date(article.date).toLocaleDateString()
            : timeFrame === "monthly"
              ? new Date(article.date).toLocaleDateString("default", {
                  month: "long",
                  year: "numeric",
                })
              : new Date(article.date).getFullYear().toString()
        acc[date] = (acc[date] || 0) + 1
        return acc
      }, {})

      setPublishedArticles(
        Object.entries(publishedArticlesData)
          .map(([date, count]) => ({
            date,
            count,
          }))
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
      )
    }

    fetchArticles()
  }, [timeFrame, selectedTag])

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="border border-gray-200 p-4 shadow-sm">
          <div className="text-sm text-gray-600">Total Articles</div>
          <div className="text-2xl font-semibold">{articles.length}</div>
        </div>
        <div className="border border-gray-200 p-4 shadow-sm">
          <div className="text-sm text-gray-600">Regions</div>
          <div className="text-2xl font-semibold">{new Set(articles.map((a) => a.region)).size}</div>
        </div>
        <div className="border border-gray-200 p-4 shadow-sm">
          <div className="text-sm text-gray-600">Tags</div>
          <div className="text-2xl font-semibold">{new Set(articles.map((a) => a.tag)).size}</div>
        </div>
      </div>

      {/* Grid for Articles by Region and Tags Frequency */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Articles by Region */}
        <div className="border border-gray-200 p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Articles by Region</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={Object.entries(regionsStats)
                  .map(([region, count]) => ({ name: region, value: count }))
                  .sort((a, b) => b.value - a.value)}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius="80%"
              >
                {Object.entries(regionsStats)
                  .sort(([, a], [, b]) => b - a)
                  .map(([region, count], index, arr) => {
                    const opacity = 1 - (index / arr.length) * 0.8
                    return <Cell key={`cell-${index}`} fill={`rgba(0, 0, 0, ${opacity})`} />
                  })}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Tags Frequency */}
        <div className="border border-gray-200 p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Tag Frequency</h2>
          <ul className="space-y-2">
            {Object.entries(tagsStats).map(([tag, count]) => (
              <li key={tag} className="flex justify-between">
                <span className="font-medium">{tag}</span>
                <span>{count}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Most Viewed Articles Graph */}
      <div className="border border-gray-200 p-6 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Most Viewed Articles</h2>
          <Select value={selectedTag} onValueChange={(value) => setSelectedTag(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select tag" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="economy">Economy</SelectItem>
              <SelectItem value="diplomacy">Diplomacy</SelectItem>
              <SelectItem value="conflicts">Conflicts</SelectItem>
              <SelectItem value="climate">Climate</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={topViewedArticles} layout="vertical" barGap={8}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis type="category" dataKey="title" width={200} />
            <Tooltip />
            <Bar dataKey="views" fill="#333" barSize={20} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Published Article Graph */}
      <div className="border border-gray-200 p-6 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Published Articles</h2>
          <Select value={timeFrame} onValueChange={(value) => setTimeFrame(value as "daily" | "monthly" | "yearly")}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time frame" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={publishedArticles}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="count" stroke="#000" fill="#000" fillOpacity={0.1} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Articles */}
      <div className="border border-gray-200 p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Recent Articles</h2>
        <ul className="space-y-2">
          {recentArticles.map((article) => (
            <li key={article.slug} className="border-b border-gray-200 py-2">
              <a href={getArticleUrl(article)} target="_blank" className="text-lg font-semibold hover:underline">
                {article.title}
              </a>
              <p className="text-sm text-gray-500">
                {article.date}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default ArticleStats

