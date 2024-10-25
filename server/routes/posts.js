const router = require("express").Router(); // router object using express.Router
const pool = require("../db");

router.get("/", async (req, res) => {
  // Destructure query parameters from the request
  const {
    page,
    limit,
    sortBy = "created_at",
    order,
    search,
    category,
  } = req.query;

  // Set default values for pagination if not provided
  const pageNum = page ? parseInt(page) : 1;
  const limitNum = limit ? parseInt(limit) : 5;
  const offset = (pageNum - 1) * limitNum;

  // get total
  let countQuery = "SELECT COUNT(*) FROM posts WHERE 1=1";
  // Base query: Select all posts
  let baseQuery = "SELECT * FROM posts WHERE 1=1"; // `1=1` ensures we can append conditions dynamically

  // Array to hold query parameters for safe interpolation
  let queryParams = [];
  let countParams = [];

  // % - any no of character
  // _ = ek hi

  // Dynamically add search condition if provided
  if (search) {
    baseQuery += ` AND title ILIKE $${queryParams.length + 1}`;
    queryParams.push(`%${search}%`);

    countQuery += ` AND title ILIKE $${countParams.length + 1}`;
    countParams.push(`%${search}%`);
  }

  // Dynamically add category filter if provided
  if (category) {
    baseQuery += ` AND LOWER(category) = LOWER($${queryParams.length + 1})`;
    queryParams.push(category);
    countQuery += ` AND category = $${countParams.length + 1}`;
    countParams.push(category);
  }

  // Add sorting if provided (default is created_at and ASC order)
  if (sortBy) {
    const sortOrder = order && order.toLowerCase() === "desc" ? "DESC" : "ASC";
    baseQuery += ` ORDER BY ${sortBy} ${sortOrder}`;
  } else {
    baseQuery += ` ORDER BY created_at ASC`; // Default sorting
  }

  // Add pagination (limit and offset)
  baseQuery += ` LIMIT $${queryParams.length + 1} OFFSET $${
    queryParams.length + 2
  }`;
  queryParams.push(limitNum, offset);

  console.log("Base Query:", baseQuery);
  console.log("Query Params:", queryParams);

  // Execute the query
  try {
    const result = await pool.query(baseQuery, queryParams);
    const totalResult = await pool.query(countQuery, countParams); // Remove LIMIT/OFFSET from count query
    res.json({
      result: result.rows,
      total: parseInt(totalResult.rows[0].count),
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
