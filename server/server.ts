import { loadServerEnv } from "./config/loadEnv.ts";

loadServerEnv();

const { default: app } = await import("./app/app.ts");

const port = Number(process.env.PORT) || 3000;

app.listen(port, "0.0.0.0", () => {
  console.log(`Example app listening on port ${port}`);
});
