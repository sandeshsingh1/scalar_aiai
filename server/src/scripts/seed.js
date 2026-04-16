import "dotenv/config";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";
import { categories, sampleProducts, demoUser } from "../data/sampleData.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (!process.env.DATABASE_URL) {
  console.log("DATABASE_URL is not set. Skipping PostgreSQL seed.");
  process.exit(0);
}

const client = new pg.Client({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.PGSSL === "false" ? false : { rejectUnauthorized: false }
});

const schemaPath = path.resolve(__dirname, "../../sql/schema.sql");

const run = async () => {
  await client.connect();
  const schema = await fs.readFile(schemaPath, "utf8");
  await client.query(schema);

  const userInsert = await client.query(
    `
      INSERT INTO users (id, name, email, password_hash)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name
      RETURNING id
    `,
    [demoUser.id, demoUser.name, demoUser.email, demoUser.passwordHash]
  );

  for (const categoryName of categories) {
    await client.query(
      `INSERT INTO categories (name) VALUES ($1) ON CONFLICT (name) DO NOTHING`,
      [categoryName]
    );
  }

  for (const product of sampleProducts) {
    const category = await client.query(`SELECT id FROM categories WHERE name = $1`, [product.category]);
    await client.query(
      `
        INSERT INTO products (
          id, category_id, name, brand, short_description, description,
          specifications, price, original_price, stock, rating, reviews_count, delivery
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          brand = EXCLUDED.brand,
          short_description = EXCLUDED.short_description,
          description = EXCLUDED.description,
          specifications = EXCLUDED.specifications,
          price = EXCLUDED.price,
          original_price = EXCLUDED.original_price,
          stock = EXCLUDED.stock,
          rating = EXCLUDED.rating,
          reviews_count = EXCLUDED.reviews_count,
          delivery = EXCLUDED.delivery
      `,
      [
        product.id,
        category.rows[0].id,
        product.name,
        product.brand,
        product.shortDescription,
        product.description,
        JSON.stringify(product.specifications),
        product.price,
        product.originalPrice,
        product.stock,
        product.rating,
        product.reviewsCount,
        product.delivery
      ]
    );

    await client.query(`DELETE FROM product_images WHERE product_id = $1`, [product.id]);
    for (let index = 0; index < product.images.length; index += 1) {
      await client.query(
        `
          INSERT INTO product_images (product_id, image_url, sort_order)
          VALUES ($1, $2, $3)
        `,
        [product.id, product.images[index], index]
      );
    }
  }

  console.log(`Seeded ${sampleProducts.length} products for user ${userInsert.rows[0].id}`);
  await client.end();
};

run().catch(async (error) => {
  console.error(error);
  await client.end();
  process.exit(1);
});
