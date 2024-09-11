import { handleWebhook } from "@/utils/facades/serverFacades/enodeFacade";


export async function POST(request: Request) {
  console.log("enode", request.body);
  try {
    const payload = await handleWebhook(request);
  } catch (error) {
    console.log(error);
  }

  return Response.json({ message: "Received" });
}
