import { Client } from "pg";
import { dbOptions } from "../../config";

import { Product } from "../models/product";
const client = new Client(dbOptions);

client.connect()
  .then(async () => {
    try {
      await client.query('BEGIN');

      await client.query(`
        CREATE TABLE IF NOT EXISTS products (
          id uuid primary key default uuid_generate_v4(),
          title text,
          description text,
          price real
        )
      `);

      await client.query(`
        CREATE TABLE IF NOT EXISTS stocks (
          product_id uuid,
          count integer,
          foreign key ("product_id") references "products" ("id")
        )
      `);

      const productsIds: { rows: Array<Product> } = await client.query(`
        INSERT INTO products (title, description, price) VALUES 
          ('Short Product Description1', 'ProductOne', 1.4),
          ('Short Product Description2', 'ProductTwo', 2.4),
          ('Short Product Description3', 'ProductThree', 3.4),
          ('Short Product Description4', 'ProductFour', 4.4),
          ('Short Product Description5', 'ProductFive', 5.4),
          ('Short Product Description6', 'ProductSix', 6.4),
          ('Short Product Description7', 'ProductSeven', 7.4),
          ('Short Product Description8', 'ProductEight', 8.4)
        RETURNING id
      `);

      await client.query(
        `
          INSERT INTO stocks (product_id, count) VALUES 
          ($1, 1),
          ($2, 2),
          ($3, 3),
          ($4, 4),
          ($5, 5),
          ($6, 6),
          ($7, 7),
          ($8, 8)
        `,
        productsIds.rows.map(product => product.id)
      );

      await client.query('COMMIT');
      console.log("The data has been successfully added to the database");
    } catch (error) {
      await client.query('ROLLBACK');
      console.error("The data hasn't been saved to the database: ", error);
    } finally {
      client.end();
    }
  })
  .catch(error => console.error("Unable to connect to the database:", error));
