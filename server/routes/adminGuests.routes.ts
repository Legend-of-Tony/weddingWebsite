import express from "express";
import {
  getAdminGuestList,
  createAdminGuest,
  updateAdminGuest,
  updateAdminPlusOne,
  deleteAdminGuest,
  updateGuestPlusOneAccess,
} from "../controllers/adminGuests.controller.ts";
import { requireAdmin } from "../middleware/requireAdmin.ts";

const router = express.Router();

router.use(requireAdmin);

router.get("/", getAdminGuestList);
router.post("/", createAdminGuest);
router.put("/plus-ones/:id", updateAdminPlusOne);
router.delete("/:id", deleteAdminGuest);
router.put("/:id", updateAdminGuest);
router.patch("/:id/plus-one", updateGuestPlusOneAccess);

export default router;
