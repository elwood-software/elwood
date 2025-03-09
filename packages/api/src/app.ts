import { router } from "./libs/trpc.js";

import getTree from "./routes/get-tree.js";
import getNamespaces from "./routes/get-namespaces.js";
import getBlob from "./routes/get-blob.js";
import action from "./routes/action.js";

export const appRouter = router({
  action,
  tree: {
    get: getTree,
  },
  blob: {
    get: getBlob,
  },
  namespaces: {
    list: getNamespaces,
  },
});
