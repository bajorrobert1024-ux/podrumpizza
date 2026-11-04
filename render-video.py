#!/usr/bin/env python3
"""Render the explicitly requested illustrative video from the site's still photos."""
from pathlib import Path
import os
import subprocess
import tempfile

root = Path(__file__).resolve().parent.parent
assets = root / 'assets'
segments = []
for index, zoom in enumerate(['1.04+0.07*on/143', '1.04+0.07*on/143', '1.11-0.07*on/143']):
    segments.append(
        f'[{index}:v]scale=1280:1024:force_original_aspect_ratio=increase,crop=1280:1024,'
        f"zoompan=z='{zoom}':x='iw/2-iw/zoom/2':y='ih/2-ih/zoom/2':d=144:s=960x768:fps=24,"
        f'trim=duration=6,setpts=PTS-STARTPTS,fps=24,settb=AVTB,format=yuv420p[v{index}]'
    )
segments += [
    '[v0][v1]xfade=transition=fade:duration=1:offset=5,fps=24,settb=AVTB[v01]',
    '[v01][v2]xfade=transition=fade:duration=1:offset=10,fps=24,format=yuv420p[out]'
]
handle, temporary = tempfile.mkstemp(prefix='.hero-render-', suffix='.mp4', dir=assets)
os.close(handle)
try:
    command = ['ffmpeg', '-y', '-hide_banner', '-loglevel', 'error', '-filter_complex_threads', '2']
    for name in ['hero-pizza.webp', 'grill.webp', 'hero-pizza.webp']:
        command += ['-i', str(assets / name)]
    command += ['-filter_complex', ';'.join(segments), '-map', '[out]', '-an', '-frames:v', '384',
                '-c:v', 'libx264', '-threads', '2', '-preset', 'medium', '-crf', '24', '-pix_fmt',
                'yuv420p', '-movflags', '+faststart', temporary]
    subprocess.run(command, check=True)
    # Verify the entire encoded stream decodes before replacing the delivered file.
    subprocess.run(['ffmpeg', '-v', 'error', '-i', temporary, '-f', 'null', '-'], check=True)
    os.replace(temporary, assets / 'hero-ambience.mp4')
    print('Verified: assets/hero-ambience.mp4 (16 seconds, H.264, silent).')
finally:
    Path(temporary).unlink(missing_ok=True)
