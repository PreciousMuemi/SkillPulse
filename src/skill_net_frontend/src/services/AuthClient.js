import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory } from './declarations/skill_net/skill_net.did.js';
import { canisterId } from './declarations/skill_net';
// Simple utility to fetch the current user's principal
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
