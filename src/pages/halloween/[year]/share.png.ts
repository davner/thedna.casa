import type { APIRoute, GetStaticPaths } from "astro";
import { getCollection } from "astro:content";
import { partyPreview } from "../../../lib/party-preview";

export const getStaticPaths = (async () => {
  const parties = await getCollection("halloween");
  return parties.map((party) => ({ params: { year: String(party.data.year) }, props: { party: party.data } }));
}) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ props }) =>
  new Response(new Uint8Array(await partyPreview(props.party)), { headers: { "Content-Type": "image/png" } });
