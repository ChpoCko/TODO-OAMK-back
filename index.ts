import exress, { Express, Request, Response } from "express";
import cors from "cors";
import { Pool, QueryResult } from "pg";

const app: Express = exress();
app.use(cors());
app.use(exress.json());
app.use(exress.urlencoded({ extended: false }));

const port = 3001;

app.get("/", (req: Request, res: Response) => {
  // res.status(200).json({ status: "success" });
  const pool = openDb();
  pool.query("select * from task", (error, result) => {
    if (error) {
      res.status(500).json({ error: error.message });
    }
    res.status(200).json(result.rows);
  });
});

app.post("/new", (req: Request, res: Response) => {
  const pool = openDb();

  pool.query(
    "insert into task (description) values ($1) returning *",
    [req.body.description],
    (error: Error, result: QueryResult) => {
      if (error) {
        res.status(500).json({ error: error });
      }

      res.status(200).json({ id: result.rows[0].id });
    }
  );
});

app.delete("/delete/:id", async (req: Request, res: Response) => {
  const pool = openDb();

  const id = parseInt(req.params.id);

  pool.query(
    "delete from task where id = $1",
    [id],
    (error: Error, result: QueryResult) => {
      if (error) {
        res.status(500).json({ error: error.message });
      }

      res.status(200).json({ id: id });
    }
  );
});

const openDb = (): Pool => {
  const pool: Pool = new Pool({
    user: "postgres",
    host: "127.0.0.1",
    database: "todo",
    password: "204487035959",
    port: 5387,
  });

  return pool;
};

app.listen(port);
