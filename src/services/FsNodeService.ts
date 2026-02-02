import { getAuthenticatedBackendUrl } from "./BackendService";

export const FsNode = {
  dataUrl: (id: string) => getAuthenticatedBackendUrl(`/fs_nodes/${id}/data`),
};
