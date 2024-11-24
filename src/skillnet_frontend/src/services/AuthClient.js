import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory } from './declarations/skillnet/skillnet.did.js'; // Path to your generated DID file
import { canisterId } from './declarations/skillnet'; // Path to your canister id

async function fetchWhoAmI() {
  const agent = new HttpAgent({ host: "https://localhost:8000" });
  const actor = Actor.createActor(idlFactory, { agent, canisterId });

  try {
    const principal = await actor.whoami();
    console.log("Principal ID: ", principal);
  } catch (error) {
    console.error("Error calling whoami: ", error);
  }
}

fetchWhoAmI();
