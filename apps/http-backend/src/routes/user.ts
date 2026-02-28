import bcrypt from "bcrypt";
import {
  SignupValidation,
  signinValidation,
  roomValidations,
} from "@repo/common";
import express, { Router } from "express";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { prismaClient } from "@repo/database";
import { AuthMiddleware } from "../middlewares/AuthMiddleware";
const app = express();
app.use(express.json());

export const UserRouter: Router = express.Router();

UserRouter.post("/signup", async (req: Request, res: Response) => {
  const { success, data, error } = SignupValidation.safeParse(req.body);

  if (!success) {
    res.status(400).json({
      message: "Incorrect inputs",
      errors: error.errors,
    });
    return;
  }

  const { username, email, password } = data;

  try {
    const existingUser = await prismaClient.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      res.status(400).json({
        message: "User already exists",
      });
      return;
    }

    const hashedpassword = await bcrypt.hash(password, 10);

    await prismaClient.user.create({
      data: { username, email, password: hashedpassword },
    });

    res.status(201).json({
      message: "User has been created successfully",
    });
    return;
  } catch (e) {
    console.log("error during signup", e);
    res.status(500).json({
      message: "sever not responding",
    });
    return;
  }
});

UserRouter.post("/signin", async (req: Request, res: Response) => {
  const { success, data, error } = signinValidation.safeParse(req.body);

  if (!success) {
    res.status(400).json({
      message: "Incorrect inputs",
      errors: error.errors,
    });
    return;
  }

  const { username, password } = data;

  try {
    const existingUser = await prismaClient.user.findUnique({
      where: { username },
    });

    if (!existingUser) {
      res.status(401).json({
        message: "User does not exist",
      });
      return;
    }

    const storedhash = existingUser.password;
    const verifiedpassword = await bcrypt.compare(password, storedhash);

    if (!verifiedpassword) {
      res.status(401).json({
        message: "Invalid credentials",
      });
      return;
    }

    const userId = existingUser.id;
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      res.status(401).json({
        message: "Jwt_Secret not found",
      });
      return;
    }

    const token = jwt.sign({ userId }, jwtSecret);

    res.status(202).json({
      message: "User has been signed in",
      token: token,
    });
    return;
  } catch (e) {
    console.log("error while signin", e);
    res.status(500).json({
      message: "server not responding",
    });
    return;
  }
});

// ── GitHub OAuth ──
UserRouter.get("/auth/github", (req: Request, res: Response) => {
  const clientId = process.env.GITHUB_CLIENT_ID;
  const callbackUrl =
    process.env.GITHUB_CALLBACK_URL ||
    "http://localhost:3000/api/v1/user/auth/github/callback";

  if (!clientId) {
    res.status(500).json({ message: "GitHub OAuth not configured" });
    return;
  }

  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(callbackUrl)}&scope=user:email`;
  res.redirect(githubAuthUrl);
});

UserRouter.get("/auth/github/callback", async (req: Request, res: Response) => {
  const { code } = req.query;
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";

  if (!code) {
    res.redirect(
      `${frontendUrl}/auth/callback?error=${encodeURIComponent("No authorization code received")}`,
    );
    return;
  }

  try {
    // Exchange code for access token
    const tokenResponse = await fetch(
      "https://github.com/login/oauth/access_token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code,
          redirect_uri:
            process.env.GITHUB_CALLBACK_URL ||
            "http://localhost:3000/api/v1/user/auth/github/callback",
        }),
      },
    );

    const tokenData = await tokenResponse.json();

    if (!tokenData.access_token) {
      res.redirect(
        `${frontendUrl}/auth/callback?error=${encodeURIComponent("Failed to get access token from GitHub")}`,
      );
      return;
    }

    // Get user info
    const userResponse = await fetch("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const githubUser = await userResponse.json();

    // Get primary email
    const emailsResponse = await fetch("https://api.github.com/user/emails", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const emails = await emailsResponse.json();
    const primaryEmail =
      emails.find((e: any) => e.primary)?.email ||
      githubUser.email ||
      `${githubUser.login}@github.com`;

    // Find or create user
    let user = await prismaClient.user.findFirst({
      where: { provider: "github", providerId: String(githubUser.id) },
    });

    if (!user) {
      let username = githubUser.login;
      const existingUser = await prismaClient.user.findUnique({
        where: { username },
      });
      if (existingUser) {
        username = `${username}_${Math.random().toString(36).slice(2, 6)}`;
      }

      user = await prismaClient.user.create({
        data: {
          username,
          email: primaryEmail,
          photo: githubUser.avatar_url,
          provider: "github",
          providerId: String(githubUser.id),
        },
      });
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      res.redirect(
        `${frontendUrl}/auth/callback?error=${encodeURIComponent("Server configuration error")}`,
      );
      return;
    }

    const token = jwt.sign({ userId: user.id }, jwtSecret);
    res.redirect(`${frontendUrl}/auth/callback?token=${token}`);
  } catch (error) {
    console.error("GitHub OAuth error:", error);
    res.redirect(
      `${frontendUrl}/auth/callback?error=${encodeURIComponent("GitHub authentication failed")}`,
    );
  }
});

// ── Google OAuth ──
UserRouter.get("/auth/google", (req: Request, res: Response) => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const callbackUrl =
    process.env.GOOGLE_CALLBACK_URL ||
    "http://localhost:3000/api/v1/user/auth/google/callback";

  if (!clientId) {
    res.status(500).json({ message: "Google OAuth not configured" });
    return;
  }

  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(callbackUrl)}&response_type=code&scope=openid%20email%20profile&access_type=offline`;
  res.redirect(googleAuthUrl);
});

