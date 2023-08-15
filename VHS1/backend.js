const express = require("express");
const mysql = require("mysql");
const session = require("express-session");
const cors = require("cors");
const app = express();

const connection = mysql.createConnection({
  host: "localhost",
  user: "root", // Replace with your MySQL username
  password: "qwerty123", // Replace with your MySQL password
  database: "mydatabase", // Replace with your database name
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL", err);
    throw err;
  }
  console.log("Connected to MySQL");
});

app.use(express.json());
app.use(cors());
app.use(
  session({
    secret: "mySecretKey",
    resave: false,
    saveUninitialized: true,
  })
);

// Strona główna
app.get("/", (req, res) => {
  res.send("Witaj! To jest strona główna.");
});

// Rejestracja nowego użytkownika
app.post("/register", async (req, res) => {
  try {
    const { username, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    const existingUserQuery = "SELECT * FROM users WHERE email = ?";
    connection.query(existingUserQuery, [email], (err, results) => {
      if (err) {
        console.error("Error fetching user", err);
        return res.status(500).json({ error: "Internal server error" });
      }

      if (results.length > 0) {
        return res
          .status(409)
          .json({ error: "User with this email already exists" });
      }

      const insertUserQuery =
        "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
      connection.query(insertUserQuery, [username, email, password], (err) => {
        if (err) {
          console.error("Error inserting user", err);
          return res.status(500).json({ error: "Internal server error" });
        }

        return res.status(201).json({ message: "Registration successful" });
      });
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Strona logowania
app.get("/login", (req, res) => {
  // Here, you can render the login form (HTML) and send it as a response
  res.send("To jest strona logowania.");
});

// Funkcja do logowania użytkownika
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const query =
      "SELECT user_id FROM users WHERE username = ? AND password = ?";
    connection.query(query, [username, password], (err, results) => {
      if (err) {
        console.error("Error fetching user", err);
        return res.status(500).json({ error: "Internal server error" });
      }

      if (results.length === 0) {
        return res.status(401).json({ error: "Invalid username or password" });
      }

      const user_id = results[0].user_id;
      req.session.username = username; // Save information about the logged-in user in the session
      return res.status(200).json({ message: "Login successful", user_id });
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/movies", (req, res) => {
  const query = "SELECT * FROM movies";
  connection.query(query, (error, results) => {
    if (error) {
      console.error("Error executing the query", error);
      res.status(500).json({ error: "Error fetching data from the database" });
    } else {
      res.json(results);
    }
  });
});

// Handle PUT request to update movie quantity
app.put("/updateMovieQuantity/:movie_id", (req, res) => {
  const movieId = req.params.movie_id;
  const quantityUpdate = req.body.quantity;

  // Get current quantity from database
  connection.query(
    "SELECT quantity FROM movies WHERE movie_id = ?",
    [movieId],
    (err, results) => {
      // Handle errors...

      const currentQuantity = results[0].quantity;
      const newQuantity = currentQuantity + quantityUpdate;

      // Update quantity in database
      connection.query(
        "UPDATE movies SET quantity = ? WHERE movie_id = ?",
        [newQuantity, movieId],
        (err, updateResult) => {
          // Handle errors...

          res.json({ message: "Quantity updated" });
        }
      );
    }
  );
});

app.get("/user_orders/:userId", (req, res) => {
  const userId = req.params.userId;

  const query = "SELECT * FROM orders WHERE user_id = ?";

  connection.query(query, [userId], (error, results) => {
    if (error) {
      console.error("Error executing the query", error);
      res.status(500).json({ error: "Error fetching data from the database" });
    } else {
      res.json(results);
    }
  });
});

// Obsługa żądania POST na endpoint '/orders'
app.post("/orders", (req, res) => {
  try {
    // Odbierz dane zamówienia przesłane w formacie JSON
    const order = req.body;

    // Wygeneruj orderId
    generateOrderId((err, orderId) => {
      if (err) {
        console.error("Error generating order ID", err);
        return res.status(500).json({ error: "Internal server error" });
      }

      // Przykład zapisu zamówienia do bazy danych MySQL
      const query =
        "INSERT INTO orders (order_id, user_id, movie_id, start_date, end_date, total_price) VALUES (?, ?, ?, ?, ?, ?)";
      connection.query(
        query,
        [
          orderId,
          order.user_id,
          order.movie_id,
          order.start_date,
          order.end_date,
          order.total_price,
        ],
        (err, result) => {
          if (err) {
            console.error("Error inserting order into database", err);
            return res.status(500).json({ error: "Internal server error" });
          }

          // Zwróć potwierdzenie z orderId
          res.json({
            orderId: orderId,
          });
        }
      );
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Funkcja do generowania kolejnego order_id
function generateOrderId(callback) {
  const query = "SELECT MAX(order_id) AS lastOrderId FROM orders";
  connection.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching last order ID", err);
      callback(err, null);
    } else {
      const lastOrderId = results[0].lastOrderId || 0;
      const nextOrderId = lastOrderId + 1;
      callback(null, nextOrderId);
    }
  });
}

app.get("/movies/:id", (req, res) => {
  const id = req.params.id;

  const query =
    "SELECT movie_id, title, year, director, price FROM movies WHERE movie_id = ?";

  connection.query(query, [id], (err, results) => {
    if (err) {
      console.error("Błąd zapytania do bazy danych:", err);
      res.status(500).json({ error: "Błąd serwera" });
    } else {
      res.json(results);
    }
  });
});

// Obsługa zapytania PUT do aktualizacji end_date
app.put("/orders/:id", (req, res) => {
  const orderId = req.params.id;
  const updatedEndDate = req.body.end_date;

  const query = "UPDATE orders SET end_date = ? WHERE order_id = ?";
  connection.query(query, [updatedEndDate, orderId], (err, result) => {
    if (err) {
      console.error("Błąd zapytania do bazy danych:", err);
      res.status(500).json({ error: "Błąd serwera" });
    } else {
      res.json({ message: "Zamówienie zostało zaktualizowane" });
    }
  });
});

app.get("/orders/:id", (req, res) => {
  const orderId = req.params.id;

  const query = "SELECT * FROM orders WHERE order_id = ?";

  connection.query(query, [orderId], (err, result) => {
    if (err) {
      console.error("Błąd zapytania do bazy danych:", err);
      res.status(500).json({ error: "Błąd serwera" });
    } else {
      if (result.length > 0) {
        res.json(result[0]);
      } else {
        res
          .status(404)
          .json({ error: "Nie znaleziono zamówienia o podanym ID" });
      }
    }
  });
});

app.get("/moviedata/:id", (req, res) => {
  const movie_id = req.params.id;

  const query =
    "SELECT movie_id, polish_title, description, rating FROM movie_data WHERE movie_id = ?";

  connection.query(query, [movie_id], (err, results) => {
    if (err) {
      console.error("Błąd zapytania do bazy danych:", err);
      res.status(500).json({ error: "Błąd serwera" });
    } else {
      res.json(results);
    }
  });
});

// Obsługa żądania POST na endpoint '/save-address'
app.put("/save-address/:userId", (req, res) => {
  try {
    const userId = req.params.userId; // Pobierz identyfikator użytkownika z adresu URL
    const { name, address, city, zipCode } = req.body;

    // Sanitize and validate user input
    const sanitizedData = {
      name: validator.string().trim().escape(name),
      address: validator.string().trim().escape(address),
      city: validator.string().trim().escape(city),
      zipCode: validator.string().trim().escape(zipCode)
    };

    const query = {
      text: "UPDATE users SET name = ?, address = ?, city = ?, zip_code = ? WHERE user_id = ?",
      values: [sanitizedData.name, sanitizedData.address, sanitizedData.city, sanitizedData.zipCode, userId]
    };

    connection.query(query, (err, result) => {
      if (err) {
        console.error("Error saving address data", err);
        return res.status(500).json({ error: "Internal server error" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      return res.status(200).json({ message: "Address data saved successfully" });
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Serwer działa na porcie http://localhost:${PORT}`);
});
