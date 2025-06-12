import "express";

declare module "express" {
  interface Request {
    session?: { [key: string]: any };
  }
}
