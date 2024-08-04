import User from "@/model/Schema";
import { connectMongo } from "@/lib/connectMongo";
import bcrypt from "bcrypt";

export async function POST(req) {
  await connectMongo();

  try {
    const { username, email, password } = await req.json();

    if (!username || !email || !password) {
      return new Response(
        JSON.stringify({ message: "username and Password are required" }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Check for duplicates
    const duplicate = await User.findOne({ email });
    if (duplicate) {
      return new Response(JSON.stringify({ message: "Email already exists" }), {
        status: 409,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    // Hash the password asynchronously
    const hashpwd = await bcrypt.hash(password, 10);

    // Create the new user
    const newUser = await User.create({
      username,
      email,
      password: hashpwd,
    });

    return new Response(JSON.stringify(newUser), {
      status: 201,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
