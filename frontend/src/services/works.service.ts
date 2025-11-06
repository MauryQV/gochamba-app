import { BASE_URL } from "@/constants";

const REQUEST_TIMEOUT = 30000;

// En React Native a menudo fetch maneja FormData mejor que axios para uploads.
export const createPublication = async (formData: FormData, token: string) => {
  // timeout con AbortController
  const controller = typeof AbortController !== "undefined" ? new AbortController() as any : null;
  const signal = controller ? controller.signal : undefined;
  const timeout = controller ? setTimeout(() => controller.abort(), REQUEST_TIMEOUT) : null;

  try {
    const res = await fetch(`${BASE_URL}/worker/publication`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        // IMPORTANT: No añadir 'Content-Type' aquí; fetch lo establecerá correctamente para multipart/form-data
      } as any,
      body: formData as any,
      signal,
    });

    if (timeout) clearTimeout(timeout);

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      let data: any = null;
      try {
        data = text ? JSON.parse(text) : { message: text };
      } catch (_e) {
        data = { message: text };
      }
      const message = data?.error || data?.message || `HTTP ${res.status}`;
      const e: any = new Error(message);
      e.response = { status: res.status, data };
      throw e;
    }

    return await res.json();
  } catch (error: any) {
    if (timeout) clearTimeout(timeout);
    // AbortError indica timeout
    if (error?.name === "AbortError") {
      console.error("Request aborted (timeout) creating publication");
      throw new Error("Network error: request timed out");
    }

    console.error("Network/Fetch error creating publication:", error.message || error);
    throw new Error(`Network error: ${error.message || "No response from server"}`);
  }
};
