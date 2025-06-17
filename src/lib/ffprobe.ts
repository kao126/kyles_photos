'use server';
import { promisify } from 'util';
import { execFile } from 'child_process';
import ffprobe from 'ffprobe-static';
import path from 'path';
import { writeFile, unlink } from 'fs/promises';

const execFileAsync = promisify(execFile);

export async function getVideoMetadata(buffer: Buffer, dateStr: string, fileName: string) {
  // 動画の場合: 一時保存して ffprobe で creation_time を取得
  const tempPath = path.join('/tmp', fileName);
  await writeFile(tempPath, buffer);

  console.log('ffprobe.path: ', ffprobe.path);

  const ffprobePath = ffprobe.path.replace(/^\[project\]\//, '').replace(/\/index\.js \[app-rsc\] \(ecmascript\)/, '');

  console.log('ffprobePath: ', ffprobePath);

  const { stdout } = await execFileAsync(ffprobePath, ['-v', 'quiet', '-print_format', 'json', '-show_format', tempPath]);
  const metadata = JSON.parse(stdout);

  await unlink(tempPath);

  return metadata?.format?.tags?.creation_time ?? dateStr;
}

// 'use server';
// import { promisify } from 'util';
// import { execFile } from 'child_process';
// import ffprobe from 'ffprobe-static';

// const execFileAsync = promisify(execFile);

// export async function getVideoMetadata(filePath: string) {
//   const ffprobePath = ffprobe.path.replace(/^\[project\]\//, '').replace(/\/index\.js \[app-route\] \(ecmascript\)/, '');

//   const { stdout } = await execFileAsync(ffprobePath, ['-v', 'quiet', '-print_format', 'json', '-show_format', filePath]);

//   return JSON.parse(stdout);
// }
