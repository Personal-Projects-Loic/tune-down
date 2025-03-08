import { AcceptOfferRequest, AcceptOfferResponse } from "../../types/nftOffer";

export const acceptOffer = async (acceptOfferRequest: AcceptOfferRequest): Promise<AcceptOfferResponse | null> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_TUNEDOWN_API_URL}/wallet/accept_offer`, {
      method: "POST",
      credentials: "include",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(acceptOfferRequest),
    });

    if (!response.ok) {
      throw new Error("Error accepting offer");
    }

    const data = await response.json();
    console.log("Offer successfully accepted:", data);
    return data;
  } catch (err) {
    console.error(err);
    return null;
  }
};