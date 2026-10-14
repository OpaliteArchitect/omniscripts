import type {
  LoginRequestDto,
  LoginResponseDto,
  ScriptsDto,
} from "@/types/auth";

export async function loginUser(
  data: LoginRequestDto,
): Promise<LoginResponseDto> {
  const response = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Invalid password. Please try again.");
    }
    throw new Error("An internal server error occurred.");
  }

  return response.json();
}

export async function fetchScripts(token: string): Promise<ScriptsDto> {
  const response = await fetch("/api/scripts", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Unauthorized or failed to fetch scripts.");
  }

  return response.json();
}
