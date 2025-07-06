import type { Metadata } from 'next/types'

import { CollectionArchive } from '@/components/CollectionArchive'
import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import PageClient from './page.client'

export const dynamic = 'force-static'
export const revalidate = 600

export default async function Page() {
  const payload = await getPayload({ config: configPromise })

  const posts = await payload.find({
    collection: 'posts',
    depth: 1,
    limit: 12,
    overrideAccess: false,
    select: {
      title: true,
      slug: true,
      categories: true,
      meta: true,
    },
  })

  return (
    <div className="min-h-screen bg-white">
      <PageClient />

      {/* Medium-style header */}
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-4xl mx-auto px-6 py-16">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-4 tracking-tight">Stories</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Discover stories, thinking, and expertise from writers on any topic.
            </p>
          </div>
        </div>
      </div>

      {/* Posts grid with Medium styling */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="space-y-8">
          {posts.docs.map((post, index) => (
            <article
              key={index}
              className="group cursor-pointer pb-8 border-b border-gray-100 last:border-b-0"
            >
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                {/* Content */}
                <div className="flex-1 min-w-0">
                  {/* Categories */}
                  {post.categories && post.categories.length > 0 && (
                    <div className="mb-3">
                      {post.categories.map((category, catIndex) => {
                        if (typeof category === 'object' && category.title) {
                          return (
                            <span
                              key={catIndex}
                              className="inline-block bg-gray-100 text-gray-700 text-xs font-medium px-2 py-1 rounded-full mr-2 mb-1 hover:bg-gray-200 transition-colors"
                            >
                              {category.title}
                            </span>
                          )
                        }
                        return null
                      })}
                    </div>
                  )}

                  {/* Title */}
                  <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-gray-700 transition-colors leading-tight">
                    <a href={`/posts/${post.slug}`} className="block hover:underline">
                      {post.title}
                    </a>
                  </h2>

                  {/* Excerpt */}
                  {post.meta?.description && (
                    <p className="text-gray-600 mb-4 leading-relaxed line-clamp-3">
                      {post.meta.description}
                    </p>
                  )}

                  {/* Meta info */}
                  <div className="flex items-center text-sm text-gray-500">
                    <span>5 min read</span>
                    <span className="mx-2">·</span>
                    <span>Member only</span>
                  </div>
                </div>

                {/* Featured image */}
                {post.meta?.image && typeof post.meta.image !== 'string' && post.meta.image.url && (
                  <div className="flex-shrink-0 w-full sm:w-28 sm:h-28 h-48 sm:h-32 order-first sm:order-last">
                    <div className="w-full h-full bg-gray-200 rounded-lg overflow-hidden">
                      <img
                        src={post.meta.image.url}
                        alt={post.title || 'Post image'}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                    </div>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>

        {/* Pagination */}
        {posts.totalPages > 1 && posts.page && (
          <div className="mt-16 pt-8 border-t border-gray-200">
            <Pagination page={posts.page} totalPages={posts.totalPages} />
          </div>
        )}
      </div>
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: `Stories - Payload Website Template`,
    description: 'Discover stories, thinking, and expertise from writers on any topic.',
  }
}
