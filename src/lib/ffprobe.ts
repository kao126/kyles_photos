import { promisify } from 'util';
import { execFile } from 'child_process';
import ffprobe from 'ffprobe-static';

const execFileAsync = promisify(execFile);

export async function getVideoMetadata(filePath: string) {
  const ffprobePath = ffprobe.path.replace(/^\[project\]\//, '').replace(/\/index\.js \[app-route\] \(ecmascript\)/, '');

  const { stdout } = await execFileAsync(ffprobePath, ['-v', 'quiet', '-print_format', 'json', '-show_format', filePath]);

  return JSON.parse(stdout);
}
