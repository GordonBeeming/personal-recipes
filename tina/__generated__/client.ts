import { createClient } from "tinacms/dist/client";
import { queries } from "./types";
export const client = createClient({ cacheDir: '/work/tina/__generated__/.cache/1759641516352', url: 'http://localhost:4001/graphql', token: 'undefined', queries,  });
export default client;
  