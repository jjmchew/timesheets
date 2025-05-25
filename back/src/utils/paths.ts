import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Root of the project (assuming this utils file is always under src/)
export const projectRoot = path.resolve(__dirname, "..", "..");

export const publicPath = path.join(projectRoot, `public`);

/**
 * Detect if we're running the code from src (TypeScript) or dist (compiled JS)
 */
function isRunningFromDist(): boolean {
  return __dirname.includes(path.sep + "dist" + path.sep);
}

/**
 * Resolve a path smartly based on whether we're running from dist or src.
 *
 * If running from dist, adjust paths accordingly.
 */
export function resolveProjectPath(...segments: string[]): string {
  if (isRunningFromDist()) {
    return path.resolve(projectRoot, "src", ...segments);
  } else {
    return path.resolve(projectRoot, "src", ...segments);
  }
}
