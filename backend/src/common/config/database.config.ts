export default () => ({
  database: {
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "", 10) || 5432,
    user: process.env.DB_USER || "postgres",
    pass: process.env.DB_PASS || "password",
    name: process.env.DB_NAME || "mydatabase",
  },
});
