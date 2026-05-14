import { Router } from "express";

const router = Router();

router.get("/login", (req, res) => {
    res.json({
        message: "Login Successful",
    });
});

export default router;