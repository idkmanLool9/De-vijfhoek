import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// Content is bundled from local data. There is no ISR or external data cache,
// so no R2 bucket, database or cache service needs to be provisioned.
export default defineCloudflareConfig();
