
import React from 'react';
import { motion } from 'framer-motion';
import { Terminal, Clock, User, Tag, ArrowRight } from 'lucide-react';
import { Blog } from '../types';

interface BlogListProps {
  blogs: Blog[];
}

const BlogList: React.FC<BlogListProps> = ({ blogs }) => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-16">
        <h1 className="text-4xl font-bold text-white mb-4">Engineering Logs</h1>
        <p className="text-slate-400 text-lg">Technical deep-dives into systems architecture, performance optimization, and the future of cloud computing.</p>
      </div>

      <div className="space-y-12">
        {blogs.map((post, idx) => (
          <motion.article 
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="group relative"
          >
            <div className="absolute -left-4 top-0 bottom-0 w-0.5 bg-slate-800 group-hover:bg-cyan-500 transition-colors hidden md:block"></div>
            
            <div className="flex flex-col md:flex-row gap-8">
              <div className="w-full md:w-1/4 shrink-0">
                <div className="sticky top-24 space-y-4">
                  <div className="flex items-center text-xs text-slate-500 font-bold uppercase tracking-widest">
                    <Clock size={14} className="mr-2" />
                    {new Date(post.publishedAt).toLocaleDateString()}
                  </div>
                  <div className="flex items-center text-xs text-cyan-400 font-bold uppercase tracking-widest">
                    <Terminal size={14} className="mr-2" />
                    {post.readingTime} Read
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map(tag => (
                      <span key={tag} className="text-[10px] bg-slate-900 border border-slate-800 text-slate-500 px-2 py-0.5 rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex-grow">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 group-hover:text-cyan-400 transition-colors">
                  {post.title}
                </h2>
                <p className="text-slate-400 text-lg leading-relaxed mb-6">
                  {post.excerpt}
                </p>
                <button className="inline-flex items-center text-white font-bold text-sm uppercase tracking-widest hover:text-cyan-400 transition-colors">
                  Read Full Entry <ArrowRight size={16} className="ml-2 group-hover:translate-x-2 transition-transform" />
                </button>
              </div>
            </div>
          </motion.article>
        ))}
      </div>

      {blogs.length === 0 && (
        <div className="py-24 text-center border border-slate-800 rounded-3xl bg-slate-900/50">
          <Terminal size={48} className="mx-auto text-slate-700 mb-6" />
          <h3 className="text-xl font-bold text-white mb-2">Logs are currently empty</h3>
          <p className="text-slate-400">Our architect is currently in deep-work mode. Check back soon.</p>
        </div>
      )}
    </div>
  );
};

export default BlogList;