UserRouter.get("/auth/google/callback", async (req: Request, res: Response) => {
  const { code } = req.query;
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";

  if (!code) {
    res.redirect(
      `${frontendUrl}/auth/callback?error=${encodeURIComponent("No authorization code received")}`,
    );
    return;
  }

  try {
    // Exchange code for tokens
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        code,
        redirect_uri:
          process.env.GOOGLE_CALLBACK_URL ||
          "http://localhost:3000/api/v1/user/auth/google/callback",
        grant_type: "authorization_code",
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenData.access_token) {
      res.redirect(
        `${frontendUrl}/auth/callback?error=${encodeURIComponent("Failed to get access token from Google")}`,
      );
      return;
    }

    // Get user info
    const userResponse = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: { Authorization: `Bearer ${tokenData.access_token}` },
      },
    );
    const googleUser = await userResponse.json();

    // Find or create user
    let user = await prismaClient.user.findFirst({
      where: { provider: "google", providerId: googleUser.id },
    });

    if (!user) {
      let username =
        googleUser.name?.replace(/\s+/g, "_").toLowerCase() ||
        googleUser.email.split("@")[0];
      const existingUser = await prismaClient.user.findUnique({
        where: { username },
      });
      if (existingUser) {
        username = `${username}_${Math.random().toString(36).slice(2, 6)}`;
      }

      user = await prismaClient.user.create({
        data: {
          username,
          email: googleUser.email,
          photo: googleUser.picture,
          provider: "google",
          providerId: googleUser.id,
        },
      });
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      res.redirect(
        `${frontendUrl}/auth/callback?error=${encodeURIComponent("Server configuration error")}`,
      );
      return;
    }

    const token = jwt.sign({ userId: user.id }, jwtSecret);
    res.redirect(`${frontendUrl}/auth/callback?token=${token}`);
  } catch (error) {
    console.error("Google OAuth error:", error);
    res.redirect(
      `${frontendUrl}/auth/callback?error=${encodeURIComponent("Google authentication failed")}`,
    );
  }
});

UserRouter.post(
  "/room",
  AuthMiddleware,
  async (req: Request, res: Response) => {
    const { success, data, error } = roomValidations.safeParse(req.body);

    if (!success) {
      console.log("Validation Error:", error);
      res.json({
        message: "Incorrect Inputs",
      });
      return;
    }

    const slug = data.slug;
    const adminId = req.userId;

    if (!adminId) {
      res.status(400).json({
        message: "incorrect adminId",
      });
      return;
    }

    try {
      const room = await prismaClient.room.create({
        data: {
          slug,
          adminId,
        },
      });

      res.status(200).json({
        roomId: room.id,
      });
    } catch (e) {
      res.status(409).json({
        message: "Room already exists",
      });
      return;
    }
  },
);

UserRouter.get("/chats/:roomId", async (req: Request, res: Response) => {
  try {
    const roomId = Number(req.params.roomId);
    const messages = await prismaClient.chat.findMany({
      where: {
        roomId: roomId,
      },
      orderBy: {
        id: "desc",
      },
      take: 1000,
    });

    res.json({
      messages,
    });
  } catch (e) {
    console.log(e);
    res.json({
      messages: [],
    });
  }
});

UserRouter.get("/room/:slug", async (req: Request, res: Response) => {
  const slug = req.params.slug;

  if (!slug) {
    res.status(400).json({ message: "Room slug is required" });
    return;
  }

  const room = await prismaClient.room.findFirst({
    where: {
      slug,
    },
  });

  if (!room) {
    res.status(404).json({ message: "Room not found" });
    return;
  }

  res.json({
    roomId: room.id,
  });
});
