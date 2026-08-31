import React from 'react';

type Post = {
  id: string | number;
  title: string;
  author?: string;
  date?: string; // ISO or display  
  excerpt?: string;
  content?: React.ReactNode;
  tags?: string[];
};

type Props = {
  posts: Post | Post[];
  className?: string;
};

const formatDate = (d?: string) => (d ? new Date(d).toLocaleDateString() : undefined);

const BlogPostItem: React.FC<{ post: Post }> = ({ post }) => (
  <article key={post.id} style={{borderBottom: '1px solid #eee', padding: '12px 0'}}>
    <h2 style={{margin: '0 0 6px'}}>{post.title}</h2>
    <div style={{color: '#666', fontSize: 12, marginBottom: 8}}>
      {post.author && <span>{post.author}</span>}
      {post.author && post.date && <span> · </span>}
      {post.date && <time dateTime={post.date}>{formatDate(post.date)}</time>}
    </div>
    {post.excerpt ? <p style={{margin: '0 0 8px'}}>{post.excerpt}</p> : null}
    {post.content ? <div>{post.content}</div> : null}
    {post.tags && post.tags.length > 0 ? (
      <div style={{marginTop: 8}}>
        {post.tags.map((t) => (
          <span key={t} style={{fontSize: 12, color: '#007acc', marginRight: 8}}>#{t}</span>
        ))}
      </div>
    ) : null}
  </article>
);

const BlogPost: React.FC<Props> = ({ posts, className }) => {
  const list = Array.isArray(posts) ? posts : [posts];
  if (!list || list.length === 0) return null;

  return (
    <section className={className}>
      {list.map((p) => (
        <BlogPostItem key={p.id} post={p} />
      ))}
    </section>
  );
};

export default BlogPost;
