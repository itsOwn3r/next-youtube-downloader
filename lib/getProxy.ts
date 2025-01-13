import { HttpsProxyAgent } from "https-proxy-agent";
import db from "./db";

export default async function getProxy() {
    
  const proxy = await db.proxy.findUnique({
    where: {
      id: 0,
    },
  });

  if (!proxy?.isActive) {
    return null;
  }

  const proxyString = `${proxy.protocol}://${proxy.ip}:${proxy.port}`;
  const agent = new HttpsProxyAgent(proxyString);

  return agent;
}
