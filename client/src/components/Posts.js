import React, { useState, useEffect } from "react";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [sortBy, setSortBy] = useState("created_at");
  const [order, setOrder] = useState("asc");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [totalPages, setTotalPages] = useState(1);

  // Fetch posts from the backend
  const fetchPosts = async () => {
    const queryParams = new URLSearchParams({
      page,
      limit,
      sortBy,
      order,
      search,
      category,
    }).toString();

    // home/:id - params
    // home/shop?page=1&limit=10&oder=asc&dkvm=023 - query params - req.query
    // req.query -  
   
    console.log(queryParams);

    try {
      const response = await fetch(
        `http://localhost:5000/posts?${queryParams}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setPosts(data.result);
      setTotalPages(Math.ceil(data.total / limit));
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  // Use useEffect to fetch posts whenever the dependencies change
  useEffect(() => {
    fetchPosts();
  }, [page, limit, sortBy, order, search, category]);

    const getPagination = () => {
      let pages = [];
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
      return pages;
    };

  return (
    <div>
      <h1>Posts</h1>
      <input
        type="text"
        placeholder="Search by title"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <input
        type="text"
        placeholder="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />
      <select onChange={(e) => setSortBy(e.target.value)}>
        <option value="created_at">Created At</option>
        <option value="title">Title</option>
        <option value="category">Category</option>
      </select>
      <select onChange={(e) => setOrder(e.target.value)}>
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </select>

      <div>
        <button onClick={() => setPage((prev) => (prev > 1 ? prev - 1 : prev))}>
          Previous Page
        </button>
        {getPagination().map((pageNumber) => (
          <button
            key={pageNumber}
            onClick={() => setPage(pageNumber)}
            style={{ fontWeight: page === pageNumber ? "bold" : "normal" }}
          >
            {pageNumber}
          </button>
        ))}
        <button
          onClick={() =>
            setPage((prev) => (prev < totalPages ? prev + 1 : prev))
          }
        >
          Next Page
        </button>
      </div>

      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <h2>{post.title}</h2>
            <p>{post.content}</p>
            <p>Category: {post.category}</p>
            <p>Created At: {new Date(post.created_at).toLocaleString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Posts;
